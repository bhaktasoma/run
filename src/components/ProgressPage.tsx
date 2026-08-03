import { useState } from "react";
import activePlan from "../data/activePlan.ts";
import { benchmarkGuidance, completedMileage, recommendWeek } from "../domain/progression.ts";
import type { BenchmarkEntry, TrainingStore } from "../domain/training.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";

interface ProgressPageProps { store: TrainingStore; onAddBenchmark: (benchmark: BenchmarkEntry) => void; onSavePaceGuidance: (benchmarkId: string, text: string, accepted: boolean) => void; }

export default function ProgressPage({ store, onAddBenchmark, onSavePaceGuidance }: ProgressPageProps) {
  const [benchmark, setBenchmark] = useState<Omit<BenchmarkEntry, "id">>({ date: trainingDateIso(), type: "Same easy route", distance: "", duration: "", averageRpe: "4", notes: "" });
  const currentWeek = activePlan.find((week) => week.workouts.some((workout) => workout.date >= trainingDateIso())) ?? activePlan.at(-1)!;
  const currentEntries = store.entries.filter((entry) => currentWeek.workouts.some((workout) => workout.id === entry.workoutId));
  const recommendation = recommendWeek(currentWeek, currentEntries, store.checkIns.find((item) => item.weekId === currentWeek.id));
  const easyEntries = store.entries.filter((entry) => Number(entry.averageRpe) <= 4 && Number(entry.actualDistance) > 0);
  const painFlags = store.entries.filter((entry) => entry.pain !== "none");
  const qualityEntries = store.entries.filter((entry) => entry.workout.toLowerCase().includes("stride") || entry.workout.toLowerCase().includes("benchmark"));
  const paceFor = (distance: string, duration: string) => {
    const miles = Number(distance); const parts = duration.split(":").map(Number);
    if (!miles || parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;
    const seconds = Math.round((parts[0] * 3600 + parts[1] * 60 + parts[2]) / miles);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}/mi`;
  };
  const comparablePaces = easyEntries.map((entry) => paceFor(entry.actualDistance, entry.duration)).filter(Boolean);
  const longRunProgression = activePlan.map((week) => {
    const longRun = week.workouts.find((workout) => workout.isLongRun);
    const logged = store.entries.find((entry) => entry.workoutId === longRun?.id);
    return longRun ? `${logged?.actualDistance || "—"}/${longRun.plannedMiles}` : null;
  }).filter(Boolean);
  const readiness = {
    consistency: store.entries.length >= 12 ? "On Track" : "Building",
    volume: activePlan.some((week) => completedMileage(store.entries.filter((entry) => week.workouts.some((workout) => workout.id === entry.workoutId))) >= week.plannedMiles * 0.8) ? "Building" : "Needs Attention",
    durability: store.entries.some((entry) => entry.workout.toLowerCase().includes("long") && Number(entry.actualDistance) >= 8) ? "Building" : "Not Yet Tested",
    goalPace: store.benchmarks.length >= 2 ? "Building" : "Not Yet Tested",
    recovery: painFlags.some((entry) => entry.pain === "concerning") ? "Needs Attention" : store.checkIns.length ? "On Track" : "Not Yet Tested",
  };

  const submitBenchmark = (event: React.FormEvent) => {
    event.preventDefault();
    if (!benchmark.distance || !/^\d+:[0-5]\d:[0-5]\d$/.test(benchmark.duration)) return;
    onAddBenchmark({ ...benchmark, id: `${benchmark.date}-${Date.now()}` });
    setBenchmark({ ...benchmark, distance: "", duration: "", notes: "" });
  };

  return <main className="progress-page">
    <header className="section-hero"><p className="goal-page__eyebrow">Decision-useful trends</p><h1>Progress Dashboard</h1><p>No readiness percentage: the evidence below shows what is building and what has not yet been tested.</p></header>
    <section className="recommendation-card"><span className={`recommendation-badge recommendation-badge--${recommendation.state.toLowerCase()}`}>{recommendation.state}</span><div><h2>{recommendation.summary}</h2><ul>{recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div></section>
    <section className="progress-grid">
      <article className="progress-card progress-card--wide"><h2>Eight-week mileage</h2><div className="mileage-bars">{activePlan.map((week, index) => { const actual = completedMileage(store.entries.filter((entry) => week.workouts.some((workout) => workout.id === entry.workoutId))); return <div key={week.id}><span>W{index + 1}</span><div><i style={{ width: `${Math.min(100, week.plannedMiles ? actual / week.plannedMiles * 100 : actual ? 100 : 0)}%` }} /></div><small>{actual.toFixed(1)} / {week.plannedMiles}</small></div>; })}</div></article>
      <article className="progress-card"><h2>Long-run progression</h2><p>{longRunProgression.join(" → ") || "Not started"}</p><small>Completed/planned miles; directional and adjusted from weekly feedback.</small></article>
      <article className="progress-card"><h2>Easy RPE comparison</h2><p>{comparablePaces.length ? `${comparablePaces[0]} latest` : "Not enough comparable runs"}</p><small>{comparablePaces.length > 1 ? `Previous: ${comparablePaces[1]}. ` : ""}Compare only similar routes and conditions at RPE 3–4.</small></article>
      <article className="progress-card"><h2>Quality trend</h2><p>{qualityEntries.length ? `${qualityEntries.length} controlled quality records` : "Not yet introduced"}</p><small>Quality begins only after consistent easy mileage.</small></article>
      <article className="progress-card"><h2>Pain and recovery</h2><p>{painFlags.length ? `${painFlags.length} pain flag${painFlags.length === 1 ? "" : "s"}` : "No pain flags recorded"}</p><small>{store.checkIns.length} weekly check-ins saved.</small></article>
    </section>
    <section className="readiness-card"><h2>10:00/mile stretch-goal evidence</h2><div>{Object.entries(readiness).map(([label, state]) => <p key={label}><span>{label.replace(/([A-Z])/g, " $1")}</span><strong>{state}</strong></p>)}</div><small>The goal remains conditional until consistency, volume, durability, goal-pace endurance, and recovery support it.</small></section>
    <section className="benchmark-card"><div><p className="goal-page__eyebrow">Every 6–8 weeks</p><h2>Record a controlled benchmark</h2><p>Next planned benchmark: same familiar easy route at RPE 3–4 during Week 8.</p></div><form onSubmit={submitBenchmark}><label>Type<select value={benchmark.type} onChange={(event) => setBenchmark({ ...benchmark, type: event.target.value as BenchmarkEntry["type"] })}><option>Controlled 5K</option><option>Controlled 10K</option><option>Repeatable tempo</option><option>Same easy route</option></select></label><label>Date<input type="date" required value={benchmark.date} onChange={(event) => setBenchmark({ ...benchmark, date: event.target.value })} /></label><label>Miles<input type="number" min="0.01" step="0.01" required value={benchmark.distance} onChange={(event) => setBenchmark({ ...benchmark, distance: event.target.value })} /></label><label>Duration<input required placeholder="0:42:00" pattern="\d+:[0-5]\d:[0-5]\d" title="Use H:MM:SS, for example 0:42:00" value={benchmark.duration} onChange={(event) => setBenchmark({ ...benchmark, duration: event.target.value })} /></label><label>Average RPE<input type="number" min="1" max="10" required value={benchmark.averageRpe} onChange={(event) => setBenchmark({ ...benchmark, averageRpe: event.target.value })} /></label><label className="benchmark-card__notes">Notes<textarea value={benchmark.notes} onChange={(event) => setBenchmark({ ...benchmark, notes: event.target.value })} /></label><button className="run-log-form__save" type="submit">Save benchmark</button></form>{store.benchmarks.length > 0 && <div className="benchmark-card__guidance"><p><strong>Suggested guidance:</strong> {benchmarkGuidance(store.benchmarks[0])}</p><div className="decision-actions"><button type="button" onClick={() => onSavePaceGuidance(store.benchmarks[0].id, benchmarkGuidance(store.benchmarks[0]), true)}>Apply guidance</button><button type="button" onClick={() => onSavePaceGuidance(store.benchmarks[0].id, benchmarkGuidance(store.benchmarks[0]), false)}>Keep current guidance</button></div>{store.paceGuidance?.benchmarkId === store.benchmarks[0].id && <small>{store.paceGuidance.accepted ? "Applied to Today as secondary guidance." : "Current guidance retained."}</small>}</div>}</section>
  </main>;
}
