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
    if (plan.id === "2026-08") return { ...plan, weeks: activePlan.slice(0, 5).map(activeWeekToRoadmapWeek) };
    if (plan.id === "2026-09") return { ...plan, weeks: [...activePlan.slice(5, 8).map((week, index) => activeWeekToRoadmapWeek(week, index)), ...plan.weeks.slice(3)] };
    return plan;
  });
}

export const roadmapMonthLabel = (id: string) => new Date(`${id}-01T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
