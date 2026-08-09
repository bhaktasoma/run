import { useEffect, useState } from "react";
import { fullBodyCooldown, strengthWarmups, sundayCooldown } from "../data/routines.ts";
import type { StrengthExerciseLog, StrengthSession, StrengthSessionLog, StrengthSessionStage, StrengthStatus } from "../domain/strength.ts";
import { moveStrengthStage, nextStrengthTarget, strengthSessionRecommendation } from "../domain/strength.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";
import ExerciseReference from "./ExerciseReference.tsx";
import RoutineChecklist from "./RoutineChecklist.tsx";

interface StrengthSessionCardProps { session: StrengthSession; weekId: string; previousLogs: StrengthSessionLog[]; onSave: (log: StrengthSessionLog) => void; defaultOpen?: boolean; }

export default function StrengthSessionCard({ session, weekId, previousLogs, onSave, defaultOpen = false }: StrengthSessionCardProps) {
  const previousSession = previousLogs.find((log) => log.sessionId === session.id);
  const sessionKey = `soma-strength-stage-${weekId}-${session.id}`;
  const [stage, setStage] = useState<StrengthSessionStage>(() => (localStorage.getItem(sessionKey) as StrengthSessionStage | null) ?? "idle");
  const [paused, setPaused] = useState(false);
  const [warmupStatus, setWarmupStatus] = useState<"completed" | "skipped" | undefined>(previousSession?.warmupStatus);
  const [cooldownStatus, setCooldownStatus] = useState<"completed" | "skipped" | undefined>(previousSession?.cooldownStatus);
  const [exercises, setExercises] = useState<StrengthExerciseLog[]>(() => session.exercises.map((exercise) => { const previous = previousSession?.exercises.find((item) => item.exerciseId === exercise.id); return { exerciseId: exercise.id, weight: previous?.weight ?? 0, reps: Array.from({ length: exercise.sets }, (_, index) => previous?.reps[index] ?? exercise.minReps), rir: previous?.rir ?? 3, status: "completed", note: "" }; }));
  const [status, setStatus] = useState<StrengthStatus>("completed");
  const [difficulty, setDifficulty] = useState<StrengthSessionLog["difficulty"]>("appropriate");
  const [concerningPain, setConcerningPain] = useState(false);
  const [techniqueStable, setTechniqueStable] = useState(true);
  const [notes, setNotes] = useState("");
  const [savedRecommendation, setSavedRecommendation] = useState<ReturnType<typeof strengthSessionRecommendation>>();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  useEffect(() => { localStorage.setItem(sessionKey, stage); }, [sessionKey, stage]);
  const updateExercise = (index: number, changes: Partial<StrengthExerciseLog>) => setExercises((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));
  const advance = () => setStage((current) => moveStrengthStage(current, "next"));
  const save = (event: React.FormEvent) => { event.preventDefault(); const log: StrengthSessionLog = { id: `${trainingDateIso()}-${session.id}`, weekId, sessionId: session.id, date: trainingDateIso(), status, difficulty, concerningPain, techniqueStable, notes, exercises, warmupStatus, cooldownStatus }; onSave(log); setSavedRecommendation(strengthSessionRecommendation(log)); localStorage.removeItem(sessionKey); setStage("idle"); };
  const warmup = strengthWarmups[session.id];
  const cooldown = session.id === "aesthetic" ? sundayCooldown : fullBodyCooldown;

  return <details className={session.required ? "strength-session-card" : "strength-session-card strength-session-card--optional"} open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
    <summary className="strength-session-card__summary"><div><span className="strength-session-card__day">{session.day}</span><div><p className="goal-page__eyebrow">{session.required ? "Primary session" : "Optional session"}</p><h2>{session.title}</h2></div></div><div><span>{session.duration}</span><strong>{isOpen ? "Hide" : "Open"}</strong></div></summary>
    {stage === "idle" ? <section className="strength-session-start"><p>Follow one guided sequence: warm up, complete the working sets, cool down, then save one session log.</p><button className="run-log-form__save" type="button" onClick={() => { setStage("warmup"); setPaused(false); }}>Start session</button></section> : <>
      <nav className="session-stage-indicator" aria-label="Session progress"><ol>{["Warm up", "Strength workout", "Cooldown", "Log completion"].map((label, index) => <li key={label} aria-current={index === ["warmup", "workout", "cooldown", "log"].indexOf(stage) ? "step" : undefined}>{label}</li>)}</ol></nav>
      <p className="sr-only" aria-live="polite">Current stage: {stage}</p>
      {paused ? <section className="session-paused"><h3>Session paused</h3><button type="button" onClick={() => setPaused(false)}>Resume</button></section> : <>
        {stage === "warmup" && <RoutineChecklist routine={warmup} status={warmupStatus} onStatus={(value) => { setWarmupStatus(value); advance(); }} />}
        {stage === "workout" && <form onSubmit={(event) => { event.preventDefault(); advance(); }}><div className="strength-exercise-list">{session.exercises.map((exercise, index) => { const previous = previousSession?.exercises.find((item) => item.exerciseId === exercise.id); const target = nextStrengthTarget(exercise, previous, previousSession?.techniqueStable ?? true); return <article className="strength-exercise" key={exercise.id}>
          <div className="strength-exercise__heading"><div><h3>{exercise.name}</h3><p>{exercise.sets} × {exercise.minReps}–{exercise.maxReps}{exercise.repLabel ? ` ${exercise.repLabel}` : ""}</p></div><ExerciseReference exercise={exercise.name} /></div>
          <div className="strength-exercise__history"><span><b>Previous</b>{previous ? `${previous.weight} lb · ${previous.reps.join(", ")} reps · ${previous.rir} RIR` : "Not logged"}</span><strong><b>Next target</b>{target.weight || "Choose start"} lb · {exercise.sets} × {target.reps}</strong><small>{target.explanation}</small></div>
          <div className="strength-exercise__inputs"><label>Weight (lb)<input type="number" min="0" step="0.5" value={exercises[index].weight || ""} placeholder="Choose" onChange={(event) => updateExercise(index, { weight: Number(event.target.value) })} /></label><fieldset className="strength-set-reps"><legend>Reps by set</legend><div>{Array.from({ length: exercise.sets }, (_, setIndex) => <label key={setIndex}><span>Set {setIndex + 1}</span><input type="number" min="0" inputMode="numeric" aria-label={`${exercise.name} set ${setIndex + 1} repetitions`} value={exercises[index].reps[setIndex] ?? exercise.minReps} onChange={(event) => { const reps = [...exercises[index].reps]; reps[setIndex] = Number(event.target.value); updateExercise(index, { reps }); }} /></label>)}</div></fieldset><label>RIR<select value={exercises[index].rir} onChange={(event) => updateExercise(index, { rir: Number(event.target.value) })}>{[0,1,2,3,4,5].map((value) => <option key={value}>{value}</option>)}</select></label><details className="strength-exercise__modify"><summary>Modify or skip</summary><label>Status<select value={exercises[index].status} onChange={(event) => updateExercise(index, { status: event.target.value as StrengthStatus })}><option value="completed">Completed</option><option value="modified">Modified</option><option value="skipped">Skipped</option></select></label><label>Optional note<textarea value={exercises[index].note} onChange={(event) => updateExercise(index, { note: event.target.value })} /></label></details></div>
        </article>; })}</div><button className="run-log-form__save" type="submit">Strength workout complete</button></form>}
        {stage === "cooldown" && <RoutineChecklist routine={cooldown} status={cooldownStatus} onStatus={(value) => { setCooldownStatus(value); advance(); }} />}
        {stage === "log" && <form onSubmit={save}><fieldset className="strength-check-in"><legend>Session check-in</legend><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as StrengthStatus)}><option value="completed">Completed</option><option value="modified">Modified</option><option value="skipped">Skipped</option></select></label><label>Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as StrengthSessionLog["difficulty"])}><option value="too-easy">Too easy</option><option value="appropriate">Appropriate</option><option value="too-hard">Too hard</option></select></label><label className="strength-check-in__check"><input type="checkbox" checked={concerningPain} onChange={(event) => setConcerningPain(event.target.checked)} /> Concerning pain</label><label className="strength-check-in__check"><input type="checkbox" checked={techniqueStable} onChange={(event) => setTechniqueStable(event.target.checked)} /> Technique remained stable</label><label className="strength-check-in__notes">Optional recovery or soreness note<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label><p>Warm-up: {warmupStatus ?? "not recorded"}. Cooldown: {cooldownStatus ?? "not recorded"}.</p><button className="run-log-form__save" type="submit">Finish and save session</button></fieldset></form>}
      </>}
      <div className="session-controls"><button type="button" disabled={stage === "warmup"} onClick={() => setStage((current) => moveStrengthStage(current, "previous"))}>Previous</button><button type="button" onClick={() => setPaused((value) => !value)}>{paused ? "Resume" : "Pause"}</button><button type="button" onClick={() => { if (stage === "warmup") setWarmupStatus("skipped"); if (stage === "cooldown") setCooldownStatus("skipped"); if (stage === "workout") setStatus("modified"); advance(); }}>Skip stage</button></div>
    </>}
    {savedRecommendation && <aside className={`strength-result strength-result--${savedRecommendation.action}`} role="status"><strong>{savedRecommendation.action === "progress" ? "Progress" : savedRecommendation.action === "reduce" ? "Reduce" : "Hold"}</strong><span>{savedRecommendation.explanation}</span></aside>}
  </details>;
}
