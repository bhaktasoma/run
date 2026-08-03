import { useMemo, useState } from "react";
import activePlan from "../data/activePlan.ts";
import { averagePace, parseDurationMinutes } from "../domain/progression.ts";
import type { ActiveWorkout, CompletionStatus, PainState, RunEntry, RunWalkMethod, Terrain, WorkoutResult } from "../domain/training.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";

interface QuickLogFormProps {
  workout?: ActiveWorkout;
  initial?: RunEntry;
  entries?: RunEntry[];
  onSave: (entry: RunEntry) => void;
  onCancel?: () => void;
  onEditExisting?: (entry: RunEntry) => void;
}

const plannedWorkouts = activePlan.flatMap((week) => week.workouts).filter((item) => item.kind === "run" || item.kind === "benchmark");
const nowIso = () => new Date().toISOString();
const makeEntry = (workout?: ActiveWorkout): RunEntry => ({
  id: "", workoutId: workout?.id, activityDate: workout?.date ?? trainingDateIso(), createdAt: "", updatedAt: "",
  workout: workout?.title ?? "Unplanned run", status: "completed", plannedDistance: workout?.plannedMiles ? String(workout.plannedMiles) : "",
  actualDistance: workout?.plannedMiles ? String(workout.plannedMiles) : "", duration: "", averageRpe: "4", finalRpe: "4", pain: "none", result: "appropriate",
  notes: "", averageHeartRate: "", maximumHeartRate: "", elevationGain: "", averageCadence: "", terrain: "", runWalkMethod: "unspecified", runWalkPattern: "", conditions: "",
});

export default function QuickLogForm({ workout, initial, entries = [], onSave, onCancel, onEditExisting }: QuickLogFormProps) {
  const [entry, setEntry] = useState<RunEntry>(initial ?? makeEntry(workout));
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState<RunEntry>();
  const dateWorkouts = useMemo(() => plannedWorkouts.filter((item) => item.date === entry.activityDate), [entry.activityDate]);
  const pace = averagePace(entry.actualDistance, entry.duration);
  const update = <K extends keyof RunEntry>(key: K, value: RunEntry[K]) => { setDuplicate(undefined); setError(""); setEntry((current) => ({ ...current, [key]: value })); };
  const selectDate = (activityDate: string) => {
    const match = plannedWorkouts.find((item) => item.date === activityDate);
    setEntry((current) => ({ ...current, activityDate, workoutId: match?.id, workout: match?.title ?? "Unplanned run", plannedDistance: match?.plannedMiles ? String(match.plannedMiles) : "" }));
    setDuplicate(undefined); setError("");
  };
  const selectWorkout = (workoutId: string) => {
    const match = dateWorkouts.find((item) => item.id === workoutId);
    setEntry((current) => ({ ...current, workoutId: match?.id, workout: match?.title ?? "Unplanned run", plannedDistance: match?.plannedMiles ? String(match.plannedMiles) : "" }));
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const distance = Number(entry.actualDistance);
    if (!entry.activityDate || entry.activityDate > trainingDateIso()) return setError("Workout date cannot be in the future.");
    if (!Number.isFinite(distance) || distance < 0) return setError("Distance must be a valid nonnegative number.");
    if ((entry.status === "completed" || entry.status === "partial") && distance <= 0) return setError("Completed or partially completed runs require a positive distance.");
    const minutes = parseDurationMinutes(entry.duration);
    if ((entry.status === "completed" || entry.status === "partial") && (!minutes || minutes <= 0)) return setError("Enter duration as MM:SS or H:MM:SS, such as 42:00 or 1:05:30.");
    if (entry.duration && minutes === null) return setError("Enter duration as MM:SS or H:MM:SS.");
    if ([entry.averageRpe, entry.finalRpe].some((value) => Number(value) < 1 || Number(value) > 10)) return setError("RPE must remain between 1 and 10.");
    const existing = entries.find((item) => item.id !== entry.id && item.activityDate === entry.activityDate && item.workoutId === entry.workoutId);
    if (existing) { setDuplicate(existing); return setError("A run is already logged for this workout and date."); }
    const timestamp = nowIso();
    onSave({ ...entry, id: entry.id || `run-${entry.activityDate}-${crypto.randomUUID()}`, createdAt: entry.createdAt || timestamp, updatedAt: timestamp });
  };

  return <form className="quick-log" onSubmit={submit}>
    <div className="quick-log__grid quick-log__grid--primary">
      <label>Workout date<input type="date" required max={trainingDateIso()} value={entry.activityDate} onChange={(event) => selectDate(event.target.value)} /></label>
      <label>Planned workout<select value={entry.workoutId ?? ""} onChange={(event) => selectWorkout(event.target.value)}><option value="">Unplanned run</option>{dateWorkouts.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      <label>Status<select value={entry.status} onChange={(event) => update("status", event.target.value as CompletionStatus)}><option value="completed">Completed</option><option value="partial">Partially completed</option><option value="skipped">Skipped</option><option value="substituted">Substituted</option></select></label>
      <label>Actual miles<input type="number" min="0" step="0.01" inputMode="decimal" value={entry.actualDistance} onChange={(event) => update("actualDistance", event.target.value)} /></label>
      <label>Duration<input inputMode="numeric" placeholder="42:00 or 1:05:30" value={entry.duration} onChange={(event) => update("duration", event.target.value)} /></label>
      <label>Session RPE<select value={entry.averageRpe} onChange={(event) => update("averageRpe", event.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Final-mile RPE<select value={entry.finalRpe} onChange={(event) => update("finalRpe", event.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Pain<select value={entry.pain} onChange={(event) => update("pain", event.target.value as PainState)}><option value="none">None</option><option value="mild">Mild</option><option value="concerning">Concerning</option></select></label>
      <label>Result<select value={entry.result} onChange={(event) => update("result", event.target.value as WorkoutResult)}><option value="easier">Easier than expected</option><option value="appropriate">Appropriate</option><option value="too-hard">Too hard</option></select></label>
    </div>
    <p className="quick-log__pace"><span>Calculated average pace</span><strong>{pace ?? "—"}</strong></p>
    <details className="quick-log__optional"><summary>Watch and route details</summary><div className="quick-log__grid quick-log__grid--optional">
      <label>Average heart rate<input type="number" min="1" value={entry.averageHeartRate} onChange={(event) => update("averageHeartRate", event.target.value)} /></label>
      <label>Maximum heart rate<input type="number" min="1" value={entry.maximumHeartRate} onChange={(event) => update("maximumHeartRate", event.target.value)} /></label>
      <label>Elevation gain (ft)<input type="number" min="0" value={entry.elevationGain} onChange={(event) => update("elevationGain", event.target.value)} /></label>
      <label>Average cadence<input type="number" min="1" value={entry.averageCadence} onChange={(event) => update("averageCadence", event.target.value)} /></label>
      <label>Terrain<select value={entry.terrain} onChange={(event) => update("terrain", event.target.value as Terrain)}><option value="">Not specified</option><option value="flat">Flat</option><option value="rolling">Rolling</option><option value="hilly">Hilly</option><option value="trail">Trail</option><option value="treadmill">Treadmill</option></select></label>
      <label>Run/walk method<select value={entry.runWalkMethod} onChange={(event) => update("runWalkMethod", event.target.value as RunWalkMethod)}><option value="unspecified">Not specified</option><option value="continuous">Continuous</option><option value="structured">Structured intervals</option><option value="unstructured">Unstructured walk breaks</option></select></label>
      <label>Run/walk pattern<input placeholder="4 min run / 1 min walk" value={entry.runWalkPattern} onChange={(event) => update("runWalkPattern", event.target.value)} /></label>
      <label>Temperature or conditions<input value={entry.conditions} onChange={(event) => update("conditions", event.target.value)} /></label>
      <label className="quick-log__notes">Notes<textarea value={entry.notes} onChange={(event) => update("notes", event.target.value)} /></label>
    </div></details>
    {error && <p className="run-log-form__error" role="alert">{error}</p>}
    {duplicate && onEditExisting && <button className="run-log-form__cancel" type="button" onClick={() => onEditExisting(duplicate)}>Edit existing entry</button>}
    <div className="run-log-form__actions"><button className="run-log-form__save" type="submit">{initial ? "Update" : "Save completion"}</button>{onCancel && <button className="run-log-form__cancel" type="button" onClick={onCancel}>Cancel</button>}</div>
  </form>;
}
