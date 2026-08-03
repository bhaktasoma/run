export type RecommendationState = "Progress" | "Hold" | "Reduce" | "Reassess";
export type CompletionStatus = "completed" | "partial" | "skipped" | "substituted";
export type PainState = "none" | "mild" | "concerning";
export type WorkoutResult = "easier" | "appropriate" | "too-hard";
export type Terrain = "flat" | "rolling" | "hilly" | "trail" | "treadmill" | "";
export type RunWalkMethod = "continuous" | "structured" | "unstructured" | "unspecified";
export type ReadinessState = "Building" | "On Track" | "Needs Attention" | "Not Yet Tested" | "Supported";

export interface ActiveWorkout {
  id: string;
  date: string;
  title: string;
  kind: "run" | "strength" | "rest" | "benchmark";
  plannedMiles: number;
  duration?: string;
  targetRpe: string;
  paceGuidance?: string;
  purpose: string;
  steps?: string[];
  isLongRun?: boolean;
  quality?: boolean;
}

export interface ActiveWeek {
  id: string;
  label: string;
  status: "Prescribed" | "Adjustable";
  plannedMiles: number;
  objective: string;
  workouts: ActiveWorkout[];
}

export interface RunEntry {
  id: string;
  workoutId?: string;
  activityDate: string;
  createdAt: string;
  updatedAt: string;
  workout: string;
  status: CompletionStatus;
  plannedDistance: string;
  actualDistance: string;
  duration: string;
  averageRpe: string;
  finalRpe: string;
  pain: PainState;
  result: WorkoutResult;
  notes: string;
  averageHeartRate: string;
  maximumHeartRate: string;
  elevationGain: string;
  averageCadence: string;
  terrain: Terrain;
  runWalkMethod: RunWalkMethod;
  runWalkPattern: string;
  conditions: string;
}

export interface WeeklyCheckIn {
  weekId: string;
  sleepRecovery: "good" | "mixed" | "poor";
  painAffectsMovement: boolean;
  confidence: "improving" | "unchanged" | "declining";
  longRunRecovery: "within-48h" | "slower" | "not-applicable";
}

export interface BenchmarkEntry {
  id: string;
  date: string;
  type: "Controlled 5K" | "Controlled 10K" | "Repeatable tempo" | "Same easy route";
  distance: string;
  duration: string;
  averageRpe: string;
  terrain?: Terrain;
  elevationGain?: string;
  conditions?: string;
  notes: string;
}

export interface Recommendation {
  state: RecommendationState;
  summary: string;
  reasons: string[];
}

export interface RecommendationDecision {
  weekId: string;
  state: RecommendationState;
  accepted: boolean;
  decidedAt: string;
}

export interface TrainingStore {
  version: 4;
  entries: RunEntry[];
  checkIns: WeeklyCheckIn[];
  benchmarks: BenchmarkEntry[];
  decisions: RecommendationDecision[];
  roadmapCompletions: Record<string, boolean>;
  paceGuidance?: { benchmarkId: string; text: string; accepted: boolean };
  strengthLogs: import("./strength.ts").StrengthSessionLog[];
  strengthDecisions: import("./strength.ts").StrengthAdjustmentDecision[];
  selectedAbExercise: "cable-crunch" | "hanging-knee-raise" | "reverse-crunch";
}
