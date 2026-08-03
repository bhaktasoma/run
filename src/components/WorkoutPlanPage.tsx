import { useState } from "react";
import activePlan from "../data/activePlan.ts";
import { abdominalExercises, strengthSessions, warmupGuides } from "../data/workoutPlan.ts";
import { entriesForWeek, recommendWeek } from "../domain/progression.ts";
import { adaptStrengthPlan, strengthSessionRecommendation } from "../domain/strength.ts";
import type { StrengthAdjustmentDecision, StrengthRecoveryMode, StrengthSessionLog } from "../domain/strength.ts";
import type { TrainingStore } from "../domain/training.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";
import StrengthSessionCard from "./StrengthSessionCard.tsx";
import ExerciseReference from "./ExerciseReference.tsx";

interface WorkoutPlanPageProps {
  store: TrainingStore;
  onSaveLog: (log: StrengthSessionLog) => void;
  onSaveDecision: (decision: StrengthAdjustmentDecision) => void;
  onSelectAb: (exercise: TrainingStore["selectedAbExercise"]) => void;
}

const dayOrder: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

export default function WorkoutPlanPage({ store, onSaveLog, onSaveDecision, onSelectAb }: WorkoutPlanPageProps) {
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
  const selectedAb = abdominalExercises[store.selectedAbExercise];
  const sessions = adapted.sessions.map((session) => session.id === "aesthetic" ? { ...session, exercises: [...session.exercises, selectedAb] } : session);
  const todayRun = currentWeek.workouts.find((workout) => workout.date === today);
  const relevantWarmup = todayRun?.isLongRun || todayRun?.quality ? warmupGuides.qualityRun : todayRun?.kind === "run" || todayRun?.kind === "benchmark" ? warmupGuides.easyRun : warmupGuides.after;
  const currentDay = todayDate.getUTCDay();
  const nextSession = sessions.map((session) => ({ session, offset: (dayOrder[session.day] - currentDay + 7) % 7 })).sort((a, b) => a.offset - b.offset)[0]?.session;

  return <main className="strength-page">
    <header className="strength-hero"><div><h1>Strength</h1><p>Two full-body sessions build durable strength without compromising key runs.</p></div><aside><span>Next strength session</span><strong>{nextSession ? `${nextSession.day} · ${nextSession.title}` : "Recovery first"}</strong><small>{nextSession?.duration ?? "Resume when everyday movement feels comfortable."}</small></aside></header>

    <nav className="strength-tabs" role="tablist" aria-label="Strength sections">
      {([ ["plan", "Overview"], ["log", "Train"], ["progress", "Progress"], ["guides", "Guides"] ] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? "is-active" : ""} onClick={() => setActiveTab(id)}>{label}</button>)}
    </nav>

    {activeTab === "plan" && <section className="strength-plan-overview strength-tab-panel" id="weekly-strength" role="tabpanel" aria-labelledby="weekly-strength-title">
      <header><div><h2 id="weekly-strength-title">Detailed strength plan</h2><p>Open a day to view exercises, sets, and form guidance.</p></div>{suggestedMode === "post-race" && <small className="strength-plan-overview__status">Recovery week · Reference only</small>}</header>
      <section className="strength-adjustment"><div><p className="goal-page__eyebrow">This week’s adaptation</p><h3>{adapted.title}</h3><p>{adapted.explanation}</p><small>{adapted.mode === "normal" ? "2 required sessions" : `Up to ${adapted.sessions.filter((session) => session.required).length} reduced sessions`} · {adapted.sessions.some((session) => !session.required) ? "Optional session available when recovered" : "Optional session suppressed this week"}</small></div></section>
      <details className="strength-alternative"><summary>Alternative when Monday strength affects Tuesday quality</summary><p>Move Full Body A to Tuesday after the quality run, separated by several hours when practical. Keep Full Body B on Thursday. Optional work remains recovery-dependent.</p></details>
      <div className="strength-plan-overview__grid">
        {sessions.filter((session) => session.required).map((session) => <details key={session.id}><summary><span>{session.day}</span><strong>{session.title}</strong><small>{session.duration} · {adapted.mode === "normal" ? "Required" : "Conditional reduced session"}</small></summary>{adapted.mode !== "normal" && <p>Complete only if your legs feel comfortable.</p>}<ol>{session.exercises.map((exercise) => <li key={exercise.id}><ExerciseReference exercise={exercise.name} label="View" row prescription={`${exercise.sets} × ${exercise.minReps}–${exercise.maxReps}${exercise.repLabel ? ` ${exercise.repLabel}` : ""}`} /></li>)}</ol></details>)}
        <article className="strength-plan-rest"><span>Friday</span><strong>Complete rest</strong><small>Recovery · Protect Saturday’s long run</small></article>
        {sessions.some((session) => !session.required) ? <details className="is-optional"><summary><span>Sunday</span><strong>Upper / Aesthetic</strong><small>25–35 min · Optional</small></summary><label className="strength-sunday-choice">Abdominal exercise<select value={store.selectedAbExercise} onChange={(event) => onSelectAb(event.target.value as TrainingStore["selectedAbExercise"])}><option value="cable-crunch">Cable crunch</option><option value="hanging-knee-raise">Hanging knee raise</option><option value="reverse-crunch">Reverse crunch</option></select></label><ol>{sessions.find((session) => !session.required)!.exercises.map((exercise) => <li key={exercise.id}><ExerciseReference exercise={exercise.name} label="View" row prescription={`${exercise.sets} × ${exercise.minReps}–${exercise.maxReps}${exercise.repLabel ? ` ${exercise.repLabel}` : ""}`} /></li>)}</ol><p>Choose only one abdominal exercise. Current selection: <strong>{selectedAb.name}</strong>.</p></details> : <article className="strength-plan-rest"><span>Sunday</span><strong>Optional session suppressed this week</strong><small>Resume only after recovery criteria are satisfied.</small></article>}
      </div>
    </section>}
      {activeTab === "week" && <section className="strength-tab-panel" role="tabpanel"><header className="strength-tab-heading"><h2>This week</h2><p>Recovery-aware adjustments for the current running week.</p></header>
        <details className="strength-alternative"><summary>Alternative when Monday strength affects Tuesday quality</summary><p>Move Full Body A to Tuesday after the quality run, separated by several hours when practical. Keep Full Body B on Thursday and the optional aesthetic session on Sunday.</p></details>

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
      {sessions.some((session) => !session.required) && <section className="optional-strength-section"><header><div><p className="goal-page__eyebrow">Optional when recovered</p><h2>Upper / Aesthetic Logger</h2></div><span>Selected abs: <strong>{selectedAb.name}</strong></span></header>{sessions.filter((session) => !session.required).map((session) => <StrengthSessionCard key={`${effectiveMode}-${session.id}-${store.selectedAbExercise}`} session={session} weekId={currentWeek.id} previousLogs={store.strengthLogs} onSave={onSaveLog} defaultOpen={session.id === nextSession?.id} />)}</section>}
    </> : <section className="strength-rest-card"><h2>No heavy strength prescribed now</h2><p>{adapted.explanation}</p></section>}
    </section>}

    {activeTab === "progress" && <section className="strength-tab-panel" role="tabpanel">
    <section className="strength-recent"><h2>Recent strength progression</h2>{store.strengthLogs.length ? <div>{store.strengthLogs.slice(0, 5).map((log) => { const recommendation = strengthSessionRecommendation(log); return <article key={log.id}><strong>{strengthSessions.find((session) => session.id === log.sessionId)?.title ?? log.sessionId}</strong><span>{log.date} · {log.status} · {log.difficulty}</span><small>{log.techniqueStable ? "Technique stable" : "Technique changed"}{log.concerningPain ? " · concerning pain" : ""}</small><small><strong>{recommendation.action === "progress" ? "Progress" : recommendation.action === "reduce" ? "Reduce" : "Hold"}:</strong> {recommendation.explanation}</small></article>; })}</div> : <p>No strength sessions logged yet.</p>}</section>
    </section>}

    {activeTab === "guides" && <section className="strength-tab-panel strength-education-grid" id="strength-guides" role="tabpanel">
      <details className="strength-guide" open><summary>{relevantWarmup.title}</summary><ul>{relevantWarmup.items.map((item) => <li key={item}>{item}</li>)}</ul>{relevantWarmup === warmupGuides.after && <p>No warm-up is needed for today’s rest day.</p>}</details>
      <details className="strength-guide"><summary>Other warm-ups and optional mobility</summary><h3>{warmupGuides.strength.title}</h3><ul>{warmupGuides.strength.items.map((item) => <li key={item}>{item}</li>)}</ul><h3>{warmupGuides.after.title}</h3><ul>{warmupGuides.after.items.map((item) => <li key={item}>{item}</li>)}</ul><p>Use mobility for actual stiffness or restriction. Static stretching is not required to prevent injury.</p></details>
      <article className="strength-guide"><h2>Core and abdominal guidance</h2><p>Dead bugs provide anti-extension, Pallof presses anti-rotation, and side planks plus suitcase carries lateral stability. The optional session adds exactly one controlled trunk-flexion exercise.</p><p>Abdominal muscles can grow through progressive resistance, while visible definition also depends on genetics and body-fat distribution. Avoid aggressive calorie restriction as running and strength demands increase.</p></article>
      <article className="strength-guide"><h2>General nutrition education</h2><ul><li>Approximate protein target: 85–95 grams per day</li><li>Spread across three or four meals</li><li>Approximately 20–30 grams per meal</li><li>Avoid aggressive calorie restriction while training load rises</li><li>Persistent fatigue, declining performance, or health changes can signal inadequate recovery or fueling</li></ul><p><small>General educational information—not individualized medical or dietary advice.</small></p></article>
    </section>}
  </main>;
}
