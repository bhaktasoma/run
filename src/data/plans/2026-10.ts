import type { Plan } from "../../types";

const DASH = "—";

const plan: Plan = {
  id: "2026-10",
  title: "October Training Plan",
  priorities: [
    "5 running days per week",
    "25–30 miles per week",
    "Long run progresses from 10 to 11 miles",
    "One quality workout per week",
    "Tempo pace around 11:15–11:45/mi",
    "Interval pace around 10:15–10:45/mi",
    "One heavy leg day and one light leg day",
    "Three upper-body sessions",
    "Four 15-minute core sessions per week",
    "One or two Sunday hikes",
  ],
  beforeWeeks: [
    {
      title: "October Pace Guide",
      table: {
        headers: ["Run Type", "October Target", "RPE"],
        rows: [
          ["Recovery", "13:30–14:15", "2–3"],
          ["Easy", "12:45–13:30", "3–4"],
          ["Long Run", "12:30–13:15", "4"],
          ["Tempo", "11:15–11:45", "6–7"],
          ["Intervals", "10:15–10:45", "8"],
          ["Strides", "Fast and relaxed", "7"],
        ],
      },
    },
    {
      paragraphs: ["Your 9–10 min/mile goal is still the destination, not today’s training pace."],
      callout: true,
    },
  ],
  weeks: [
    {
      title: "Week 1",
      subtitle: "October 5–11",
      note: "Build after September",
      weeklyMileage: "30 miles",
      days: [
        { day: "Monday", date: "Oct 5", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Heavy Upper", core: "Core A", mobility: "10 min" },
        { day: "Tuesday", date: "Oct 6", run: "Tempo: 1 mi easy + 3 mi tempo + 1 mi easy", miles: "5", pace: "Tempo 11:30–11:45", strength: "Light Legs", core: "Core B", mobility: "10 min" },
        { day: "Wednesday", date: "Oct 7", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Upper Moderate", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Oct 8", run: "Recovery", miles: "3", pace: "13:30–14:15", strength: DASH, core: "Core C", mobility: "15 min" },
        { day: "Friday", date: "Oct 9", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "Core D", mobility: "15 min" },
        { day: "Saturday", date: "Oct 10", run: "Long Run", miles: "10", pace: "12:30–13:15", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Oct 11", run: "Easy Run", miles: "4", pace: "12:45–13:30", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
    {
      title: "Week 2",
      subtitle: "October 12–18",
      note: "Speed development",
      weeklyMileage: "~26 miles + hike",
      days: [
        { day: "Monday", date: "Oct 12", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Heavy Upper", core: "Core A", mobility: "10 min" },
        { day: "Tuesday", date: "Oct 13", run: "Intervals: 1 mi WU + 5×800m + CD", miles: "5", pace: "Repeats 10:15–10:45", strength: "Light Legs", core: "Core B", mobility: "10 min" },
        { day: "Wednesday", date: "Oct 14", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Upper Moderate", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Oct 15", run: "Recovery", miles: "3", pace: "13:30–14:15", strength: DASH, core: "Core C", mobility: "15 min" },
        { day: "Friday", date: "Oct 16", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "Core D", mobility: "15 min" },
        { day: "Saturday", date: "Oct 17", run: "Long Run", miles: "10", pace: "12:30–13:15", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Oct 18", run: "Long Hike", miles: "2–3 hr", pace: "RPE 3–4", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
    {
      title: "Week 3",
      subtitle: "October 19–25",
      note: "Endurance + hills",
      weeklyMileage: "31 miles",
      days: [
        { day: "Monday", date: "Oct 19", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Heavy Upper", core: "Core A", mobility: "10 min" },
        { day: "Tuesday", date: "Oct 20", run: "Hill Repeats: 7×60 sec", miles: "5", pace: "RPE 7–8 uphill", strength: "Light Legs", core: "Core B", mobility: "10 min" },
        { day: "Wednesday", date: "Oct 21", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Upper Moderate", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Oct 22", run: "Recovery", miles: "3", pace: "13:30–14:15", strength: DASH, core: "Core C", mobility: "15 min" },
        { day: "Friday", date: "Oct 23", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "Core D", mobility: "15 min" },
        { day: "Saturday", date: "Oct 24", run: "Long Run", miles: "11", pace: "12:30–13:15", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Oct 25", run: "Easy", miles: "4", pace: "12:45–13:30", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
    {
      title: "Week 4",
      subtitle: "October 26 – November 1",
      note: "Recovery week",
      weeklyMileage: "~18 miles + hike",
      days: [
        { day: "Monday", date: "Oct 26", run: "Easy", miles: "3", pace: "13:00–13:45", strength: "Upper Body", core: "Core A", mobility: "10 min" },
        { day: "Tuesday", date: "Oct 27", run: "Easy + 4×20-sec strides", miles: "4", pace: "13:00–13:45", strength: "Light Legs", core: "Core B", mobility: "10 min" },
        { day: "Wednesday", date: "Oct 28", run: "Rest", miles: DASH, pace: DASH, strength: "Upper Body", core: DASH, mobility: "15 min" },
        { day: "Thursday", date: "Oct 29", run: "Recovery", miles: "3", pace: "13:30–14:15", strength: DASH, core: "Core C", mobility: "15 min" },
        { day: "Friday", date: "Oct 30", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs −20% volume", core: "Core D", mobility: "15 min" },
        { day: "Saturday", date: "Oct 31", run: "Long Run", miles: "8", pace: "12:45–13:30", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Nov 1", run: "Long Hike", miles: "2–3 hr", pace: "RPE 3–4", strength: "Light Upper", core: DASH, mobility: "10 min" },
      ],
    },
  ],
  afterWeeks: [
    {
      title: "Quality Workout Notes",
      bullets: [
        "800m workout: 1 mile easy warm-up, then 800m fast and 400m easy jog repeated five times, followed by an easy cool-down. The fast sections should feel hard but controlled—not like sprinting.",
        "Hill workout: Find a moderate hill, run uphill for 60 seconds, jog or walk down, and repeat seven times before finishing with easy running. Effort—not pace—is the target.",
      ],
    },
    {
      title: "October at a Glance",
      table: {
        headers: ["Week", "Mileage", "Long Run", "Quality Workout", "Sunday"],
        rows: [
          ["Oct 5–11", "30", "10 mi", "Tempo", "Easy"],
          ["Oct 12–18", "26", "10 mi", "5×800m", "Hike"],
          ["Oct 19–25", "31", "11 mi", "Hills", "Easy"],
          ["Oct 26–Nov 1", "18", "8 mi", "Strides", "Hike"],
        ],
      },
      paragraphs: ["Total running: approximately 105 miles. This is a substantial month, but the recovery week keeps the overall load manageable."],
    },
    {
      title: "Strength: Keep Progressing",
      paragraphs: ["Your established strength workouts remain the same."],
      table: {
        headers: ["Day", "Session", "Prescription"],
        rows: [
          ["Monday", "Heavy Upper", "4×6–8 major movements; 3×8–12 accessories"],
          ["Tuesday", "Light Legs", "3×10 each; controlled and unilateral"],
          ["Wednesday", "Moderate Upper", "3×10–12"],
          ["Friday", "Heavy Legs", "Main lifts 3–4×6–10; accessories 3×10–15"],
          ["Sunday", "Light Upper", "3×12–15 with lighter weights"],
        ],
      },
    },
    {
      title: "Weight Progression",
      paragraphs: ["When you hit the top of the rep range for every set with good form for two consecutive sessions, increase the weight."],
      bullets: [
        "Example: Squat 60 lb for 4×8 in weeks 1 and 2, move to 65 lb until all four sets reach eight reps, then progress to 70 lb.",
        "This creates progressive overload without constantly testing yourself.",
      ],
    },
    {
      title: "Core + Mobility",
      table: {
        headers: ["Day", "Core"],
        rows: [
          ["Monday", "Core A — anti-extension"], ["Tuesday", "Core B — anti-rotation"],
          ["Thursday", "Core C — hip/lower abs"], ["Friday", "Core D — lateral stability"],
        ],
      },
      paragraphs: ["Continue four 15-minute core sessions. Mobility sequence: hip flexor → hamstring → calf → figure-4 → quad → child’s pose → thoracic rotation."],
    },
    {
      title: "Sunday Hiking Rule",
      paragraphs: ["Saturday long run plus a Sunday easy hike is fine. A five-hour mountain hike is not an easy recovery weekend. Keep October hikes around 2–3 hours at RPE 3–4."],
      callout: true,
    },
    {
      title: "What October Should Accomplish",
      paragraphs: [
        "By November 1: “10 miles doesn’t feel like a big deal anymore.”",
        "Your 13-minute miles should start feeling easier, and you may occasionally run faster without deliberately pushing. That is the aerobic base being built now; the 9–10 min/mile goal comes later.",
      ],
      callout: true,
    },
  ],
};

export default plan;
