import type { Plan, PlanSection } from "../types";
import WeekCard from "./WeekCard";

interface PlanPageProps {
  plan: Plan;
}

export default function PlanPage({ plan }: PlanPageProps) {
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
        <h1 className="plan-page__title">{plan.title}</h1>
        {plan.intro && <p>{plan.intro}</p>}
      </header>
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
        <WeekCard key={week.title} week={week} />
      ))}
      {renderSections(plan.afterWeeks)}
    </div>
  );
}
