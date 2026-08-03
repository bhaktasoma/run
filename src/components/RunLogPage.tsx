import { useState } from "react";
import type { RunEntry, TrainingStore } from "../domain/training.ts";
import QuickLogForm from "./QuickLogForm.tsx";
import { trainingDateIso } from "../utils/trainingDate.ts";
import { exportTrainingBackup, previewTrainingBackup } from "../domain/storage.ts";

interface RunLogPageProps {
  store: TrainingStore;
  onSave: (entry: RunEntry) => void;
  onDelete: (id: string) => void;
  onRestore: (store: TrainingStore) => void;
}

const csvColumns: { key: keyof RunEntry; label: string }[] = [
  { key: "id", label: "Entry ID" }, { key: "activityDate", label: "Activity Date" }, { key: "createdAt", label: "Created At" }, { key: "updatedAt", label: "Updated At" }, { key: "workoutId", label: "Planned Workout ID" }, { key: "workout", label: "Workout" }, { key: "status", label: "Status" },
  { key: "plannedDistance", label: "Planned Distance (mi)" }, { key: "actualDistance", label: "Actual Distance (mi)" },
  { key: "duration", label: "Duration" }, { key: "averageRpe", label: "Average RPE" }, { key: "finalRpe", label: "Final RPE" },
  { key: "pain", label: "Pain" }, { key: "result", label: "Result" }, { key: "notes", label: "Notes" },
  { key: "averageHeartRate", label: "Average HR" }, { key: "maximumHeartRate", label: "Maximum HR" }, { key: "elevationGain", label: "Elevation Gain (ft)" }, { key: "averageCadence", label: "Average Cadence" }, { key: "terrain", label: "Terrain" }, { key: "runWalkMethod", label: "Run/Walk Method" }, { key: "runWalkPattern", label: "Run/Walk Pattern" }, { key: "conditions", label: "Conditions" },
];
const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;

export default function RunLogPage({ store, onSave, onDelete, onRestore }: RunLogPageProps) {
  const [editing, setEditing] = useState<RunEntry | undefined>();
  const [adding, setAdding] = useState(false);
  const [restorePreview, setRestorePreview] = useState<ReturnType<typeof previewTrainingBackup>>();
  const [restoreError, setRestoreError] = useState("");
  const exportCsv = () => {
    const header = csvColumns.map((column) => escapeCsv(column.label)).join(",");
    const rows = store.entries.map((entry) => csvColumns.map((column) => escapeCsv(String(entry[column.key] ?? ""))).join(","));
    const url = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `run-log-${trainingDateIso()}.csv`; link.click(); URL.revokeObjectURL(url);
  };
  const remove = (entry: RunEntry) => {
    if (window.confirm(`Delete the ${entry.workout.toLowerCase()} logged for ${entry.activityDate}?`)) onDelete(entry.id);
  };
  const exportJson = () => { const url = URL.createObjectURL(new Blob([exportTrainingBackup(store)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = `soma-running-backup-${trainingDateIso()}.json`; link.click(); URL.revokeObjectURL(url); };
  const chooseBackup = async (file?: File) => { setRestoreError(""); setRestorePreview(undefined); if (!file) return; try { setRestorePreview(previewTrainingBackup(await file.text())); } catch (error) { setRestoreError(error instanceof Error ? error.message : "The backup could not be read."); } };

  return <main className="run-log-page">
    <header className="run-log__header"><div><p className="goal-page__eyebrow">Training record</p><h1>Run History &amp; Backup</h1><p>Completion records used by the Plan, Progress, and weekly recommendation.</p></div><div className="run-log__header-actions"><button className="run-log-form__save" type="button" onClick={() => { setEditing(undefined); setAdding(true); }}>Log a past run</button><button className="app__nav-btn" type="button" onClick={exportCsv} disabled={!store.entries.length}>Export CSV</button></div></header>
    <aside className="run-log__privacy">Versioned data stays in this browser. JSON is the restorable backup; CSV remains available for analysis.</aside>
    <details className="backup-card"><summary>Backup or restore all training data</summary><p>Preview a JSON backup before replacing this browser’s data.</p><div className="run-log__header-actions"><button type="button" className="app__nav-btn" onClick={exportJson}>Export JSON backup</button><label className="app__nav-btn">Choose JSON backup<input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => void chooseBackup(event.target.files?.[0])} /></label></div>{restoreError && <p role="alert" className="run-log-form__error">{restoreError}</p>}{restorePreview && <div className="backup-preview" role="status"><strong>Backup preview</strong><p>{restorePreview.counts.runs} runs · {restorePreview.counts.checkIns} check-ins · {restorePreview.counts.benchmarks} benchmarks · {restorePreview.counts.strength} strength sessions · {restorePreview.counts.decisions} decisions</p><button type="button" className="run-log-form__save" onClick={() => { if (window.confirm("Replace the training data in this browser with this backup?")) { onRestore(restorePreview.store); setRestorePreview(undefined); } }}>Confirm and replace local data</button></div>}</details>
    {(adding || editing) && <section className="today-log-section"><h2>{editing ? "Edit saved run" : "Log a past run"}</h2><QuickLogForm key={editing?.id ?? "new-past-run"} initial={editing} entries={store.entries} onSave={(entry) => { onSave(entry); setEditing(undefined); setAdding(false); }} onEditExisting={(entry) => { setEditing(entry); setAdding(false); }} onCancel={() => { setEditing(undefined); setAdding(false); }} /></section>}
    <section className="run-log-history"><h2>Saved runs</h2>{!store.entries.length ? <p>No runs logged yet.</p> : <div className="run-log-history__list">{[...store.entries].sort((a,b) => b.activityDate.localeCompare(a.activityDate)).map((entry) => <article key={entry.id}><div><strong>{entry.workout}</strong><span>{entry.activityDate} · {entry.status}</span></div><p>{entry.status === "skipped" ? "Skipped" : `${entry.actualDistance} mi · ${entry.duration} · RPE ${entry.averageRpe} · ${entry.pain} pain`}</p><div className="run-log-history__actions"><button type="button" onClick={() => { setEditing(entry); setAdding(false); }}>Edit</button><button className="run-log-history__delete" type="button" onClick={() => remove(entry)}>Delete</button></div></article>)}</div>}</section>
  </main>;
}
