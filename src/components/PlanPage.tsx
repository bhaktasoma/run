import type { Plan, PlanSection } from "../types";
import WeekCard from "./WeekCard";
import { roadmapMonthLabel } from "../data/roadmapAlignment.ts";

interface PlanPageProps {
  plan: Plan;
  plans: Plan[];
  onSelectPlan: (id: string) => void;
}

export default function PlanPage({ plan, plans, onSelectPlan }: PlanPageProps) {
  const renderSections = (sections: PlanSection[] = []) =>
    sections.map((section, index) => (
      <section
        className={section.callout ? "plan-section plan-section--callout" : "plan-section"}
        key={`${section.title ?? "section"}-${index}`}
      >
        {section.title && <h2>{section.title}</h2>}
        {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {section.bullets && (
          <ul>
            {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        )}
        {section.table && (
          <div className="plan-section__table-wrap">
            <table className="data-table">
              <thead>
                <tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, rowIndex) => (
                  <tr key={`${row[0]}-${rowIndex}`}>
                    {row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    ));

  return (
    <div className="plan-page">
      <header className="plan-page__header">
        <p className="goal-page__eyebrow">Long-Term Roadmap</p>
        <h1 className="plan-page__title">{plan.title}</h1>
        {plan.intro && <p>{plan.intro}</p>}
        <label className="roadmap-month-picker">Roadmap month<select value={plan.id} onChange={(event) => onSelectPlan(event.target.value)}>{plans.map((item) => <option key={item.id} value={item.id}>{roadmapMonthLabel(item.id)}</option>)}</select></label>
      </header>
      <aside className="roadmap-note">The long-term roadmap shows the intended direction through 2028. Only the current rolling eight-week plan is a specific prescription. Future weeks will be adjusted using completed training, recovery, benchmarks, health, and schedule.</aside>
      {plan.priorities && (
        <section className="plan-section">
          <h2>Priorities</h2>
          <ul className="plan-priorities">
            {plan.priorities.map((priority) => <li key={priority}>{priority}</li>)}
          </ul>
        </section>
      )}
      {renderSections(plan.beforeWeeks)}
      {plan.weeks.map((week) => (
        <WeekCard key={`${plan.id}-${week.title}`} week={week} />
      ))}
      {renderSections(plan.afterWeeks)}
    </div>
  );
}
