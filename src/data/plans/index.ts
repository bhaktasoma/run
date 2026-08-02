import type { Plan } from "../../types";
import plan202607 from "./2026-07";
import plan202609 from "./2026-09";
import plan202610 from "./2026-10";
import futurePlans from "./future";

// Add new months here as they're created, newest last.
const plans: Plan[] = [plan202607, plan202609, plan202610, ...futurePlans];

export default plans;
