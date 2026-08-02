import { useEffect, useState } from "react";

interface RunLogEntry {
  id: string;
  date: string;
  workout: string;
  plannedDistance: string;
  actualDistance: string;
  duration: string;
  averagePace: string;
  averageRpe: string;
  finalRpe: string;
  weatherTerrain: string;
  fuel: string;
  fluids: string;
  energy: string;
  stomach: string;
  pain: string;
  sleep: string;
  preRunMeal: string;
  recovery: string;
  worked: string;
  changeNextTime: string;
}

const STORAGE_KEY = "run-training-log-v1";

const emptyEntry = (): RunLogEntry => ({
  id: "",
  date: new Date().toISOString().slice(0, 10),
  workout: "Long Run",
  plannedDistance: "",
  actualDistance: "",
  duration: "",
  averagePace: "",
  averageRpe: "",
  finalRpe: "",
  weatherTerrain: "",
  fuel: "",
  fluids: "",
  energy: "",
  stomach: "",
  pain: "",
  sleep: "",
  preRunMeal: "",
  recovery: "",
  worked: "",
  changeNextTime: "",
});

const csvColumns: { key: keyof RunLogEntry; label: string }[] = [
  { key: "date", label: "Date" }, { key: "workout", label: "Workout" },
  { key: "plannedDistance", label: "Planned Distance (mi)" }, { key: "actualDistance", label: "Actual Distance (mi)" },
  { key: "duration", label: "Duration" }, { key: "averagePace", label: "Average Pace" },
  { key: "averageRpe", label: "Average RPE" }, { key: "finalRpe", label: "Final-Mile RPE" },
  { key: "weatherTerrain", label: "Weather and Terrain" }, { key: "fuel", label: "Fuel" },
  { key: "fluids", label: "Fluids and Electrolytes" }, { key: "energy", label: "Energy" },
  { key: "stomach", label: "Stomach Comfort" }, { key: "pain", label: "Pain or Soreness" },
  { key: "sleep", label: "Sleep" }, { key: "preRunMeal", label: "Pre-Run Meal" },
  { key: "recovery", label: "Recovery" }, { key: "worked", label: "What Worked" },
  { key: "changeNextTime", label: "Change Next Time" },
];

const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;

export default function RunLogPage() {
  const [entry, setEntry] = useState<RunLogEntry>(emptyEntry);
  const [entries, setEntries] = useState<RunLogEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as RunLogEntry[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const update = (key: keyof RunLogEntry, value: string) => setEntry((current) => ({ ...current, [key]: value }));

  const saveEntry = (event: React.FormEvent) => {
    event.preventDefault();
    setEntries((current) => [{ ...entry, id: `${Date.now()}-${Math.random()}` }, ...current]);
    setEntry(emptyEntry());
  };

  const exportCsv = () => {
    const header = csvColumns.map((column) => escapeCsv(column.label)).join(",");
    const rows = entries.map((item) => csvColumns.map((column) => escapeCsv(item[column.key])).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `run-log-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="run-log-page">
      <header className="run-log__header">
        <div>
          <p className="goal-page__eyebrow">Training Journal</p>
          <h1>Run Log</h1>
          <p>Record long runs and races so pace, effort, fueling, and recovery patterns become visible.</p>
        </div>
        <button className="app__nav-btn" type="button" onClick={exportCsv} disabled={entries.length === 0}>Export CSV</button>
      </header>

      <aside className="run-log__privacy">Entries stay in this browser on this device. Export the CSV regularly as your backup.</aside>

      <form className="run-log-form" onSubmit={saveEntry}>
        <fieldset>
          <legend>Run details</legend>
          <label>Date<input required type="date" value={entry.date} onChange={(event) => update("date", event.target.value)} /></label>
          <label>Workout<select value={entry.workout} onChange={(event) => update("workout", event.target.value)}><option>Long Run</option><option>Half Marathon</option><option>Marathon</option><option>Race</option><option>Other</option></select></label>
          <label>Planned miles<input inputMode="decimal" value={entry.plannedDistance} onChange={(event) => update("plannedDistance", event.target.value)} /></label>
          <label>Actual miles<input required inputMode="decimal" value={entry.actualDistance} onChange={(event) => update("actualDistance", event.target.value)} /></label>
          <label>Duration<input placeholder="2:15:30" value={entry.duration} onChange={(event) => update("duration", event.target.value)} /></label>
          <label>Average pace<input placeholder="12:15/mi" value={entry.averagePace} onChange={(event) => update("averagePace", event.target.value)} /></label>
          <label>Average RPE<input type="number" min="1" max="10" value={entry.averageRpe} onChange={(event) => update("averageRpe", event.target.value)} /></label>
          <label>Final-mile RPE<input type="number" min="1" max="10" value={entry.finalRpe} onChange={(event) => update("finalRpe", event.target.value)} /></label>
        </fieldset>

        <fieldset>
          <legend>Conditions and fueling</legend>
          <label className="run-log-form__wide">Weather and terrain<textarea value={entry.weatherTerrain} onChange={(event) => update("weatherTerrain", event.target.value)} /></label>
          <label>Fuel used<textarea placeholder="Products, grams/hour, timing" value={entry.fuel} onChange={(event) => update("fuel", event.target.value)} /></label>
          <label>Fluids and electrolytes<textarea placeholder="Amounts and timing" value={entry.fluids} onChange={(event) => update("fluids", event.target.value)} /></label>
          <label>Pre-run meal<textarea value={entry.preRunMeal} onChange={(event) => update("preRunMeal", event.target.value)} /></label>
          <label>Sleep<input placeholder="Hours and quality" value={entry.sleep} onChange={(event) => update("sleep", event.target.value)} /></label>
        </fieldset>

        <fieldset>
          <legend>How it felt</legend>
          <label>Energy<textarea value={entry.energy} onChange={(event) => update("energy", event.target.value)} /></label>
          <label>Stomach comfort<textarea value={entry.stomach} onChange={(event) => update("stomach", event.target.value)} /></label>
          <label>Pain or soreness<textarea value={entry.pain} onChange={(event) => update("pain", event.target.value)} /></label>
          <label>Recovery afterward<textarea value={entry.recovery} onChange={(event) => update("recovery", event.target.value)} /></label>
          <label>What worked?<textarea value={entry.worked} onChange={(event) => update("worked", event.target.value)} /></label>
          <label>What should change next time?<textarea value={entry.changeNextTime} onChange={(event) => update("changeNextTime", event.target.value)} /></label>
        </fieldset>

        <button className="run-log-form__save" type="submit">Save run</button>
      </form>

      <section className="run-log-history">
        <h2>Saved runs</h2>
        {entries.length === 0 ? <p>No runs logged yet.</p> : (
          <div className="run-log-history__list">
            {entries.map((item) => (
              <article key={item.id}>
                <div><strong>{item.workout}</strong><span>{item.date}</span></div>
                <p>{item.actualDistance} mi · {item.duration || "No duration"} · {item.averagePace || "No pace"} · RPE {item.averageRpe || "—"}</p>
                <button type="button" onClick={() => setEntries((current) => current.filter((saved) => saved.id !== item.id))}>Delete</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
