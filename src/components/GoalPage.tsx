export default function GoalPage() {
  return (
    <main className="goal-page">
      <header className="goal-page__hero">
        <p className="goal-page__eyebrow">2027 Race Goals</p>
        <h1>Go farther. Finish stronger.</h1>
        <p className="goal-page__intro">
          Build the endurance, speed, and resilience to take on two meaningful finish lines in 2027.
        </p>
      </header>

      <div className="goal-grid">
        <section className="goal-card">
          <span className="goal-card__number">01</span>
          <h2>Half Marathon</h2>
          <p>Run another half marathon in 2027 with a confident, controlled effort.</p>
          <p className="goal-card__metric">Target average pace: 10:00 per mile</p>
          <p>Arrive healthy, hold the goal pace consistently, and finish with strength left in reserve.</p>
        </section>

        <section className="goal-card">
          <span className="goal-card__number">02</span>
          <h2>First Marathon</h2>
          <p>Complete a first full marathon in 2027.</p>
          <p className="goal-card__metric">Primary goal: finish strong</p>
          <p>Build patiently, respect the distance, and reach the final miles prepared to keep moving well.</p>
        </section>
      </div>

      <section className="knowledge-section">
        <header className="knowledge-section__header">
          <p className="goal-page__eyebrow">Running Knowledge</p>
          <h2>Know what each workout is asking you to do</h2>
          <p>Use effort and purpose—not just the number on your watch—to guide each training day.</p>
        </header>

        <dl className="knowledge-grid">
          <div className="knowledge-card">
            <dt>Pace</dt>
            <dd>How long it takes to run one mile. A 10:00/mile pace means each mile takes ten minutes.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Easy Run</dt>
            <dd>A relaxed, conversational run that builds aerobic fitness without creating heavy fatigue.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Recovery Run</dt>
            <dd>A very gentle run—slower than an easy run—used to promote movement between harder sessions.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Long Run</dt>
            <dd>The week’s longest run. It develops endurance, confidence, fueling practice, and time on your feet.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Tempo Run</dt>
            <dd>A sustained, comfortably hard effort. You can speak only in short phrases, but the pace remains controlled.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Intervals</dt>
            <dd>Repeated faster efforts separated by easy jogging or rest, such as five 800-meter repeats.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Hill Repeats</dt>
            <dd>Strong uphill efforts followed by an easy walk or jog downhill. They build strength, form, and power.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Strides</dt>
            <dd>Short, smooth accelerations—usually 20 seconds—run fast but relaxed with full recovery between each.</dd>
          </div>
          <div className="knowledge-card">
            <dt>RPE</dt>
            <dd>Rate of Perceived Exertion: a 1–10 effort scale where 1 is extremely easy and 10 is an all-out effort.</dd>
          </div>
          <div className="knowledge-card">
            <dt>Warm-up &amp; Cool-down</dt>
            <dd>Easy movement before and after a quality workout that prepares the body and helps it return to rest.</dd>
          </div>
        </dl>

        <aside className="knowledge-section__note">
          <strong>Remember:</strong> Heat, hills, fatigue, and terrain can change your pace. When pace and RPE disagree, use the planned effort as your guide.
        </aside>
      </section>
    </main>
  );
}
