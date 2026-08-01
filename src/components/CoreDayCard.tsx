import type { CoreDay } from "../types";

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
      <table className="data-table">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
          </tr>
        </thead>
        <tbody>
          {coreDay.rows.map((row) => (
            <tr key={row.exercise}>
              <td>{row.exercise}</td>
              <td>{row.sets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
