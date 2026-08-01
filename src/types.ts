export interface DayEntry {
  day: string;
  date: string;
  run: string;
  miles: string;
  pace: string;
  strength: string;
  core: string;
  mobility: string;
}

export interface Week {
  title: string;
  subtitle: string;
  note?: string;
  days: DayEntry[];
  weeklyMileage: string;
}

export interface Plan {
  id: string;
  title: string;
  intro?: string;
  priorities?: string[];
  beforeWeeks?: PlanSection[];
  afterWeeks?: PlanSection[];
  weeks: Week[];
}

export interface PlanSection {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  callout?: boolean;
}

export interface LiftRow {
  exercise: string;
  sets: string;
  reps: string;
}

export interface LiftDay {
  day: string;
  title: string;
  duration?: string;
  note?: string;
  rows: LiftRow[];
  restNote?: string;
  finishNote?: string;
}

export interface CoreRow {
  exercise: string;
  sets: string;
}

export interface CoreDay {
  day: string;
  label: string;
  rows: CoreRow[];
}

export interface MobilityRow {
  exercise: string;
  reps: string;
}

export interface ProgressionRow {
  weeks: string;
  goal: string;
  intensity: string;
}

export interface WorkoutPlan {
  liftDays: LiftDay[];
  coreDays: CoreDay[];
  mobilityBefore: {
    title: string;
    rows: MobilityRow[];
  };
  mobilityAfter: {
    title: string;
    note: string;
    items: string[];
  };
  progression: ProgressionRow[];
  recommendation: {
    title: string;
    guidelines: string[];
    summary: string;
  };
}
