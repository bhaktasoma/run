export type StrengthSessionId = "full-body-a" | "full-body-b" | "aesthetic";
export type StrengthStatus = "completed" | "modified" | "skipped";
export type StrengthDifficulty = "too-easy" | "appropriate" | "too-hard";
export type StrengthRecoveryMode = "normal" | "running-recovery" | "high-fatigue" | "race-week" | "post-race" | "marathon-peak";

export interface StrengthExercise {
  id: string;
  name: string;
  sets: number;
  minReps: number;
  maxReps: number;
  repLabel?: string;
  lowerBody?: boolean;
  core?: boolean;
  increment: number;
}

export interface StrengthSession {
  id: StrengthSessionId;
  title: string;
  day: string;
  duration: string;
  required: boolean;
  exercises: StrengthExercise[];
}

export interface StrengthExerciseLog {
  exerciseId: string;
  weight: number;
  reps: number[];
  rir: number;
  status: StrengthStatus;
  note: string;
}

export interface StrengthSessionLog {
  id: string;
  weekId: string;
  sessionId: StrengthSessionId;
  date: string;
  status: StrengthStatus;
  difficulty: StrengthDifficulty;
  concerningPain: boolean;
  techniqueStable: boolean;
  notes: string;
  exercises: StrengthExerciseLog[];
  warmupStatus?: "completed" | "skipped";
  cooldownStatus?: "completed" | "skipped";
}

export interface StrengthTarget {
  action: "increase" | "hold" | "reduce";
  weight: number;
  reps: number;
  explanation: string;
}

export interface StrengthAdjustmentDecision {
  weekId: string;
  mode: StrengthRecoveryMode;
  accepted: boolean;
  decidedAt: string;
}

export interface AdaptedStrengthPlan {
  mode: StrengthRecoveryMode;
  title: string;
  explanation: string;
  sessions: StrengthSession[];
  suppressedSessionIds: StrengthSessionId[];
}

export type SundayStrengthState = "recovered" | "shortened" | "suppressed";
export type StrengthSessionStage = "idle" | "warmup" | "workout" | "cooldown" | "log";
const STRENGTH_STAGE_ORDER: StrengthSessionStage[] = ["idle", "warmup", "workout", "cooldown", "log"];

export function moveStrengthStage(stage: StrengthSessionStage, direction: "next" | "previous"): StrengthSessionStage {
  const index = STRENGTH_STAGE_ORDER.indexOf(stage);
  return STRENGTH_STAGE_ORDER[Math.max(0, Math.min(STRENGTH_STAGE_ORDER.length - 1, index + (direction === "next" ? 1 : -1)))];
}

export const STRENGTH_THRESHOLDS = {
  targetRir: 2,
  startingRir: 3,
  recoveryLowerBodySetReduction: 1,
  highFatigueSetMultiplier: 0.5,
  marathonPeakLowerBodySetMultiplier: 2 / 3,
} as const;

export const STRENGTH_PROGRESSION_RULE = "Reach the top of the repetition range with good form before increasing the weight by the smallest available amount.";

export const BODY_RECOMPOSITION_GOAL = "Build an athletic, lean physique with stronger glutes, thighs, back and core while protecting running performance, recovery and long-term health. Visible abdominal definition is an optional aesthetic outcome, not a requirement for successful training.";

export function sundayStrengthState(mode: StrengthRecoveryMode, recovery?: "good" | "mixed" | "poor", longRunRecovery?: "within-48h" | "slower" | "not-applicable"): SundayStrengthState {
  if (mode !== "normal" || recovery === "poor") return "suppressed";
  if (recovery === "mixed" || longRunRecovery === "slower") return "shortened";
  return "recovered";
}

export function shortenedSundaySession(session: StrengthSession): StrengthSession {
  const ids = new Set(["sunday-pulldown", "incline-press", "optional-suitcase", "reverse-crunch", "sunday-side-plank"]);
  return { ...session, title: "Shortened Back + Core", duration: "15–20 min", exercises: session.exercises.filter((exercise) => ids.has(exercise.id)).map((exercise) => ({ ...exercise, sets: 2 })) };
}

export function nextStrengthTarget(exercise: StrengthExercise, performance?: StrengthExerciseLog, techniqueStable = true): StrengthTarget {
  if (!performance || performance.status === "skipped") return { action: "hold", weight: performance?.weight ?? 0, reps: exercise.minReps, explanation: "No completed performance to justify an increase. Start or repeat the bottom of the range with 2–3 reps in reserve." };
  const repsComplete = performance.reps.length === exercise.sets;
  const allAtTop = repsComplete && performance.reps.every((reps) => reps >= exercise.maxReps);
  const belowMinimum = performance.reps.some((reps) => reps < exercise.minReps);
  if (!techniqueStable || performance.rir < 1 || belowMinimum) return { action: "reduce", weight: Math.max(0, performance.weight - exercise.increment), reps: exercise.minReps, explanation: "Reduce by the smallest increment because reps or technique were not stable. Do not train to failure." };
  if (allAtTop && performance.rir >= STRENGTH_THRESHOLDS.targetRir && performance.status === "completed") return { action: "increase", weight: performance.weight + exercise.increment, reps: exercise.minReps, explanation: "Every set reached the top of the range with stable technique and about two reps in reserve. Add the smallest increment and return to the bottom of the range." };
  return { action: "hold", weight: performance.weight, reps: Math.min(exercise.maxReps, Math.max(exercise.minReps, Math.min(...performance.reps) + (repsComplete ? 1 : 0))), explanation: "Keep the same weight and build repetitions within the range before increasing load." };
}

const withSets = (session: StrengthSession, setsFor: (exercise: StrengthExercise) => number): StrengthSession => ({
  ...session,
  exercises: session.exercises.map((exercise) => ({ ...exercise, sets: Math.max(1, setsFor(exercise)) })),
});

export function adaptStrengthPlan(sessions: StrengthSession[], mode: StrengthRecoveryMode): AdaptedStrengthPlan {
  if (mode === "post-race") return { mode, title: "Post-race return to strength", explanation: "Use reduced Full Body A and B only when walking and normal movement feel comfortable. Remove one lower-body set, keep 2–3 repetitions in reserve, and choose conservative—not challenging—starting weights. The optional Core / Back routine is temporarily suppressed.", sessions: sessions.filter((session) => session.required).map((session) => ({ ...withSets(session, (exercise) => exercise.sets - (exercise.lowerBody ? 1 : 0)), duration: "25–35 min" })), suppressedSessionIds: ["aesthetic"] };
  if (mode === "race-week") {
    const base = sessions.find((session) => session.id === "full-body-a")!;
    const maintenance = { ...base, title: "Short race-week maintenance", day: "Monday or Tuesday", duration: "20–25 min", exercises: base.exercises.filter((exercise) => !exercise.lowerBody).map((exercise) => ({ ...exercise, sets: Math.min(2, exercise.sets) })) };
    return { mode, title: "Race-week adjustment", explanation: "Use one short maintenance session early in the week. Demanding lower-body work and the optional session are removed.", sessions: [maintenance], suppressedSessionIds: ["full-body-b", "aesthetic"] };
  }
  if (mode === "high-fatigue") {
    const base = sessions.find((session) => session.id === "full-body-a")!;
    return { mode, title: "High-fatigue adjustment", explanation: "Use one substantially reduced full-body session. The second required session and optional Core / Back routine are suppressed until recovery improves.", sessions: [{ ...withSets(base, (exercise) => Math.ceil(exercise.sets * STRENGTH_THRESHOLDS.highFatigueSetMultiplier)), duration: "20–30 min" }], suppressedSessionIds: ["full-body-b", "aesthetic"] };
  }
  if (mode === "running-recovery") return { mode, title: "Running recovery week", explanation: "Remove one set from each lower-body exercise while keeping recoverable upper-body and back work. The optional Core / Back routine is suppressed until normal recovery resumes.", sessions: sessions.filter((session) => session.required).map((session) => ({ ...withSets(session, (exercise) => exercise.sets - (exercise.lowerBody ? STRENGTH_THRESHOLDS.recoveryLowerBodySetReduction : 0)), duration: "30–40 min" })), suppressedSessionIds: ["aesthetic"] };
  if (mode === "marathon-peak") return { mode, title: "Marathon-peak adjustment", explanation: "Keep useful resistance intensity while reducing lower-body volume by about one-third. The optional routine is suppressed so running quality and recovery remain primary.", sessions: sessions.filter((session) => session.required).map((session) => withSets(session, (exercise) => exercise.lowerBody ? Math.round(exercise.sets * STRENGTH_THRESHOLDS.marathonPeakLowerBodySetMultiplier) : exercise.sets)), suppressedSessionIds: ["aesthetic"] };
  return { mode, title: "Normal strength week", explanation: "Use both required full-body sessions. Sunday Back + Core + Aesthetics is optional and changes with recovery after Saturday’s long run; never make up missed strength later.", sessions, suppressedSessionIds: [] };
}

export function strengthSessionRecommendation(log: StrengthSessionLog) {
  if (log.concerningPain) return { action: "reduce" as const, explanation: "Concerning pain was reported. Do not progress load; reassess the exercise before the next session." };
  if (!log.techniqueStable || log.difficulty === "too-hard") return { action: "reduce" as const, explanation: "Technique changed or the session was too hard. Reduce the next session rather than forcing progression." };
  if (log.status === "skipped" || log.status === "modified") return { action: "hold" as const, explanation: "Hold the current targets until the complete session is repeatable." };
  if (log.difficulty === "too-easy") return { action: "progress" as const, explanation: "The session was completed with stable technique and felt too easy. Use exercise-level double progression before adding weight." };
  return { action: "hold" as const, explanation: "The difficulty was appropriate. Continue building reps within each prescribed range." };
}
