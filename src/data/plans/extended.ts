import type { DayEntry, Plan, Week } from "../../types";
import { sumMileageValues } from "../../domain/progression.ts";

const DASH = "—";

interface MonthBlock {
  id: string;
  phase: string;
  totals: number[];
  longRuns: number[];
  quality: string[];
  qualityPace: string;
  easyPace: string;
  longPace: string;
  goal: string;
}

const blocks: MonthBlock[] = [
  { id: "2027-08", phase: "Fall half-marathon base", totals: [27, 29, 30, 24, 29], longRuns: [9, 10, 11, 8, 10], quality: ["6×20-sec strides", "7×60-sec hills", "3×8-min tempo", "4×20-sec strides", "5×800m"], qualityPace: "10:15–10:45/mi; RPE 7", easyPace: "11:45–12:30/mi", longPace: "11:45–12:30/mi", goal: "Rebuild consistently after the first half marathon." },
  { id: "2027-09", phase: "Threshold development", totals: [30, 31, 32, 25], longRuns: [10, 11, 12, 9], quality: ["3×1-mile cruise intervals", "8×60-sec hills", "4-mile tempo", "6×20-sec strides"], qualityPace: "10:10–10:40/mi; RPE 6–7", easyPace: "11:40–12:25/mi", longPace: "11:35–12:20/mi", goal: "Extend controlled faster running without forcing goal pace." },
  { id: "2027-10", phase: "Monterey-specific endurance", totals: [32, 33, 34, 27], longRuns: [11, 12, 13, 9], quality: ["3×2 miles at current HM effort", "6×800m", "5 miles at current HM effort", "4×20-sec strides"], qualityPace: "10:00–10:30/mi; RPE 7", easyPace: "11:30–12:15/mi", longPace: "11:25–12:10/mi", goal: "Practice race effort, fueling, and coastal-weather strategy." },
  { id: "2027-11", phase: "Provisional Monterey target, taper, and recovery", totals: [24, 22, 14, 18, 22], longRuns: [8, 13, 6, 7, 8], quality: ["3×1 mile at HM effort", "Race-week strides", "All easy", "All easy", "4×20-sec strides"], qualityPace: "10:00–10:30/mi; race by RPE", easyPace: "12:00–13:00/mi", longPace: "11:45–12:30/mi", goal: "Provisional November 2027 target. Confirm when officially announced, then recover fully." },
  { id: "2027-12", phase: "Off-season recovery", totals: [18, 21, 23, 18], longRuns: [6, 7, 8, 6], quality: ["All easy", "4×20-sec strides", "Light fartlek: 6×1 min", "All easy"], qualityPace: "Comfortable; never above RPE 6", easyPace: "12:00–13:00/mi", longPace: "12:00–12:45/mi", goal: "Restore freshness and maintain a comfortable aerobic routine." },
  { id: "2028-01", phase: "Marathon foundation I", totals: [23, 25, 27, 22, 26], longRuns: [8, 9, 10, 7, 9], quality: ["6×20-sec strides", "6×60-sec hills", "3×8-min tempo", "All easy", "5×800m"], qualityPace: "10:15–10:45/mi; RPE 6–7", easyPace: "11:50–12:35/mi", longPace: "11:50–12:35/mi", goal: "Re-establish durable five-day running and strength consistency." },
  { id: "2028-02", phase: "Marathon foundation II", totals: [27, 29, 30, 24], longRuns: [10, 11, 12, 8], quality: ["7×60-sec hills", "3×1-mile cruise intervals", "4-mile steady progression", "4×20-sec strides"], qualityPace: "10:10–10:40/mi; RPE 6–7", easyPace: "11:45–12:30/mi", longPace: "11:40–12:25/mi", goal: "Build strength and aerobic durability without marathon-level fatigue." },
  { id: "2028-03", phase: "Endurance development", totals: [30, 31, 32, 25], longRuns: [11, 12, 13, 9], quality: ["3×10-min tempo", "6×800m", "8×60-sec hills", "6×20-sec strides"], qualityPace: "10:05–10:35/mi; RPE 6–7", easyPace: "11:40–12:25/mi", longPace: "11:35–12:20/mi", goal: "Make 12–13 miles feel routine and practice fueling." },
  { id: "2028-04", phase: "Endurance and threshold", totals: [32, 33, 34, 27], longRuns: [12, 13, 14, 10], quality: ["4×1-mile cruise intervals", "5-mile tempo progression", "7×800m", "4×20-sec strides"], qualityPace: "10:00–10:30/mi; RPE 7", easyPace: "11:35–12:20/mi", longPace: "11:30–12:15/mi", goal: "Strengthen threshold while preserving recovery capacity." },
  { id: "2028-05", phase: "Pre-marathon base", totals: [33, 35, 36, 29, 35], longRuns: [13, 14, 15, 10, 14], quality: ["3×2-mile steady blocks", "8×60-sec hills", "6-mile progression", "6×20-sec strides", "6×1-mile cruise intervals"], qualityPace: "10:10–10:45/mi; RPE 6–7", easyPace: "11:35–12:20/mi", longPace: "11:30–12:15/mi", goal: "Enter marathon-specific training healthy and comfortable near 35 miles per week." },
  { id: "2028-06", phase: "Marathon block: weeks 1–4", totals: [34, 36, 38, 30], longRuns: [14, 15, 16, 11], quality: ["4×1-mile steady intervals", "5-mile marathon-effort block", "8×800m", "6×20-sec strides"], qualityPace: "10:30–11:15/mi; RPE 6", easyPace: "11:40–12:30/mi", longPace: "11:35–12:25/mi or 3-hour cap", goal: "Begin race-specific endurance and test fueling every 30–40 minutes." },
  { id: "2028-07", phase: "Marathon block: weeks 5–9", totals: [37, 39, 40, 32, 39], longRuns: [15, 16, 17, 12, 16], quality: ["6-mile marathon-effort block", "6×1-mile cruise intervals", "8-mile progression", "4×20-sec strides", "7-mile marathon-effort block"], qualityPace: "10:30–11:15/mi; RPE 6", easyPace: "11:40–12:30/mi", longPace: "11:35–12:25/mi or 3:10 cap", goal: "Build long-run durability while keeping the majority of miles easy." },
  { id: "2028-08", phase: "Marathon block: weeks 10–13", totals: [40, 41, 42, 33], longRuns: [17, 18, 18, 13], quality: ["8-mile marathon-effort block", "5×1-mile cruise intervals", "10-mile steady progression", "6×20-sec strides"], qualityPace: "10:30–11:15/mi; RPE 6", easyPace: "11:45–12:35/mi", longPace: "11:40–12:30/mi or 3:15 cap", goal: "Reach peak time-on-feet without chasing excessive long-run duration." },
  { id: "2028-09", phase: "Marathon peak and taper", totals: [42, 40, 34, 27], longRuns: [18, 20, 16, 10], quality: ["8-mile marathon-effort block", "6-mile marathon-effort block", "4×1 mile controlled", "4×20-sec strides"], qualityPace: "10:35–11:20/mi; RPE 6", easyPace: "11:50–12:40/mi", longPace: "11:45–12:35/mi; cap longest run near 3:15", goal: "Complete the final peak, then reduce volume while retaining rhythm." },
  { id: "2028-10", phase: "Provisional Long Beach race window and recovery", totals: [34, 16, 18, 21, 24], longRuns: [26, 5, 6, 7, 8], quality: ["Race-week strides", "All recovery", "All easy", "4×20-sec strides", "Light steady running"], qualityPace: "Race by sustainable effort; recovery RPE 2–3", easyPace: "12:15–13:30/mi", longPace: "Race plan or easy recovery", goal: "Finish the first marathon strong. Long Beach and the Santa Cruz backup remain provisional until official 2028 dates are confirmed." },
];

const monthName = (id: string) => new Date(`${id}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });

const mondayDates = (id: string) => {
  const [year, month] = id.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  while (date.getUTCDay() !== 1) date.setUTCDate(date.getUTCDate() + 1);
  const dates: Date[] = [];
  while (date.getUTCMonth() === month - 1) {
    dates.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 7);
  }
  return dates;
};

const label = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const benchmarkPace = (pace: string, rpe: string) =>
  `${rpe}; ${pace} only if recent benchmark and recovery support it`;

const buildWeek = (block: MonthBlock, start: Date, index: number): Week => {
  const dates = Array.from({ length: 7 }, (_, offset) => new Date(start.getTime() + offset * 86400000));
  const total = block.totals[index];
  const long = block.longRuns[index];
  const remaining = total - long;
  const mon = Math.max(3, Math.round(remaining * 0.24));
  const tue = Math.max(3, Math.round(remaining * 0.28));
  const wed = Math.max(2, Math.round(remaining * 0.25));
  const thu = Math.max(2, remaining - mon - tue - wed);
  const isMonterey = block.id === "2027-11" && index === 1;
  const isLongBeach = block.id === "2028-10" && index === 0;
  const raceMiles = isMonterey ? "13.1" : "26.2";
  const raceName = isMonterey ? "Monterey Bay Half Marathon" : "Long Beach Marathon — provisional date TBD";

  const days: DayEntry[] = [
    { day: "Monday", date: label(dates[0]), run: "Easy Run", miles: String(mon), pace: benchmarkPace(block.easyPace, "RPE 3–4"), strength: "Upper Body", core: "Core A", mobility: "10 min" },
    { day: "Tuesday", date: label(dates[1]), run: block.quality[index], miles: String(tue), pace: `${block.qualityPace}; use RPE first and pace only when benchmark-supported`, strength: DASH, core: "Core B", mobility: "10 min" },
    { day: "Wednesday", date: label(dates[2]), run: "Easy Run", miles: String(wed), pace: benchmarkPace(block.easyPace, "RPE 3–4"), strength: index >= block.totals.length - 2 ? "Light Legs only" : "Heavy Legs", core: DASH, mobility: "10 min" },
    { day: "Thursday", date: label(dates[3]), run: "Recovery Run", miles: String(thu), pace: benchmarkPace(block.easyPace, "RPE 2–3"), strength: DASH, core: "Core C", mobility: "15 min" },
    { day: "Friday", date: label(dates[4]), run: "Rest", miles: DASH, pace: "No pace — rest", strength: "Upper Body / Rest", core: "Core D", mobility: "15 min" },
    { day: "Saturday", date: label(dates[5]), run: isMonterey || isLongBeach ? "Shakeout or Rest" : "Long Run", miles: isMonterey || isLongBeach ? "2" : String(long), pace: isMonterey || isLongBeach ? "Very easy; RPE 2" : benchmarkPace(block.longPace, "RPE 3–4"), strength: DASH, core: DASH, mobility: "10 min" },
    { day: "Sunday", date: label(dates[6]), run: isMonterey || isLongBeach ? raceName : "Rest or Easy Hike", miles: isMonterey || isLongBeach ? raceMiles : DASH, pace: isMonterey || isLongBeach ? "Race by sustainable effort" : "Comfortable walking pace; RPE 2–3", strength: DASH, core: DASH, mobility: "Gentle only" },
  ];

  const scheduledMileage = sumMileageValues(days.map((day) => day.miles));

  return { title: `Week ${index + 1}`, subtitle: `${label(dates[0])} – ${label(dates[6])}`, note: isMonterey || isLongBeach ? "Race week" : index === block.totals.length - 1 ? "Recovery / transition" : block.phase, weeklyMileage: isMonterey || isLongBeach ? `${scheduledMileage.toFixed(1)} miles incl. warm-ups, shakeout & race` : `${total} miles`, days };
};

const extendedPlans: Plan[] = blocks.map((block) => {
  const starts = mondayDates(block.id);
  return {
    id: block.id,
    title: `${monthName(block.id)} Training Plan`,
    intro: `${block.phase}. This plan assumes the previous block was completed without persistent pain or unusual fatigue.`,
    priorities: [block.goal, "Keep easy days conversational.", "Reduce or repeat a week when recovery worsens.", "Maintain strength without compromising the next key run."],
    beforeWeeks: [{ paragraphs: ["Mileage is a target, but RPE and current benchmarks choose the pace—not the calendar. Listed ranges are conditional references. Use the time cap on long runs when it comes first, and update the exact taper when official race dates are announced."], callout: true }],
    weeks: starts.map((start, index) => buildWeek(block, start, index)),
    afterWeeks: [
      { title: "Phase Goal", paragraphs: [block.goal] },
      ...(block.id === "2028-10" ? [{ title: "Santa Cruz Backup — Provisional", paragraphs: ["If Santa Cruz becomes the target, repeat a reduced maintenance week after the provisional Long Beach window and shift the final race week to the official date once announced. Do not run both full marathons."] }] : []),
      { title: "Adjustment Rules", bullets: ["Stop and reassess pain that changes your stride.", "Do not make up missed mileage.", "After any race, prioritize recovery before resuming the next block."] },
    ],
  };
});

export default extendedPlans;
