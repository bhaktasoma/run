import assert from "node:assert/strict";
import test from "node:test";
import plans from "../data/plans/index.ts";
import { strengthSessions } from "../data/workoutPlan.ts";
import { adaptStrengthPlan, nextStrengthTarget } from "./strength.ts";

const squat = strengthSessions[0].exercises[0];

test("double progression increases only after every set reaches the top with reserve", () => {
  const increase = nextStrengthTarget(squat, { exerciseId: squat.id, weight: 60, reps: [7, 7, 7], rir: 2, status: "completed", note: "" }, true);
  assert.equal(increase.action, "increase");
  assert.equal(increase.weight, 65);
  assert.equal(increase.reps, 5);
  const incomplete = nextStrengthTarget(squat, { exerciseId: squat.id, weight: 60, reps: [7, 7, 6], rir: 2, status: "completed", note: "" }, true);
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

test("roadmap never places heavy lower-body strength on Friday before a Saturday long run", () => {
  for (const plan of plans) for (const week of plan.weeks) {
    const friday = week.days.find((day) => day.day === "Friday");
    const saturday = week.days.find((day) => day.day === "Saturday");
    if (saturday?.run.toLowerCase().includes("long run")) assert.doesNotMatch(friday?.strength ?? "", /heavy legs|full body [ab]/i);
  }
});
