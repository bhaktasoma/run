export const PRIMARY_NAVIGATION = ["Today", "Plan", "Progress", "Strength"] as const;
export const SECONDARY_NAVIGATION = ["Roadmap", "Goal", "Run History & Backup", "Guides"] as const;
export const ROADMAP_COLUMNS = ["Day / date", "Workout", "Distance", "Effort", "Strength"] as const;
export const STRENGTH_TABS = ["Overview", "Train", "Progress", "Guides"] as const;

export const runOutcomeIsSavable = (status: string, distance: string, durationValid: boolean, result: string) =>
  status === "skipped" || (["completed", "partial", "substituted"].includes(status) && Number(distance) > 0 && durationValid && Boolean(result));
