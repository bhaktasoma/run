import type { DayEntry } from "../types";

interface FuelingGuideProps {
  entry: DayEntry;
}

type FuelingLevel = "short" | "medium" | "long" | "half" | "marathon";

const getLevel = (entry: DayEntry): FuelingLevel => {
  const run = entry.run.toLowerCase();
  if (run.includes("marathon") && !run.includes("half")) return "marathon";
  if (run.includes("half marathon")) return "half";
  const miles = Number.parseFloat(entry.miles);
  if (miles >= 12) return "long";
  if (miles >= 7) return "medium";
  return "short";
};

const duringGuidance: Record<FuelingLevel, string> = {
  short: "Water is usually enough. Carbohydrate during the run is optional unless the session exceeds about 60–75 minutes.",
  medium: "Begin early and practice approximately 30–45 g carbohydrate per hour, divided into small amounts every 15–20 minutes.",
  long: "Begin within the first 20–30 minutes. Practice 45–60 g carbohydrate per hour; increase only gradually and only if your stomach tolerates it.",
  half: "Use the breakfast and products already tested in long runs. Aim for the practiced carbohydrate schedule—typically 30–60 g per hour—and start before fatigue appears.",
  marathon: "Use only the fully rehearsed race plan. Build toward at least 45–60 g carbohydrate per hour, and consider more only after repeated successful practice on long runs.",
};

const labels: Record<FuelingLevel, string> = {
  short: "Short long-run fueling",
  medium: "75–150 minute fueling",
  long: "Over 150 minute fueling",
  half: "Half-marathon fueling",
  marathon: "Marathon fueling",
};

export default function FuelingGuide({ entry }: FuelingGuideProps) {
  const level = getLevel(entry);

  return (
    <details className="fueling-guide">
      <summary>Fueling guide</summary>
      <div className="fueling-guide__panel">
        <strong>{labels[level]}</strong>
        <dl>
          <div>
            <dt>Night before</dt>
            <dd>Eat a familiar carbohydrate-focused meal with moderate protein. Hydrate normally; avoid overeating and unfamiliar, very fatty, spicy, or high-fiber foods.</dd>
          </div>
          <div>
            <dt>Morning</dt>
            <dd>Eat a familiar carbohydrate-rich breakfast 2–4 hours before the run. If useful, add a small low-fiber snack 30–60 minutes before starting.</dd>
          </div>
          <div>
            <dt>During</dt>
            <dd>{duringGuidance[level]} Drink to thirst; include electrolytes when duration, heat, or sweat loss warrants them.</dd>
          </div>
          <div>
            <dt>After</dt>
            <dd>Within about two hours, eat carbohydrates plus 15–25 g protein. Continue fluids, electrolytes as needed, and normal balanced meals.</dd>
          </div>
        </dl>
        <p><strong>Practice rule:</strong> Record what you used, timing, energy, thirst, and stomach comfort. Never introduce a new product on race day.</p>
      </div>
    </details>
  );
}
