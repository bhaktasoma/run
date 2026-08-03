import { useEffect, useState } from "react";
import { loadTrainingStore, saveTrainingStore } from "../domain/storage.ts";
import type { BenchmarkEntry, RecommendationDecision, RunEntry, TrainingStore, WeeklyCheckIn } from "../domain/training.ts";

export default function useTrainingStore() {
  const [store, setStore] = useState<TrainingStore>(loadTrainingStore);

  useEffect(() => saveTrainingStore(store), [store]);

  const upsertEntry = (entry: RunEntry) => setStore((current) => ({
    ...current,
    entries: current.entries.some((item) => item.id === entry.id)
      ? current.entries.map((item) => item.id === entry.id ? entry : item)
      : [entry, ...current.entries],
  }));
  const deleteEntry = (id: string) => setStore((current) => ({ ...current, entries: current.entries.filter((item) => item.id !== id) }));
  const upsertCheckIn = (checkIn: WeeklyCheckIn) => setStore((current) => ({
    ...current,
    checkIns: [...current.checkIns.filter((item) => item.weekId !== checkIn.weekId), checkIn],
  }));
  const addBenchmark = (benchmark: BenchmarkEntry) => setStore((current) => ({ ...current, benchmarks: [benchmark, ...current.benchmarks] }));
  const saveDecision = (decision: RecommendationDecision) => setStore((current) => ({
    ...current,
    decisions: [...current.decisions.filter((item) => item.weekId !== decision.weekId), decision],
  }));
  const savePaceGuidance = (benchmarkId: string, text: string, accepted: boolean) => setStore((current) => ({ ...current, paceGuidance: { benchmarkId, text, accepted } }));
  const setRoadmapCompletion = (id: string, complete: boolean) => setStore((current) => {
    const roadmapCompletions = { ...current.roadmapCompletions };
    if (complete) roadmapCompletions[id] = true;
    else delete roadmapCompletions[id];
    return { ...current, roadmapCompletions };
  });

  return { store, upsertEntry, deleteEntry, upsertCheckIn, addBenchmark, saveDecision, savePaceGuidance, setRoadmapCompletion };
}
