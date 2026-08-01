import { useState } from "react";
import plans from "./data/plans";
import workoutPlan from "./data/workoutPlan";
import PlanPage from "./components/PlanPage";
import WorkoutPlanPage from "./components/WorkoutPlanPage";
import GoalPage from "./components/GoalPage";
import "./App.css";

type Page = { kind: "plan"; id: string } | { kind: "workout" } | { kind: "goal" };

const monthOptions = Array.from({ length: 12 }, (_, index) => {
  const date = new Date(2026, 7 + index, 1);

  return {
    id: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
});

function App() {
  const [page, setPage] = useState<Page>({ kind: "plan", id: monthOptions[0].id });
  const selectedPlan = page.kind === "plan" ? plans.find((plan) => plan.id === page.id) : undefined;

  return (
    <div className="app">
      <nav className="app__nav">
        <div className="app__brand" aria-label="Run Training home">
          <span className="app__brand-mark">R</span>
          <span className="app__brand-name">Run Training</span>
        </div>
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
          Workout Plan
        </button>
        <button
          type="button"
          className={page.kind === "goal" ? "app__nav-btn is-active" : "app__nav-btn"}
          onClick={() => setPage({ kind: "goal" })}
        >
          Goal
        </button>
      </nav>

      {page.kind === "goal" ? (
        <GoalPage />
      ) : page.kind === "workout" ? (
        <WorkoutPlanPage plan={workoutPlan} />
      ) : selectedPlan ? (
        <PlanPage plan={selectedPlan} />
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
