import { useEffect, useState } from "react";
import type { GuidedRoutine, RoutineStep } from "../data/routines.ts";
import ExerciseReference from "./ExerciseReference.tsx";

interface RoutineChecklistProps {
  routine: GuidedRoutine;
  extraStep?: RoutineStep;
  status?: "completed" | "skipped";
  onStatus?: (status: "completed" | "skipped") => void;
  collapsible?: boolean;
}

function TimerButton({ step }: { step: RoutineStep }) {
  const base = Number(step.prescription.match(/\d+/)?.[0] ?? 0);
  const seconds = /minutes/i.test(step.prescription) ? base * 60 : base;
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [running, remaining]);
  useEffect(() => { if (remaining === 0) setRunning(false); }, [remaining]);
  if (!/seconds|minutes/i.test(step.prescription) || !seconds) return null;
  return <button className="routine-timer" type="button" onClick={() => { if (remaining === 0) setRemaining(seconds); setRunning((value) => !value); }} aria-label={`${running ? "Pause" : "Start"} timer for ${step.name}`}>{running ? "Pause" : remaining === 0 ? "Restart" : "Timer"} · <span aria-live="polite">{remaining}s</span></button>;
}

export default function RoutineChecklist({ routine, extraStep, status, onStatus, collapsible = false }: RoutineChecklistProps) {
  const steps = extraStep ? [...routine.steps, extraStep] : routine.steps;
  const [checked, setChecked] = useState<string[]>([]);
  const content = <div className="routine-checklist__body"><ol>{steps.map((step) => <li key={step.id}><label><input type="checkbox" checked={checked.includes(step.id)} onChange={() => setChecked((current) => current.includes(step.id) ? current.filter((id) => id !== step.id) : [...current, step.id])} /><span><strong>{step.name}</strong><small>{step.prescription}</small></span></label><span className="routine-checklist__tools">{step.demonstration && <ExerciseReference exercise={step.name} label="View" />}<TimerButton step={step} /></span></li>)}</ol>{routine.note && <p>{routine.note}</p>}{onStatus && <div className="routine-checklist__actions"><button type="button" onClick={() => onStatus("completed")}>Complete stage</button><button type="button" onClick={() => onStatus("skipped")}>Skip</button>{status && <span role="status">{status === "completed" ? "Completed" : "Skipped"}</span>}</div>}</div>;
  if (collapsible) return <details className="routine-checklist"><summary><span><strong>{routine.title}</strong><small>{routine.duration}{status ? ` · ${status}` : ""}</small></span></summary>{content}</details>;
  return <section className="routine-checklist" aria-labelledby={`${routine.id}-title`}><header><h3 id={`${routine.id}-title`}>{routine.title}</h3><span>{routine.duration}</span></header>{content}</section>;
}
