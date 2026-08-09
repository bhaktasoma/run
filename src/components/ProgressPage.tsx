import { useState } from "react";
import activePlan from "../data/activePlan.ts";
import { benchmarkGuidance, entriesForWeek, parseDurationMinutes, recommendWeek } from "../domain/progression.ts";
import type { BenchmarkEntry, TrainingStore } from "../domain/training.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";
import ProgressGraphs from "./ProgressGraphs.tsx";
import { resolveStrengthStatus } from "../domain/workoutStatus.ts";

interface ProgressPageProps { store: TrainingStore; onAddBenchmark: (benchmark: BenchmarkEntry) => void; onSavePaceGuidance: (benchmarkId: string, text: string, accepted: boolean) => void; onLogRun: () => void; }

const emptyBenchmark = (): Omit<BenchmarkEntry, "id"> => ({ date: trainingDateIso(), type: "Same easy route", distance: "", duration: "", averageRpe: "4", notes: "", terrain: "flat", elevationGain: "", conditions: "" });

export default function ProgressPage({ store, onAddBenchmark, onSavePaceGuidance, onLogRun }: ProgressPageProps) {
  const [benchmark, setBenchmark] = useState(emptyBenchmark);
  const currentWeek = activePlan.find((week) => week.workouts.some((workout) => workout.date >= trainingDateIso())) ?? activePlan.at(-1)!;
  const recommendation = recommendWeek(currentWeek, entriesForWeek(currentWeek, store.entries), store.checkIns.find((item) => item.weekId === currentWeek.id), trainingDateIso());
  const sundayWorkout = currentWeek.workouts.find((workout) => /Back \+ Core \+ Aesthetics/i.test(workout.title)) ?? currentWeek.workouts.at(-1)!;
  const sundayStatus = resolveStrengthStatus("aesthetic", sundayWorkout.date, currentWeek, store);
  const painFlags = store.entries.filter((entry) => entry.pain !== "none");
  const strengthCompleted = store.strengthLogs.filter((entry) => entry.status === "completed").length;
  const hasRecoveryData = store.entries.length > 0 || store.checkIns.length > 0;
  const readiness = {
    consistency: store.entries.length === 0 ? "Not Yet Tested" : store.entries.length >= 12 ? "On Track" : "Building",
    durability: store.entries.some((entry) => /long/i.test(entry.workout) && Number(entry.actualDistance) >= 8) ? "Building" : "Not Yet Tested",
    goalPace: store.benchmarks.length >= 2 ? "Building" : "Not Yet Tested",
    recovery: painFlags.some((entry) => entry.pain === "concerning") ? "Needs Attention" : store.checkIns.length ? "On Track" : "Not Yet Tested",
  };

  const submitBenchmark = (event: React.FormEvent) => {
    event.preventDefault();
    if (!benchmark.distance || !parseDurationMinutes(benchmark.duration)) return;
    onAddBenchmark({ ...benchmark, id: `${benchmark.date}-${Date.now()}` });
    setBenchmark({ ...emptyBenchmark(), date: benchmark.date, type: benchmark.type });
  };

  return <main className="progress-page">
    <header className="section-hero"><p className="goal-page__eyebrow">Decision-useful trends</p><h1>Progress</h1><p>Use repeatable evidence to see what is building. No readiness percentage or automatic pace progression.</p></header>
    <section className="recommendation-card"><span className={`recommendation-badge recommendation-badge--${hasRecoveryData ? recommendation.state.toLowerCase() : "hold"}`}>{hasRecoveryData ? recommendation.state : "Hold"}</span><div><h2>{hasRecoveryData ? recommendation.summary : "Insufficient data—hold"}</h2><ul>{hasRecoveryData ? recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>) : <li>Log runs and complete weekly check-ins before drawing recovery or progression conclusions.</li>}</ul></div></section>
    {!store.entries.length && !store.benchmarks.length ? <section className="progress-onboarding"><h2>Your progress will appear here</h2><p>To build meaningful trends, log:</p><ul><li>3 comparable easy runs</li><li>2 long runs</li><li>2 completed training weeks</li><li>Comparable controlled benchmarks</li></ul><button className="run-log-form__save" type="button" onClick={onLogRun}>Log a run from Today</button></section> : <ProgressGraphs store={store} />}
    <section aria-labelledby="status-title"><p className="goal-page__eyebrow">Supporting signals</p><h2 id="status-title">Status</h2><div className="progress-status-grid">
      <article><strong>Pain &amp; recovery</strong><span>{!hasRecoveryData ? "No recovery data yet" : painFlags.length ? `${painFlags.length} pain flag${painFlags.length === 1 ? "" : "s"}` : "No pain flags in recorded data"}</span><small>{store.checkIns.length} weekly check-ins saved</small></article>
      <article><strong>Strength consistency</strong><span>{strengthCompleted} session{strengthCompleted === 1 ? "" : "s"} completed</span><small>Shown separately from running volume</small></article>
      <article><strong>Sunday strength</strong><span>{sundayStatus.state}</span><small>{sundayStatus.availabilityReason}</small></article>
      <article><strong>Next benchmark</strong><span>Same familiar easy route</span><small>Repeat every 6–8 weeks at RPE 3–4</small></article>
      <article><strong>Data quality</strong><span>{store.entries.length} run log entr{store.entries.length === 1 ? "y" : "ies"}</span><small>Missing fields remain missing; they are never estimated</small></article>
    </div></section>
    <section className="readiness-card"><h2>10:00/mile stretch-goal evidence</h2><div>{Object.entries(readiness).map(([label, state]) => <p key={label}><span>{label.replace(/([A-Z])/g, " $1")}</span><strong>{state}</strong></p>)}</div><small>The goal remains conditional until consistency, durability, goal-pace endurance, and recovery support it.</small></section>
    <details className="benchmark-disclosure"><summary>Record a controlled benchmark</summary><section className="benchmark-card"><div><p className="goal-page__eyebrow">Every 6–8 weeks</p><h2>Record a controlled benchmark</h2><p>Repeat the same benchmark under comparable conditions. Saving one never changes pace guidance automatically.</p></div><form onSubmit={submitBenchmark}>
      <label>Type<select value={benchmark.type} onChange={(event) => setBenchmark({ ...benchmark, type: event.target.value as BenchmarkEntry["type"] })}><option>Controlled 5K</option><option>Controlled 10K</option><option>Repeatable tempo</option><option>Same easy route</option></select></label>
      <label>Date<input type="date" required value={benchmark.date} onChange={(event) => setBenchmark({ ...benchmark, date: event.target.value })} /></label>
      <label>Miles<input type="number" min="0.01" step="0.01" required value={benchmark.distance} onChange={(event) => setBenchmark({ ...benchmark, distance: event.target.value })} /></label>
      <label>Duration<input required placeholder="42:00 or 1:02:00" title="Use MM:SS or H:MM:SS" value={benchmark.duration} onChange={(event) => setBenchmark({ ...benchmark, duration: event.target.value })} /></label>
      <label>Average RPE<input type="number" min="1" max="10" required value={benchmark.averageRpe} onChange={(event) => setBenchmark({ ...benchmark, averageRpe: event.target.value })} /></label>
      <label>Terrain<select value={benchmark.terrain} onChange={(event) => setBenchmark({ ...benchmark, terrain: event.target.value as BenchmarkEntry["terrain"] })}><option value="flat">Flat</option><option value="rolling">Rolling</option><option value="hilly">Hilly</option><option value="trail">Trail</option><option value="treadmill">Treadmill</option></select></label>
      <label>Elevation gain (ft)<input type="number" min="0" step="1" value={benchmark.elevationGain} onChange={(event) => setBenchmark({ ...benchmark, elevationGain: event.target.value })} /></label>
      <label>Conditions<input placeholder="Cool, calm, familiar route" value={benchmark.conditions} onChange={(event) => setBenchmark({ ...benchmark, conditions: event.target.value })} /></label>
      <label className="benchmark-card__notes">Notes<textarea value={benchmark.notes} onChange={(event) => setBenchmark({ ...benchmark, notes: event.target.value })} /></label><button className="run-log-form__save" type="submit">Save benchmark</button>
    </form>{store.benchmarks.length > 0 && <div className="benchmark-card__guidance"><p><strong>Suggested guidance:</strong> {benchmarkGuidance(store.benchmarks[0])}</p><div className="decision-actions"><button type="button" onClick={() => onSavePaceGuidance(store.benchmarks[0].id, benchmarkGuidance(store.benchmarks[0]), true)}>Apply guidance</button><button type="button" onClick={() => onSavePaceGuidance(store.benchmarks[0].id, benchmarkGuidance(store.benchmarks[0]), false)}>Keep current guidance</button></div>{store.paceGuidance?.benchmarkId === store.benchmarks[0].id && <small>{store.paceGuidance.accepted ? "Applied to Today as secondary guidance." : "Current guidance retained."}</small>}</div>}</section></details>
  </main>;
}
