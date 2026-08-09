import { useEffect, useState } from "react";
import { loadTrainingStore, saveTrainingStore } from "../domain/storage.ts";
import type { BenchmarkEntry, RecommendationDecision, RoutineCompletion, RunEntry, TrainingStore, WeeklyCheckIn } from "../domain/training.ts";
import type { StrengthAdjustmentDecision, StrengthSessionLog } from "../domain/strength.ts";

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
  const upsertStrengthLog = (log: StrengthSessionLog) => setStore((current) => ({
    ...current,
    strengthLogs: current.strengthLogs.some((item) => item.id === log.id) ? current.strengthLogs.map((item) => item.id === log.id ? log : item) : [log, ...current.strengthLogs],
  }));
  const saveStrengthDecision = (decision: StrengthAdjustmentDecision) => setStore((current) => ({
    ...current,
    strengthDecisions: [...current.strengthDecisions.filter((item) => item.weekId !== decision.weekId), decision],
  }));
  const selectAbExercise = (selectedAbExercise: TrainingStore["selectedAbExercise"]) => setStore((current) => ({ ...current, selectedAbExercise }));
  const upsertRoutineCompletion = (completion: RoutineCompletion) => setStore((current) => ({ ...current, routineCompletions: [...current.routineCompletions.filter((item) => item.id !== completion.id), completion] }));
  const restoreStore = (restored: TrainingStore) => setStore(restored);
  return { store, upsertEntry, deleteEntry, upsertCheckIn, addBenchmark, saveDecision, savePaceGuidance, upsertStrengthLog, saveStrengthDecision, selectAbExercise, upsertRoutineCompletion, restoreStore };
}
