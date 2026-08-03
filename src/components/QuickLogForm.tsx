import { useState } from "react";
import type { ActiveWorkout, CompletionStatus, PainState, RunEntry, WorkoutResult } from "../domain/training.ts";
import { trainingDateIso } from "../utils/trainingDate.ts";

interface QuickLogFormProps {
  workout?: ActiveWorkout;
  initial?: RunEntry;
  onSave: (entry: RunEntry) => void;
  onCancel?: () => void;
}

const makeEntry = (workout?: ActiveWorkout): RunEntry => ({
  id: "",
  workoutId: workout?.id,
  date: workout?.date ?? trainingDateIso(),
  workout: workout?.title ?? "Run",
  status: "completed",
  plannedDistance: workout?.plannedMiles ? String(workout.plannedMiles) : "",
  actualDistance: workout?.plannedMiles ? String(workout.plannedMiles) : "0",
  duration: "",
  averageRpe: "4",
  finalRpe: "4",
  pain: "none",
  result: "appropriate",
  notes: "",
  fueling: "",
  weatherTerrain: "",
});

export default function QuickLogForm({ workout, initial, onSave, onCancel }: QuickLogFormProps) {
  const [entry, setEntry] = useState<RunEntry>(initial ?? makeEntry(workout));
  const [error, setError] = useState("");
  const update = <K extends keyof RunEntry>(key: K, value: RunEntry[K]) => setEntry((current) => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const distance = Number(entry.actualDistance);
    if (!Number.isFinite(distance) || distance < 0 || (entry.status !== "skipped" && distance <= 0 && workout?.kind !== "strength")) {
      setError("Enter a valid distance. Use 0 only for a skipped or strength session.");
      return;
    }
    if (!/^\d+:[0-5]\d:[0-5]\d$/.test(entry.duration)) {
      setError("Duration must use H:MM:SS, for example 0:42:00.");
      return;
    }
    onSave({ ...entry, id: entry.id || `${entry.date}-${Date.now()}` });
  };

  return (
    <form className="quick-log" onSubmit={submit}>
      <div className="quick-log__grid">
        <label>Status<select value={entry.status} onChange={(event) => update("status", event.target.value as CompletionStatus)}><option value="completed">Completed</option><option value="partial">Partially completed</option><option value="skipped">Skipped</option><option value="substituted">Substituted</option></select></label>
        <label>Actual miles<input required type="number" min="0" step="0.01" inputMode="decimal" value={entry.actualDistance} onChange={(event) => update("actualDistance", event.target.value)} /></label>
        <label>Duration<input required inputMode="numeric" placeholder="0:42:00" value={entry.duration} onChange={(event) => update("duration", event.target.value)} /></label>
        <label>Average RPE<select value={entry.averageRpe} onChange={(event) => update("averageRpe", event.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Final RPE<select value={entry.finalRpe} onChange={(event) => update("finalRpe", event.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Pain<select value={entry.pain} onChange={(event) => update("pain", event.target.value as PainState)}><option value="none">None</option><option value="mild">Mild</option><option value="concerning">Concerning</option></select></label>
        <label>Result<select value={entry.result} onChange={(event) => update("result", event.target.value as WorkoutResult)}><option value="easier">Easier than expected</option><option value="appropriate">Appropriate</option><option value="too-hard">Too hard</option></select></label>
      </div>
      <details className="quick-log__optional">
        <summary>Optional details</summary>
        <div className="quick-log__grid quick-log__grid--optional">
          <label>Notes<textarea value={entry.notes} onChange={(event) => update("notes", event.target.value)} /></label>
          <label>Fueling<textarea value={entry.fueling} onChange={(event) => update("fueling", event.target.value)} /></label>
          <label>Weather and terrain<textarea value={entry.weatherTerrain} onChange={(event) => update("weatherTerrain", event.target.value)} /></label>
        </div>
      </details>
      {error && <p className="run-log-form__error" role="alert">{error}</p>}
      <div className="run-log-form__actions"><button className="run-log-form__save" type="submit">{initial ? "Update" : "Save completion"}</button>{onCancel && <button className="run-log-form__cancel" type="button" onClick={onCancel}>Cancel</button>}</div>
    </form>
  );
}
