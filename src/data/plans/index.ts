import type { Plan } from "../../types";
import plan202607 from "./2026-07.ts";
import plan202609 from "./2026-09.ts";
import plan202610 from "./2026-10.ts";
import futurePlans from "./future.ts";
import extendedPlans from "./extended.ts";
import { alignRoadmapWithActivePlan } from "../roadmapAlignment.ts";

const alignStrengthSchedule = (plan: Plan): Plan => ({
  ...plan,
  priorities: plan.priorities ? [...plan.priorities.filter((priority) => !/upper.body|leg day|strength session|core|mobility/i.test(priority)), "Two required full-body strength sessions; optional aesthetic work only when recovery is good"] : plan.priorities,
  afterWeeks: plan.afterWeeks?.filter((section) => !/strength schedule|strength:|core \+ mobility/i.test(section.title ?? "")),
  weeks: plan.weeks.map((week, weekIndex) => {
    const postRace = week.note?.toLowerCase().includes("post-race") || (plan.id === "2027-11" && weekIndex === 2) || (plan.id === "2028-10" && weekIndex === 1);
    const raceWeek = week.note?.toLowerCase().includes("race week");
    const runningRecovery = week.note?.toLowerCase().includes("recovery");
    const marathonPeak = plan.id === "2028-08" || plan.id === "2028-09";
    const sessionA = marathonPeak ? "Full Body A (⅓ fewer lower sets)" : runningRecovery ? "Full Body A (reduced lower sets)" : "Full Body A";
    const sessionB = marathonPeak ? "Full Body B (⅓ fewer lower sets)" : runningRecovery ? "Full Body B (reduced lower sets)" : "Full Body B";
    return {
      ...week,
      days: week.days.map((day) => {
        if (postRace) return { ...day, strength: "—", core: "—", mobility: day.run.toLowerCase().includes("rest") ? "Optional gentle movement" : "Short contextual warm-up" };
        if (raceWeek) {
          if (day.day === "Monday") return { ...day, strength: "Short maintenance only", core: "Included", mobility: "Short contextual warm-up" };
          return { ...day, strength: "—", core: "—", mobility: day.day === "Friday" ? "Complete rest" : "Optional if stiff" };
        }
        if (day.day === "Monday") return { ...day, strength: sessionA, core: "Included", mobility: "Short contextual warm-up" };
        if (day.day === "Thursday") return { ...day, strength: sessionB, core: "Included", mobility: "Short contextual warm-up" };
        if (day.day === "Friday") return { ...day, strength: "—", core: "—", mobility: "Complete rest" };
        if (day.day === "Sunday") return { ...day, strength: marathonPeak ? "Optional session suppressed during marathon peak" : "Optional 15-minute Core / Back, once weekly when recovered", core: "Included in optional routine", mobility: "Optional if stiff" };
        return { ...day, strength: "—", core: "—", mobility: day.run.toLowerCase().includes("rest") ? "Optional if stiff" : "3–7 min contextual warm-up" };
      }),
    };
  }),
});

// Add new months here as they're created, newest last.
const plans: Plan[] = alignRoadmapWithActivePlan([plan202607, plan202609, plan202610, ...futurePlans, ...extendedPlans].map(alignStrengthSchedule));

export default plans;
