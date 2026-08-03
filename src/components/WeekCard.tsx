import type { Week } from "../types";
import { formatText } from "../utils/formatText";
import FuelingGuide from "./FuelingGuide";

export default function WeekCard({ week }: { week: Week }) {
  return <section className="week-card">
    <header className="week-card__header"><div><h2>{week.title}{week.note && <span className="week-card__note">{week.note}</span>}</h2><p className="week-card__subtitle">{week.subtitle}</p></div><div className="week-card__stats"><span className="week-card__mileage">{week.weeklyMileage}</span></div></header>
    <div className="week-card__table-wrap"><table className="week-table roadmap-table"><thead><tr><th>Day / date</th><th>Workout</th><th>Distance</th><th>Effort</th><th>Strength</th></tr></thead><tbody>{week.days.map((entry) => <tr key={`${entry.day}-${entry.date}`}><td data-label="Day / date"><strong>{entry.day}</strong><br />{entry.date}</td><td data-label="Workout">{formatText(entry.run)}{(entry.run.includes("Long Run") || entry.run.includes("Marathon")) && <FuelingGuide entry={entry} />}</td><td data-label="Distance">{entry.miles}</td><td data-label="Effort">{formatText(entry.pace)}</td><td data-label="Strength">{formatText(entry.strength)}</td></tr>)}</tbody></table></div>
  </section>;
}
