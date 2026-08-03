import activePlan from "../data/activePlan.ts";
import { completedMileage, recommendWeek } from "../domain/progression.ts";
import type { RunEntry, TrainingStore } from "../domain/training.ts";
import QuickLogForm from "./QuickLogForm.tsx";

interface TodayPageProps {
  store: TrainingStore;
  onSaveEntry: (entry: RunEntry) => void;
}

const isoToday = () => new Date().toISOString().slice(0, 10);

export default function TodayPage({ store, onSaveEntry }: TodayPageProps) {
  const today = isoToday();
  const currentWeek = activePlan.find((week) => week.workouts.some((workout) => workout.date === today))
    ?? activePlan.find((week) => week.workouts.some((workout) => workout.date > today))
    ?? activePlan.at(-1)!;
  const todayWorkout = currentWeek.workouts.find((workout) => workout.date === today)
    ?? currentWeek.workouts.find((workout) => workout.date >= today)
    ?? currentWeek.workouts[0];
  const weekEntries = store.entries.filter((entry) => currentWeek.workouts.some((workout) => workout.id === entry.workoutId));
  const checkIn = store.checkIns.find((item) => item.weekId === currentWeek.id);
  const recommendation = recommendWeek(currentWeek, weekEntries, checkIn);
  const nextLongRun = activePlan.flatMap((week) => week.workouts).find((workout) => workout.isLongRun && workout.date >= today);
  const raceDate = new Date("2027-11-14T00:00:00");
  const countdown = Math.max(0, Math.ceil((raceDate.getTime() - new Date(`${today}T00:00:00`).getTime()) / 86_400_000));
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
        <h2>{existing ? "Update today’s completion" : "Log today’s workout"}</h2>
        <p>The required fields are kept short; optional context stays collapsed.</p>
        <QuickLogForm key={existing?.id ?? todayWorkout.id} workout={todayWorkout} initial={existing} onSave={onSaveEntry} />
      </section>
    </main>
  );
}
