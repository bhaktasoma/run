import assert from "node:assert/strict";
import test from "node:test";
import { daysBetweenIsoDates, trainingDateIso } from "../utils/trainingDate.ts";

test("training dates remain on Pacific time during the UTC evening boundary", () => {
  assert.equal(trainingDateIso(new Date("2026-08-03T02:00:00Z")), "2026-08-02");
  assert.equal(trainingDateIso(new Date("2026-08-03T08:00:00Z")), "2026-08-03");
});

test("race countdown uses calendar dates without timezone drift", () => {
  assert.equal(daysBetweenIsoDates("2026-08-02", "2026-08-03"), 1);
});
