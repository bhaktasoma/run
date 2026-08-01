import type { WorkoutPlan } from "../types";
import LiftDayCard from "./LiftDayCard";
import CoreDayCard from "./CoreDayCard";
import ExerciseReference from "./ExerciseReference";

interface WorkoutPlanPageProps {
  plan: WorkoutPlan;
}

export default function WorkoutPlanPage({ plan }: WorkoutPlanPageProps) {
  return (
    <div className="workout-page">
      <h1 className="plan-page__title">Workout Plan</h1>

      <section className="workout-section">
        <h2 className="workout-section__title">Strength Training</h2>
        <div className="workout-grid">
          {plan.liftDays.map((liftDay) => (
            <LiftDayCard key={liftDay.day} liftDay={liftDay} />
          ))}
        </div>
      </section>

      <section className="workout-section">
        <h2 className="workout-section__title">15-Minute Core Program</h2>
        <div className="workout-grid workout-grid--compact">
          {plan.coreDays.map((coreDay) => (
            <CoreDayCard key={coreDay.day} coreDay={coreDay} />
          ))}
        </div>
      </section>

      <section className="workout-section">
        <h2 className="workout-section__title">Daily Mobility (10–15 Minutes)</h2>
        <div className="workout-grid workout-grid--compact">
          <section className="panel panel--compact">
            <header className="panel__header">
              <h3>{plan.mobilityBefore.title}</h3>
            </header>
            <table className="data-table workout-table">
              <colgroup>
                <col className="workout-table__exercise--compact" />
                <col className="workout-table__sets" />
              </colgroup>
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Reps</th>
                </tr>
              </thead>
              <tbody>
                {plan.mobilityBefore.rows.map((row) => (
                  <tr key={row.exercise}>
                    <td>
                      {row.exercise}
                      <ExerciseReference exercise={row.exercise} />
                    </td>
                    <td>{row.reps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="panel panel--compact">
            <header className="panel__header">
              <h3>{plan.mobilityAfter.title}</h3>
            </header>
            <p className="panel__note">{plan.mobilityAfter.note}</p>
            <ul className="stretch-list">
              {plan.mobilityAfter.items.map((item) => (
                <li key={item}>
                  {item}
                  <ExerciseReference exercise={item} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className="workout-section">
        <h2 className="workout-section__title">Progressive Strength Plan</h2>
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Weeks</th>
                <th>Goal</th>
                <th>Intensity</th>
              </tr>
            </thead>
            <tbody>
              {plan.progression.map((row) => (
                <tr key={row.weeks}>
                  <td>{row.weeks}</td>
                  <td>{row.goal}</td>
                  <td>{row.intensity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="workout-section">
        <h2 className="workout-section__title">{plan.recommendation.title}</h2>
        <div className="panel">
          <ul className="stretch-list">
            {plan.recommendation.guidelines.map((guideline) => (
              <li key={guideline}>{guideline}</li>
            ))}
          </ul>
          <p className="panel__footnote">{plan.recommendation.summary}</p>
        </div>
      </section>
    </div>
  );
}
