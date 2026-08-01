interface ExerciseReferenceProps {
  exercise: string;
}

type Pattern = "press" | "pull" | "squat" | "hinge" | "lunge" | "core" | "carry" | "mobility";

const getPattern = (exercise: string): Pattern => {
  const name = exercise.toLowerCase();
  if (/plank|dead bug|bird dog|mountain|twist|superman|knee raise|wood chop/.test(name)) return "core";
  if (/carry/.test(name)) return "carry";
  if (/squat|leg press|step-up|calf|bridge|lateral walk/.test(name)) return "squat";
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

export default function ExerciseReference({ exercise }: ExerciseReferenceProps) {
  const pattern = getPattern(exercise);
  const searchName = exercise.replace(/\s*\(.*\)$/, "");
  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${searchName} proper form tutorial`)}`;

  return (
    <details className="exercise-reference">
      <summary>Form &amp; video</summary>
      <div className="exercise-reference__content">
        <div>
          <strong>{exercise}</strong>
          <ul>
            {cues[pattern].map((cue) => <li key={cue}>{cue}</li>)}
          </ul>
          <a className="exercise-reference__video" href={videoUrl} target="_blank" rel="noreferrer">
            <span aria-hidden="true">▶</span>
            Watch demonstration
          </a>
        </div>
      </div>
      <p className="exercise-reference__note">Video results open on YouTube. Prefer demonstrations from qualified coaches or physical therapists.</p>
    </details>
  );
}
