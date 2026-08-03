import activePlan from "../data/activePlan.ts";
import { abdominalExercises, strengthSessions, warmupGuides } from "../data/workoutPlan.ts";
import { recommendWeek } from "../domain/progression.ts";
import { adaptStrengthPlan, strengthSessionRecommendation } from "../domain/strength.ts";
import type { StrengthAdjustmentDecision, StrengthRecoveryMode, StrengthSessionLog } from "../domain/strength.ts";
import type { TrainingStore } from "../domain/training.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";
import StrengthSessionCard from "./StrengthSessionCard.tsx";

interface WorkoutPlanPageProps {
  store: TrainingStore;
  onSaveLog: (log: StrengthSessionLog) => void;
  onSaveDecision: (decision: StrengthAdjustmentDecision) => void;
  onSelectAb: (exercise: TrainingStore["selectedAbExercise"]) => void;
}

const dayOrder: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

export default function WorkoutPlanPage({ store, onSaveLog, onSaveDecision, onSelectAb }: WorkoutPlanPageProps) {
  const today = trainingDateIso();
  const todayDate = new Date(`${today}T12:00:00Z`);
  const currentWeek = activePlan.find((week) => week.workouts.some((workout) => workout.date === today)) ?? activePlan.find((week) => week.workouts.some((workout) => workout.date > today)) ?? activePlan.at(-1)!;
  const runningEntries = store.entries.filter((entry) => currentWeek.workouts.some((workout) => workout.id === entry.workoutId));
  const checkIn = store.checkIns.find((item) => item.weekId === currentWeek.id);
  const runningRecommendation = recommendWeek(currentWeek, runningEntries, checkIn);
  let suggestedMode: StrengthRecoveryMode = "normal";
  if (currentWeek.id === "2026-W31") suggestedMode = "post-race";
  else if (runningRecommendation.state === "Reduce" || runningRecommendation.state === "Reassess" || checkIn?.sleepRecovery === "poor") suggestedMode = "high-fatigue";
  else if (currentWeek.objective.toLowerCase().includes("consolidate")) suggestedMode = "running-recovery";
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
    <header className="strength-hero"><div><p className="goal-page__eyebrow">Running performance + lean muscle</p><h1>Strength</h1><p>Two balanced full-body sessions support durability, visible lean muscle, back and abdominal development, and healthy aging without compromising key runs.</p></div><aside><span>Next scheduled</span><strong>{nextSession ? `${nextSession.day} · ${nextSession.title}` : "Recovery first"}</strong><small>{nextSession?.duration ?? "Resume when normal walking and daily movement feel comfortable."}</small></aside></header>

    <section className="strength-schedule" aria-label="Weekly strength placement"><div><strong>Monday</strong><span>Full Body A after easy running or alone</span></div><div><strong>Thursday</strong><span>Full Body B after easy/recovery running</span></div><div><strong>Friday</strong><span>Complete rest before the long run</span></div><div className="is-optional"><strong>Sunday</strong><span>Optional Upper / Aesthetic when recovery is good</span></div></section>
    <details className="strength-alternative"><summary>Alternative when Monday strength affects Tuesday quality</summary><p>Move Full Body A to Tuesday after the quality run, separated by several hours when practical. Keep Full Body B on Thursday and the optional aesthetic session on Sunday.</p></details>

    <section className="strength-adjustment">
      <div><p className="goal-page__eyebrow">Current running week</p><h2>{adaptStrengthPlan(strengthSessions, suggestedMode).title}</h2><p>{adaptStrengthPlan(strengthSessions, suggestedMode).explanation}</p><small>This is an explained coaching adjustment, not a silent plan change.</small></div>
      {suggestedMode !== "normal" && <div className="decision-actions"><button type="button" onClick={() => onSaveDecision({ weekId: currentWeek.id, mode: suggestedMode, accepted: true, decidedAt: new Date().toISOString() })}>Use adjustment</button><button type="button" onClick={() => onSaveDecision({ weekId: currentWeek.id, mode: suggestedMode, accepted: false, decidedAt: new Date().toISOString() })}>Keep original sessions</button></div>}
      {decision && <p className="decision-note">{decision.accepted ? "Recommended adjustment selected." : "Original sessions retained."}</p>}
    </section>

    {sessions.length ? <>
      <section className="strength-week-heading"><div><p className="goal-page__eyebrow">This week</p><h2>Required full-body sessions</h2></div><p>Start with 2–3 good repetitions in reserve. Do not routinely train to failure.</p></section>
      {sessions.filter((session) => session.required).map((session) => <StrengthSessionCard key={`${effectiveMode}-${session.id}`} session={session} weekId={currentWeek.id} previousLogs={store.strengthLogs} onSave={onSaveLog} />)}
      {sessions.some((session) => !session.required) && <section className="optional-strength-section"><header><div><p className="goal-page__eyebrow">Optional</p><h2>Upper / Aesthetic Session</h2></div><label>Choose one abdominal exercise<select value={store.selectedAbExercise} onChange={(event) => onSelectAb(event.target.value as TrainingStore["selectedAbExercise"])}><option value="cable-crunch">Cable crunch</option><option value="hanging-knee-raise">Hanging knee raise</option><option value="reverse-crunch">Reverse crunch</option></select></label></header>{sessions.filter((session) => !session.required).map((session) => <StrengthSessionCard key={`${effectiveMode}-${session.id}-${store.selectedAbExercise}`} session={session} weekId={currentWeek.id} previousLogs={store.strengthLogs} onSave={onSaveLog} />)}</section>}
    </> : <section className="strength-rest-card"><h2>No heavy strength prescribed now</h2><p>{adapted.explanation}</p></section>}

    <section className="strength-recent"><h2>Recent strength progression</h2>{store.strengthLogs.length ? <div>{store.strengthLogs.slice(0, 5).map((log) => { const recommendation = strengthSessionRecommendation(log); return <article key={log.id}><strong>{strengthSessions.find((session) => session.id === log.sessionId)?.title ?? log.sessionId}</strong><span>{log.date} · {log.status} · {log.difficulty}</span><small>{log.techniqueStable ? "Technique stable" : "Technique changed"}{log.concerningPain ? " · concerning pain" : ""}</small><small><strong>{recommendation.action === "progress" ? "Progress" : recommendation.action === "reduce" ? "Reduce" : "Hold"}:</strong> {recommendation.explanation}</small></article>; })}</div> : <p>No strength sessions logged yet.</p>}</section>

    <section className="strength-education-grid">
      <details className="strength-guide" open><summary>{relevantWarmup.title}</summary><ul>{relevantWarmup.items.map((item) => <li key={item}>{item}</li>)}</ul>{relevantWarmup === warmupGuides.after && <p>No warm-up is needed for today’s rest day.</p>}</details>
      <details className="strength-guide"><summary>Other warm-ups and optional mobility</summary><h3>{warmupGuides.strength.title}</h3><ul>{warmupGuides.strength.items.map((item) => <li key={item}>{item}</li>)}</ul><h3>{warmupGuides.after.title}</h3><ul>{warmupGuides.after.items.map((item) => <li key={item}>{item}</li>)}</ul><p>Use mobility for actual stiffness or restriction. Static stretching is not required to prevent injury.</p></details>
      <article className="strength-guide"><h2>Core and abdominal guidance</h2><p>Dead bugs provide anti-extension, Pallof presses anti-rotation, and side planks plus suitcase carries lateral stability. The optional session adds exactly one controlled trunk-flexion exercise.</p><p>Abdominal muscles can grow through progressive resistance, while visible definition also depends on genetics and body-fat distribution. Avoid aggressive calorie restriction as running and strength demands increase.</p></article>
      <article className="strength-guide"><h2>General nutrition education</h2><ul><li>Approximate protein target: 85–95 grams per day</li><li>Spread across three or four meals</li><li>Approximately 20–30 grams per meal</li><li>Avoid aggressive calorie restriction while training load rises</li><li>Persistent fatigue, declining performance, or health changes can signal inadequate recovery or fueling</li></ul><p><small>General educational information—not individualized medical or dietary advice.</small></p></article>
    </section>
  </main>;
}
