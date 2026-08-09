import { useEffect, useRef, useState } from "react";
import activePlan from "../data/activePlan.ts";
import { completedMileage, entriesForWeek, recommendWeek } from "../domain/progression.ts";
import type { RoutineCompletion, RunEntry, TrainingStore } from "../domain/training.ts";
import QuickLogForm from "./QuickLogForm.tsx";
import { daysBetweenIsoDates, trainingDateIso } from "../utils/trainingDate.ts";
import { montereyTarget } from "../data/races.ts";
import { qualityStrides, runCooldown, runWarmup } from "../data/routines.ts";
import RoutineChecklist from "./RoutineChecklist.tsx";
import { resolveStrengthStatus, resolveWorkoutStatus, strengthSessionIdForWorkout } from "../domain/workoutStatus.ts";

interface TodayPageProps {
  store: TrainingStore;
  onSaveEntry: (entry: RunEntry) => void;
  onOpenStrength?: () => void;
  focusLog?: boolean;
  onLogFocused?: () => void;
  onSaveRoutine: (completion: RoutineCompletion) => void;
}

export default function TodayPage({ store, onSaveEntry, onOpenStrength, focusLog = false, onLogFocused, onSaveRoutine }: TodayPageProps) {
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
  const recommendation = recommendWeek(currentWeek, weekEntries, checkIn, today);
  const nextLongRun = activePlan.flatMap((week) => week.workouts).find((workout) => workout.isLongRun && workout.date >= today);
  const countdown = daysBetweenIsoDates(today, montereyTarget.internalDate);
  const runTitle = todayWorkout.title.replace(/\s*\+\s*Full Body [AB].*$/i, "");
  const hasStrength = /Full Body [AB]/i.test(todayWorkout.title);
  const strengthTitle = todayWorkout.title.match(/Full Body [AB]/i)?.[0] ?? "Strength";
  const existing = store.entries.find((entry) => entry.workoutId === todayWorkout.id);
  const logHeadingRef = useRef<HTMLHeadingElement>(null);
  const runWorkout = { ...todayWorkout, title: runTitle, targetRpe: todayWorkout.targetRpe.split(";")[0], steps: todayWorkout.steps?.filter((step) => !/Full Body/i.test(step)) };
  const primaryStatus = resolveWorkoutStatus(todayWorkout, currentWeek, store);
  const strengthId = strengthSessionIdForWorkout(todayWorkout);
  const strengthStatus = strengthId ? resolveStrengthStatus(strengthId, todayWorkout.date, currentWeek, store) : undefined;
  const saveRoutine = (type: RoutineCompletion["type"], status: RoutineCompletion["status"]) => onSaveRoutine({ id: `${todayWorkout.id}-${type}`, workoutId: todayWorkout.id, date: todayWorkout.date, type, status });
  const routineStatus = (type: RoutineCompletion["type"]) => store.routineCompletions.find((item) => item.workoutId === todayWorkout.id && item.type === type)?.status;
  useEffect(() => { if (!focusLog) return; logHeadingRef.current?.scrollIntoView({ block: "start" }); logHeadingRef.current?.focus({ preventScroll: true }); onLogFocused?.(); }, [focusLog, onLogFocused]);

  return (
    <main className="today-page">
      <header className="today-hero today-hero--workout">
        <div><p className="goal-page__eyebrow">Today · {todayWorkout.date}</p><h1>{runTitle}</h1><p><strong>{todayWorkout.plannedMiles ? `${todayWorkout.plannedMiles} miles` : todayWorkout.duration ?? "Rest day"}</strong> · {todayWorkout.targetRpe.split(";")[0]}</p>{todayWorkout.steps && <ul>{todayWorkout.steps.filter((step) => !/Full Body/i.test(step)).map((step) => <li key={step}>{step}</li>)}</ul>}<div className="today-actions">{primaryStatus.sessionType === "run" ? <><a href="#run-warmup">Start run warm-up</a><a href="#today-log">{existing ? "View or update run" : "Log after completion"}</a></> : primaryStatus.sessionType === "strength" ? <button type="button" onClick={onOpenStrength}>{primaryStatus.recommendedAction}</button> : <><strong>{primaryStatus.recommendedAction}</strong><button type="button" className="app__nav-btn" onClick={() => { setShowPastRun(true); setPastEntry(undefined); }}>Log an unplanned run</button></>}</div></div>
      </header>

      <section className="today-grid" aria-label="Today overview">
        {hasStrength && <article className="focus-card focus-card--primary"><p className="metric-label">Separate activity</p><strong>{strengthTitle} · {strengthStatus?.state}</strong><span>{strengthStatus?.availabilityReason}</span><button className="app__nav-btn" type="button" onClick={onOpenStrength}>{strengthStatus?.recommendedAction}</button></article>}
        <article className="focus-card"><p className="metric-label">This week</p><strong>{completedMileage(weekEntries).toFixed(1)} / {currentWeek.plannedMiles} mi</strong><span>completed / planned</span></article>
        <article className="focus-card"><p className="metric-label">Next long run</p><strong>{nextLongRun ? `${nextLongRun.plannedMiles} miles` : "Not scheduled"}</strong><span>{nextLongRun?.date ?? "—"} · RPE 3–4</span></article>
        <article className="focus-card"><p className="metric-label">Provisional race target</p><strong>{countdown} days · provisional</strong><span>{montereyTarget.title} · {montereyTarget.confirmation}</span></article>
      </section>

      {(todayWorkout.kind === "run" || todayWorkout.kind === "benchmark") && <section className="today-routines" id="run-warmup" aria-label="Before and after this run"><RoutineChecklist routine={runWarmup} extraStep={todayWorkout.quality ? qualityStrides : undefined} status={routineStatus("run-warmup")} onStatus={(status) => saveRoutine("run-warmup", status)} collapsible /><RoutineChecklist routine={runCooldown} status={routineStatus("run-cooldown")} onStatus={(status) => saveRoutine("run-cooldown", status)} collapsible /><p>These routine records are separate from run and strength completion.</p></section>}

      <section className="recommendation-card" aria-live="polite">
        <div><p className="metric-label">Weekly recommendation</p><h2>{recommendation.summary}</h2></div>
        <ul>{recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <p className="guardrail">Coaching guardrail only—not a medical diagnosis or automatic schedule change.</p>
      </section>

      {(todayWorkout.kind === "run" || todayWorkout.kind === "benchmark") && <section className="today-log-section" id="today-log">
        <div className="today-log-section__heading"><div><h2 ref={logHeadingRef} tabIndex={-1}>{existing ? "Update today’s completion" : "Log today’s workout"}</h2><p>The required fields are kept short; watch and route context stays collapsed.</p></div><button className="app__nav-btn" type="button" onClick={() => { setShowPastRun((value) => !value); setPastEntry(undefined); }}>Log a past run</button></div>
        <QuickLogForm key={existing?.id ?? todayWorkout.id} workout={runWorkout} initial={existing} entries={store.entries} onSave={onSaveEntry} onEditExisting={setPastEntry} />
      </section>}
      {(showPastRun || pastEntry) && <section className="today-log-section"><h2>{pastEntry ? "Edit existing run" : "Log a past run"}</h2><QuickLogForm key={pastEntry?.id ?? "past-run"} initial={pastEntry} entries={store.entries} onSave={(entry) => { onSaveEntry(entry); setShowPastRun(false); setPastEntry(undefined); }} onEditExisting={setPastEntry} onCancel={() => { setShowPastRun(false); setPastEntry(undefined); }} /></section>}
    </main>
  );
}
