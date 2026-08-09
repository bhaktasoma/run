import { useRef, useState } from "react";
import plans from "./data/plans";
import PlanPage from "./components/PlanPage";
import WorkoutPlanPage from "./components/WorkoutPlanPage";
import GoalPage from "./components/GoalPage";
import RunLogPage from "./components/RunLogPage";
import TodayPage from "./components/TodayPage";
import CurrentPlanPage from "./components/CurrentPlanPage";
import ProgressPage from "./components/ProgressPage";
import RunningGuidesPage from "./components/RunningGuidesPage";
import useTrainingStore from "./hooks/useTrainingStore";
import PlanOnboarding from "./components/PlanOnboarding";
import { onboardingWasDismissed, saveOnboardingDismissal } from "./domain/onboarding.ts";
import "./App.css";

type Page = { kind: "today" | "current" | "progress" | "strength" | "goal" | "log" | "guides" } | { kind: "roadmap"; id: string };

export default function App() {
  const [page, setPage] = useState<Page>({ kind: "today" });
  const [showOnboarding, setShowOnboarding] = useState(() => !onboardingWasDismissed());
  const [focusTodayLog, setFocusTodayLog] = useState(false);
  const [focusStrengthSession, setFocusStrengthSession] = useState<string>();
  const moreMenuRef = useRef<HTMLDetailsElement>(null);
  const training = useTrainingStore();
  const selectedPlan = page.kind === "roadmap" ? plans.find((plan) => plan.id === page.id) ?? plans[0] : plans[0];
  const navigate = (kind: Page["kind"]) => setPage(kind === "roadmap" ? { kind, id: selectedPlan.id } : { kind } as Page);
  const primary = [["today", "Today"], ["current", "Plan"], ["progress", "Progress"], ["strength", "Strength"]] as const;
  const dismissOnboarding = () => { saveOnboardingDismissal(); setShowOnboarding(false); };
  const openTodayLog = () => { setFocusTodayLog(true); setPage({ kind: "today" }); };
  const closeMore = () => { if (moreMenuRef.current) moreMenuRef.current.open = false; };
  const navigateFromMore = (kind: Page["kind"]) => { closeMore(); navigate(kind); };

  return <div className="app">
    <nav className="app__nav" aria-label="Primary navigation"><div className="app__brand" aria-label="Run Training home"><span className="app__brand-mark">R</span><span className="app__brand-name">Run Training</span></div>
      <div className="app__primary-links">{primary.map(([kind, label]) => <button key={kind} type="button" className={page.kind === kind ? "app__nav-btn is-active" : "app__nav-btn"} aria-current={page.kind === kind ? "page" : undefined} onClick={() => navigate(kind)}>{label}</button>)}</div>
      <button className={page.kind === "roadmap" ? "app__nav-btn app__roadmap-link is-active" : "app__nav-btn app__roadmap-link"} type="button" onClick={() => navigate("roadmap")}>Roadmap</button>
      <details className="app__more" ref={moreMenuRef}><summary className="app__nav-btn">More</summary><div><button type="button" className={page.kind === "roadmap" ? "is-active" : ""} onClick={() => navigateFromMore("roadmap")}>Roadmap</button><button type="button" className={page.kind === "goal" ? "is-active" : ""} onClick={() => navigateFromMore("goal")}>Goal</button><button type="button" className={page.kind === "log" ? "is-active" : ""} onClick={() => navigateFromMore("log")}>Run History &amp; Backup</button><button type="button" className={page.kind === "guides" ? "is-active" : ""} onClick={() => navigateFromMore("guides")}>Guides</button><button type="button" onClick={() => { closeMore(); setShowOnboarding(true); }}>How this plan works</button></div></details>
    </nav>
    {showOnboarding && <PlanOnboarding onDismiss={dismissOnboarding} />}
    {page.kind === "today" ? <TodayPage store={training.store} onSaveEntry={training.upsertEntry} onSaveRoutine={training.upsertRoutineCompletion} onOpenStrength={() => navigate("strength")} focusLog={focusTodayLog} onLogFocused={() => setFocusTodayLog(false)} />
      : page.kind === "current" ? <CurrentPlanPage store={training.store} onSaveCheckIn={training.upsertCheckIn} onSaveDecision={training.saveDecision} onOpenWorkout={(target, sessionId) => { setFocusStrengthSession(sessionId); navigate(target); }} />
      : page.kind === "progress" ? <ProgressPage store={training.store} onAddBenchmark={training.addBenchmark} onSavePaceGuidance={training.savePaceGuidance} onLogRun={openTodayLog} />
      : page.kind === "log" ? <RunLogPage store={training.store} onSave={training.upsertEntry} onDelete={training.deleteEntry} onRestore={training.restoreStore} />
      : page.kind === "goal" ? <GoalPage />
      : page.kind === "guides" ? <RunningGuidesPage />
      : page.kind === "strength" ? <WorkoutPlanPage store={training.store} onSaveLog={training.upsertStrengthLog} onSaveDecision={training.saveStrengthDecision} onSaveRoutine={training.upsertRoutineCompletion} focusSessionId={focusStrengthSession} />
      : <PlanPage plan={selectedPlan} plans={plans} onSelectPlan={(id) => setPage({ kind: "roadmap", id })} />}
  </div>;
}
