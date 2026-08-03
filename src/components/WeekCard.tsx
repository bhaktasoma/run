import type { Week } from "../types";
import { formatText } from "../utils/formatText";
import FuelingGuide from "./FuelingGuide";

interface WeekCardProps {
  week: Week;
  planId: string;
  completions: Record<string, boolean>;
  onCompletionChange: (id: string, complete: boolean) => void;
}

export default function WeekCard({ week, planId, completions, onCompletionChange }: WeekCardProps) {
  const dayKeys = week.days.map((entry) => `${planId}|${entry.date}|${entry.day}|${entry.run}`);
  const checked = dayKeys.map((key) => Boolean(completions[key]));

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
                <td>
                  {formatText(entry.run)}
                  {(entry.run.includes("Long Run") || entry.run.includes("Marathon")) && <FuelingGuide entry={entry} />}
                </td>
                <td>{entry.miles}</td>
                <td>{formatText(entry.pace)}</td>
                <td>{formatText(entry.strength)}</td>
                <td>{entry.core}</td>
                <td>{entry.mobility}</td>
                <td className="week-table__check-col">
                  <input
                    type="checkbox"
                    checked={checked[index]}
                    onChange={(event) => onCompletionChange(dayKeys[index], event.target.checked)}
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
