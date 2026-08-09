import assert from "node:assert/strict";
import test from "node:test";
import activePlan from "../data/activePlan.ts";
import { emptyTrainingStore } from "./storage.ts";
import { resolveStrengthStatus, resolveWorkoutStatus } from "./workoutStatus.ts";

const normalWeek = activePlan.find((week) => week.id !== "2026-W31" && week.id !== "2026-W32")!;
const sunday = normalWeek.workouts.find((workout) => /Back \+ Core \+ Aesthetics/i.test(workout.title))!;

test("shared Sunday resolver returns the same state to every consuming view", () => {
  const store = emptyTrainingStore();
  const today = resolveWorkoutStatus(sunday, normalWeek, store);
  const plan = resolveWorkoutStatus(sunday, normalWeek, store);
  const overview = resolveStrengthStatus("aesthetic", sunday.date, normalWeek, store);
  const train = resolveStrengthStatus("aesthetic", sunday.date, normalWeek, store);
  assert.equal(today.state, plan.state);
  assert.equal(plan.state, overview.state);
  assert.equal(overview.state, train.state);
  assert.match(today.availabilityReason, /unknown/i);
  assert.equal(today.canLogCompletion, false);
});

test("Sunday resolves shortened, suppressed, post-race, and completed states", () => {
  const mixed = emptyTrainingStore();
  mixed.checkIns.push({ weekId: normalWeek.id, sleepRecovery: "mixed", painAffectsMovement: false, confidence: "unchanged", longRunRecovery: "within-48h" });
  assert.equal(resolveStrengthStatus("aesthetic", sunday.date, normalWeek, mixed).state, "shortened");
  const pain = emptyTrainingStore();
  pain.checkIns.push({ weekId: normalWeek.id, sleepRecovery: "good", painAffectsMovement: true, confidence: "unchanged", longRunRecovery: "within-48h" });
  assert.equal(resolveStrengthStatus("aesthetic", sunday.date, normalWeek, pain).state, "suppressed");
  const postRace = activePlan.find((week) => week.id === "2026-W32")!;
  const postRaceSunday = postRace.workouts.at(-1)!;
  assert.equal(resolveStrengthStatus("aesthetic", postRaceSunday.date, postRace, emptyTrainingStore()).state, "suppressed");
  const completed = emptyTrainingStore();
  completed.strengthLogs.push({ id: "done", weekId: normalWeek.id, sessionId: "aesthetic", date: sunday.date, status: "completed", difficulty: "appropriate", concerningPain: false, techniqueStable: true, notes: "", exercises: [] });
  assert.equal(resolveStrengthStatus("aesthetic", sunday.date, normalWeek, completed).state, "completed");
});

test("run, strength, and rest workouts expose type-appropriate actions", () => {
  const store = emptyTrainingStore();
  const run = normalWeek.workouts.find((workout) => workout.kind === "run")!;
  const rest = normalWeek.workouts.find((workout) => workout.kind === "rest")!;
  assert.equal(resolveWorkoutStatus(run, normalWeek, store).recommendedAction, "Start run warm-up");
  assert.equal(resolveWorkoutStatus(rest, normalWeek, store).recommendedAction, "Follow recovery guidance");
});
