import assert from "node:assert/strict";
import test from "node:test";
import { PRIMARY_NAVIGATION, ROADMAP_COLUMNS, runOutcomeIsSavable, SECONDARY_NAVIGATION, STRENGTH_TABS } from "./uiConfig.ts";
import { montereyTarget } from "../data/races.ts";
import plans from "../data/plans/index.ts";
import activePlan from "../data/activePlan.ts";
import { roadmapMonthLabel, runOnlyTitle } from "../data/roadmapAlignment.ts";
import { onboardingWasDismissed, saveOnboardingDismissal } from "./onboarding.ts";

test("Monterey 2027 remains explicitly provisional", () => {
  assert.equal(montereyTarget.provisional, true);
  assert.equal(montereyTarget.title, "Provisional November 2027 target");
  assert.equal(montereyTarget.confirmation, "Confirm when officially announced");
});

test("mobile navigation keeps four primary destinations and moves secondary tools", () => {
  assert.deepEqual(PRIMARY_NAVIGATION, ["Today", "Plan", "Progress", "Strength"]);
  assert.deepEqual(SECONDARY_NAVIGATION, ["Roadmap", "Goal", "Run History & Backup", "Guides"]);
});

test("roadmap is read-only and limited to five directional fields", () => {
  assert.deepEqual(ROADMAP_COLUMNS, ["Day / date", "Workout", "Distance", "Effort", "Strength"]);
  assert.ok(!ROADMAP_COLUMNS.some((column) => /complete|core|mobility/i.test(column)));
});

test("strength navigation is consolidated", () => assert.deepEqual(STRENGTH_TABS, ["Overview", "Train", "Progress", "Guides"]));

test("new run outcomes cannot save before required fields are explicit", () => {
  assert.equal(runOutcomeIsSavable("", "", false, ""), false);
  assert.equal(runOutcomeIsSavable("completed", "3", true, ""), false);
  assert.equal(runOutcomeIsSavable("completed", "3", true, "appropriate"), true);
  assert.equal(runOutcomeIsSavable("skipped", "", false, ""), true);
});

test("run logging removes combined strength names", () => {
  assert.equal(runOnlyTitle("Easy run + Full Body A"), "Easy run");
  assert.equal(runOnlyTitle("Recovery run + Full Body B"), "Recovery run");
});

test("overlapping roadmap weeks use authoritative active-plan mileage and long runs", () => {
  const august = plans.find((plan) => plan.id === "2026-08")!;
  assert.deepEqual(august.weeks.slice(0, 5).map((week) => Number.parseFloat(week.weeklyMileage)), activePlan.slice(0, 5).map((week) => week.plannedMiles));
  assert.equal(august.weeks[4].days.find((day) => day.run === "Long easy run")?.miles, "5");
  assert.equal(roadmapMonthLabel("2026-08"), "August 2026");
  assert.equal(roadmapMonthLabel("2027-08"), "August 2027");
});

test("onboarding dismissal persists and can be read on the next visit", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  assert.equal(onboardingWasDismissed(storage), false);
  saveOnboardingDismissal(storage);
  assert.equal(onboardingWasDismissed(storage), true);
});
