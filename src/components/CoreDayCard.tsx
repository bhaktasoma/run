import type { CoreDay } from "../types";
import ExerciseReference from "./ExerciseReference";

interface CoreDayCardProps {
  coreDay: CoreDay;
}

export default function CoreDayCard({ coreDay }: CoreDayCardProps) {
  return (
    <section className="panel panel--compact">
      <header className="panel__header">
        <h3>
          {coreDay.label} <span className="panel__subtle">({coreDay.day})</span>
        </h3>
      </header>
      <table className="data-table workout-table">
        <colgroup>
          <col className="workout-table__exercise--compact" />
          <col className="workout-table__sets" />
        </colgroup>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
          </tr>
        </thead>
        <tbody>
          {coreDay.rows.map((row) => (
            <tr key={row.exercise}>
              <td>
                {row.exercise}
                <ExerciseReference exercise={row.exercise} />
              </td>
              <td>{row.sets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
