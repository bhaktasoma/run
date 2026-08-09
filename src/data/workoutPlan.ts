import type { StrengthExercise, StrengthSession } from "../domain/strength.ts";

const exercise = (id: string, name: string, sets: number, minReps: number, maxReps: number, options: Partial<StrengthExercise> = {}): StrengthExercise => ({ id, name, sets, minReps, maxReps, increment: options.lowerBody ? 5 : 2.5, ...options });

export const strengthSessions: StrengthSession[] = [
  {
    id: "full-body-a", title: "Full Body A", day: "Monday", duration: "45–55 min", required: true,
    exercises: [
      exercise("goblet-squat", "Goblet squat or equivalent", 3, 6, 10, { lowerBody: true }),
      exercise("rdl", "Romanian deadlift", 3, 6, 10, { lowerBody: true }),
      exercise("split-squat", "Split squat", 2, 8, 10, { lowerBody: true, repLabel: "per leg" }),
      exercise("standing-calf", "Standing calf raise", 2, 10, 15, { lowerBody: true }),
      exercise("row-a", "Chest-supported or cable row", 3, 8, 12),
      exercise("db-press", "Push-up or dumbbell press", 3, 6, 12),
      exercise("dead-bug", "Dead bug", 2, 8, 12, { core: true, repLabel: "per side" }),
      exercise("pallof", "Pallof press", 2, 10, 12, { core: true, repLabel: "per side" }),
    ],
  },
  {
    id: "full-body-b", title: "Full Body B", day: "Thursday", duration: "40–50 min", required: true,
    exercises: [
      exercise("step-up", "Step-up", 3, 8, 10, { lowerBody: true, repLabel: "per leg" }),
      exercise("hip-thrust", "Hip thrust or glute bridge", 3, 8, 12, { lowerBody: true }),
      exercise("hamstring-curl", "Hamstring curl", 2, 10, 12, { lowerBody: true }),
      exercise("single-leg-calf", "Single-leg calf raise", 2, 10, 15, { lowerBody: true, repLabel: "per leg" }),
      exercise("lat-pulldown", "Lat pulldown or assisted pull-up", 3, 8, 12),
      exercise("shoulder-press", "Dumbbell overhead press", 3, 6, 12),
      exercise("side-plank", "Side plank", 2, 20, 45, { core: true, repLabel: "seconds per side" }),
      exercise("suitcase-carry", "Farmer or suitcase carry", 2, 30, 45, { core: true, repLabel: "seconds per side" }),
    ],
  },
  {
    id: "aesthetic", title: "Optional Core / Back", day: "Sunday", duration: "15 min", required: false,
    exercises: [
      exercise("optional-row", "Cable or band row", 2, 10, 15),
      exercise("reverse-crunch", "Reverse crunch", 2, 10, 15, { core: true }),
      exercise("cable-crunch", "Cable crunch or controlled curl-up", 2, 10, 15, { core: true }),
      exercise("bird-dog", "Side plank or bird dog", 2, 20, 30, { core: true, repLabel: "seconds per side" }),
      exercise("optional-suitcase", "Suitcase carry", 2, 30, 45, { core: true, repLabel: "seconds per side" }),
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
