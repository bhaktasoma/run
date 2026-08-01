import type { Plan } from "../../types";

const DASH = "—";

const plan: Plan = {
  id: "2026-09",
  title: "September Training Plan",
  intro: "Your September goal is not yet to run 9–10 min/mile. It’s to build the engine that eventually gets you there.",
  priorities: [
    "5 running days per week",
    "One quality workout per week",
    "Long run progresses to 10 miles",
    "One heavy leg day and one light leg day",
    "Three upper-body sessions",
    "15-minute core four times per week",
    "Sunday alternates between an easy run and long hike",
    "Keep easy days genuinely easy",
  ],
  beforeWeeks: [
    {
      title: "September Pace Guide",
      table: {
        headers: ["Run", "Target Pace", "RPE"],
        rows: [
          ["Recovery", "13:30–14:15", "2–3"],
          ["Easy", "12:45–13:30", "3–4"],
          ["Long", "12:45–13:30", "4"],
          ["Tempo", "11:30–12:00", "6–7"],
          ["Strides", "Fast but relaxed", "7"],
          ["Hill Repeats", "Strong uphill effort", "7–8"],
        ],
      },
    },
    {
      paragraphs: ["Don’t force the pace on hills or hot days. RPE is more important than the watch."],
      callout: true,
    },
  ],
  weeks: [
    {
      title: "Week 1",
      subtitle: "August 31 – September 6",
      note: "Ease into September",
      weeklyMileage: "~22 miles",
      days: [
        { day: "Monday", date: "Aug 31", run: "Easy", miles: "4", pace: "13:00–13:30", strength: "Heavy Upper", core: "15 min A", mobility: "10 min" },
        { day: "Tuesday", date: "Sep 1", run: "Easy + 4×20-sec strides", miles: "4", pace: "13:00–13:30", strength: "Light Legs", core: "15 min B", mobility: "10 min" },
        { day: "Wednesday", date: "Sep 2", run: "No Run", miles: DASH, pace: DASH, strength: "Upper Moderate", core: DASH, mobility: "15 min" },
        { day: "Thursday", date: "Sep 3", run: "Recovery", miles: "3", pace: "13:30–14:15", strength: DASH, core: "15 min C", mobility: "15 min" },
        { day: "Friday", date: "Sep 4", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "15 min D", mobility: "15 min" },
        { day: "Saturday", date: "Sep 5", run: "Long Run", miles: "8", pace: "12:45–13:30", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Sep 6", run: "Easy Run", miles: "3", pace: "13:15–13:45", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
    {
      title: "Week 2",
      subtitle: "September 7–13",
      note: "Controlled tempo",
      weeklyMileage: "~20 miles + hike",
      days: [
        { day: "Monday", date: "Sep 7", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Heavy Upper", core: "15 min A", mobility: "10 min" },
        { day: "Tuesday", date: "Sep 8", run: "Tempo: 1 easy + 2 tempo + 1 easy", miles: "4", pace: "Tempo 11:45–12:00", strength: "Light Legs", core: "15 min B", mobility: "10 min" },
        { day: "Wednesday", date: "Sep 9", run: "No Run", miles: DASH, pace: DASH, strength: "Upper Moderate", core: DASH, mobility: "15 min" },
        { day: "Thursday", date: "Sep 10", run: "Recovery", miles: "3", pace: "13:30–14:15", strength: DASH, core: "15 min C", mobility: "15 min" },
        { day: "Friday", date: "Sep 11", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "15 min D", mobility: "15 min" },
        { day: "Saturday", date: "Sep 12", run: "Long Run", miles: "9", pace: "12:45–13:30", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Sep 13", run: "Long Hike", miles: "2–3 hr", pace: "RPE 3–4", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
    {
      title: "Week 3",
      subtitle: "September 14–20",
      note: "Build aerobic strength",
      weeklyMileage: "~25 miles",
      days: [
        { day: "Monday", date: "Sep 14", run: "Easy", miles: "4", pace: "12:45–13:15", strength: "Heavy Upper", core: "15 min A", mobility: "10 min" },
        { day: "Tuesday", date: "Sep 15", run: "Hill Repeats: 6×60 sec uphill", miles: "5", pace: "RPE 7–8 uphill", strength: "Light Legs", core: "15 min B", mobility: "10 min" },
        { day: "Wednesday", date: "Sep 16", run: "No Run", miles: DASH, pace: DASH, strength: "Upper Moderate", core: DASH, mobility: "15 min" },
        { day: "Thursday", date: "Sep 17", run: "Recovery", miles: "3", pace: "13:30–14:15", strength: DASH, core: "15 min C", mobility: "15 min" },
        { day: "Friday", date: "Sep 18", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "15 min D", mobility: "15 min" },
        { day: "Saturday", date: "Sep 19", run: "Long Run", miles: "9", pace: "12:45–13:15", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Sep 20", run: "Easy Run", miles: "4", pace: "13:00–13:30", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
    {
      title: "Week 4",
      subtitle: "September 21–27",
      note: "Recovery week",
      weeklyMileage: "~17 miles + hike",
      days: [
        { day: "Monday", date: "Sep 21", run: "Easy", miles: "3", pace: "13:00–13:45", strength: "Upper Body", core: "15 min A", mobility: "10 min" },
        { day: "Tuesday", date: "Sep 22", run: "Easy + 4×20-sec strides", miles: "4", pace: "13:00–13:45", strength: "Light Legs", core: "15 min B", mobility: "10 min" },
        { day: "Wednesday", date: "Sep 23", run: "No Run", miles: DASH, pace: DASH, strength: "Upper Body", core: DASH, mobility: "15 min" },
        { day: "Thursday", date: "Sep 24", run: "Recovery", miles: "3", pace: "13:45–14:15", strength: DASH, core: "15 min C", mobility: "15 min" },
        { day: "Friday", date: "Sep 25", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs −20% volume", core: "15 min D", mobility: "15 min" },
        { day: "Saturday", date: "Sep 26", run: "Long Run", miles: "7", pace: "13:00–13:45", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Sep 27", run: "Long Hike", miles: "2–3 hr", pace: "RPE 3–4", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
    {
      title: "Week 5",
      subtitle: "September 28 – October 4",
      note: "Finish strong",
      weeklyMileage: "~26 miles",
      days: [
        { day: "Monday", date: "Sep 28", run: "Easy", miles: "4", pace: "12:30–13:15", strength: "Heavy Upper", core: "15 min A", mobility: "10 min" },
        { day: "Tuesday", date: "Sep 29", run: "Tempo: 1 easy + 3 tempo + 1 easy", miles: "5", pace: "Tempo 11:30–11:45", strength: "Light Legs", core: "15 min B", mobility: "10 min" },
        { day: "Wednesday", date: "Sep 30", run: "No Run", miles: DASH, pace: DASH, strength: "Upper Moderate", core: DASH, mobility: "15 min" },
        { day: "Thursday", date: "Oct 1", run: "Recovery", miles: "3", pace: "13:15–14:00", strength: DASH, core: "15 min C", mobility: "15 min" },
        { day: "Friday", date: "Oct 2", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "15 min D", mobility: "15 min" },
        { day: "Saturday", date: "Oct 3", run: "Long Run", miles: "10", pace: "12:30–13:15", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Oct 4", run: "Easy Run", miles: "4", pace: "12:45–13:30", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
  ],
  afterWeeks: [
    {
      title: "September at a Glance",
      table: {
        headers: ["Week", "Running Miles", "Long Run", "Quality Workout", "Sunday"],
        rows: [
          ["Sep 1–6", "~22", "8", "Strides", "Easy Run"],
          ["Sep 7–13", "~20", "9", "Tempo", "Hike"],
          ["Sep 14–20", "~25", "9", "Hills", "Easy Run"],
          ["Sep 21–27", "~17", "7", "Strides", "Hike"],
          ["Sep 28–Oct 4", "~26", "10", "Tempo", "Easy Run"],
        ],
      },
      paragraphs: ["September target: approximately 84–90 running miles."],
    },
    {
      title: "Strength Schedule",
      paragraphs: ["The strength schedule stays consistent throughout September."],
      table: {
        headers: ["Day", "Strength"],
        rows: [
          ["Monday", "Heavy Upper Body"], ["Tuesday", "Light Leg Stability"],
          ["Wednesday", "Moderate Upper Body"], ["Thursday", "None"],
          ["Friday", "Heavy Legs"], ["Saturday", "None"], ["Sunday", "Light Upper Body"],
        ],
      },
      bullets: ["Core: Monday, Tuesday, Thursday, and Friday — 15 minutes each.", "Mobility: 10–15 minutes after runs or strength sessions."],
    },
    {
      title: "How to Increase Your Weights in September",
      paragraphs: ["Increase weight only after completing every set at the top of the rep range with good form while still having 1–2 reps in reserve."],
      table: {
        headers: ["Exercise Type", "Increase"],
        rows: [
          ["Upper-body cable/dumbbell", "+2.5–5 lb"], ["Squat", "+5 lb"],
          ["Romanian deadlift", "+5 lb"], ["Split squat", "+2.5–5 lb"],
          ["Calf raises", "+5–10 lb"], ["Core", "Add reps/time first"],
        ],
      },
      bullets: ["Protect Saturday’s long run: Friday’s heavy-leg session should not become a leg-destroying workout."],
    },
    {
      title: "Your September Win",
      paragraphs: [
        "Don’t judge September by whether you can run 10:00/mile yet.",
        "Judge it by this: “I completed September stronger, healthier, and more consistent than I started it.”",
        "Comfortably handling 25–26 miles per week, a 10-mile long run, tempo around 11:30–11:45, and progressive strength training puts you in a strong position for October.",
      ],
      callout: true,
    },
  ],
};

export default plan;
