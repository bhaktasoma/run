import assert from "node:assert/strict";
import test from "node:test";
import { loadTrainingStore, saveTrainingStore, TRAINING_STORAGE_KEY } from "./storage.ts";

test("versioned storage migrates legacy logs and round-trips new data", () => {
  const values = new Map<string, string>();
  values.set("run-training-log-v1", JSON.stringify([{ id: "old-1", date: "2026-08-01", workout: "Long Run", actualDistance: "4", duration: "0:58:00", pain: "None" }]));
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const migrated = loadTrainingStore(storage);
  assert.equal(migrated.version, 2);
  assert.equal(migrated.entries[0].pain, "none");
  saveTrainingStore(migrated, storage);
  assert.ok(values.has(TRAINING_STORAGE_KEY));
  assert.deepEqual(loadTrainingStore(storage), migrated);
});
