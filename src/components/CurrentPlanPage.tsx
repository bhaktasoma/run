import { useState } from "react";
import activePlan from "../data/activePlan.ts";
import { completedMileage, entriesForWeek, recommendWeek } from "../domain/progression.ts";
import type { RecommendationDecision, TrainingStore, WeeklyCheckIn } from "../domain/training.ts";
import { displayTrainingDate, trainingDateIso } from "../utils/trainingDate.ts";

interface CurrentPlanPageProps {
  store: TrainingStore;
  onSaveCheckIn: (checkIn: WeeklyCheckIn) => void;
  onSaveDecision: (decision: RecommendationDecision) => void;
}

export default function CurrentPlanPage({ store, onSaveCheckIn, onSaveDecision }: CurrentPlanPageProps) {
  const [openWeekId, setOpenWeekId] = useState(activePlan[0].id);
  const [checkIn, setCheckIn] = useState<WeeklyCheckIn>({ weekId: activePlan[0].id, sleepRecovery: "good", painAffectsMovement: false, confidence: "unchanged", longRunRecovery: "not-applicable" });
  const selectedWeek = activePlan.find((week) => week.id === openWeekId)!;
  const entries = entriesForWeek(selectedWeek, store.entries);
  const savedCheckIn = store.checkIns.find((item) => item.weekId === selectedWeek.id);
  const recommendation = recommendWeek(selectedWeek, entries, savedCheckIn, trainingDateIso());
  const savedDecision = store.decisions.find((item) => item.weekId === selectedWeek.id);

  const selectWeek = (weekId: string) => {
    setOpenWeekId(weekId);
    setCheckIn(store.checkIns.find((item) => item.weekId === weekId) ?? { weekId, sleepRecovery: "good", painAffectsMovement: false, confidence: "unchanged", longRunRecovery: "not-applicable" });
  };

  return (
    <main className="current-plan-page">
      <header className="section-hero"><p className="goal-page__eyebrow">Specific prescription</p><h1>Current 8-Week Plan</h1><p>Weeks 1–2 are prescribed. Weeks 3–8 remain adjustable using completed training, recovery, benchmarks, health, and schedule.</p></header>
      <div className="eight-week-strip" aria-label="Eight-week plan">
        {activePlan.map((week) => {
          const weekEntries = entriesForWeek(week, store.entries);
          return <button className={week.id === openWeekId ? "week-selector is-active" : "week-selector"} type="button" key={week.id} onClick={() => selectWeek(week.id)}><span>Week {activePlan.indexOf(week) + 1}</span><strong>{week.plannedMiles} mi</strong><small>{completedMileage(weekEntries).toFixed(1)} done · {week.status}</small></button>;
        })}
      </div>

      <section className="active-week-card">
        <header><div><p className="goal-page__eyebrow">{selectedWeek.status}</p><h2>{selectedWeek.label}</h2><p>{selectedWeek.objective}</p></div><strong>{selectedWeek.plannedMiles} miles</strong></header>
        <div className="active-workout-list">
          {selectedWeek.workouts.map((workout) => <article key={workout.id}><time dateTime={workout.date}>{displayTrainingDate(workout.date)}</time><div><strong>{workout.title}</strong><span>{workout.purpose}</span></div><div><strong>{workout.plannedMiles ? `${workout.plannedMiles} mi` : workout.duration ?? "—"}</strong><span>{workout.targetRpe}</span></div></article>)}
        </div>
      </section>

      <section className="check-in-card">
        <div><p className="goal-page__eyebrow">End-of-week check-in</p><h2>How did the week land?</h2></div>
        <form onSubmit={(event) => { event.preventDefault(); onSaveCheckIn(checkIn); }}>
          <label>Sleep and recovery<select value={checkIn.sleepRecovery} onChange={(event) => setCheckIn({ ...checkIn, sleepRecovery: event.target.value as WeeklyCheckIn["sleepRecovery"] })}><option value="good">Good</option><option value="mixed">Mixed</option><option value="poor">Poor</option></select></label>
          <label>Confidence<select value={checkIn.confidence} onChange={(event) => setCheckIn({ ...checkIn, confidence: event.target.value as WeeklyCheckIn["confidence"] })}><option value="improving">Improving</option><option value="unchanged">Unchanged</option><option value="declining">Declining</option></select></label>
          <label>Long-run recovery<select value={checkIn.longRunRecovery} onChange={(event) => setCheckIn({ ...checkIn, longRunRecovery: event.target.value as WeeklyCheckIn["longRunRecovery"] })}><option value="within-48h">Within 24–48 hours</option><option value="slower">Longer than 48 hours</option><option value="not-applicable">Not applicable</option></select></label>
          <label className="check-in-card__checkbox"><input type="checkbox" checked={checkIn.painAffectsMovement} onChange={(event) => setCheckIn({ ...checkIn, painAffectsMovement: event.target.checked })} /> Pain affected normal movement or running form</label>
          <button className="run-log-form__save" type="submit">Save check-in</button>
        </form>
        <div className="recommendation-card recommendation-card--nested"><span className={`recommendation-badge recommendation-badge--${recommendation.state.toLowerCase()}`}>{recommendation.state}</span><div><h3>{recommendation.summary}</h3><ul>{recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div><div className="decision-actions"><button type="button" onClick={() => onSaveDecision({ weekId: selectedWeek.id, state: recommendation.state, accepted: true, decidedAt: new Date().toISOString() })}>Accept</button><button type="button" onClick={() => onSaveDecision({ weekId: selectedWeek.id, state: recommendation.state, accepted: false, decidedAt: new Date().toISOString() })}>Decline</button></div>{savedDecision && <p className="decision-note">Recommendation {savedDecision.accepted ? "accepted" : "declined"}. The plan was not silently changed.</p>}</div>
      </section>
    </main>
  );
}
