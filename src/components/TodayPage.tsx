import { useState } from "react";
import activePlan from "../data/activePlan.ts";
import { completedMileage, entriesForWeek, recommendWeek } from "../domain/progression.ts";
import type { RunEntry, TrainingStore } from "../domain/training.ts";
import QuickLogForm from "./QuickLogForm.tsx";
import { daysBetweenIsoDates, trainingDateIso } from "../utils/trainingDate.ts";

interface TodayPageProps {
  store: TrainingStore;
  onSaveEntry: (entry: RunEntry) => void;
}

export default function TodayPage({ store, onSaveEntry }: TodayPageProps) {
  const [showPastRun, setShowPastRun] = useState(false);
  const [pastEntry, setPastEntry] = useState<RunEntry>();
  const today = trainingDateIso();
  const currentWeek = activePlan.find((week) => week.workouts.some((workout) => workout.date === today))
    ?? activePlan.find((week) => week.workouts.some((workout) => workout.date > today))
    ?? activePlan.at(-1)!;
  const todayWorkout = currentWeek.workouts.find((workout) => workout.date === today)
    ?? currentWeek.workouts.find((workout) => workout.date >= today)
    ?? currentWeek.workouts[0];
  const weekEntries = entriesForWeek(currentWeek, store.entries);
  const checkIn = store.checkIns.find((item) => item.weekId === currentWeek.id);
  const recommendation = recommendWeek(currentWeek, weekEntries, checkIn);
  const nextLongRun = activePlan.flatMap((week) => week.workouts).find((workout) => workout.isLongRun && workout.date >= today);
  const countdown = daysBetweenIsoDates(today, "2027-11-14");
  const existing = store.entries.find((entry) => entry.workoutId === todayWorkout.id);

  return (
    <main className="today-page">
      <header className="today-hero">
        <div><p className="goal-page__eyebrow">Today · {todayWorkout.date}</p><h1>{todayWorkout.title}</h1><p>{todayWorkout.purpose}</p></div>
        <span className={`recommendation-badge recommendation-badge--${recommendation.state.toLowerCase()}`}>{recommendation.state}</span>
      </header>

      <section className="today-grid" aria-label="Today overview">
        <article className="focus-card focus-card--primary">
          <p className="metric-label">Prescription</p>
          <strong>{todayWorkout.plannedMiles ? `${todayWorkout.plannedMiles} miles` : todayWorkout.duration ?? "Rest day"}</strong>
          <span>{todayWorkout.targetRpe}</span>
          {todayWorkout.paceGuidance && <small>{todayWorkout.paceGuidance}</small>}
          {store.paceGuidance?.accepted && <small><strong>Benchmark update:</strong> {store.paceGuidance.text}</small>}
          {todayWorkout.steps && <ol>{todayWorkout.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
        </article>
        <article className="focus-card"><p className="metric-label">This week</p><strong>{completedMileage(weekEntries).toFixed(1)} / {currentWeek.plannedMiles} mi</strong><span>completed / planned</span></article>
        <article className="focus-card"><p className="metric-label">Next long run</p><strong>{nextLongRun ? `${nextLongRun.plannedMiles} miles` : "Not scheduled"}</strong><span>{nextLongRun?.date ?? "—"} · RPE 3–4</span></article>
        <article className="focus-card"><p className="metric-label">Monterey Bay Half</p><strong>{countdown} days</strong><span>November 14, 2027 · confirmed</span></article>
      </section>

      <section className="recommendation-card" aria-live="polite">
        <div><p className="metric-label">Weekly recommendation</p><h2>{recommendation.summary}</h2></div>
        <ul>{recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <p className="guardrail">Coaching guardrail only—not a medical diagnosis or automatic schedule change.</p>
      </section>

      <section className="today-log-section">
        <div className="today-log-section__heading"><div><h2>{existing ? "Update today’s completion" : "Log today’s workout"}</h2><p>The required fields are kept short; watch and route context stays collapsed.</p></div><button className="app__nav-btn" type="button" onClick={() => { setShowPastRun((value) => !value); setPastEntry(undefined); }}>Log a past run</button></div>
        <QuickLogForm key={existing?.id ?? todayWorkout.id} workout={todayWorkout} initial={existing} entries={store.entries} onSave={onSaveEntry} onEditExisting={setPastEntry} />
      </section>
      {(showPastRun || pastEntry) && <section className="today-log-section"><h2>{pastEntry ? "Edit existing run" : "Log a past run"}</h2><QuickLogForm key={pastEntry?.id ?? "past-run"} initial={pastEntry} entries={store.entries} onSave={(entry) => { onSaveEntry(entry); setShowPastRun(false); setPastEntry(undefined); }} onEditExisting={setPastEntry} onCancel={() => { setShowPastRun(false); setPastEntry(undefined); }} /></section>}
    </main>
  );
}
