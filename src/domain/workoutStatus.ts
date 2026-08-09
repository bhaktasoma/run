import type { ActiveWeek, ActiveWorkout, TrainingStore } from "./training.ts";
import type { StrengthSessionId } from "./strength.ts";

export type ResolvedWorkoutState = "available" | "shortened" | "suppressed" | "completed" | "skipped" | "notScheduled";
export interface ResolvedWorkoutStatus {
  state: ResolvedWorkoutState;
  sessionId: string;
  date: string;
  sessionType: "run" | "strength" | "rest" | "mobility";
  duration: string;
  availabilityReason: string;
  recommendedAction: string;
  canPreview: boolean;
  canLogCompletion: boolean;
}

const strengthIdFor = (workout: ActiveWorkout): StrengthSessionId | undefined => /Full Body A/i.test(workout.title) ? "full-body-a" : /Full Body B/i.test(workout.title) ? "full-body-b" : /Back \+ Core \+ Aesthetics/i.test(workout.title) ? "aesthetic" : undefined;

export function resolveStrengthStatus(sessionId: StrengthSessionId, date: string, week: ActiveWeek, store: TrainingStore): ResolvedWorkoutStatus {
  const saved = store.strengthLogs.find((log) => log.sessionId === sessionId && log.date === date);
  if (saved?.status === "completed") return { state: "completed", sessionId, date, sessionType: "strength", duration: "Saved", availabilityReason: "This session is already logged.", recommendedAction: "View completed session", canPreview: true, canLogCompletion: false };
  if (saved?.status === "skipped") return { state: "skipped", sessionId, date, sessionType: "strength", duration: "—", availabilityReason: "This session was logged as skipped.", recommendedAction: "View saved workout", canPreview: true, canLogCompletion: false };
  const normalDuration = sessionId === "aesthetic" ? "30–40 min" : sessionId === "full-body-a" ? "45–55 min" : "40–50 min";
  if (sessionId !== "aesthetic") return { state: "available", sessionId, date, sessionType: "strength", duration: normalDuration, availabilityReason: "Scheduled primary strength session.", recommendedAction: `Start ${sessionId === "full-body-a" ? "Full Body A" : "Full Body B"}`, canPreview: true, canLogCompletion: true };
  if (week.id === "2026-W31" || week.id === "2026-W32") return { state: "suppressed", sessionId, date, sessionType: "strength", duration: "Mobility or rest", availabilityReason: "Post-race recovery: optional Sunday strength is suppressed.", recommendedAction: "Start mobility or rest", canPreview: true, canLogCompletion: false };
  const checkIn = store.checkIns.find((item) => item.weekId === week.id);
  if (checkIn?.painAffectsMovement) return { state: "suppressed", sessionId, date, sessionType: "strength", duration: "Mobility or rest", availabilityReason: "Pain affected normal movement.", recommendedAction: "Start mobility or rest", canPreview: true, canLogCompletion: false };
  if (checkIn?.sleepRecovery === "poor") return { state: "suppressed", sessionId, date, sessionType: "strength", duration: "Mobility or rest", availabilityReason: "The saved weekly check-in reports poor recovery.", recommendedAction: "Start mobility or rest", canPreview: true, canLogCompletion: false };
  if (checkIn?.sleepRecovery === "mixed" || checkIn?.longRunRecovery === "slower") return { state: "shortened", sessionId, date, sessionType: "strength", duration: "15–20 min", availabilityReason: "The saved check-in indicates mild fatigue or slower long-run recovery.", recommendedAction: "Start shortened Sunday session", canPreview: true, canLogCompletion: true };
  const saturday = week.workouts.find((workout) => workout.isLongRun);
  const saturdayLogged = saturday && store.entries.some((entry) => entry.workoutId === saturday.id);
  if (!checkIn || (saturday && saturday.date < date && !saturdayLogged)) return { state: "available", sessionId, date, sessionType: "strength", duration: normalDuration, availabilityReason: "Recovery is unknown. Check pain, leg soreness, energy, and long-run recovery before starting.", recommendedAction: "Complete the brief readiness check", canPreview: true, canLogCompletion: false };
  return { state: "available", sessionId, date, sessionType: "strength", duration: normalDuration, availabilityReason: "Saved recovery data supports the normal optional session.", recommendedAction: "Start 30–40 min session", canPreview: true, canLogCompletion: true };
}

export function resolveWorkoutStatus(workout: ActiveWorkout, week: ActiveWeek, store: TrainingStore): ResolvedWorkoutStatus {
  const strengthId = strengthIdFor(workout);
  if (workout.kind === "strength" && strengthId) return resolveStrengthStatus(strengthId, workout.date, week, store);
  const runLog = store.entries.find((entry) => entry.workoutId === workout.id);
  if (runLog) return { state: runLog.status === "skipped" ? "skipped" : "completed", sessionId: workout.id, date: workout.date, sessionType: "run", duration: workout.duration ?? `${workout.plannedMiles} mi`, availabilityReason: `Run logged as ${runLog.status}.`, recommendedAction: "View completed run", canPreview: true, canLogCompletion: false };
  if (workout.kind === "run" || workout.kind === "benchmark") return { state: "available", sessionId: workout.id, date: workout.date, sessionType: "run", duration: workout.duration ?? `${workout.plannedMiles} mi`, availabilityReason: "Scheduled by the current eight-week Plan.", recommendedAction: "Start run warm-up", canPreview: true, canLogCompletion: true };
  return { state: "notScheduled", sessionId: workout.id, date: workout.date, sessionType: "rest", duration: "Rest", availabilityReason: workout.purpose, recommendedAction: "Follow recovery guidance", canPreview: false, canLogCompletion: false };
}

export const strengthSessionIdForWorkout = strengthIdFor;
