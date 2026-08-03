import type { Plan } from "../../types";
import plan202607 from "./2026-07.ts";
import plan202609 from "./2026-09.ts";
import plan202610 from "./2026-10.ts";
import futurePlans from "./future.ts";
import extendedPlans from "./extended.ts";

// Add new months here as they're created, newest last.
const plans: Plan[] = [plan202607, plan202609, plan202610, ...futurePlans, ...extendedPlans];

export default plans;
