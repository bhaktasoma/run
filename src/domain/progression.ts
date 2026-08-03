import type { ActiveWeek, BenchmarkEntry, Recommendation, RunEntry, WeeklyCheckIn } from "./training.ts";

export const COACHING_THRESHOLDS = {
  progressCompletionRate: 0.8,
  reduceCompletionRate: 0.6,
  easyRpeCeiling: 4,
  excessiveRpe: 7,
  multipleHardSessions: 2,
} as const;

const completedStatuses = new Set(["completed", "partial", "substituted"]);

export const parseDurationMinutes = (value: string) => {
  const parts = value.trim().split(":").map(Number);
  if ((parts.length !== 2 && parts.length !== 3) || parts.some((part) => !Number.isFinite(part) || part < 0)) return null;
  if (parts.slice(1).some((part) => part >= 60)) return null;
  const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
  return seconds / 60;
};

export const averagePace = (distance: string, duration: string) => {
  const miles = Number(distance); const minutes = parseDurationMinutes(duration);
  if (!Number.isFinite(miles) || miles <= 0 || minutes === null || minutes <= 0) return null;
  const seconds = Math.round(minutes * 60 / miles);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}/mi`;
};

export const entriesForWeek = (week: ActiveWeek, entries: RunEntry[]) => {
  const dates = week.workouts.map((workout) => workout.date).sort();
  return entries.filter((entry) => entry.activityDate >= dates[0] && entry.activityDate <= dates.at(-1)!);
};

export const sessionLoad = (entry: RunEntry) => (parseDurationMinutes(entry.duration) ?? 0) * Number(entry.averageRpe || 0);

export const weeklyVolumeSummary = (week: ActiveWeek, entries: RunEntry[]) => {
  const completed = entries.filter((entry) => completedStatuses.has(entry.status));
  const durations = completed.map((entry) => parseDurationMinutes(entry.duration) ?? 0);
  const plannedDurations = week.workouts.filter((workout) => workout.kind === "run" || workout.kind === "benchmark").map((workout) => workout.duration ? parseDurationMinutes(workout.duration) : null).filter((value): value is number => value !== null);
  return {
    plannedDistance: week.plannedMiles,
    completedDistance: completedMileage(completed),
    plannedDurationMinutes: plannedDurations.length ? plannedDurations.reduce((sum, value) => sum + value, 0) : null,
    completedDurationMinutes: durations.reduce((sum, value) => sum + value, 0),
    longestRun: Math.max(0, ...completed.map((entry) => Number(entry.actualDistance) || 0)),
    completedSessions: completed.length,
    load: completed.reduce((sum, entry) => sum + sessionLoad(entry), 0),
  };
};

export function easyRunInsight(entries: RunEntry[]) {
  const easy = entries.filter((entry) => completedStatuses.has(entry.status) && /easy|recovery/i.test(entry.workout) && !/long|benchmark/i.test(entry.workout) && Number(entry.averageRpe) >= 2 && Number(entry.averageRpe) <= 4 && averagePace(entry.actualDistance, entry.duration));
  if (easy.length < 3) return "There is not yet enough comparable easy-run data.";
  const latest = easy[0];
  const comparable = easy.slice(1).filter((entry) => entry.terrain === latest.terrain && Math.abs(Number(entry.averageRpe) - Number(latest.averageRpe)) <= 1).slice(0, 2);
  if (comparable.length < 2) return easy.some((entry) => entry.terrain !== latest.terrain) ? "Recent runs used different terrain, so direct pace comparison is limited." : "There is not yet enough comparable easy-run data.";
  const latestMinutes = (parseDurationMinutes(latest.duration) ?? 0) / Number(latest.actualDistance);
  const priorMinutes = comparable.reduce((sum, entry) => sum + (parseDurationMinutes(entry.duration) ?? 0) / Number(entry.actualDistance), 0) / comparable.length;
  if (latestMinutes < priorMinutes * .98) return `Your recent ${latest.terrain || "similar"} easy runs are becoming faster at a similar RPE.`;
  if (latest.averageHeartRate && comparable.every((entry) => entry.averageHeartRate) && Number(latest.averageHeartRate) < comparable.reduce((sum, entry) => sum + Number(entry.averageHeartRate), 0) / comparable.length - 3 && Math.abs(latestMinutes - priorMinutes) / priorMinutes < .05) return "Heart rate has been lower at a similar easy pace across several comparable runs; treat watch heart rate as supporting context.";
  return "Comparable easy runs are stable; continue collecting data before drawing a fitness conclusion.";
}

export function qualityWorkoutInsight(entries: RunEntry[]) {
  const quality = entries.filter((entry) => /stride|tempo|interval|hill repeat|benchmark/i.test(entry.workout) && completedStatuses.has(entry.status));
  const group = quality.find((entry) => quality.filter((item) => item.workout === entry.workout).length >= 2)?.workout;
  if (!group) return "There is not yet enough repeated quality-workout data with the same structure.";
  const matches = quality.filter((entry) => entry.workout === group);
  return `${matches.length} comparable “${group}” sessions are recorded. Review completion, pace, RPE, and pain together.`;
}

export function watchContextInsight(entries: RunEntry[]) {
  const sorted = [...entries].filter((entry) => averagePace(entry.actualDistance, entry.duration)).sort((a, b) => b.activityDate.localeCompare(a.activityDate));
  const paceMinutes = (entry: RunEntry) => (parseDurationMinutes(entry.duration) ?? 0) / Number(entry.actualDistance);
  const comparableTo = (latest: RunEntry, metric: "averageHeartRate" | "averageCadence") => sorted.slice(1).filter((entry) => entry[metric] && entry.terrain === latest.terrain && Math.abs(Number(entry.averageRpe) - Number(latest.averageRpe)) <= 1 && Math.abs(paceMinutes(entry) - paceMinutes(latest)) / paceMinutes(latest) <= .05).slice(0, 2);
  const latestHr = sorted.find((entry) => entry.averageHeartRate);
  const hrMatches = latestHr ? comparableTo(latestHr, "averageHeartRate") : [];
  const heartRate = latestHr && hrMatches.length >= 2 ? `Latest comparable average heart rate: ${latestHr.averageHeartRate} bpm across similar pace, RPE, and ${latestHr.terrain || "unspecified"} terrain.` : "There is not yet enough comparable heart-rate data.";
  const latestCadence = sorted.find((entry) => entry.averageCadence);
  const cadenceMatches = latestCadence ? comparableTo(latestCadence, "averageCadence") : [];
  const cadence = latestCadence && cadenceMatches.length >= 2 ? `Latest comparable cadence: ${latestCadence.averageCadence} spm at ${averagePace(latestCadence.actualDistance, latestCadence.duration)} on ${latestCadence.terrain || "unspecified"} terrain.` : latestCadence ? `Latest cadence: ${latestCadence.averageCadence} spm; more similar-pace, similar-terrain runs are needed for a trend.` : "No cadence data has been supplied.";
  return { heartRate, cadence };
}

export const completedMileage = (entries: RunEntry[]) => entries.reduce((sum, entry) => {
  if (!completedStatuses.has(entry.status)) return sum;
  const miles = Number(entry.actualDistance);
  return sum + (Number.isFinite(miles) ? miles : 0);
}, 0);

export const totalScheduledMileage = (week: ActiveWeek) =>
  week.workouts.reduce((sum, workout) => sum + workout.plannedMiles, 0);

export const sumMileageValues = (values: Array<string | number>) => values.reduce<number>((sum, value) => {
  const miles = Number(value);
  return sum + (Number.isFinite(miles) ? miles : 0);
}, 0);

export type WorkoutDateState = "past" | "today" | "future";
export const workoutDateState = (workoutDate: string, today: string): WorkoutDateState => workoutDate < today ? "past" : workoutDate === today ? "today" : "future";

export function recommendWeek(week: ActiveWeek, entries: RunEntry[], checkIn?: WeeklyCheckIn, evaluationDate = week.workouts.map((workout) => workout.date).sort().at(-1)!): Recommendation {
  const plannedRuns = week.workouts.filter((workout) => workout.kind === "run" || workout.kind === "benchmark");
  const pastRuns = plannedRuns.filter((workout) => workoutDateState(workout.date, evaluationDate) === "past");
  const todayRuns = plannedRuns.filter((workout) => workoutDateState(workout.date, evaluationDate) === "today");
  const dueRuns = [...pastRuns, ...todayRuns];
  const futureRuns = plannedRuns.filter((workout) => workoutDateState(workout.date, evaluationDate) === "future");
  const relevant = entries.filter((entry) => entry.activityDate <= evaluationDate && entry.workoutId && dueRuns.some((workout) => workout.id === entry.workoutId));
  const completed = relevant.filter((entry) => completedStatuses.has(entry.status)).length;
  const completionRate = dueRuns.length ? completed / dueRuns.length : 1;
  const observed = entries.filter((entry) => entry.activityDate <= evaluationDate && completedStatuses.has(entry.status));
  const tooHard = observed.filter((entry) => entry.result === "too-hard" || Number(entry.averageRpe) >= COACHING_THRESHOLDS.excessiveRpe || Number(entry.finalRpe) >= 8);
  const concerningPain = observed.some((entry) => entry.pain === "concerning");
  const mildPain = observed.some((entry) => entry.pain === "mild");

  if (concerningPain || checkIn?.painAffectsMovement) {
    return {
      state: "Reassess",
      summary: "Reassess before progressing next week.",
      reasons: [concerningPain ? "A workout recorded concerning pain." : "Pain is affecting normal movement or running form."],
    };
  }

  if (plannedRuns.length === 0) return { state: "Hold", summary: "Complete the recovery week without adding mileage.", reasons: ["This is an intentional zero-mile post-race week; no end-of-week progression decision is required."] };

  const reduceReasons: string[] = [];
  if (tooHard.length >= COACHING_THRESHOLDS.multipleHardSessions) reduceReasons.push("Multiple sessions were harder than planned.");
  if (checkIn?.sleepRecovery === "poor") reduceReasons.push("Sleep and recovery were poor.");
  if (checkIn?.confidence === "declining") reduceReasons.push("Training confidence is declining.");
  if (completionRate < COACHING_THRESHOLDS.reduceCompletionRate && relevant.length > 0) reduceReasons.push("Much of the planned running was missed.");
  if (reduceReasons.length) return { state: "Reduce", summary: `Reduce next week below ${week.plannedMiles} miles.`, reasons: reduceReasons };

  const holdReasons: string[] = [];
  if (!checkIn && futureRuns.length === 0) holdReasons.push("Complete the weekly check-in before progressing.");
  if (tooHard.length === 1) holdReasons.push("One session was harder than planned.");
  if (mildPain) holdReasons.push("Mild pain was recorded.");
  if (checkIn?.sleepRecovery === "mixed") holdReasons.push("Sleep and recovery were mixed.");
  if (checkIn?.longRunRecovery === "slower") holdReasons.push("The long run took more than 48 hours to recover from.");
  if (observed.some((entry) => entry.workout.toLowerCase().includes("long") && Number(entry.finalRpe) >= 7)) holdReasons.push("The long run finished at a high effort.");
  if (completionRate < COACHING_THRESHOLDS.progressCompletionRate && relevant.length > 0) holdReasons.push("Less than 80% of planned running was completed.");
  if (holdReasons.length) return { state: "Hold", summary: `Hold next week near ${week.plannedMiles} miles.`, reasons: holdReasons };

  if (futureRuns.length > 0 || todayRuns.length > 0) return {
    state: "Hold",
    summary: "Continue the current week as planned.",
    reasons: todayRuns.some((workout) => !relevant.some((entry) => entry.workoutId === workout.id))
      ? ["No missed workouts before today. Today’s workout is still open.", "Future workouts are not counted as missed."]
      : pastRuns.length ? ["All workouts before today were resolved.", "Future workouts are not counted as missed."] : ["No running workouts are due yet.", "Future workouts are not counted as missed."],
  };

  return {
    state: "Progress",
    summary: "Progress to the next planned week.",
    reasons: ["Most planned training was completed.", "Recovery was normal and no concerning pain was reported."],
  };
}

export function adjustedMileage(currentMiles: number, recommendation: Recommendation["state"]) {
  if (recommendation === "Progress") return Math.round(currentMiles * 1.08);
  if (recommendation === "Reduce") return Math.round(currentMiles * 0.75);
  if (recommendation === "Reassess") return 0;
  return currentMiles;
}

export function benchmarkGuidance(benchmark: BenchmarkEntry) {
  const distance = Number(benchmark.distance);
  const minutesTotal = parseDurationMinutes(benchmark.duration);
  if (minutesTotal === null || !Number.isFinite(distance) || distance <= 0) return "Benchmark saved, but distance or duration is not valid enough to create pace guidance.";
  const secondsPerMile = minutesTotal * 60 / distance;
  const minutes = Math.floor(secondsPerMile / 60);
  const seconds = Math.round(secondsPerMile % 60);
  const adjustedMinutes = seconds === 60 ? minutes + 1 : minutes;
  const formattedPace = `${adjustedMinutes}:${String(seconds === 60 ? 0 : seconds).padStart(2, "0")}/mi`;
  if (benchmark.type === "Same easy route" && Number(benchmark.averageRpe) <= 4) return `Use ${formattedPace} as a secondary easy-route reference only on comparable terrain and conditions while RPE remains 3–4.`;
  return `${benchmark.type} averaged ${formattedPace} at RPE ${benchmark.averageRpe}. Use the effort trend to review training ranges; do not translate it directly into a faster race target.`;
}
