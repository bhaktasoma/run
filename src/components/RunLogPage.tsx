import { useState } from "react";
import type { RunEntry, TrainingStore } from "../domain/training.ts";
import QuickLogForm from "./QuickLogForm.tsx";

interface RunLogPageProps {
  store: TrainingStore;
  onSave: (entry: RunEntry) => void;
  onDelete: (id: string) => void;
}

const csvColumns: { key: keyof RunEntry; label: string }[] = [
  { key: "date", label: "Date" }, { key: "workout", label: "Workout" }, { key: "status", label: "Status" },
  { key: "plannedDistance", label: "Planned Distance (mi)" }, { key: "actualDistance", label: "Actual Distance (mi)" },
  { key: "duration", label: "Duration" }, { key: "averageRpe", label: "Average RPE" }, { key: "finalRpe", label: "Final RPE" },
  { key: "pain", label: "Pain" }, { key: "result", label: "Result" }, { key: "notes", label: "Notes" },
  { key: "fueling", label: "Fueling" }, { key: "weatherTerrain", label: "Weather and Terrain" },
];
const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;

export default function RunLogPage({ store, onSave, onDelete }: RunLogPageProps) {
  const [editing, setEditing] = useState<RunEntry | undefined>();
  const exportCsv = () => {
    const header = csvColumns.map((column) => escapeCsv(column.label)).join(",");
    const rows = store.entries.map((entry) => csvColumns.map((column) => escapeCsv(String(entry[column.key] ?? ""))).join(","));
    const url = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `run-log-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  };
  const remove = (entry: RunEntry) => {
    if (window.confirm(`Delete the ${entry.workout.toLowerCase()} logged for ${entry.date}?`)) onDelete(entry.id);
  };

  return <main className="run-log-page">
    <header className="run-log__header"><div><p className="goal-page__eyebrow">Training record</p><h1>Run Log</h1><p>Fast completion records used by weekly recommendations and progress trends.</p></div><button className="app__nav-btn" type="button" onClick={exportCsv} disabled={!store.entries.length}>Export CSV</button></header>
    <aside className="run-log__privacy">Versioned data stays in this browser. Existing log entries are migrated when possible; export CSV regularly as a backup.</aside>
    {editing && <section className="today-log-section"><h2>Edit saved run</h2><QuickLogForm key={editing.id} initial={editing} onSave={(entry) => { onSave(entry); setEditing(undefined); }} onCancel={() => setEditing(undefined)} /></section>}
    <section className="run-log-history"><h2>Saved runs</h2>{!store.entries.length ? <p>No runs logged yet. Use Today to record the next workout.</p> : <div className="run-log-history__list">{store.entries.map((entry) => <article key={entry.id}><div><strong>{entry.workout}</strong><span>{entry.date} · {entry.status}</span></div><p>{entry.actualDistance} mi · {entry.duration} · RPE {entry.averageRpe} · {entry.pain} pain</p><div className="run-log-history__actions"><button type="button" onClick={() => setEditing(entry)}>Edit</button><button className="run-log-history__delete" type="button" onClick={() => remove(entry)}>Delete</button></div></article>)}</div>}</section>
  </main>;
}
