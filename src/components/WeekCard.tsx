import { useState } from "react";
import type { Week } from "../types";
import { formatText } from "../utils/formatText";

interface WeekCardProps {
  week: Week;
}

export default function WeekCard({ week }: WeekCardProps) {
  const [checked, setChecked] = useState<boolean[]>(() => week.days.map(() => false));

  const toggleDay = (index: number) => {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  const completedCount = checked.filter(Boolean).length;

  return (
    <section className="week-card">
      <header className="week-card__header">
        <div>
          <h2>
            {week.title}
            {week.note && <span className="week-card__note">{week.note}</span>}
          </h2>
          <p className="week-card__subtitle">{week.subtitle}</p>
        </div>
        <div className="week-card__stats">
          <span className="week-card__mileage">{week.weeklyMileage}</span>
          <span className="week-card__progress">
            {completedCount}/{week.days.length} days
          </span>
        </div>
      </header>

      <div className="week-card__table-wrap">
        <table className="week-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Run</th>
              <th>Miles</th>
              <th>Pace</th>
              <th>Strength</th>
              <th>Core</th>
              <th>Mobility</th>
              <th className="week-table__check-col">✓</th>
            </tr>
          </thead>
          <tbody>
            {week.days.map((entry, index) => (
              <tr key={entry.day} className={checked[index] ? "is-checked" : undefined}>
                <td>{entry.day}</td>
                <td>{entry.date}</td>
                <td>{formatText(entry.run)}</td>
                <td>{entry.miles}</td>
                <td>{formatText(entry.pace)}</td>
                <td>{formatText(entry.strength)}</td>
                <td>{entry.core}</td>
                <td>{entry.mobility}</td>
                <td className="week-table__check-col">
                  <input
                    type="checkbox"
                    checked={checked[index]}
                    onChange={() => toggleDay(index)}
                    aria-label={`Mark ${entry.day} ${entry.date} complete`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
