import type { RunEntry, TrainingStore } from "./training.ts";

export const TRAINING_STORAGE_KEY = "soma-training-store-v4";
const VERSION_THREE_STORAGE_KEY = "soma-training-store-v3";
const PREVIOUS_TRAINING_STORAGE_KEY = "soma-training-store-v2";

export const emptyTrainingStore = (): TrainingStore => ({
  version: 4,
  entries: [],
  checkIns: [],
  benchmarks: [],
  decisions: [],
  roadmapCompletions: {},
  strengthLogs: [],
  strengthDecisions: [],
  selectedAbExercise: "cable-crunch",
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
      if (parsed.version === 4) return { ...emptyTrainingStore(), ...parsed, entries: parsed.entries.map(migrateEntry) };
    }
    const versionThree = storage.getItem(VERSION_THREE_STORAGE_KEY);
    if (versionThree) {
      const parsed = JSON.parse(versionThree) as { entries?: MigratableRunEntry[] } & Partial<TrainingStore>;
      return { ...emptyTrainingStore(), ...parsed, version: 4, entries: (parsed.entries ?? []).map(migrateEntry) };
    }
    const previous = storage.getItem(PREVIOUS_TRAINING_STORAGE_KEY);
    if (previous) {
      const parsed = JSON.parse(previous) as { entries?: MigratableRunEntry[] } & Partial<TrainingStore>;
      return { ...emptyTrainingStore(), ...parsed, version: 4, entries: (parsed.entries ?? []).map(migrateEntry) };
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
