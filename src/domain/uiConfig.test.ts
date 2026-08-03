import assert from "node:assert/strict";
import test from "node:test";
import { PRIMARY_NAVIGATION, ROADMAP_COLUMNS, runOutcomeIsSavable, SECONDARY_NAVIGATION, STRENGTH_TABS } from "./uiConfig.ts";
import { montereyTarget } from "../data/races.ts";

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
