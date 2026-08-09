import type { RunEntry, TrainingStore } from "./training.ts";

export const TRAINING_STORAGE_KEY = "soma-training-store-v5";
const VERSION_FOUR_STORAGE_KEY = "soma-training-store-v4";
const VERSION_THREE_STORAGE_KEY = "soma-training-store-v3";
const PREVIOUS_TRAINING_STORAGE_KEY = "soma-training-store-v2";

export const emptyTrainingStore = (): TrainingStore => ({
  version: 5,
  entries: [],
  checkIns: [],
  benchmarks: [],
  decisions: [],
  roadmapCompletions: {},
  strengthLogs: [],
  strengthDecisions: [],
  selectedAbExercise: "cable-crunch",
  routineCompletions: [],
});

interface LegacyRunEntry {
  id?: string;
  date?: string;
  workout?: string;
  plannedDistance?: string;
  actualDistance?: string;
  duration?: string;
  averageRpe?: string;
  finalRpe?: string;
  pain?: string;
  fuel?: string;
  weatherTerrain?: string;
  worked?: string;
  changeNextTime?: string;
}

type MigratableRunEntry = Omit<LegacyRunEntry, "pain"> & Partial<Omit<RunEntry, "pain">> & { pain?: string };

const migrateEntry = (entry: MigratableRunEntry, index: number): RunEntry => ({
  id: entry.id ?? `legacy-${index}`,
  workoutId: entry.workoutId,
  activityDate: entry.activityDate ?? entry.date ?? "",
  createdAt: entry.createdAt ?? `${entry.activityDate ?? entry.date ?? "1970-01-01"}T12:00:00.000Z`,
  updatedAt: entry.updatedAt ?? entry.createdAt ?? `${entry.activityDate ?? entry.date ?? "1970-01-01"}T12:00:00.000Z`,
  workout: entry.workout ?? "Run",
  status: entry.status ?? "completed",
  plannedDistance: entry.plannedDistance ?? "",
  actualDistance: entry.actualDistance ?? "",
  duration: entry.duration ?? "",
  averageRpe: entry.averageRpe ?? "",
  finalRpe: entry.finalRpe ?? "",
  pain: entry.pain?.toLowerCase().includes("concern") ? "concerning" : entry.pain && !entry.pain.toLowerCase().includes("none") ? "mild" : "none",
  result: entry.result ?? "appropriate",
  notes: entry.notes ?? [entry.worked, entry.changeNextTime].filter(Boolean).join(" "),
  averageHeartRate: entry.averageHeartRate ?? "",
  maximumHeartRate: entry.maximumHeartRate ?? "",
  elevationGain: entry.elevationGain ?? "",
  averageCadence: entry.averageCadence ?? "",
  terrain: entry.terrain ?? (entry.weatherTerrain?.toLowerCase().includes("hill") ? "hilly" : ""),
  runWalkMethod: entry.runWalkMethod ?? "unspecified",
  runWalkPattern: entry.runWalkPattern ?? "",
  conditions: entry.conditions ?? entry.weatherTerrain ?? "",
});

export function loadTrainingStore(storage: Pick<Storage, "getItem"> = localStorage): TrainingStore {
  try {
    const stored = storage.getItem(TRAINING_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TrainingStore;
      if (parsed.version === 5) return { ...emptyTrainingStore(), ...parsed, entries: parsed.entries.map(migrateEntry) };
    }
    const versionFour = storage.getItem(VERSION_FOUR_STORAGE_KEY);
    if (versionFour) {
      const parsed = JSON.parse(versionFour) as { entries?: MigratableRunEntry[] } & Partial<TrainingStore>;
      return { ...emptyTrainingStore(), ...parsed, version: 5, entries: (parsed.entries ?? []).map(migrateEntry) };
    }
    const versionThree = storage.getItem(VERSION_THREE_STORAGE_KEY);
    if (versionThree) {
      const parsed = JSON.parse(versionThree) as { entries?: MigratableRunEntry[] } & Partial<TrainingStore>;
      return { ...emptyTrainingStore(), ...parsed, version: 5, entries: (parsed.entries ?? []).map(migrateEntry) };
    }
    const previous = storage.getItem(PREVIOUS_TRAINING_STORAGE_KEY);
    if (previous) {
      const parsed = JSON.parse(previous) as { entries?: MigratableRunEntry[] } & Partial<TrainingStore>;
      return { ...emptyTrainingStore(), ...parsed, version: 5, entries: (parsed.entries ?? []).map(migrateEntry) };
    }
    const legacy = JSON.parse(storage.getItem("run-training-log-v1") ?? "[]") as LegacyRunEntry[];
    return { ...emptyTrainingStore(), entries: legacy.map(migrateEntry) };
  } catch {
    return emptyTrainingStore();
  }
}

export function saveTrainingStore(store: TrainingStore, storage: Pick<Storage, "setItem"> = localStorage) {
  storage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(store));
}

export interface BackupPreview { store: TrainingStore; counts: { runs: number; checkIns: number; benchmarks: number; strength: number; decisions: number }; }

export const exportTrainingBackup = (store: TrainingStore) => JSON.stringify({ format: "soma-running-backup", exportedAt: new Date().toISOString(), data: store }, null, 2);

export function previewTrainingBackup(text: string): BackupPreview {
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error("This file is not valid JSON."); }
  if (!parsed || typeof parsed !== "object" || (parsed as { format?: unknown }).format !== "soma-running-backup") throw new Error("This is not a Soma running-plan backup.");
  const data = (parsed as { data?: unknown }).data;
  if (!data || typeof data !== "object") throw new Error("The backup does not contain training data.");
  const candidate = data as Partial<TrainingStore>;
  for (const key of ["entries", "checkIns", "benchmarks", "decisions", "strengthLogs", "strengthDecisions"] as const) if (!Array.isArray(candidate[key])) throw new Error(`The backup is missing a valid ${key} collection.`);
  if (!candidate.entries!.every((entry) => entry && typeof entry === "object" && typeof entry.id === "string" && typeof entry.activityDate === "string" && typeof entry.status === "string")) throw new Error("The backup contains an invalid run entry.");
  if (!candidate.benchmarks!.every((entry) => entry && typeof entry === "object" && typeof entry.id === "string" && typeof entry.date === "string")) throw new Error("The backup contains an invalid benchmark.");
  if (!candidate.strengthLogs!.every((entry) => entry && typeof entry === "object" && typeof entry.id === "string" && Array.isArray(entry.exercises))) throw new Error("The backup contains an invalid strength log.");
  if (candidate.version !== undefined && ![4, 5].includes(Number(candidate.version))) throw new Error("This backup version is not supported.");
  const store: TrainingStore = { ...emptyTrainingStore(), ...candidate, version: 5 };
  return { store, counts: { runs: store.entries.length, checkIns: store.checkIns.length, benchmarks: store.benchmarks.length, strength: store.strengthLogs.length, decisions: store.decisions.length + store.strengthDecisions.length } };
}
