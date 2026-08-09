import assert from "node:assert/strict";
import test from "node:test";
import plans from "../data/plans/index.ts";
import { strengthSessions } from "../data/workoutPlan.ts";
import { adaptStrengthPlan, moveStrengthStage, nextStrengthTarget, shortenedSundaySession, STRENGTH_PROGRESSION_RULE, sundayStrengthState } from "./strength.ts";

const squat = strengthSessions[0].exercises[0];

test("double progression increases only after every set reaches the top with reserve", () => {
  const increase = nextStrengthTarget(squat, { exerciseId: squat.id, weight: 60, reps: [10, 10, 10], rir: 2, status: "completed", note: "" }, true);
  assert.equal(increase.action, "increase");
  assert.equal(increase.weight, 65);
  assert.equal(increase.reps, 6);
  const incomplete = nextStrengthTarget(squat, { exerciseId: squat.id, weight: 60, reps: [10, 10, 9], rir: 2, status: "completed", note: "" }, true);
  assert.equal(incomplete.action, "hold");
  assert.equal(incomplete.weight, 60);
});

test("double progression holds or reduces when reps or technique are insufficient", () => {
  assert.equal(nextStrengthTarget(squat, { exerciseId: squat.id, weight: 60, reps: [6, 6, 6], rir: 2, status: "completed", note: "" }, true).action, "hold");
  assert.equal(nextStrengthTarget(squat, { exerciseId: squat.id, weight: 60, reps: [5, 4, 4], rir: 0, status: "modified", note: "" }, false).action, "reduce");
});

test("running recovery removes one lower-body set only", () => {
  const adapted = adaptStrengthPlan(strengthSessions, "running-recovery");
  const originalLower = strengthSessions[0].exercises.find((exercise) => exercise.lowerBody)!;
  const adaptedLower = adapted.sessions[0].exercises.find((exercise) => exercise.id === originalLower.id)!;
  const originalUpper = strengthSessions[0].exercises.find((exercise) => !exercise.lowerBody)!;
  const adaptedUpper = adapted.sessions[0].exercises.find((exercise) => exercise.id === originalUpper.id)!;
  assert.equal(adaptedLower.sets, originalLower.sets - 1);
  assert.equal(adaptedUpper.sets, originalUpper.sets);
});

test("race week offers one maintenance session without demanding lower body", () => {
  const adapted = adaptStrengthPlan(strengthSessions, "race-week");
  assert.equal(adapted.sessions.length, 1);
  assert.ok(adapted.sessions[0].exercises.every((exercise) => !exercise.lowerBody));
  assert.ok(adapted.suppressedSessionIds.includes("aesthetic"));
});

test("post-race recovery conditionally reduces required strength and suppresses optional work", () => {
  const adapted = adaptStrengthPlan(strengthSessions, "post-race");
  assert.equal(adapted.sessions.length, 2);
  assert.deepEqual(adapted.suppressedSessionIds, ["aesthetic"]);
  assert.ok(adapted.sessions.flatMap((session) => session.exercises).filter((exercise) => exercise.lowerBody).every((exercise) => exercise.sets <= 2));
  assert.ok(adapted.sessions.every((session) => session.duration === "25–35 min"));
});

test("marathon peak reduces lower-body volume by about one third", () => {
  const adapted = adaptStrengthPlan(strengthSessions, "marathon-peak");
  const original = strengthSessions[0].exercises.find((exercise) => exercise.lowerBody && exercise.sets === 3)!;
  const changed = adapted.sessions[0].exercises.find((exercise) => exercise.id === original.id)!;
  assert.equal(changed.sets, 2);
});

test("poor recovery suppresses optional strength", () => {
  const adapted = adaptStrengthPlan(strengthSessions, "high-fatigue");
  assert.ok(adapted.suppressedSessionIds.includes("aesthetic"));
  assert.equal(adapted.sessions.length, 1);
});

test("full-body sessions provide the intended balanced movement coverage", () => {
  assert.deepEqual(strengthSessions[0].exercises.map((exercise) => exercise.id), ["goblet-squat", "rdl", "split-squat", "standing-calf", "row-a", "db-press", "dead-bug", "pallof"]);
  assert.deepEqual(strengthSessions[1].exercises.map((exercise) => exercise.id), ["step-up", "hip-thrust", "hamstring-curl", "single-leg-calf", "lat-pulldown", "shoulder-press", "side-plank", "suitcase-carry"]);
  for (const session of strengthSessions.filter((item) => item.required)) {
    assert.ok(session.exercises.every((exercise) => exercise.sets >= 2 && exercise.sets <= 3));
  }
});

test("Sunday session has normal, shortened, and suppressed recovery states", () => {
  const optional = strengthSessions.find((session) => !session.required)!;
  assert.equal(optional.title, "Optional Back + Core + Aesthetics");
  assert.equal(optional.duration, "30–40 min");
  assert.equal(optional.exercises.length, 8);
  const shortened = shortenedSundaySession(optional);
  assert.equal(shortened.duration, "15–20 min");
  assert.equal(shortened.exercises.length, 5);
  assert.equal(sundayStrengthState("normal", "good", "within-48h"), "recovered");
  assert.equal(sundayStrengthState("normal", "mixed", "within-48h"), "shortened");
  assert.equal(sundayStrengthState("normal", "good", "slower"), "shortened");
  assert.equal(sundayStrengthState("normal", "poor", "within-48h"), "suppressed");
  assert.ok(adaptStrengthPlan(strengthSessions, "normal").sessions.some((session) => session.id === optional.id));
  for (const mode of ["post-race", "running-recovery", "high-fatigue", "race-week", "marathon-peak"] as const) {
    const adapted = adaptStrengthPlan(strengthSessions, mode);
    assert.ok(!adapted.sessions.some((session) => session.id === optional.id), `${mode} should suppress the optional routine`);
    assert.ok(adapted.suppressedSessionIds.includes(optional.id));
  }
});

test("guided strength stages support next, previous, and bounded skipping", () => {
  assert.equal(moveStrengthStage("idle", "next"), "warmup");
  assert.equal(moveStrengthStage("warmup", "next"), "workout");
  assert.equal(moveStrengthStage("workout", "next"), "cooldown");
  assert.equal(moveStrengthStage("cooldown", "next"), "log");
  assert.equal(moveStrengthStage("cooldown", "previous"), "workout");
  assert.equal(moveStrengthStage("log", "next"), "log");
});

test("published progression rule requires good form before the smallest load increase", () => {
  assert.equal(STRENGTH_PROGRESSION_RULE, "Reach the top of the repetition range with good form before increasing the weight by the smallest available amount.");
});

test("roadmap never places heavy lower-body strength on Friday before a Saturday long run", () => {
  for (const plan of plans) for (const week of plan.weeks) {
    const friday = week.days.find((day) => day.day === "Friday");
    const saturday = week.days.find((day) => day.day === "Saturday");
    if (saturday?.run.toLowerCase().includes("long run")) assert.doesNotMatch(friday?.strength ?? "", /heavy legs|full body [ab]/i);
  }
});
