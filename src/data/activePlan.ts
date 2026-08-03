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
  { miles: [3, 3, 2, 5], objective: "Recovery week: absorb training and add relaxed coordination", longRunPurpose: "Reduce load while maintaining comfortable durability.", strides: true },
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
    workout(dates[0], "Easy run + Full Body A", "run", monday, "Run RPE 3–4; strength with 2–3 RIR", "Build aerobic consistency and balanced strength early in the week.", { paceGuidance: easyPace, steps: ["5 minutes very easy", `${monday} miles conversational`, "Full Body A afterward or later in the day", "Walk 3–5 minutes to cool down"] }),
    workout(dates[1], "Rest / normal activity", "rest", 0, "RPE 1–2", "Keep this day available for quality running when later blocks introduce it."),
    workout(dates[2], blueprint.benchmark ? "Same-route easy benchmark" : "Easy run", blueprint.benchmark ? "benchmark" : "run", wednesday, "RPE 3–4", blueprint.benchmark ? "Compare pace on the same route at the same easy effort; do not race." : "Accumulate relaxed aerobic volume.", { paceGuidance: easyPace, steps: blueprint.benchmark ? ["Use the same familiar route", "Hold RPE 3–4 throughout", "Record time, pace, conditions, and recovery"] : undefined }),
    workout(dates[3], blueprint.strides ? "Easy run + strides + Full Body B" : "Recovery run + Full Body B", "run", thursday, blueprint.strides ? "Easy RPE 3; strides RPE 6–7; strength with 2–3 RIR" : "Run RPE 2–3; strength with 2–3 RIR", blueprint.strides ? "Add relaxed coordination and the second balanced strength session." : "Add easy volume and the second balanced strength session.", { paceGuidance: "Easy effort controls the pace", steps: blueprint.strides ? ["Complete the easy miles first", "Run 4 relaxed 20-second accelerations", "Walk or jog fully between strides", "Complete Full Body B afterward or later"] : ["Complete the recovery run", "Complete Full Body B afterward or later"] }),
    workout(dates[4], "Complete rest", "rest", 0, "RPE 1", "Protect freshness for Saturday’s long run."),
    workout(dates[5], "Long easy run", "run", saturday, "RPE 3–4", blueprint.longRunPurpose, { paceGuidance: easyPace, isLongRun: true, steps: ["Start slower than normal", `${saturday} miles at conversational effort`, "Walk breaks are welcome", "Stop if pain changes running form"] }),
    workout(dates[6], "Rest or optional Upper / Aesthetic", "strength", 0, "RPE 1–2 or strength RPE 5–6", "Absorb the week; add the optional session only when recovery is good.", { duration: "Optional 25–35 min" }),
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
