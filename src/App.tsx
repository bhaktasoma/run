import { useState } from "react";
import plans from "./data/plans";
import workoutPlan from "./data/workoutPlan";
import PlanPage from "./components/PlanPage";
import WorkoutPlanPage from "./components/WorkoutPlanPage";
import "./App.css";

type Page = { kind: "plan"; id: string } | { kind: "workout" };

function App() {
  const [page, setPage] = useState<Page>({ kind: "plan", id: plans[plans.length - 1].id });

  return (
    <div className="app">
      <nav className="app__nav">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={
              page.kind === "plan" && page.id === plan.id ? "app__nav-btn is-active" : "app__nav-btn"
            }
            onClick={() => setPage({ kind: "plan", id: plan.id })}
          >
            {plan.title}
          </button>
        ))}
        <button
          type="button"
          className={page.kind === "workout" ? "app__nav-btn is-active" : "app__nav-btn"}
          onClick={() => setPage({ kind: "workout" })}
        >
          Workout Plan
        </button>
      </nav>

      {page.kind === "workout" ? (
        <WorkoutPlanPage plan={workoutPlan} />
      ) : (
        <PlanPage plan={plans.find((plan) => plan.id === page.id) ?? plans[0]} />
      )}
    </div>
  );
}

export default App;
