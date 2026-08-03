import type { ActiveWeek, BenchmarkEntry, RunEntry, Terrain, WeeklyCheckIn } from "./training.ts";
import { averagePace, parseDurationMinutes, sessionLoad } from "./progression.ts";

export type ProgressRange = "8w" | "12w" | "6m" | "all";
export const GRAPH_THRESHOLDS = { easyMinimum: 3, easyStrong: 5, similarRpe: 1, similarPaceRatio: .05, similarDistanceMiles: 1, loadMinimumWeeks: 2 } as const;
const DAY = 86_400_000;
const completed = new Set(["completed", "partial"]);
const isoShift = (iso: string, days: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + days * DAY).toISOString().slice(0, 10);
const mondayFor = (iso: string) => { const date = new Date(`${iso}T12:00:00Z`); return isoShift(iso, -((date.getUTCDay() + 6) % 7)); };
export const milesToKm = (miles: number) => miles * 1.609344;
export const feetToMeters = (feet: number) => feet * .3048;
export const rangeStart = (range: ProgressRange, today: string) => range === "all" ? "0000-01-01" : isoShift(today, -(range === "8w" ? 56 : range === "12w" ? 84 : 183));
export const filterByRange = <T extends { date: string }>(items: T[], range: ProgressRange, today: string) => items.filter((item) => item.date >= rangeStart(range, today) && item.date <= today);

export interface WeeklyGraphDatum {
  id: string; start: string; end: string; label: string; plannedDistance: number; completedDistance: number;
  plannedDuration: number | null; completedDuration: number; rollingDistance: number | null; rollingLoad: number | null;
  load: number; sessions: number; partial: boolean; recovery: boolean; race: boolean; postRace: boolean;
  recoveryFlag: boolean; painFlag: boolean; hardSessions: number;
}

export function aggregateWeeklyGraph(weeks: ActiveWeek[], entries: RunEntry[], checkIns: WeeklyCheckIn[], today: string): WeeklyGraphDatum[] {
  const starts = new Set(weeks.map((week) => week.workouts.map((workout) => workout.date).sort()[0]));
  entries.forEach((entry) => { if (entry.activityDate && entry.activityDate <= today) starts.add(mondayFor(entry.activityDate)); });
  const data = [...starts].sort().filter((start) => start <= today).map((start) => {
    const end = isoShift(start, 6);
    const week = weeks.find((item) => item.workouts.some((workout) => workout.date >= start && workout.date <= end));
    const weekEntries = entries.filter((entry) => entry.activityDate >= start && entry.activityDate <= end && completed.has(entry.status));
    const runWorkouts = week?.workouts.filter((workout) => workout.kind === "run" || workout.kind === "benchmark") ?? [];
    const plannedDurations = runWorkouts.map((workout) => workout.duration ? parseDurationMinutes(workout.duration) : null).filter((value): value is number => value !== null);
    const checkIn = week ? checkIns.find((item) => item.weekId === week.id) : undefined;
    const text = `${week?.objective ?? ""} ${week?.workouts.map((workout) => workout.title).join(" ") ?? ""}`.toLowerCase();
    return { id: week?.id ?? start, start, end, label: week?.label ?? `${start} – ${end}`, plannedDistance: week?.plannedMiles ?? 0, completedDistance: weekEntries.reduce((sum, entry) => sum + (Number(entry.actualDistance) || 0), 0), plannedDuration: plannedDurations.length ? plannedDurations.reduce((sum, value) => sum + value, 0) : null, completedDuration: weekEntries.reduce((sum, entry) => sum + (parseDurationMinutes(entry.duration) ?? 0), 0), rollingDistance: null, rollingLoad: null, load: weekEntries.reduce((sum, entry) => sum + sessionLoad(entry), 0), sessions: weekEntries.length, partial: today >= start && today <= end, recovery: /recovery|recover|consolidate|taper/.test(text), race: /race week|half marathon|marathon/.test(text) && !/post-race/.test(text), postRace: /post-race|recover from/.test(text), recoveryFlag: checkIn?.sleepRecovery === "poor" || checkIn?.longRunRecovery === "slower", painFlag: weekEntries.some((entry) => entry.pain === "concerning") || Boolean(checkIn?.painAffectsMovement), hardSessions: weekEntries.filter((entry) => entry.result === "too-hard").length };
  });
  return data.map((item, index) => {
    const completedWeeks = data.slice(0, index + 1).filter((week) => !week.partial && week.end < today);
    const rolling = completedWeeks.slice(-4);
    return { ...item, rollingDistance: rolling.length === 4 ? rolling.reduce((sum, week) => sum + week.completedDistance, 0) / 4 : null, rollingLoad: rolling.length === 4 ? rolling.reduce((sum, week) => sum + week.load, 0) / 4 : null };
  });
}

export const interpretConsistency = (weeks: WeeklyGraphDatum[]) => {
  const latest = weeks.at(-1);
  if (!latest) return "There is not enough weekly training data yet.";
  const status = latest.partial ? "This week is in progress and is not interpreted as a completed low-volume week." : `You completed ${latest.completedDistance.toFixed(1)} of ${latest.plannedDistance.toFixed(1)} planned miles.`;
  const recent = weeks.filter((week) => !week.partial && week.sessions > 0).slice(-3);
  const context = latest.recovery || latest.postRace ? " The lower target is an intentional recovery reduction." : recent.length === 3 ? " Completed volume has been recorded across the last three completed weeks." : " More completed weeks are needed for a consistency interpretation.";
  return status + context;
};

export interface LongRunDatum { id: string; date: string; distance: number; duration: string; pace: string | null; averageRpe: number | null; finalRpe: number | null; rpeBand: "easy" | "moderate" | "hard" | "missing"; rpeLabel: string; elevation: number | null; terrain: Terrain; pain: RunEntry["pain"]; recovery: string; cadence: string; }
export function selectLongRuns(entries: RunEntry[], weeks: ActiveWeek[], checkIns: WeeklyCheckIn[]) {
  const workoutMap = new Map(weeks.flatMap((week) => week.workouts.map((workout) => [workout.id, workout] as const)));
  return entries.filter((entry) => completed.has(entry.status) && (workoutMap.get(entry.workoutId ?? "")?.isLongRun || /long run|race-specific endurance|half marathon|marathon/i.test(entry.workout))).map((entry): LongRunDatum => {
    const final = Number(entry.finalRpe); const band = !Number.isFinite(final) || !entry.finalRpe ? "missing" : final <= 4 ? "easy" : final <= 6 ? "moderate" : "hard";
    const week = weeks.find((item) => item.workouts.some((workout) => workout.date === entry.activityDate)); const check = week ? checkIns.find((item) => item.weekId === week.id) : undefined;
    return { id: entry.id, date: entry.activityDate, distance: Number(entry.actualDistance) || 0, duration: entry.duration, pace: averagePace(entry.actualDistance, entry.duration), averageRpe: entry.averageRpe ? Number(entry.averageRpe) : null, finalRpe: entry.finalRpe ? final : null, rpeBand: band, rpeLabel: band === "easy" ? "Final RPE 3–4" : band === "moderate" ? "Final RPE 5–6" : band === "hard" ? "Final RPE 7–10" : "Final RPE missing", elevation: entry.elevationGain ? Number(entry.elevationGain) : null, terrain: entry.terrain, pain: entry.pain, recovery: check?.longRunRecovery === "slower" || check?.sleepRecovery === "poor" ? "Delayed or poor recovery" : check?.longRunRecovery === "within-48h" ? "Recovered within 48 hours" : "Recovery not recorded", cadence: entry.averageCadence };
  }).sort((a, b) => a.date.localeCompare(b.date));
}
const terrainCompatible = (a: Terrain, b: Terrain) => a === b || ((a === "flat" || a === "rolling") && (b === "flat" || b === "rolling"));
export const interpretLongRuns = (runs: LongRunDatum[]) => { const latest = runs.at(-1); if (!latest) return "No completed long-run durability data yet."; const prior = [...runs].reverse().slice(1).find((run) => Math.abs(run.distance - latest.distance) <= GRAPH_THRESHOLDS.similarDistanceMiles && terrainCompatible(run.terrain, latest.terrain)); if (!prior) return `Latest long run: ${latest.distance} miles, ${latest.rpeLabel.toLowerCase()}. No prior run has sufficiently similar distance and terrain.`; return `Your latest ${latest.distance}-mile run finished at ${latest.rpeLabel.replace("Final ", "")}; the previous comparable ${prior.distance}-mile run finished at ${prior.rpeLabel.replace("Final ", "")}. ${latest.pain !== "none" ? `${latest.pain} pain was recorded.` : "No pain was recorded."}`; };

export interface EasyRunDatum { id: string; date: string; paceSeconds: number; pace: string; heartRate: number | null; rpe: number; terrain: Terrain; elevation: number | null; context: string; trend: number | null; }
export function selectComparableEasyRuns(entries: RunEntry[]) {
  const eligible = entries.filter((entry) => entry.status === "completed" && /easy|recovery/i.test(entry.workout) && !/long|race|interval|tempo|hill|stride/i.test(entry.workout) && [3,4].includes(Number(entry.averageRpe)) && averagePace(entry.actualDistance, entry.duration)).sort((a,b) => a.activityDate.localeCompare(b.activityDate));
  const groups = new Map<string, RunEntry[]>(); eligible.forEach((entry) => { const key = entry.terrain === "treadmill" ? "treadmill" : entry.terrain === "trail" ? "trail" : entry.terrain === "hilly" ? "hilly" : "flat-rolling"; groups.set(key, [...(groups.get(key) ?? []), entry]); });
  const cohort = [...groups.values()].sort((a,b) => b.length - a.length)[0] ?? [];
  const raw = cohort.map((entry) => { const minutes = parseDurationMinutes(entry.duration)! / Number(entry.actualDistance); return { id: entry.id, date: entry.activityDate, paceSeconds: Math.round(minutes * 60), pace: averagePace(entry.actualDistance, entry.duration)!, heartRate: entry.averageHeartRate ? Number(entry.averageHeartRate) : null, rpe: Number(entry.averageRpe), terrain: entry.terrain, elevation: entry.elevationGain ? Number(entry.elevationGain) : null, context: entry.conditions, trend: null } satisfies EasyRunDatum; });
  return raw.map((item, index) => { const window = raw.slice(Math.max(0, index - 2), index + 1).map((entry) => entry.paceSeconds).sort((a,b) => a-b); return { ...item, trend: window.length >= GRAPH_THRESHOLDS.easyMinimum ? window[Math.floor(window.length / 2)] : null }; });
}
export const interpretEasyRuns = (runs: EasyRunDatum[]) => { if (runs.length < GRAPH_THRESHOLDS.easyMinimum) return `Not enough comparable easy runs yet. Complete at least ${GRAPH_THRESHOLDS.easyMinimum} easy runs on similar terrain.`; const first = runs.slice(0, Math.min(2, runs.length)).reduce((sum, run) => sum + run.paceSeconds, 0) / Math.min(2, runs.length); const last = runs.slice(-2).reduce((sum, run) => sum + run.paceSeconds, 0) / 2; const change = (first - last) / first; const strength = runs.length >= GRAPH_THRESHOLDS.easyStrong ? "Five or more" : `${runs.length}`; if (change > .02) return `${strength} comparable easy runs show a modest improvement in pace at a similar RPE.`; if (change < -.02) return `${strength} comparable easy runs were modestly slower; terrain, heat, elevation, and recovery context should be reviewed before interpreting the change.`; return `${strength} comparable easy runs show stable pace at a similar RPE.`; };

export const benchmarkPace = (entry: BenchmarkEntry) => averagePace(entry.distance, entry.duration);
export const filterBenchmarks = (entries: BenchmarkEntry[], type: BenchmarkEntry["type"] | "all") => [...entries].filter((entry) => type === "all" || entry.type === type).sort((a,b) => a.date.localeCompare(b.date));
export const interpretBenchmarks = (entries: BenchmarkEntry[], type: BenchmarkEntry["type"] | "all") => { const filtered = filterBenchmarks(entries, type); const latest = filtered.at(-1); if (!latest) return "No controlled benchmarks match this filter yet."; const prior = [...filtered].reverse().slice(1).find((entry) => entry.type === latest.type); if (!prior) return `One ${latest.type} is recorded. A second benchmark of the same type is needed for comparison.`; const latestMinutes = parseDurationMinutes(latest.duration); const priorMinutes = parseDurationMinutes(prior.duration); if (!latestMinutes || !priorMinutes) return "Benchmark duration is incomplete, so comparison is not available."; const contextWeak = latest.terrain && prior.terrain && !terrainCompatible(latest.terrain, prior.terrain) || Boolean(latest.conditions && prior.conditions && latest.conditions !== prior.conditions); const direction = latestMinutes < priorMinutes ? "faster" : latestMinutes > priorMinutes ? "slower" : "the same time as"; return `This ${latest.type} was ${direction} the previous ${latest.type} at RPE ${latest.averageRpe}. ${contextWeak ? "Terrain or conditions differ, so the comparison is weak." : "Review—but do not automatically change—future pace guidance."}`; };

export const interpretLoad = (weeks: WeeklyGraphDatum[]) => { const valid = weeks.filter((week) => week.load > 0 && week.sessions > 0); if (valid.length < GRAPH_THRESHOLDS.loadMinimumWeeks) return "Not enough weeks contain valid duration and session-RPE data for a load graph."; const latest = valid.at(-1)!; const context = latest.recoveryFlag ? "recovery was mixed or delayed" : latest.painFlag ? "a concerning pain flag was recorded" : latest.hardSessions >= 2 ? "multiple sessions felt too hard" : "no major recovery flag was recorded"; return `Estimated weekly load was ${Math.round(latest.load)} and ${context}. Interpret this descriptive estimate together with completion, pain, and recovery.`; };
