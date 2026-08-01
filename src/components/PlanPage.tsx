import type { Plan } from "../types";
import WeekCard from "./WeekCard";

interface PlanPageProps {
  plan: Plan;
}

export default function PlanPage({ plan }: PlanPageProps) {
  return (
    <div className="plan-page">
      <h1 className="plan-page__title">{plan.title}</h1>
      {plan.weeks.map((week) => (
        <WeekCard key={week.title} week={week} />
      ))}
    </div>
  );
}
