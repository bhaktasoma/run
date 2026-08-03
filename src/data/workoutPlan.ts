import type { StrengthExercise, StrengthSession } from "../domain/strength.ts";

const exercise = (id: string, name: string, sets: number, minReps: number, maxReps: number, options: Partial<StrengthExercise> = {}): StrengthExercise => ({ id, name, sets, minReps, maxReps, increment: options.lowerBody ? 5 : 2.5, ...options });

export const strengthSessions: StrengthSession[] = [
  {
    id: "full-body-a", title: "Full Body A", day: "Monday", duration: "45–55 min", required: true,
    exercises: [
      exercise("squat-trap", "Squat or trap-bar deadlift", 3, 5, 7, { lowerBody: true }),
      exercise("rdl", "Romanian deadlift", 3, 6, 8, { lowerBody: true }),
      exercise("standing-calf", "Standing straight-knee calf raise", 3, 8, 12, { lowerBody: true }),
      exercise("db-press", "Dumbbell press or chest press", 3, 8, 10),
      exercise("row-a", "Cable, dumbbell, or chest-supported row", 3, 8, 10),
      exercise("lateral-raise-a", "Lateral raise", 2, 12, 15),
      exercise("pallof", "Pallof press", 2, 10, 12, { core: true, repLabel: "per side" }),
      exercise("suitcase-carry", "Suitcase carry", 2, 30, 40, { core: true, repLabel: "metres per side" }),
    ],
  },
  {
    id: "full-body-b", title: "Full Body B", day: "Thursday", duration: "40–50 min", required: true,
    exercises: [
      exercise("split-squat", "Bulgarian split squat or step-up", 3, 6, 8, { lowerBody: true, repLabel: "per leg" }),
      exercise("hip-thrust", "Hip thrust or glute bridge", 3, 8, 12, { lowerBody: true }),
      exercise("hamstring-curl", "Hamstring curl", 2, 8, 12, { lowerBody: true }),
      exercise("seated-calf", "Seated bent-knee calf raise", 3, 10, 15, { lowerBody: true }),
      exercise("lat-pulldown", "Lat pulldown or assisted pull-up", 3, 8, 10),
      exercise("row-b", "Light cable or chest-supported row", 2, 10, 12),
      exercise("shoulder-press", "Dumbbell shoulder press", 3, 8, 10),
      exercise("dead-bug", "Dead bug", 2, 8, 10, { core: true, repLabel: "per side" }),
      exercise("side-plank", "Side plank", 2, 20, 40, { core: true, repLabel: "seconds per side" }),
    ],
  },
  {
    id: "aesthetic", title: "Upper / Aesthetic", day: "Sunday", duration: "25–35 min", required: false,
    exercises: [
      exercise("incline-press", "Incline dumbbell press", 3, 8, 12),
      exercise("seated-row", "Seated cable row", 2, 8, 12),
      exercise("lateral-raise-c", "Lateral raise", 3, 12, 20),
      exercise("reverse-fly", "Reverse fly or face pull", 2, 12, 15),
      exercise("biceps", "Biceps curl", 2, 10, 15),
      exercise("triceps", "Triceps pushdown", 2, 10, 15),
      exercise("hip-abduction", "Optional hip abduction", 2, 12, 20, { lowerBody: true }),
    ],
  },
];

export const abdominalExercises: Record<"cable-crunch" | "hanging-knee-raise" | "reverse-crunch", StrengthExercise> = {
  "cable-crunch": exercise("cable-crunch", "Cable crunch", 3, 10, 15, { core: true }),
  "hanging-knee-raise": exercise("hanging-knee-raise", "Hanging knee raise", 3, 8, 12, { core: true }),
  "reverse-crunch": exercise("reverse-crunch", "Reverse crunch", 3, 10, 15, { core: true }),
};

export const warmupGuides = {
  easyRun: { title: "Before an easy run · 3–5 min", items: ["Ankle rocks: 8–10 per side", "Front/back leg swings: 10 per side", "Lateral leg swings: 10 per side", "Walking lunges: 6 per side", "Begin running gradually"] },
  qualityRun: { title: "Before quality or long running · 5–7 min", items: ["Ankle rocks", "Front/back and lateral leg swings", "Walking lunges", "Marching", "Optional skips, high knees, or relaxed strides when appropriate"] },
  strength: { title: "Before strength training", items: ["Several minutes of easy movement", "Bodyweight versions of the first exercises", "Two or three progressively heavier warm-up sets for the first compound lift"] },
  after: { title: "After training · optional", items: ["Calf stretch or ankle mobility", "Hip-flexor stretch", "Adductor rock-back", "Hip rotation", "Thoracic rotation"] },
};

export default strengthSessions;
