import assert from "node:assert/strict";
import test from "node:test";
import { loadTrainingStore, saveTrainingStore, TRAINING_STORAGE_KEY } from "./storage.ts";

test("versioned storage migrates legacy logs and round-trips new data", () => {
  const values = new Map<string, string>();
  values.set("run-training-log-v1", JSON.stringify([{ id: "old-1", date: "2026-08-01", workout: "Long Run", actualDistance: "4", duration: "0:58:00", pain: "None" }]));
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const migrated = loadTrainingStore(storage);
  assert.equal(migrated.version, 3);
  assert.equal(migrated.entries[0].pain, "none");
  saveTrainingStore(migrated, storage);
  assert.ok(values.has(TRAINING_STORAGE_KEY));
  assert.deepEqual(loadTrainingStore(storage), migrated);
});

test("version two storage safely migrates strength defaults", () => {
  const values = new Map<string, string>();
  values.set("soma-training-store-v2", JSON.stringify({ version: 2, entries: [], checkIns: [], benchmarks: [], decisions: [], roadmapCompletions: {} }));
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const migrated = loadTrainingStore(storage);
  assert.equal(migrated.version, 3);
  assert.deepEqual(migrated.strengthLogs, []);
  assert.equal(migrated.selectedAbExercise, "cable-crunch");
});

test("strength logs persist in version three storage", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const store = loadTrainingStore(storage);
  store.strengthLogs.push({ id: "2026-08-03-full-body-a", weekId: "2026-W32", sessionId: "full-body-a", date: "2026-08-03", status: "completed", difficulty: "appropriate", concerningPain: false, techniqueStable: true, notes: "", exercises: [{ exerciseId: "squat-trap", weight: 50, reps: [7, 7, 7], rir: 2, status: "completed", note: "" }] });
  saveTrainingStore(store, storage);
  const reloaded = loadTrainingStore(storage);
  assert.equal(reloaded.strengthLogs.length, 1);
  assert.equal(reloaded.strengthLogs[0].exercises[0].weight, 50);
});
