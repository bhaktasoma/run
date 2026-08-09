import assert from "node:assert/strict";
import test from "node:test";
import { exerciseVideoLabel, exerciseVideoUrl, fullBodyCooldown, kneeResilience, mobilityRoutine, runCooldown, runWarmup, SAFE_EXTERNAL_LINK_PROPS, strengthWarmups } from "../data/routines.ts";

test("shared routines include run and strength preparation and recovery", () => {
  assert.equal(runWarmup.steps.length, 6);
  assert.equal(runCooldown.steps.length, 5);
  assert.equal(strengthWarmups["full-body-a"].steps.length, 7);
  assert.equal(strengthWarmups["full-body-b"].steps.length, 7);
  assert.equal(fullBodyCooldown.steps.length, 6);
  assert.equal(mobilityRoutine.steps.length, 6);
});

test("video references use safe YouTube searches with trusted-source qualifiers", () => {
  const rdl = exerciseVideoUrl("Romanian deadlift");
  const ankle = exerciseVideoUrl("Knee-to-wall ankle rocks");
  assert.match(rdl, /^https:\/\/www\.youtube\.com\/results\?search_query=/);
  assert.match(decodeURIComponent(rdl), /hospital sports medicine/);
  assert.match(decodeURIComponent(ankle), /physical therapist/);
  assert.deepEqual(SAFE_EXTERNAL_LINK_PROPS, { target: "_blank", rel: "noopener noreferrer" });
  assert.equal(exerciseVideoLabel("Romanian deadlift"), "View YouTube examples for Romanian deadlift (opens in a new tab)");
});

test("knee resilience uses the requested non-diagnostic label and safety message", () => {
  assert.equal(kneeResilience.title, "Knee and Lower-Leg Resilience");
  assert.deepEqual(kneeResilience.patterns, ["Controlled step-down", "Split squat", "Hamstring curl", "Calf raise", "Tibialis raise", "Lateral band walk", "Single-leg balance"]);
  assert.match(kneeResilience.safety, /swelling, locking, giving way, sharp pain/);
});
