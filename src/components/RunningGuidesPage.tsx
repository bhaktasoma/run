export default function RunningGuidesPage() {
  const guides = [
    ["RPE and pace", "RPE is your 1–10 effort rating. Easy running is usually RPE 3–4: conversational and sustainable. Pace is secondary and may change with heat, hills, fatigue, and terrain."],
    ["Strides", "After an easy run, accelerate smoothly for 20 seconds at fast-but-relaxed RPE 6–7. Walk or jog 60–90 seconds and repeat only while form stays smooth."],
    ["Hill repeats", "Run uphill for the prescribed time at strong, controlled effort. Recover fully downhill. Keep effort consistent and stop before form deteriorates."],
    ["Tempo running", "A controlled, comfortably hard effort around RPE 6–7. Use short phrases as the talk test and avoid turning the workout into a race."],
    ["Intervals", "Repeat faster efforts with prescribed easy recovery. Warm up, keep repetitions controlled, and prioritize repeatable effort over chasing watch pace."],
    ["Long-run fueling", "For runs longer than about 75 minutes, practice the breakfast, fluids, electrolytes, and carbohydrate plan you may use on race day. Refuel afterward with carbohydrate, protein, and fluids."],
  ];
  return <main className="goal-page"><header className="section-hero"><p className="goal-page__eyebrow">Running education</p><h1>Running Guides</h1><p>Open only the guidance needed for today’s workout. RPE remains primary and pace remains conditional.</p></header><section className="strength-education-grid">{guides.map(([title, body]) => <details className="strength-guide" key={title}><summary>{title}</summary><p>{body}</p></details>)}</section></main>;
}
