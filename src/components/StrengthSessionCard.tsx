import { useState } from "react";
import type { StrengthExerciseLog, StrengthSession, StrengthSessionLog, StrengthStatus } from "../domain/strength.ts";
import { nextStrengthTarget, strengthSessionRecommendation } from "../domain/strength.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";
import ExerciseReference from "./ExerciseReference.tsx";

interface StrengthSessionCardProps {
  session: StrengthSession;
  weekId: string;
  previousLogs: StrengthSessionLog[];
  onSave: (log: StrengthSessionLog) => void;
}

export default function StrengthSessionCard({ session, weekId, previousLogs, onSave }: StrengthSessionCardProps) {
  const previousSession = previousLogs.find((log) => log.sessionId === session.id);
  const [exercises, setExercises] = useState<StrengthExerciseLog[]>(() => session.exercises.map((exercise) => {
    const previous = previousSession?.exercises.find((item) => item.exerciseId === exercise.id);
    return { exerciseId: exercise.id, weight: previous?.weight ?? 0, reps: Array.from({ length: exercise.sets }, (_, index) => previous?.reps[index] ?? exercise.minReps), rir: previous?.rir ?? 3, status: "completed", note: "" };
  }));
  const [status, setStatus] = useState<StrengthStatus>("completed");
  const [difficulty, setDifficulty] = useState<StrengthSessionLog["difficulty"]>("appropriate");
  const [concerningPain, setConcerningPain] = useState(false);
  const [techniqueStable, setTechniqueStable] = useState(true);
  const [notes, setNotes] = useState("");
  const [savedRecommendation, setSavedRecommendation] = useState<ReturnType<typeof strengthSessionRecommendation>>();
  const updateExercise = (index: number, changes: Partial<StrengthExerciseLog>) => setExercises((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const log: StrengthSessionLog = { id: `${trainingDateIso()}-${session.id}`, weekId, sessionId: session.id, date: trainingDateIso(), status, difficulty, concerningPain, techniqueStable, notes, exercises };
    onSave(log);
    setSavedRecommendation(strengthSessionRecommendation(log));
  };

  return <section className={session.required ? "strength-session-card" : "strength-session-card strength-session-card--optional"}>
    <header><div><p className="goal-page__eyebrow">{session.required ? "Required" : "Optional"} · {session.day}</p><h2>{session.title}</h2></div><span>{session.duration}</span></header>
    <form onSubmit={submit}>
      <div className="strength-exercise-list">{session.exercises.map((exercise, index) => {
        const previous = previousSession?.exercises.find((item) => item.exerciseId === exercise.id);
        const target = nextStrengthTarget(exercise, previous, previousSession?.techniqueStable ?? true);
        return <article className="strength-exercise" key={exercise.id}>
          <div className="strength-exercise__heading"><div><h3>{exercise.name}</h3><p>{exercise.sets} × {exercise.minReps}–{exercise.maxReps}{exercise.repLabel ? ` ${exercise.repLabel}` : ""}</p></div><ExerciseReference exercise={exercise.name} /></div>
          <div className="strength-exercise__history"><span>Previous: {previous ? `${previous.weight} lb · ${previous.reps.join(", ")} reps · ${previous.rir} RIR` : "Not logged"}</span><strong>Next: {target.weight || "Choose start"} lb · {exercise.sets} × {target.reps}</strong><small>{target.explanation}</small></div>
          <div className="strength-exercise__inputs">
            <label>Weight (lb)<input type="number" min="0" step="0.5" value={exercises[index].weight} onChange={(event) => updateExercise(index, { weight: Number(event.target.value) })} /></label>
            <label>Reps by set<input inputMode="numeric" value={exercises[index].reps.join(", ")} onChange={(event) => updateExercise(index, { reps: event.target.value.split(",").map((value) => Number(value.trim())).filter(Number.isFinite) })} /></label>
            <label>RIR<select value={exercises[index].rir} onChange={(event) => updateExercise(index, { rir: Number(event.target.value) })}>{[0,1,2,3,4,5].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Status<select value={exercises[index].status} onChange={(event) => updateExercise(index, { status: event.target.value as StrengthStatus })}><option value="completed">Completed</option><option value="modified">Modified</option><option value="skipped">Skipped</option></select></label>
          </div>
          <details><summary>Exercise note</summary><textarea value={exercises[index].note} onChange={(event) => updateExercise(index, { note: event.target.value })} /></details>
        </article>;
      })}</div>
      <fieldset className="strength-check-in"><legend>Session check-in</legend><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as StrengthStatus)}><option value="completed">Completed</option><option value="modified">Modified</option><option value="skipped">Skipped</option></select></label><label>Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value as StrengthSessionLog["difficulty"])}><option value="too-easy">Too easy</option><option value="appropriate">Appropriate</option><option value="too-hard">Too hard</option></select></label><label className="strength-check-in__check"><input type="checkbox" checked={concerningPain} onChange={(event) => setConcerningPain(event.target.checked)} /> Concerning pain</label><label className="strength-check-in__check"><input type="checkbox" checked={techniqueStable} onChange={(event) => setTechniqueStable(event.target.checked)} /> Technique remained stable</label><label className="strength-check-in__notes">Optional notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label><button className="run-log-form__save" type="submit">Save strength session</button></fieldset>
    </form>
    {savedRecommendation && <aside className={`strength-result strength-result--${savedRecommendation.action}`} role="status"><strong>{savedRecommendation.action === "progress" ? "Progress" : savedRecommendation.action === "reduce" ? "Reduce" : "Hold"}</strong><span>{savedRecommendation.explanation}</span></aside>}
  </section>;
}
