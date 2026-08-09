export interface RoutineStep {
  id: string;
  name: string;
  prescription: string;
  demonstration?: boolean;
}

export interface GuidedRoutine {
  id: string;
  title: string;
  duration: string;
  steps: RoutineStep[];
  note?: string;
}

const step = (id: string, name: string, prescription: string, demonstration = true): RoutineStep => ({ id, name, prescription, demonstration });

export const strengthWarmups: Record<"full-body-a" | "full-body-b" | "aesthetic", GuidedRoutine> = {
  "full-body-a": { id: "warmup-a", title: "Full Body A warm-up", duration: "About 7 min", steps: [step("walk", "Brisk walk or march", "60 seconds", false), step("cat-cow", "Cat-cow", "6 repetitions"), step("ankle-rock", "Knee-to-wall ankle rocks", "8 per side"), step("good-morning", "Bodyweight good mornings", "10 repetitions"), step("glute-bridge", "Glute bridges", "10 repetitions"), step("reverse-lunge", "Supported alternating reverse lunges", "5 per side"), step("bodyweight-squat", "Bodyweight squats", "8 repetitions")], note: "Then perform one light practice set of the squat and Romanian deadlift." },
  "full-body-b": { id: "warmup-b", title: "Full Body B warm-up", duration: "About 7 min", steps: [step("walk", "Brisk walk or march", "60 seconds", false), step("ankle-rock", "Ankle rocks", "8 per side"), step("hip-switch", "90/90 hip switches", "6 per side"), step("low-step-up", "Low step-ups", "6 per side"), step("glute-bridge", "Glute bridges", "10 repetitions"), step("calf-raise", "Calf raises", "10 repetitions"), step("band-pull-apart", "Band pull-aparts", "10 repetitions")], note: "Then perform one light practice set of the step-up and hip-thrust exercises." },
  aesthetic: { id: "warmup-sunday", title: "Sunday warm-up", duration: "About 6 min", steps: [step("march", "March or easy cardio", "60 seconds", false), step("cat-cow", "Cat-cow", "6 repetitions"), step("open-book", "Open-book rotation", "5 per side"), step("wall-slide", "Wall slides", "8 repetitions"), step("band-pull-apart", "Band pull-aparts", "10 repetitions"), step("bird-dog", "Bird dogs", "5 per side")], note: "Then perform one light practice set of the first pulling exercise." },
};

export const fullBodyCooldown: GuidedRoutine = { id: "cooldown-full", title: "Full-body cooldown", duration: "About 6 min", steps: [step("slow-walk", "Slow walking and relaxed breathing", "60 seconds", false), step("calf-stretch", "Calf stretch", "30 seconds per side"), step("hip-flexor-stretch", "Half-kneeling hip-flexor stretch", "30 seconds per side"), step("quad-stretch", "Quadriceps stretch", "30 seconds per side"), step("hamstring-stretch", "Hamstring stretch", "30 seconds per side"), step("figure-four", "Figure-four glute stretch", "30 seconds per side")], note: "Stretch gently and never force a painful range." };

export const sundayCooldown: GuidedRoutine = { id: "cooldown-sunday", title: "Sunday cooldown", duration: "About 6 min", steps: [step("breathing", "Relaxed breathing", "45 seconds", false), step("child-side", "Child’s pose with side reach", "30 seconds per side"), step("doorway", "Doorway chest stretch", "30 seconds per side"), step("lat-stretch", "Kneeling lat stretch", "30 seconds per side"), step("open-book", "Open-book rotation", "5 slow repetitions per side"), step("neck-rotation", "Gentle neck rotation", "5 per side")], note: "Stretch gently and never force a painful range." };

export const runWarmup: GuidedRoutine = { id: "run-warmup", title: "Run warm-up", duration: "5–8 min", steps: [step("easy-jog", "Brisk walk or very easy jog", "2–3 minutes", false), step("ankle-rock", "Knee-to-wall ankle rocks", "8 per side"), step("leg-swings", "Leg swings", "8–10 each direction"), step("walking-lunge", "Walking lunges", "5–6 per side"), step("calf-raise", "Calf raises", "10–12 repetitions"), step("glute-bridge", "Glute bridges", "10 repetitions")], note: "Use dynamic movement before running; avoid prolonged static stretching." };
export const qualityStrides = step("quality-strides", "Relaxed strides", "2–4 short strides with full recovery");
export const runCooldown: GuidedRoutine = { id: "run-cooldown", title: "Run cooldown", duration: "About 5 min", steps: [step("slow-walk", "Walk slowly", "2–3 minutes", false), step("calf-stretch", "Calf stretch", "20–30 seconds per side"), step("hip-flexor-stretch", "Hip-flexor stretch", "20–30 seconds per side"), step("quad-stretch", "Quadriceps stretch", "20–30 seconds per side"), step("figure-four", "Figure-four glute stretch", "20–30 seconds per side")], note: "Cooldown stretching is recommended but optional and does not guarantee injury prevention." };

export const mobilityRoutine: GuidedRoutine = { id: "mobility-8", title: "Mobility reset", duration: "8–10 min", steps: [step("ankle-rock", "Knee-to-wall ankle mobility", "8 per side"), step("hip-switch", "90/90 hip switches", "6 per side"), step("adductor-rock", "Adductor rock-back", "8 per side"), step("hip-flexor-mobility", "Half-kneeling hip-flexor mobility", "30 seconds per side"), step("open-book", "Open-book thoracic rotation", "5 per side"), step("cat-cow", "Cat-cow", "6 repetitions")], note: "Use no more than twice weekly after an easy run, on a recovery day, or on Sunday when strength is suppressed." };

export const kneeResilience = {
  title: "Knee and Lower-Leg Resilience",
  patterns: ["Controlled step-down", "Split squat", "Hamstring curl", "Calf raise", "Tibialis raise", "Lateral band walk", "Single-leg balance"],
  safety: "Stop and seek appropriate professional assessment for knee swelling, locking, giving way, sharp pain or symptoms that progressively worsen.",
};

const trustedQueries: Record<string, string> = {
  "Romanian deadlift": "Romanian deadlift form hospital sports medicine",
  "Pallof press": "Pallof press physical therapist",
  "Knee-to-wall ankle rocks": "knee to wall ankle mobility physical therapist",
  "Knee-to-wall ankle mobility": "knee to wall ankle mobility physical therapist",
};

export function exerciseVideoUrl(exercise: string) {
  const exact = exercise.replace(/\s+or\s+.*$/i, "").replace(/\s*\(.*\)$/, "");
  const query = trustedQueries[exact] ?? `${exact} physical therapist proper form`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export const SAFE_EXTERNAL_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;
export const exerciseVideoLabel = (exercise: string) => `View ${exercise} demonstration on YouTube (opens in a new tab)`;
