import type { ActiveWeek, BenchmarkEntry, Recommendation, RunEntry, WeeklyCheckIn } from "./training.ts";

export const COACHING_THRESHOLDS = {
  progressCompletionRate: 0.8,
  reduceCompletionRate: 0.6,
  easyRpeCeiling: 4,
  excessiveRpe: 7,
  multipleHardSessions: 2,
} as const;

const completedStatuses = new Set(["completed", "partial", "substituted"]);

export const completedMileage = (entries: RunEntry[]) => entries.reduce((sum, entry) => {
  const miles = Number(entry.actualDistance);
  return sum + (Number.isFinite(miles) ? miles : 0);
}, 0);

export const totalScheduledMileage = (week: ActiveWeek) =>
  week.workouts.reduce((sum, workout) => sum + workout.plannedMiles, 0);

export const sumMileageValues = (values: Array<string | number>) => values.reduce<number>((sum, value) => {
  const miles = Number(value);
  return sum + (Number.isFinite(miles) ? miles : 0);
}, 0);

export function recommendWeek(week: ActiveWeek, entries: RunEntry[], checkIn?: WeeklyCheckIn): Recommendation {
  const plannedRuns = week.workouts.filter((workout) => workout.kind === "run" || workout.kind === "benchmark");
  const relevant = entries.filter((entry) => entry.workoutId && plannedRuns.some((workout) => workout.id === entry.workoutId));
  const completed = relevant.filter((entry) => completedStatuses.has(entry.status)).length;
  const completionRate = plannedRuns.length ? completed / plannedRuns.length : 1;
  const tooHard = relevant.filter((entry) => entry.result === "too-hard" || Number(entry.averageRpe) >= COACHING_THRESHOLDS.excessiveRpe);
  const concerningPain = relevant.some((entry) => entry.pain === "concerning");
  const mildPain = relevant.some((entry) => entry.pain === "mild");

  if (concerningPain || checkIn?.painAffectsMovement) {
    return {
      state: "Reassess",
      summary: "Reassess before progressing next week.",
      reasons: [concerningPain ? "A workout recorded concerning pain." : "Pain is affecting normal movement or running form."],
    };
  }

  const reduceReasons: string[] = [];
  if (tooHard.length >= COACHING_THRESHOLDS.multipleHardSessions) reduceReasons.push("Multiple sessions were harder than planned.");
  if (checkIn?.sleepRecovery === "poor") reduceReasons.push("Sleep and recovery were poor.");
  if (checkIn?.confidence === "declining") reduceReasons.push("Training confidence is declining.");
  if (completionRate < COACHING_THRESHOLDS.reduceCompletionRate && relevant.length > 0) reduceReasons.push("Much of the planned running was missed.");
  if (reduceReasons.length) return { state: "Reduce", summary: `Reduce next week below ${week.plannedMiles} miles.`, reasons: reduceReasons };

  const holdReasons: string[] = [];
  if (!checkIn) holdReasons.push("Complete the weekly check-in before progressing.");
  if (tooHard.length === 1) holdReasons.push("One session was harder than planned.");
  if (mildPain) holdReasons.push("Mild pain was recorded.");
  if (checkIn?.sleepRecovery === "mixed") holdReasons.push("Sleep and recovery were mixed.");
  if (checkIn?.longRunRecovery === "slower") holdReasons.push("The long run took more than 48 hours to recover from.");
  if (completionRate < COACHING_THRESHOLDS.progressCompletionRate && relevant.length > 0) holdReasons.push("Less than 80% of planned running was completed.");
  if (holdReasons.length) return { state: "Hold", summary: `Hold next week near ${week.plannedMiles} miles.`, reasons: holdReasons };

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
  const parts = benchmark.duration.split(":").map(Number);
  const distance = Number(benchmark.distance);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part)) || !Number.isFinite(distance) || distance <= 0) return "Benchmark saved, but distance or duration is not valid enough to create pace guidance.";
  const secondsPerMile = (parts[0] * 3600 + parts[1] * 60 + parts[2]) / distance;
  const minutes = Math.floor(secondsPerMile / 60);
  const seconds = Math.round(secondsPerMile % 60);
  const adjustedMinutes = seconds === 60 ? minutes + 1 : minutes;
  const formattedPace = `${adjustedMinutes}:${String(seconds === 60 ? 0 : seconds).padStart(2, "0")}/mi`;
  if (benchmark.type === "Same easy route" && Number(benchmark.averageRpe) <= 4) return `Use ${formattedPace} as a secondary easy-route reference only on comparable terrain and conditions while RPE remains 3–4.`;
  return `${benchmark.type} averaged ${formattedPace} at RPE ${benchmark.averageRpe}. Use the effort trend to review training ranges; do not translate it directly into a faster race target.`;
}
