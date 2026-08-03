import type { ActiveWeek, ActiveWorkout } from "../domain/training.ts";

const DAY = 86_400_000;
const toIso = (date: Date) => date.toISOString().slice(0, 10);
const displayDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const workout = (
  date: Date,
  title: string,
  kind: ActiveWorkout["kind"],
  plannedMiles: number,
  targetRpe: string,
  purpose: string,
  extra: Partial<ActiveWorkout> = {},
): ActiveWorkout => ({ id: toIso(date), date: toIso(date), title, kind, plannedMiles, targetRpe, purpose, ...extra });

interface WeekBlueprint {
  miles: [number, number, number, number];
  objective: string;
  longRunPurpose: string;
  benchmark?: boolean;
  strides?: boolean;
}

const blueprints: WeekBlueprint[] = [
  { miles: [0, 0, 0, 0], objective: "Recover from the July 26 half marathon", longRunPurpose: "No long run; absorb the race." },
  { miles: [3, 3, 2, 4], objective: "Return gently with four conversational runs", longRunPurpose: "Reintroduce easy time on feet." },
  { miles: [3, 4, 3, 5], objective: "Rebuild an easy-running rhythm", longRunPurpose: "Extend only while effort stays easy." },
  { miles: [3, 4, 3, 6], objective: "Add a little endurance without intensity", longRunPurpose: "Practice relaxed pacing and recovery." },
  { miles: [3, 3, 3, 6], objective: "Consolidate and add relaxed coordination", longRunPurpose: "Hold durability while reducing weekday load.", strides: true },
  { miles: [4, 4, 3, 7], objective: "Resume gradual aerobic development", longRunPurpose: "Build endurance at conversational effort." },
  { miles: [4, 5, 3, 8], objective: "Build consistency before adding workouts", longRunPurpose: "Practice fueling if the run exceeds 75 minutes." },
  { miles: [4, 5, 4, 9], objective: "Check aerobic progress at the same easy effort", longRunPurpose: "Finish controlled, never depleted.", benchmark: true },
];

const buildWeek = (blueprint: WeekBlueprint, index: number): ActiveWeek => {
  const start = new Date(Date.UTC(2026, 6, 27 + index * 7));
  const dates = Array.from({ length: 7 }, (_, offset) => new Date(start.getTime() + offset * DAY));
  const [monday, wednesday, thursday, saturday] = blueprint.miles;
  const recoveryWeek = index === 0;
  const easyPace = "Secondary guide: about 13:30–14:30/mi only when RPE stays easy";
  const workouts = recoveryWeek ? [
    workout(dates[0], "Post-race rest", "rest", 0, "RPE 1–2", "Let soreness and fatigue settle."),
    workout(dates[1], "Gentle walk or rest", "rest", 0, "RPE 1–2", "Promote circulation without training stress.", { duration: "10–20 min" }),
    workout(dates[2], "Rest", "rest", 0, "RPE 1", "Continue recovery."),
    workout(dates[3], "Gentle walk or rest", "rest", 0, "RPE 1–2", "Move only if it feels restorative.", { duration: "15–25 min" }),
    workout(dates[4], "Rest", "rest", 0, "RPE 1", "Continue recovery."),
    workout(dates[5], "Easy walk", "rest", 0, "RPE 1–2", "Check that normal movement feels comfortable.", { duration: "20–30 min" }),
    workout(dates[6], "Rest", "rest", 0, "RPE 1", "Finish the recovery week fresher."),
  ] : [
    workout(dates[0], "Easy run", "run", monday, "RPE 3–4", "Build aerobic consistency without lingering fatigue.", { paceGuidance: easyPace, steps: ["5 minutes very easy", `${monday} miles conversational`, "Walk 3–5 minutes to cool down"] }),
    workout(dates[1], "Runner strength — normal", "strength", 0, "RPE 6", "Build hip, calf, and single-leg strength away from the long run.", { duration: "30–40 min", steps: ["Squat or sit-to-stand: 3×6–8", "Romanian deadlift: 3×8", "Split squat: 3×8/side", "Calf raise: 3×12", "Stop with 2–3 reps in reserve"] }),
    workout(dates[2], blueprint.benchmark ? "Same-route easy benchmark" : "Easy run", blueprint.benchmark ? "benchmark" : "run", wednesday, "RPE 3–4", blueprint.benchmark ? "Compare pace on the same route at the same easy effort; do not race." : "Accumulate relaxed aerobic volume.", { paceGuidance: easyPace, steps: blueprint.benchmark ? ["Use the same familiar route", "Hold RPE 3–4 throughout", "Record time, pace, conditions, and recovery"] : undefined }),
    workout(dates[3], blueprint.strides ? "Easy run + 4 × 20-sec strides" : "Recovery run", "run", thursday, blueprint.strides ? "Easy RPE 3; strides RPE 6–7" : "RPE 2–3", blueprint.strides ? "Add relaxed coordination only after consistent easy running." : "Add easy volume while protecting recovery.", { paceGuidance: "Easy effort controls the pace", steps: blueprint.strides ? ["Complete the easy miles first", "Run 4 relaxed 20-second accelerations", "Walk or jog fully between strides"] : undefined }),
    workout(dates[4], "Runner strength — light", "strength", 0, "RPE 4–5", "Maintain movement quality without tiring the legs before the long run.", { duration: "20–25 min", steps: ["Glute bridge: 2×10", "Low step-up: 2×8/side", "Calf raise: 2×10", "Side plank: 2×20 sec/side", "Keep every repetition comfortable"] }),
    workout(dates[5], "Long easy run", "run", saturday, "RPE 3–4", blueprint.longRunPurpose, { paceGuidance: easyPace, isLongRun: true, steps: ["Start slower than normal", `${saturday} miles at conversational effort`, "Walk breaks are welcome", "Stop if pain changes running form"] }),
    workout(dates[6], "Rest or gentle walk", "rest", 0, "RPE 1–2", "Absorb the week and assess long-run recovery.", { duration: "Optional 15–30 min" }),
  ];

  const end = dates[6];
  return {
    id: `2026-W${String(31 + index).padStart(2, "0")}`,
    label: `${displayDate(start)} – ${displayDate(end)}`,
    status: index < 2 ? "Prescribed" : "Adjustable",
    plannedMiles: blueprint.miles.reduce((sum, miles) => sum + miles, 0),
    objective: blueprint.objective,
    workouts,
  };
};

const activePlan = blueprints.map(buildWeek);

export default activePlan;
