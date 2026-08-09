import activePlan from "./activePlan.ts";
import type { ActiveWeek } from "../domain/training.ts";
import type { DayEntry, Plan, Week } from "../types.ts";

const dayName = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
export const runOnlyTitle = (title: string) => title.replace(/\s*\+\s*Full Body [AB].*$/i, "");

export function activeWeekToRoadmapWeek(week: ActiveWeek, index: number): Week {
  const days: DayEntry[] = week.workouts.map((workout) => ({ day: dayName(workout.date), date: shortDate(workout.date), run: runOnlyTitle(workout.title), miles: workout.plannedMiles ? String(workout.plannedMiles) : "—", pace: workout.paceGuidance ? `${workout.targetRpe.split(";")[0]}; ${workout.paceGuidance}` : workout.targetRpe, strength: /Full Body A/i.test(workout.title) ? "Full Body A" : /Full Body B/i.test(workout.title) ? "Full Body B" : workout.kind === "strength" ? workout.title.replace(/^Rest or optional /i, "Optional ") : "—", core: "—", mobility: "—" }));
  return { title: `Week ${index + 1}`, subtitle: week.label, note: `${week.objective} · Authoritative 8-week Plan`, weeklyMileage: `${week.plannedMiles} miles`, days };
}

export function alignRoadmapWithActivePlan(plans: Plan[]) {
  return plans.map((plan) => {
    if (plan.id === "2026-08") return { ...plan, title: "August 2026 Training Plan", priorities: ["Authoritative rolling eight-week prescription shown below", "RPE controls effort; pace is conditional on conditions and benchmarks", "Two primary strength sessions; Sunday Back + Core + Aesthetics follows shared recovery status"], weeks: activePlan.slice(0, 5).map(activeWeekToRoadmapWeek) };
    if (plan.id === "2026-09") return { ...plan, title: "September 2026 Training Plan", priorities: ["Weeks overlapping the current eight-week Plan are authoritative", "Later September guidance is directional and will be updated from completed training", "RPE controls effort; do not force calendar-based pace improvement"], weeks: [...activePlan.slice(5, 8).map((week, index) => activeWeekToRoadmapWeek(week, index)), ...plan.weeks.slice(3)] };
    return plan;
  });
}

export const roadmapMonthLabel = (id: string) => new Date(`${id}-01T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
