import assert from "node:assert/strict";
import test from "node:test";
import { emptyTrainingStore, exportTrainingBackup, loadTrainingStore, previewTrainingBackup, saveTrainingStore, TRAINING_STORAGE_KEY } from "./storage.ts";

test("versioned storage migrates legacy logs and round-trips new data", () => {
  const values = new Map<string, string>();
  values.set("run-training-log-v1", JSON.stringify([{ id: "old-1", date: "2026-08-01", workout: "Long Run", actualDistance: "4", duration: "0:58:00", pain: "None" }]));
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const migrated = loadTrainingStore(storage);
  assert.equal(migrated.version, 4);
  assert.equal(migrated.entries[0].pain, "none");
  assert.equal(migrated.entries[0].activityDate, "2026-08-01");
  saveTrainingStore(migrated, storage);
  assert.ok(values.has(TRAINING_STORAGE_KEY));
  assert.deepEqual(loadTrainingStore(storage), migrated);
});

test("version two storage safely migrates strength defaults", () => {
  const values = new Map<string, string>();
  values.set("soma-training-store-v2", JSON.stringify({ version: 2, entries: [], checkIns: [], benchmarks: [], decisions: [], roadmapCompletions: {} }));
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const migrated = loadTrainingStore(storage);
  assert.equal(migrated.version, 4);
  assert.deepEqual(migrated.strengthLogs, []);
  assert.equal(migrated.selectedAbExercise, "cable-crunch");
});

test("version three entries migrate activity and audit dates without losing IDs", () => {
  const values = new Map<string, string>();
  values.set("soma-training-store-v3", JSON.stringify({ version: 3, entries: [{ id: "run-1", workoutId: "2026-08-03", date: "2026-08-03", workout: "Easy run", status: "completed", plannedDistance: "3", actualDistance: "3", duration: "42:00", averageRpe: "4", finalRpe: "4", pain: "none", result: "appropriate", notes: "", fueling: "", weatherTerrain: "Flat and cool" }], checkIns: [], benchmarks: [], decisions: [], roadmapCompletions: [], strengthLogs: [], strengthDecisions: [], selectedAbExercise: "cable-crunch" }));
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const migrated = loadTrainingStore(storage);
  assert.equal(migrated.entries[0].id, "run-1");
  assert.equal(migrated.entries[0].activityDate, "2026-08-03");
  assert.equal(migrated.entries[0].conditions, "Flat and cool");
  assert.ok(migrated.entries[0].createdAt);
});

test("strength logs persist in version four storage", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const store = loadTrainingStore(storage);
  store.strengthLogs.push({ id: "2026-08-03-full-body-a", weekId: "2026-W32", sessionId: "full-body-a", date: "2026-08-03", status: "completed", difficulty: "appropriate", concerningPain: false, techniqueStable: true, notes: "", exercises: [{ exerciseId: "squat-trap", weight: 50, reps: [7, 7, 7], rir: 2, status: "completed", note: "" }] });
  saveTrainingStore(store, storage);
  const reloaded = loadTrainingStore(storage);
  assert.equal(reloaded.strengthLogs.length, 1);
  assert.equal(reloaded.strengthLogs[0].exercises[0].weight, 50);
});

test("version four round-trip preserves editable run fields", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  const store = loadTrainingStore(storage);
  store.entries.push({ id: "stable-id", activityDate: "2026-08-02", createdAt: "2026-08-03T01:00:00.000Z", updatedAt: "2026-08-03T02:00:00.000Z", workout: "Unplanned run", status: "partial", plannedDistance: "", actualDistance: "2", duration: "30:00", averageRpe: "5", finalRpe: "6", pain: "mild", result: "too-hard", notes: "Stopped early", averageHeartRate: "145", maximumHeartRate: "160", elevationGain: "120", averageCadence: "162", terrain: "rolling", runWalkMethod: "structured", runWalkPattern: "4 min run / 1 min walk", conditions: "Warm" });
  saveTrainingStore(store, storage);
  const entry = loadTrainingStore(storage).entries[0];
  assert.equal(entry.id, "stable-id");
  assert.equal(entry.status, "partial");
  assert.equal(entry.result, "too-hard");
  assert.equal(entry.notes, "Stopped early");
});

test("JSON backup previews and preserves versioned training data", () => {
  const store = emptyTrainingStore();
  store.entries.push({ id: "r", activityDate: "2026-08-03", createdAt: "x", updatedAt: "x", workout: "Easy run", status: "completed", plannedDistance: "3", actualDistance: "3", duration: "42:00", averageRpe: "4", finalRpe: "4", pain: "none", result: "appropriate", notes: "", averageHeartRate: "", maximumHeartRate: "", elevationGain: "", averageCadence: "", terrain: "flat", runWalkMethod: "continuous", runWalkPattern: "", conditions: "" });
  store.roadmapCompletions.old = true;
  const preview = previewTrainingBackup(exportTrainingBackup(store));
  assert.equal(preview.counts.runs, 1);
  assert.equal(preview.store.entries[0].id, "r");
  assert.deepEqual(preview.store.roadmapCompletions, { old: true });
});

test("JSON restore rejects malformed and incomplete backups", () => {
  assert.throws(() => previewTrainingBackup("not json"), /valid JSON/);
  assert.throws(() => previewTrainingBackup(JSON.stringify({ format: "other", data: {} })), /not a Soma/);
  assert.throws(() => previewTrainingBackup(JSON.stringify({ format: "soma-running-backup", data: { version: 4 } })), /missing a valid/);
});
