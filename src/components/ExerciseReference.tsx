import { exerciseVideoLabel, exerciseVideoUrl, SAFE_EXTERNAL_LINK_PROPS } from "../data/routines.ts";

interface ExerciseReferenceProps {
  exercise: string;
  label?: string;
  prescription?: string;
  row?: boolean;
}

type Pattern = "press" | "pull" | "squat" | "hinge" | "lunge" | "core" | "carry" | "mobility";

const getPattern = (exercise: string): Pattern => {
  const name = exercise.toLowerCase();
  if (/plank|dead bug|bird dog|mountain|twist|superman|knee raise|wood chop|crunch|pallof/.test(name)) return "core";
  if (/carry/.test(name)) return "carry";
  if (/squat|leg press|step-up|calf|bridge|hip thrust|lateral walk|abduction/.test(name)) return "squat";
  if (/deadlift|hamstring curl/.test(name)) return "hinge";
  if (/lunge|split squat/.test(name)) return "lunge";
  if (/row|pulldown|pull-up|face pull|curl|reverse fly/.test(name)) return "pull";
  if (/press|push-up|pushdown|extension|raise|arnold/.test(name)) return "press";
  return "mobility";
};

const cues: Record<Pattern, string[]> = {
  press: ["Brace your core and keep ribs stacked.", "Move with control through a comfortable range.", "Keep shoulders down and away from your ears."],
  pull: ["Start with a tall chest and neutral spine.", "Lead with the elbows instead of the hands.", "Pause briefly, then return the weight with control."],
  squat: ["Keep your whole foot grounded.", "Track knees in the same direction as your toes.", "Stay tall and control both the lowering and rising phases."],
  hinge: ["Push the hips back with a neutral spine.", "Keep the weight close to your body.", "Stand by driving the floor away and squeezing the glutes."],
  lunge: ["Take a stable stance and keep the front foot planted.", "Lower under control with the knee tracking over the toes.", "Drive through the front foot to return."],
  core: ["Brace as if preparing for a gentle punch.", "Keep the spine and pelvis controlled.", "Stop the set when you can no longer hold position."],
  carry: ["Stand tall with level shoulders and hips.", "Brace the trunk without holding your breath.", "Use short, controlled steps."],
  mobility: ["Move slowly into a comfortable range.", "Keep breathing instead of forcing the position.", "Stop before sharp pain or pinching."],
};

export default function ExerciseReference({ exercise, label, prescription, row = false }: ExerciseReferenceProps) {
  const pattern = getPattern(exercise);
  const videoUrl = exerciseVideoUrl(exercise);

  const referenceContent = <>
    <div className="exercise-reference__content">
      <div>
        <strong>{exercise}</strong>
        <ul>
          {cues[pattern].map((cue) => <li key={cue}>{cue}</li>)}
        </ul>
        <a className="exercise-reference__video" href={videoUrl} {...SAFE_EXTERNAL_LINK_PROPS} aria-label={exerciseVideoLabel(exercise)}>
          <span aria-hidden="true">▶</span>
          View demonstration <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
    <p className="exercise-reference__note">Video results open on YouTube. Prefer demonstrations from qualified coaches or physical therapists.</p>
  </>;

  if (row) return (
    <details className="exercise-reference exercise-reference--row">
      <summary title={`View form tips and video for ${exercise}`}>
        <strong>{exercise}</strong>
        <span>{prescription}</span>
        <b>{label ?? "View"}</b>
      </summary>
      {referenceContent}
    </details>
  );

  return (
    <details className="exercise-reference">
      <summary className={label ? "exercise-reference__trigger--text" : undefined} title={`View form tips and video for ${exercise}`}>
        {label ? <span>{label}</span> : <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
          <path d="M2.2 12s3.6-6 9.8-6 9.8 6 9.8 6-3.6 6-9.8 6-9.8-6-9.8-6Z" />
          <circle cx="12" cy="12" r="2.8" />
        </svg>}
        <span className="sr-only">{label ? " form tips and video for " : "View form tips and video for "}{exercise}</span>
      </summary>
      {referenceContent}
    </details>
  );
}
