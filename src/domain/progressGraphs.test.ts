import assert from "node:assert/strict";
import test from "node:test";
import activePlan from "../data/activePlan.ts";
import { aggregateWeeklyGraph, feetToMeters, filterBenchmarks, filterByRange, interpretBenchmarks, interpretEasyRuns, interpretLoad, interpretLongRuns, milesToKm, rangeStart, selectComparableEasyRuns, selectLongRuns } from "./progressGraphs.ts";
import type { BenchmarkEntry, RunEntry } from "./training.ts";

const run = (id: string, overrides: Partial<RunEntry> = {}): RunEntry => ({ id, workoutId: id, activityDate: id, createdAt: `${id}T12:00:00Z`, updatedAt: `${id}T12:00:00Z`, workout: "Easy run", status: "completed", plannedDistance: "3", actualDistance: "3", duration: "42:00", averageRpe: "4", finalRpe: "4", pain: "none", result: "appropriate", notes: "", averageHeartRate: "", maximumHeartRate: "", elevationGain: "", averageCadence: "", terrain: "flat", runWalkMethod: "continuous", runWalkPattern: "", conditions: "", ...overrides });
const benchmark = (id: string, overrides: Partial<BenchmarkEntry> = {}): BenchmarkEntry => ({ id, date: id, type: "Controlled 5K", distance: "3.10686", duration: "35:00", averageRpe: "7", notes: "", terrain: "flat", ...overrides });

test("weekly aggregation uses activity date, preserves partial and recovery weeks, and rolls completed weeks", () => {
  const entries = [
    run("e1", { workoutId: activePlan[1].workouts[0].id, activityDate: "2026-08-10" }),
    run("e2", { activityDate: "2026-07-20", actualDistance: "2" }),
  ];
  const weeks = aggregateWeeklyGraph(activePlan, entries, [], "2026-08-12");
  assert.equal(weeks.find((week) => week.start === "2026-08-10")?.completedDistance, 3);
  assert.equal(weeks.find((week) => week.start === "2026-08-10")?.partial, true);
  assert.equal(weeks.find((week) => week.id === activePlan[0].id)?.postRace, true);
  assert.ok(weeks.every((week) => week.rollingDistance === null || Number.isFinite(week.rollingDistance)));
});

test("long runs are identified and interpreted only against comparable terrain and distance", () => {
  const logs = [run("a", { activityDate: "2026-08-01", workout: "Long run", actualDistance: "7", finalRpe: "4" }), run("b", { activityDate: "2026-08-15", workout: "Long run", actualDistance: "7.5", finalRpe: "6", terrain: "rolling" })];
  const selected = selectLongRuns(logs, activePlan, []);
  assert.equal(selected.length, 2);
  assert.equal(selected[1].rpeLabel, "Final RPE 5–6");
  assert.match(interpretLongRuns(selected), /previous comparable/);
});

test("easy efficiency excludes unlike workouts and separates treadmill and outdoor cohorts", () => {
  const logs = [run("a", { activityDate: "2026-08-01" }), run("b", { activityDate: "2026-08-03", duration: "41:00", averageHeartRate: "145" }), run("c", { activityDate: "2026-08-05", duration: "40:00" }), run("d", { activityDate: "2026-08-06", terrain: "treadmill" }), run("e", { activityDate: "2026-08-07", workout: "Tempo run", averageRpe: "7" })];
  const selected = selectComparableEasyRuns(logs);
  assert.equal(selected.length, 3);
  assert.equal(selected[2].trend !== null, true);
  assert.match(interpretEasyRuns(selected), /comparable easy runs/);
  assert.equal(selected.filter((item) => item.heartRate === null).length, 2);
});

test("benchmark comparison stays within type and weakens unlike context", () => {
  const entries = [benchmark("b1", { date: "2026-08-01" }), benchmark("b2", { date: "2026-09-01", duration: "34:00", terrain: "hilly" }), benchmark("b3", { date: "2026-09-02", type: "Controlled 10K" })];
  assert.equal(filterBenchmarks(entries, "Controlled 5K").length, 2);
  assert.match(interpretBenchmarks(entries, "Controlled 5K"), /comparison is weak/);
  assert.doesNotMatch(interpretBenchmarks(entries, "Controlled 10K"), /previous/);
});

test("load requires valid duration and RPE rather than inventing missing data", () => {
  const weeks = aggregateWeeklyGraph(activePlan, [run("bad", { activityDate: "2026-08-10", duration: "", averageRpe: "" })], [], "2026-08-20");
  assert.match(interpretLoad(weeks), /Not enough weeks/);
});

test("ranges and display conversions are deterministic", () => {
  assert.equal(rangeStart("8w", "2026-08-03"), "2026-06-08");
  assert.deepEqual(filterByRange([{ date: "2026-06-07" }, { date: "2026-06-08" }], "8w", "2026-08-03"), [{ date: "2026-06-08" }]);
  assert.equal(milesToKm(1), 1.609344);
  assert.equal(feetToMeters(100), 30.48);
});

test("malformed legacy values do not create false graph observations", () => {
  const selected = selectComparableEasyRuns([run("legacy", { activityDate: "", duration: "oops", actualDistance: "not-a-number", averageRpe: "" })]);
  assert.deepEqual(selected, []);
});
