import assert from "node:assert/strict";
import test from "node:test";
import activePlan from "../data/activePlan.ts";
import plans from "../data/plans/index.ts";
import { adjustedMileage, benchmarkGuidance, recommendWeek, sumMileageValues, totalScheduledMileage } from "./progression.ts";
import type { RunEntry, WeeklyCheckIn } from "./training.ts";

const entryFor = (workoutId: string, overrides: Partial<RunEntry> = {}): RunEntry => ({
  id: `log-${workoutId}`,
  workoutId,
  date: workoutId,
  workout: "Easy run",
  status: "completed",
  plannedDistance: "3",
  actualDistance: "3",
  duration: "0:42:00",
  averageRpe: "4",
  finalRpe: "4",
  pain: "none",
  result: "appropriate",
  notes: "",
  fueling: "",
  weatherTerrain: "",
  ...overrides,
});

const goodCheckIn = (weekId: string): WeeklyCheckIn => ({ weekId, sleepRecovery: "good", painAffectsMovement: false, confidence: "improving", longRunRecovery: "within-48h" });

test("active weeks use full-year date identities and exact planned totals", () => {
  assert.equal(activePlan.length, 8);
  assert.equal(plans.length, 27);
  for (const week of activePlan) {
    assert.equal(totalScheduledMileage(week), week.plannedMiles);
    for (const workout of week.workouts) assert.match(workout.id, /^2026-\d{2}-\d{2}$/);
  }
});

test("active plan preserves recovery and strength guardrails", () => {
  assert.deepEqual(activePlan.map((week) => week.plannedMiles), [0, 12, 15, 16, 15, 18, 20, 22]);
  for (const week of activePlan.slice(1)) {
    assert.ok(week.workouts.filter((workout) => workout.kind === "run" || workout.kind === "benchmark").length <= 5);
    assert.equal(week.workouts.filter((workout) => workout.title.includes("Full Body")).length, 2);
    const longRun = week.workouts.find((workout) => workout.isLongRun)!;
    const normalStrength = week.workouts.find((workout) => workout.title.includes("normal"))!;
    assert.ok(new Date(longRun.date).getTime() - new Date(normalStrength.date).getTime() >= 3 * 86_400_000);
  }
});

test("race-week mileage includes warm-up running, shakeout, and race", () => {
  assert.equal(sumMileageValues(["3", "3", "2", "2", "—", "2", "13.1"]), 25.1);
  assert.equal(sumMileageValues(["3", "3", "2", "2", "—", "2", "26.2"]), 38.2);
});

test("progression decisions are deterministic", () => {
  const week = activePlan[1];
  const runs = week.workouts.filter((item) => item.kind === "run").map((item) => entryFor(item.id));
  assert.equal(recommendWeek(week, runs, goodCheckIn(week.id)).state, "Progress");
  assert.equal(recommendWeek(week, runs.map((entry, index) => index === 0 ? { ...entry, result: "too-hard" } : entry), { ...goodCheckIn(week.id), sleepRecovery: "mixed" }).state, "Hold");
  assert.equal(recommendWeek(week, runs.slice(0, 2).map((entry) => ({ ...entry, result: "too-hard" })), { ...goodCheckIn(week.id), sleepRecovery: "poor" }).state, "Reduce");
  assert.equal(recommendWeek(week, [{ ...runs[0], pain: "concerning" }], goodCheckIn(week.id)).state, "Reassess");
});

test("plan adjustments follow named recommendation states", () => {
  assert.equal(adjustedMileage(20, "Progress"), 22);
  assert.equal(adjustedMileage(20, "Hold"), 20);
  assert.equal(adjustedMileage(20, "Reduce"), 15);
  assert.equal(adjustedMileage(20, "Reassess"), 0);
});

test("benchmark guidance remains effort-qualified", () => {
  const guidance = benchmarkGuidance({ id: "b1", date: "2026-09-16", type: "Same easy route", distance: "3", duration: "0:42:00", averageRpe: "4", notes: "" });
  assert.match(guidance, /14:00\/mi/);
  assert.match(guidance, /RPE remains 3–4/);
});
