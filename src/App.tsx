import { useState } from "react";
import plans from "./data/plans";
import PlanPage from "./components/PlanPage";
import WorkoutPlanPage from "./components/WorkoutPlanPage";
import GoalPage from "./components/GoalPage";
import RunLogPage from "./components/RunLogPage";
import TodayPage from "./components/TodayPage";
import CurrentPlanPage from "./components/CurrentPlanPage";
import ProgressPage from "./components/ProgressPage";
import useTrainingStore from "./hooks/useTrainingStore";
import "./App.css";

type Page = { kind: "today" } | { kind: "current" } | { kind: "progress" } | { kind: "plan"; id: string } | { kind: "workout" } | { kind: "goal" } | { kind: "log" };

const monthOptions = Array.from({ length: 27 }, (_, index) => {
  const date = new Date(2026, 7 + index, 1);

  return {
    id: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
});

function App() {
  const [page, setPage] = useState<Page>({ kind: "today" });
  const training = useTrainingStore();
  const selectedPlan = page.kind === "plan" ? plans.find((plan) => plan.id === page.id) : undefined;

  return (
    <div className="app">
      <nav className="app__nav" aria-label="Primary navigation">
        <div className="app__brand" aria-label="Run Training home">
          <span className="app__brand-mark">R</span>
          <span className="app__brand-name">Run Training</span>
        </div>
        <button type="button" className={page.kind === "today" ? "app__nav-btn is-active" : "app__nav-btn"} onClick={() => setPage({ kind: "today" })}>Today</button>
        <button type="button" className={page.kind === "current" ? "app__nav-btn is-active" : "app__nav-btn"} onClick={() => setPage({ kind: "current" })}>Current Plan</button>
        <button type="button" className={page.kind === "progress" ? "app__nav-btn is-active" : "app__nav-btn"} onClick={() => setPage({ kind: "progress" })}>Progress</button>
        <label className="app__month-picker">
          <span className="sr-only">Select training plan month</span>
          <select
            className="app__month-select"
            value={page.kind === "plan" ? page.id : ""}
            onChange={(event) => setPage({ kind: "plan", id: event.target.value })}
          >
            {page.kind !== "plan" && <option value="">Select month</option>}
            {monthOptions.map((month) => (
              <option key={month.id} value={month.id}>
                {month.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={page.kind === "workout" ? "app__nav-btn is-active" : "app__nav-btn"}
          onClick={() => setPage({ kind: "workout" })}
        >
          Strength
        </button>
        <button
          type="button"
          className={page.kind === "goal" ? "app__nav-btn is-active" : "app__nav-btn"}
          onClick={() => setPage({ kind: "goal" })}
        >
          Goal
        </button>
        <button
          type="button"
          className={page.kind === "log" ? "app__nav-btn is-active" : "app__nav-btn"}
          onClick={() => setPage({ kind: "log" })}
        >
          Run Log
        </button>
      </nav>

      {page.kind === "today" ? (
        <TodayPage store={training.store} onSaveEntry={training.upsertEntry} />
      ) : page.kind === "current" ? (
        <CurrentPlanPage store={training.store} onSaveCheckIn={training.upsertCheckIn} onSaveDecision={training.saveDecision} />
      ) : page.kind === "progress" ? (
        <ProgressPage store={training.store} onAddBenchmark={training.addBenchmark} onSavePaceGuidance={training.savePaceGuidance} />
      ) : page.kind === "log" ? (
        <RunLogPage store={training.store} onSave={training.upsertEntry} onDelete={training.deleteEntry} />
      ) : page.kind === "goal" ? (
        <GoalPage />
      ) : page.kind === "workout" ? (
        <WorkoutPlanPage store={training.store} onSaveLog={training.upsertStrengthLog} onSaveDecision={training.saveStrengthDecision} onSelectAb={training.selectAbExercise} />
      ) : selectedPlan ? (
        <PlanPage plan={selectedPlan} completions={training.store.roadmapCompletions} onCompletionChange={training.setRoadmapCompletion} />
      ) : (
        <div className="plan-page__empty">
          <h1>{monthOptions.find((month) => month.id === page.id)?.label}</h1>
          <p>No training plan has been added for this month yet.</p>
        </div>
      )}
    </div>
  );
}

export default App;
