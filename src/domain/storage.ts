import type { RunEntry, TrainingStore } from "./training.ts";

export const TRAINING_STORAGE_KEY = "soma-training-store-v2";

export const emptyTrainingStore = (): TrainingStore => ({
  version: 2,
  entries: [],
  checkIns: [],
  benchmarks: [],
  decisions: [],
  roadmapCompletions: {},
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

const migrateEntry = (entry: LegacyRunEntry, index: number): RunEntry => ({
  id: entry.id ?? `legacy-${index}`,
  date: entry.date ?? "",
  workout: entry.workout ?? "Run",
  status: "completed",
  plannedDistance: entry.plannedDistance ?? "",
  actualDistance: entry.actualDistance ?? "",
  duration: entry.duration ?? "",
  averageRpe: entry.averageRpe ?? "",
  finalRpe: entry.finalRpe ?? "",
  pain: entry.pain?.toLowerCase().includes("concern") ? "concerning" : entry.pain && !entry.pain.toLowerCase().includes("none") ? "mild" : "none",
  result: "appropriate",
  notes: [entry.worked, entry.changeNextTime].filter(Boolean).join(" "),
  fueling: entry.fuel ?? "",
  weatherTerrain: entry.weatherTerrain ?? "",
});

export function loadTrainingStore(storage: Pick<Storage, "getItem"> = localStorage): TrainingStore {
  try {
    const stored = storage.getItem(TRAINING_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TrainingStore;
      if (parsed.version === 2) return { ...emptyTrainingStore(), ...parsed };
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
