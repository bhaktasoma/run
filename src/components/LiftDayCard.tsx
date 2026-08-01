import type { LiftDay } from "../types";
import ExerciseReference from "./ExerciseReference";

interface LiftDayCardProps {
  liftDay: LiftDay;
}

export default function LiftDayCard({ liftDay }: LiftDayCardProps) {
  return (
    <section className="panel">
      <header className="panel__header">
        <h3>
          {liftDay.day} — {liftDay.title}
        </h3>
        {liftDay.duration && <span className="panel__duration">{liftDay.duration}</span>}
      </header>
      {liftDay.note && <p className="panel__note">{liftDay.note}</p>}

      <table className="data-table workout-table">
        <colgroup>
          <col className="workout-table__exercise" />
          <col className="workout-table__number" />
          <col className="workout-table__number" />
        </colgroup>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
          </tr>
        </thead>
        <tbody>
          {liftDay.rows.map((row) => (
            <tr key={row.exercise}>
              <td>
                {row.exercise}
                <ExerciseReference exercise={row.exercise} />
              </td>
              <td>{row.sets}</td>
              <td>{row.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {liftDay.restNote && <p className="panel__footnote">{liftDay.restNote}</p>}
      {liftDay.finishNote && <p className="panel__footnote">{liftDay.finishNote}</p>}
    </section>
  );
}
