import { useEffect, useState } from "react";
import activePlan from "../data/activePlan.ts";
import { strengthSessions, warmupGuides } from "../data/workoutPlan.ts";
import { kneeResilience, mobilityRoutine } from "../data/routines.ts";
import { entriesForWeek, recommendWeek } from "../domain/progression.ts";
import { adaptStrengthPlan, BODY_RECOMPOSITION_GOAL, shortenedSundaySession, STRENGTH_PROGRESSION_RULE, strengthSessionRecommendation } from "../domain/strength.ts";
import type { StrengthAdjustmentDecision, StrengthRecoveryMode, StrengthSessionLog } from "../domain/strength.ts";
import type { RoutineCompletion, TrainingStore } from "../domain/training.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";
import StrengthSessionCard from "./StrengthSessionCard.tsx";
import ExerciseReference from "./ExerciseReference.tsx";
import RoutineChecklist from "./RoutineChecklist.tsx";
import { resolveStrengthStatus } from "../domain/workoutStatus.ts";

interface WorkoutPlanPageProps {
  store: TrainingStore;
  onSaveLog: (log: StrengthSessionLog) => void;
  onSaveDecision: (decision: StrengthAdjustmentDecision) => void;
  onSaveRoutine: (completion: RoutineCompletion) => void;
  focusSessionId?: string;
}

const dayOrder: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

export default function WorkoutPlanPage({ store, onSaveLog, onSaveDecision, onSaveRoutine, focusSessionId }: WorkoutPlanPageProps) {
  const [activeTab, setActiveTab] = useState<"plan" | "week" | "log" | "progress" | "guides">("plan");
  const today = trainingDateIso();
  const todayDate = new Date(`${today}T12:00:00Z`);
  const currentWeek = activePlan.find((week) => week.workouts.some((workout) => workout.date === today)) ?? activePlan.find((week) => week.workouts.some((workout) => workout.date > today)) ?? activePlan.at(-1)!;
  const runningEntries = entriesForWeek(currentWeek, store.entries);
  const checkIn = store.checkIns.find((item) => item.weekId === currentWeek.id);
  const runningRecommendation = recommendWeek(currentWeek, runningEntries, checkIn, today);
  let suggestedMode: StrengthRecoveryMode = "normal";
  if (currentWeek.id === "2026-W31" || currentWeek.id === "2026-W32") suggestedMode = "post-race";
  else if (runningRecommendation.state === "Reduce" || runningRecommendation.state === "Reassess" || checkIn?.sleepRecovery === "poor") suggestedMode = "high-fatigue";
  else if (/recovery|consolidate/i.test(currentWeek.objective)) suggestedMode = "running-recovery";
  const decision = store.strengthDecisions.find((item) => item.weekId === currentWeek.id);
  const effectiveMode = decision?.accepted === false ? "normal" : suggestedMode;
  const adapted = adaptStrengthPlan(strengthSessions, effectiveMode);
  const sundayWorkout = currentWeek.workouts.find((workout) => /Back \+ Core \+ Aesthetics/i.test(workout.title)) ?? currentWeek.workouts.at(-1)!;
  const sundayResolved = resolveStrengthStatus("aesthetic", sundayWorkout.date, currentWeek, store);
  const sundayState = sundayResolved.state === "shortened" ? "shortened" : sundayResolved.state === "suppressed" ? "suppressed" : "recovered";
  const baseSunday = strengthSessions.find((session) => session.id === "aesthetic")!;
  const sundaySession = sundayState === "shortened" ? shortenedSundaySession(baseSunday) : baseSunday;
  const sessions = adapted.sessions.filter((session) => session.id !== "aesthetic");
  const currentDay = todayDate.getUTCDay();
  const nextSession = sessions.map((session) => ({ session, offset: (dayOrder[session.day] - currentDay + 7) % 7 })).sort((a, b) => a.offset - b.offset)[0]?.session;
  useEffect(() => { if (focusSessionId) setActiveTab("log"); }, [focusSessionId]);

  return <main className="strength-page">
    <header className="strength-hero"><div><h1>Strength</h1><p>Two primary full-body sessions build running durability. An optional Sunday back-and-core session supports posture, core strength and lean-muscle development when recovery permits.</p></div><aside><span>Next strength session</span><strong>{sundayWorkout.date === today ? `Sunday · Back + Core + Aesthetics · ${sundayResolved.state}` : nextSession ? `${nextSession.day} · ${nextSession.title}` : "Recovery first"}</strong><small>{sundayWorkout.date === today ? sundayResolved.availabilityReason : nextSession?.duration ?? "Resume when everyday movement feels comfortable."}</small></aside></header>

    <nav className="strength-tabs" role="tablist" aria-label="Strength sections">
      {([ ["plan", "Overview"], ["log", "Train"], ["progress", "Progress"], ["guides", "Guides"] ] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? "is-active" : ""} onClick={() => setActiveTab(id)}>{label}</button>)}
    </nav>

    {activeTab === "plan" && <section className="strength-plan-overview strength-tab-panel" id="weekly-strength" role="tabpanel" aria-labelledby="weekly-strength-title">
      <header><div><h2 id="weekly-strength-title">Detailed strength plan</h2><p>Open a day to view exercises, sets, and form guidance.</p></div>{suggestedMode === "post-race" && <small className="strength-plan-overview__status">Recovery week · Reference only</small>}</header>
      <section className="strength-adjustment"><div><p className="goal-page__eyebrow">This week’s adaptation</p><h3>{adapted.title}</h3><p>{adapted.explanation}</p><small>{adapted.mode === "normal" ? "2 primary sessions" : `Up to ${adapted.sessions.filter((session) => session.required).length} reduced sessions`} · Sunday {sundayResolved.state}: {sundayResolved.availabilityReason}</small></div></section>
      <details className="strength-alternative"><summary>Alternative when Monday strength affects Tuesday quality</summary><p>Move Full Body A to Tuesday after the quality run, separated by several hours when practical. Keep Full Body B on Thursday. Optional work remains recovery-dependent.</p></details>
      <div className="strength-plan-overview__grid">
        {sessions.filter((session) => session.required).map((session) => <details key={session.id}><summary><span>{session.day}</span><strong>{session.title}</strong><small>{session.duration} · {adapted.mode === "normal" ? "Required" : "Conditional reduced session"}</small></summary>{adapted.mode !== "normal" && <p>Complete only if your legs feel comfortable.</p>}<ol>{session.exercises.map((exercise) => <li key={exercise.id}><ExerciseReference exercise={exercise.name} label="View" row prescription={`${exercise.sets} × ${exercise.minReps}–${exercise.maxReps}${exercise.repLabel ? ` ${exercise.repLabel}` : ""}`} /></li>)}</ol></details>)}
        <article className="strength-plan-rest"><span>Friday</span><strong>Complete rest</strong><small>Recovery · Protect Saturday’s long run</small></article>
        <details className="is-optional"><summary><span>Sunday</span><strong>Back + Core + Aesthetics</strong><small>{sundayResolved.duration} · {sundayResolved.state}</small></summary><p>{sundayResolved.availabilityReason}</p><ol>{sundaySession.exercises.map((exercise) => <li key={exercise.id}><ExerciseReference exercise={exercise.name} label="View" row prescription={`${exercise.sets} × ${exercise.minReps}–${exercise.maxReps}${exercise.repLabel ? ` ${exercise.repLabel}` : ""}`} /></li>)}</ol></details>
      </div>
    </section>}
      {activeTab === "week" && <section className="strength-tab-panel" role="tabpanel"><header className="strength-tab-heading"><h2>This week</h2><p>Recovery-aware adjustments for the current running week.</p></header>
        <details className="strength-alternative"><summary>Alternative when Monday strength affects Tuesday quality</summary><p>Move Full Body A to Tuesday after the quality run, separated by several hours when practical. Keep Full Body B on Thursday. Use the optional Core / Back routine only when recovered.</p></details>

        <section className="strength-adjustment" id="strength-adjustment">
          <div><p className="goal-page__eyebrow">Current running week</p><h2>{adaptStrengthPlan(strengthSessions, suggestedMode).title}</h2><p>{adaptStrengthPlan(strengthSessions, suggestedMode).explanation}</p><small>This is an explained coaching adjustment, not a silent plan change.</small></div>
          {suggestedMode !== "normal" && <div className="decision-actions"><button type="button" onClick={() => onSaveDecision({ weekId: currentWeek.id, mode: suggestedMode, accepted: true, decidedAt: new Date().toISOString() })}>Use adjustment</button><button type="button" onClick={() => onSaveDecision({ weekId: currentWeek.id, mode: suggestedMode, accepted: false, decidedAt: new Date().toISOString() })}>Keep original sessions</button></div>}
          {decision && <p className="decision-note">{decision.accepted ? "Recommended adjustment selected." : "Original sessions retained."}</p>}
        </section>
      </section>}

    {activeTab === "log" && <section className="strength-tab-panel strength-log-tab" role="tabpanel">
    {sessions.length ? <>
      <header className="strength-tab-heading strength-log-heading" id="strength-logger"><h2>Log workouts</h2><p>Open a session, record your sets, and save when complete. Keep 2–3 good repetitions in reserve.</p></header>
      {sessions.filter((session) => session.required).map((session) => <StrengthSessionCard key={`${effectiveMode}-${session.id}`} session={session} weekId={currentWeek.id} previousLogs={store.strengthLogs} onSave={onSaveLog} defaultOpen={session.id === nextSession?.id} />)}
      <section className="optional-strength-section"><header><div><p className="goal-page__eyebrow">Sunday · {sundayResolved.state}</p><h2>Back + Core + Aesthetics</h2><p>{sundayResolved.availabilityReason}</p></div></header><StrengthSessionCard key={`${effectiveMode}-${sundayState}-${sundaySession.id}`} session={sundaySession} weekId={currentWeek.id} previousLogs={store.strengthLogs} onSave={onSaveLog} defaultOpen={focusSessionId === "aesthetic" || sundayWorkout.date === today} availability={sundayResolved} onStartMobility={() => setActiveTab("guides")} /></section>
    </> : <section className="strength-rest-card"><h2>No heavy strength prescribed now</h2><p>{adapted.explanation}</p></section>}
    </section>}

    {activeTab === "progress" && <section className="strength-tab-panel" role="tabpanel">
    <section className="strength-recent"><h2>Recent strength progression</h2>{store.strengthLogs.some((log) => log.exercises.some((exercise) => exercise.status !== "not-recorded")) ? <div>{store.strengthLogs.filter((log) => log.exercises.some((exercise) => exercise.status !== "not-recorded")).slice(0, 5).map((log) => { const recommendation = strengthSessionRecommendation(log); return <article key={log.id}><strong>{strengthSessions.find((session) => session.id === log.sessionId)?.title ?? log.sessionId}</strong><span>{log.date} · {log.status} · {log.difficulty}</span><small>{log.techniqueStable ? "Technique stable" : "Technique changed"}{log.concerningPain ? " · concerning pain" : ""}</small><small><strong>{recommendation.action === "progress" ? "Progress" : recommendation.action === "reduce" ? "Reduce" : "Hold"}:</strong> {recommendation.explanation}</small></article>; })}</div> : <p>No recorded strength exercise results yet.</p>}</section>
    </section>}

    {activeTab === "guides" && <section className="strength-tab-panel strength-education-grid" id="strength-guides" role="tabpanel">
      <details className="strength-guide"><summary>Warm-ups and cooldowns</summary><h3>{warmupGuides.strength.title}</h3><ul>{warmupGuides.strength.items.map((item) => <li key={item}>{item}</li>)}</ul><h3>{warmupGuides.after.title}</h3><ul>{warmupGuides.after.items.map((item) => <li key={item}>{item}</li>)}</ul><p>Use mobility for actual stiffness or restriction. Static stretching is not required to prevent injury.</p></details>
      <article className="strength-guide"><h2>Progress without training to failure</h2><p>{STRENGTH_PROGRESSION_RULE}</p><p>Finish most working sets with 2–3 good repetitions remaining. Hold the weight when form changes or recovery is poor.</p></article>
      <article className="strength-guide"><h2>Body recomposition, in perspective</h2><p>{BODY_RECOMPOSITION_GOAL}</p><p>Fat cannot be selectively lost from the hips or thighs. Strength training can develop the glutes, hips and thighs, while visible abs depend on abdominal development, overall body composition and individual genetics. The priority is recomposition and performance—not aggressive weight loss.</p></article>
      <article className="strength-guide"><h2>Fuel strength and running</h2><ul><li>A practical protein range at about 114 lb / 51.7 kg is 85–100 grams per day, spread across three or four meals.</li><li>Begin near maintenance intake rather than pursuing aggressive weight loss.</li><li>Fuel long runs, quality workouts and recovery adequately.</li><li>The app intentionally does not set daily calorie or weight-loss targets.</li></ul><p>Persistent fatigue, worsening performance, poor recovery, recurring injuries or menstrual changes are reasons to pause any fat-loss effort and discuss the symptoms with an appropriate healthcare or sports-nutrition professional.</p><p><small>General educational information—not individualized medical or dietary advice.</small></p></article>
      <article className="strength-guide"><h2>{kneeResilience.title}</h2><p>Full Body A/B already cover split squats, hamstring curls, calf raises and step-ups. When useful, add a brief technique block with controlled step-downs, tibialis raises, lateral band walks and single-leg balance—never as automatic punishment for pain or missed work.</p><ul>{kneeResilience.patterns.map((pattern) => <li key={pattern}><ExerciseReference exercise={pattern} label="View" /></li>)}</ul><p><strong>{kneeResilience.safety}</strong></p></article>
      <article className="strength-guide"><h2>Reusable mobility</h2><RoutineChecklist routine={mobilityRoutine} status={store.routineCompletions.find((item) => item.type === "mobility" && item.date === today)?.status} onStatus={(status) => onSaveRoutine({ id: `${today}-mobility`, workoutId: "mobility", date: today, type: "mobility", status })} /></article>
    </section>}
  </main>;
}
