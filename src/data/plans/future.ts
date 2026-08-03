import type { DayEntry, Plan, Week } from "../../types";

const DASH = "—";

interface WeekConfig {
  start: string;
  focus: string;
  miles: [number, number, number, number, number];
  quality: string;
  qualityPace: string;
  sunday?: "Rest" | "Easy Hike" | "Long Hike";
}

interface MonthConfig {
  id: string;
  title: string;
  phase: string;
  easyPace: string;
  recoveryPace: string;
  longPace: string;
  tempoPace: string;
  intervalPace: string;
  hillPace: string;
  priorities: string[];
  weeks: WeekConfig[];
  benchmark: string;
  next: string;
}

const formatDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const benchmarkPace = (pace: string, rpe: string) =>
  `${rpe}; ${pace} only if recent benchmark and recovery support it`;

const getQualityPace = (config: WeekConfig, month: MonthConfig) => {
  const workout = config.quality.toLowerCase();
  if (workout.includes("hill")) return `${config.qualityPace}; ${month.hillPace}`;
  if (workout.includes("stride")) return `Easy RPE 3–4; strides RPE 7; ignore pace unless benchmark-supported`;
  if (workout.includes("interval") || workout.includes("800m") || workout.includes("fartlek")) return benchmarkPace(month.intervalPace, config.qualityPace);
  return benchmarkPace(month.tempoPace, config.qualityPace);
};

const makeWeek = (config: WeekConfig, index: number, month: MonthConfig): Week => {
  const start = new Date(`${config.start}T00:00:00Z`);
  const dates = Array.from({ length: 7 }, (_, day) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + day);
    return formatDate(date);
  });
  const [monday, qualityMiles, wednesday, thursday, longRun] = config.miles;
  const weeklyMileage = monday + qualityMiles + wednesday + thursday + longRun;
  const sunday = config.sunday ?? "Rest";
  const days: DayEntry[] = [
    { day: "Monday", date: dates[0], run: "Easy Run", miles: String(monday), pace: benchmarkPace(month.easyPace, "RPE 3–4"), strength: "Heavy Upper", core: "Core A", mobility: "10 min" },
    { day: "Tuesday", date: dates[1], run: config.quality, miles: String(qualityMiles), pace: getQualityPace(config, month), strength: DASH, core: "Core B", mobility: "10 min" },
    { day: "Wednesday", date: dates[2], run: "Easy Run", miles: String(wednesday), pace: benchmarkPace(month.easyPace, "RPE 3–4"), strength: "Heavy Legs", core: DASH, mobility: "10 min" },
    { day: "Thursday", date: dates[3], run: "Recovery Run", miles: String(thursday), pace: benchmarkPace(month.recoveryPace, "RPE 2–3"), strength: DASH, core: "Core C", mobility: "15 min" },
    { day: "Friday", date: dates[4], run: "Rest", miles: DASH, pace: "No pace — rest", strength: "Upper Moderate / Rest", core: "Core D", mobility: "15 min" },
    { day: "Saturday", date: dates[5], run: "Long Run", miles: String(longRun), pace: benchmarkPace(month.longPace, "RPE 3–4"), strength: DASH, core: DASH, mobility: "10 min" },
    { day: "Sunday", date: dates[6], run: sunday, miles: DASH, pace: sunday === "Rest" ? "No pace — rest" : "Comfortable walking pace; RPE 2–4", strength: "Light Upper", core: DASH, mobility: "10 min" },
  ];

  return {
    title: `Week ${index + 1}`,
    subtitle: `${dates[0]} – ${dates[6]}`,
    note: config.focus,
    weeklyMileage: `${weeklyMileage} miles${sunday.includes("Hike") ? " + hike" : ""}`,
    days,
  };
};

const monthConfigs: MonthConfig[] = [
  {
    id: "2026-11", title: "November Training Plan", phase: "Reset and rebuild",
    easyPace: "12:45–13:30/mi", recoveryPace: "13:30–14:15/mi", longPace: "12:45–13:30/mi", tempoPace: "11:30–12:00/mi", intervalPace: "10:45–11:15/mi", hillPace: "Pace varies by grade",
    priorities: ["Recover from the October build", "Keep five relaxed running days", "Reinforce strength and mobility", "Use one light quality session per week"],
    weeks: [
      { start: "2026-11-02", focus: "Post-build reset", miles: [4, 4, 4, 3, 8], quality: "Easy + 4×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Rest" },
      { start: "2026-11-09", focus: "Aerobic rhythm", miles: [4, 5, 4, 3, 9], quality: "Steady: 2 mi easy + 2 mi RPE 5 + easy", qualityPace: "RPE 5 steady", sunday: "Easy Hike" },
      { start: "2026-11-16", focus: "Light hills", miles: [4, 5, 4, 3, 9], quality: "Hill Repeats: 6×45 sec", qualityPace: "RPE 7 uphill", sunday: "Rest" },
      { start: "2026-11-23", focus: "Recovery week", miles: [3, 4, 3, 3, 7], quality: "Easy + 4×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Easy Hike" },
      { start: "2026-11-30", focus: "Return to steady work", miles: [4, 5, 4, 3, 9], quality: "Tempo: 1 easy + 2 tempo + easy", qualityPace: "RPE 6", sunday: "Rest" },
    ],
    benchmark: "Finish easy runs feeling fresher than when you started. No pace test this month.",
    next: "December continues aerobic development without increasing both speed and mileage at the same time.",
  },
  {
    id: "2026-12", title: "December Training Plan", phase: "Aerobic consistency",
    easyPace: "12:45–13:30/mi", recoveryPace: "13:30–14:15/mi", longPace: "12:30–13:15/mi", tempoPace: "11:20–11:50/mi", intervalPace: "10:40–11:10/mi", hillPace: "Pace varies by grade",
    priorities: ["Build consistency during a busy month", "Long run reaches 10 miles", "Alternate tempo and hills", "Keep recovery days genuinely easy"],
    weeks: [
      { start: "2026-12-07", focus: "Tempo control", miles: [4, 5, 4, 3, 9], quality: "Tempo: 1 easy + 3×6 min tempo + easy", qualityPace: "RPE 6–7", sunday: "Rest" },
      { start: "2026-12-14", focus: "Strength on hills", miles: [4, 5, 4, 3, 10], quality: "Hill Repeats: 7×60 sec", qualityPace: "RPE 7–8 uphill", sunday: "Easy Hike" },
      { start: "2026-12-21", focus: "Holiday maintenance", miles: [4, 4, 4, 3, 8], quality: "Easy + 6×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Rest" },
      { start: "2026-12-28", focus: "Recovery week", miles: [3, 4, 3, 3, 7], quality: "Easy fartlek: 6×1 min quicker", qualityPace: "RPE 6 on pickups", sunday: "Easy Hike" },
    ],
    benchmark: "On the final easy run, note heart rate and RPE at your natural pace; do not race the watch.",
    next: "January begins a structured strength-and-hills block.",
  },
  {
    id: "2027-01", title: "January Training Plan", phase: "Running strength",
    easyPace: "12:30–13:15/mi", recoveryPace: "13:15–14:00/mi", longPace: "12:30–13:15/mi", tempoPace: "11:15–11:45/mi", intervalPace: "10:30–11:00/mi", hillPace: "Pace varies by grade",
    priorities: ["Build hill strength", "Maintain 26–29 miles per week", "Practice relaxed strides", "Stay consistent with two meaningful strength sessions"],
    weeks: [
      { start: "2027-01-04", focus: "Hill foundation", miles: [4, 5, 4, 3, 10], quality: "Hill Repeats: 7×60 sec", qualityPace: "RPE 7–8 uphill", sunday: "Rest" },
      { start: "2027-01-11", focus: "Controlled tempo", miles: [5, 5, 4, 3, 10], quality: "Tempo: 1 easy + 3 tempo + 1 easy", qualityPace: "RPE 6–7", sunday: "Easy Hike" },
      { start: "2027-01-18", focus: "Aerobic strength", miles: [5, 6, 4, 3, 10], quality: "Rolling hills: 6×2 min strong", qualityPace: "RPE 7", sunday: "Rest" },
      { start: "2027-01-25", focus: "Recovery week", miles: [4, 4, 3, 3, 8], quality: "Easy + 4×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Easy Hike" },
    ],
    benchmark: "Complete a controlled 30-minute steady run at RPE 5. Record average pace only after finishing.",
    next: "February adds short intervals while holding mileage steady.",
  },
  {
    id: "2027-02", title: "February Training Plan", phase: "Speed economy",
    easyPace: "12:30–13:15/mi", recoveryPace: "13:15–14:00/mi", longPace: "12:15–13:00/mi", tempoPace: "11:10–11:40/mi", intervalPace: "10:15–10:45/mi", hillPace: "Pace varies by grade",
    priorities: ["Introduce controlled intervals", "Keep most running easy", "Long run reaches 11 miles", "Recover fully between faster repeats"],
    weeks: [
      { start: "2027-02-01", focus: "Short intervals", miles: [5, 6, 4, 3, 10], quality: "Intervals: 8×1 min fast / 2 min easy", qualityPace: "RPE 8 fast", sunday: "Rest" },
      { start: "2027-02-08", focus: "Tempo endurance", miles: [5, 6, 4, 3, 11], quality: "Tempo: 2 easy + 3 tempo + 1 easy", qualityPace: "RPE 6–7", sunday: "Easy Hike" },
      { start: "2027-02-15", focus: "800m rhythm", miles: [5, 6, 4, 3, 11], quality: "Intervals: 5×800m with 400m jog", qualityPace: "RPE 7–8", sunday: "Rest" },
      { start: "2027-02-22", focus: "Recovery week", miles: [4, 4, 4, 3, 8], quality: "Easy + 6×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Easy Hike" },
    ],
    benchmark: "The final interval should resemble the first. If pace fades sharply, slow the next session.",
    next: "March extends tempo duration and overall endurance.",
  },
  {
    id: "2027-03", title: "March Training Plan", phase: "Threshold development",
    easyPace: "12:15–13:00/mi", recoveryPace: "13:00–13:45/mi", longPace: "12:15–13:00/mi", tempoPace: "11:00–11:30/mi", intervalPace: "10:00–10:30/mi", hillPace: "Pace varies by grade",
    priorities: ["Extend comfortably hard running", "Reach 30–32 miles on peak weeks", "Fuel long runs longer than 75 minutes", "Protect the recovery week"],
    weeks: [
      { start: "2027-03-01", focus: "Tempo blocks", miles: [5, 6, 5, 3, 11], quality: "Tempo: 3×8 min with 3 min easy", qualityPace: "RPE 6–7", sunday: "Rest" },
      { start: "2027-03-08", focus: "Hill endurance", miles: [5, 6, 5, 3, 11], quality: "Hill Repeats: 8×60 sec", qualityPace: "RPE 7–8 uphill", sunday: "Easy Hike" },
      { start: "2027-03-15", focus: "Continuous tempo", miles: [5, 6, 5, 4, 12], quality: "Tempo: 2 easy + 20 min tempo + easy", qualityPace: "RPE 6–7", sunday: "Rest" },
      { start: "2027-03-22", focus: "Recovery week", miles: [4, 5, 4, 3, 9], quality: "Easy + 6×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Easy Hike" },
      { start: "2027-03-29", focus: "Return to quality", miles: [5, 6, 5, 3, 11], quality: "Intervals: 6×800m with 400m jog", qualityPace: "RPE 7–8", sunday: "Rest" },
    ],
    benchmark: "Run a controlled 5K at RPE 7—not all-out. Use it to update training effort, not to prove fitness.",
    next: "April begins half-marathon-specific endurance.",
  },
  {
    id: "2027-04", title: "April Training Plan", phase: "Half-marathon foundation",
    easyPace: "12:00–12:45/mi", recoveryPace: "12:45–13:30/mi", longPace: "12:00–12:45/mi", tempoPace: "10:50–11:20/mi", intervalPace: "9:55–10:25/mi", hillPace: "Pace varies by grade",
    priorities: ["Build durable 11–12 mile long runs", "Add steady finishes", "Practice fueling and hydration", "Keep only one hard workout per week"],
    weeks: [
      { start: "2027-04-05", focus: "Cruise intervals", miles: [5, 7, 5, 3, 11], quality: "Cruise: 3×1 mile with 3 min easy", qualityPace: "RPE 6–7", sunday: "Rest" },
      { start: "2027-04-12", focus: "Long-run strength", miles: [5, 6, 5, 4, 12], quality: "Hill Repeats: 8×60 sec", qualityPace: "RPE 7–8 uphill", sunday: "Easy Hike" },
      { start: "2027-04-19", focus: "Tempo progression", miles: [5, 7, 5, 4, 12], quality: "Tempo: 2 easy + 4 tempo + 1 easy", qualityPace: "RPE 6–7", sunday: "Rest" },
      { start: "2027-04-26", focus: "Recovery week", miles: [4, 5, 4, 3, 9], quality: "Easy + 6×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Easy Hike" },
    ],
    benchmark: "Finish one long run with 15 minutes at RPE 5. You should remain controlled, not depleted.",
    next: "May introduces measured goal-pace practice.",
  },
  {
    id: "2027-05", title: "May Training Plan", phase: "Provisional half-marathon peak and taper",
    easyPace: "11:45–12:30/mi", recoveryPace: "12:30–13:15/mi", longPace: "11:45–12:30/mi", tempoPace: "10:30–11:00/mi", intervalPace: "9:45–10:15/mi", hillPace: "Pace varies by grade",
    priorities: ["Complete the final race-specific workouts", "Do not force 10:00/mile", "Begin tapering in the second half of May", "Reduce heavy-leg volume before race week"],
    weeks: [
      { start: "2027-05-03", focus: "Goal-effort sampler", miles: [5, 7, 5, 4, 12], quality: "4×1 mile at current HM effort", qualityPace: "RPE 7; cap at 10:00/mi", sunday: "Rest" },
      { start: "2027-05-10", focus: "Interval economy", miles: [5, 7, 5, 4, 12], quality: "Intervals: 6×800m with 400m jog", qualityPace: "RPE 8", sunday: "Easy Hike" },
      { start: "2027-05-17", focus: "Final sustained effort", miles: [5, 7, 5, 3, 11], quality: "Tempo: 2 easy + 2×2 mi + easy", qualityPace: "RPE 7", sunday: "Rest" },
      { start: "2027-05-24", focus: "Taper week", miles: [4, 4, 3, 2, 7], quality: "Easy + 4×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Rest" },
      { start: "2027-05-31", focus: "Provisional race window", miles: [3, 3, 2, 2, 13], quality: "Easy + 3×20-sec strides", qualityPace: "Keep everything relaxed", sunday: "Rest" },
    ],
    benchmark: "Race by sustainable effort. If 10:00/mile exceeded RPE 7 during repeated spring miles, choose the pace that matches current fitness.",
    next: "The provisional May 29–June 6 window can hold the first half marathon once a race is selected; then begin recovery.",
  },
  {
    id: "2027-06", title: "June Training Plan", phase: "Race, recover, and reset",
    easyPace: "11:45–12:30/mi", recoveryPace: "12:30–13:15/mi", longPace: "11:30–12:15/mi", tempoPace: "10:20–10:50/mi", intervalPace: "9:40–10:10/mi", hillPace: "Pace varies by grade",
    priorities: ["Use early June only as a provisional backup half-marathon window", "Take recovery seriously", "Return to running gradually", "Begin rebuilding toward the fall half marathon"],
    weeks: [
      { start: "2027-06-07", focus: "Post-race recovery", miles: [3, 3, 3, 2, 6], quality: "All easy; walk breaks welcome", qualityPace: "RPE 2–3", sunday: "Rest" },
      { start: "2027-06-14", focus: "Gentle return", miles: [4, 4, 4, 3, 8], quality: "Easy + 4×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Easy Hike" },
      { start: "2027-06-21", focus: "Rebuild aerobic rhythm", miles: [4, 5, 4, 3, 9], quality: "Steady: 2 mi easy + 2 mi RPE 5 + easy", qualityPace: "RPE 5", sunday: "Rest" },
      { start: "2027-06-28", focus: "Light hills", miles: [4, 5, 4, 3, 9], quality: "Hill Repeats: 6×45 sec", qualityPace: "RPE 7 uphill", sunday: "Easy Hike" },
    ],
    benchmark: "By month-end, easy running should feel normal again. If fatigue or soreness persists, repeat an easier week.",
    next: "July begins the aerobic foundation for the October–November half marathon.",
  },
  {
    id: "2027-07", title: "July Training Plan", phase: "Fall half-marathon foundation",
    easyPace: "12:00–13:00/mi", recoveryPace: "12:45–13:45/mi", longPace: "11:45–12:30/mi", tempoPace: "10:00–10:30/mi", intervalPace: "9:35–10:05/mi", hillPace: "Pace varies by grade",
    priorities: ["Rebuild consistent mileage", "Use the first half-marathon result to update paces", "Develop hills and tempo gradually", "Prepare for the provisional November 2027 Monterey Bay target; confirm when officially announced"],
    weeks: [
      { start: "2027-07-05", focus: "Consistent base", miles: [4, 5, 4, 3, 9], quality: "Easy + 6×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Rest" },
      { start: "2027-07-12", focus: "Hill strength", miles: [5, 6, 4, 3, 10], quality: "Hill Repeats: 7×60 sec", qualityPace: "RPE 7–8 uphill", sunday: "Easy Hike" },
      { start: "2027-07-19", focus: "Controlled tempo", miles: [5, 6, 4, 3, 10], quality: "Tempo: 2 easy + 3 tempo + 1 easy", qualityPace: "RPE 6–7", sunday: "Rest" },
      { start: "2027-07-26", focus: "Recovery week", miles: [4, 4, 4, 3, 8], quality: "Easy + 4×20-sec strides", qualityPace: "Easy; strides RPE 7", sunday: "Easy Hike" },
    ],
    benchmark: "Use the first half-marathon result and July RPE data to set realistic fall training paces. Do not assume 10:00/mile automatically.",
    next: "August begins the dedicated build toward the provisional November 2027 Monterey Bay target. Confirm when officially announced.",
  },
];

const futurePlans: Plan[] = monthConfigs.map((month) => ({
  id: month.id,
  title: month.title,
  intro: `${month.phase}. This plan assumes you are pain-free and comfortably completed the preceding month. Adjust down if recovery, sleep, or soreness worsens.`,
  priorities: month.priorities,
  beforeWeeks: [
    {
      paragraphs: ["RPE and current benchmarks choose the pace—not the calendar. The listed ranges are conditional references, never required progression; hold or slow them when heat, hills, fatigue, terrain, or benchmark results call for it."],
      callout: true,
    },
  ],
  weeks: month.weeks.map((week, index) => makeWeek(week, index, month)),
  afterWeeks: [
    { title: "Monthly Benchmark", paragraphs: [month.benchmark] },
    { title: "What Comes Next", paragraphs: [month.next] },
    {
      title: "Adjustment Rules",
      bullets: [
        "Repeat or reduce a week if pain changes your stride, fatigue persists for several days, or easy effort becomes unusually hard.",
        "Do not make up missed miles. Resume with the next appropriate easy day.",
        "Once races are booked, move the taper and race weeks to match the actual dates.",
      ],
    },
  ],
}));

export default futurePlans;
