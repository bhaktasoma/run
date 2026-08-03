export default function GoalPage() {
  return (
    <main className="goal-page">
      <header className="goal-page__hero">
        <p className="goal-page__eyebrow">2027–2028 Race Roadmap</p>
        <h1>Go farther. Finish stronger.</h1>
        <p className="goal-page__intro">
          Build speed and endurance through two half marathons before taking on a first full marathon in 2028.
        </p>
      </header>

      <div className="goal-grid">
        <section className="goal-card">
          <span className="goal-card__number">01</span>
          <h2>First 2027 Half Marathon</h2>
          <p>Provisional window: late May or early June. Choose a race and use the result to measure progress.</p>
          <p className="goal-card__metric">Goal: healthy, controlled benchmark</p>
          <p>Choose the final pace from spring workouts rather than forcing 10:00/mile before it is sustainable.</p>
        </section>

        <section className="goal-card">
          <span className="goal-card__number">02</span>
          <h2>Monterey Bay Half Marathon</h2>
          <p>Race on November 14, 2027 after a dedicated late-summer and fall training block.</p>
          <p className="goal-card__metric">Consider 10:00/mile if benchmarks support it</p>
          <p>Treat the pace as earned by training—not guaranteed by the calendar.</p>
          <a className="goal-card__link" href="https://www.montereybayhalfmarathon.org/" target="_blank" rel="noreferrer">
            Official Monterey Bay race site <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="goal-card">
          <span className="goal-card__number">03</span>
          <h2>Spring 2028 Endurance Event</h2>
          <p>Run an optional half marathon or supported long-run event.</p>
          <p className="goal-card__metric">Goal: reinforce endurance and fueling</p>
          <p>Use this event to prepare for marathon training without needing an all-out performance.</p>
        </section>

        <section className="goal-card">
          <span className="goal-card__number">04</span>
          <h2>First Full Marathon Options</h2>
          <p>Complete the first full marathon in fall 2028 after a dedicated marathon-specific block. Official 2028 dates are still to be announced.</p>
          <p className="goal-card__metric">Primary goal: finish strong</p>
          <p>Build patiently, respect the distance, and reach the final miles prepared to keep moving well.</p>
          <div className="goal-card__options">
            <div>
              <strong>Long Beach Marathon</strong>
              <span>Provisional early October target · flatter coastal course</span>
              <a className="goal-card__link" href="https://runlongbeach.com/" target="_blank" rel="noreferrer">
                Official race site <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div>
              <strong>Santa Cruz Marathon</strong>
              <span>Provisional fall alternative · rugged coastal terrain</span>
              <a className="goal-card__link" href="https://www.runsantacruz.com/" target="_blank" rel="noreferrer">
                Official race site <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
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

        <section className="rpe-guide">
          <header className="rpe-guide__header">
            <h3>Practical RPE Guide</h3>
            <p>RPE measures how hard the effort feels to you on a scale from 1 to 10.</p>
          </header>
          <div className="rpe-guide__grid">
            <article className="rpe-level">
              <span className="rpe-level__score">1–2</span>
              <div>
                <h4>Very Easy</h4>
                <p>Walking, warming up, or extremely gentle recovery. Breathing feels normal.</p>
              </div>
            </article>
            <article className="rpe-level rpe-level--highlight">
              <span className="rpe-level__score">3–4</span>
              <div>
                <h4>Easy and Conversational</h4>
                <p>You can speak in full sentences and continue for a long time. This is the target for easy runs, long runs, and easy hikes.</p>
              </div>
            </article>
            <article className="rpe-level">
              <span className="rpe-level__score">5–6</span>
              <div>
                <h4>Moderate</h4>
                <p>Breathing is deeper. You can talk in short sentences, but the effort requires attention.</p>
              </div>
            </article>
            <article className="rpe-level">
              <span className="rpe-level__score">7</span>
              <div>
                <h4>Comfortably Hard</h4>
                <p>Used for tempo work and strides. You can say only a few words at a time while staying controlled.</p>
              </div>
            </article>
            <article className="rpe-level">
              <span className="rpe-level__score">8–9</span>
              <div>
                <h4>Very Hard</h4>
                <p>Used for short intervals or hill repeats. Talking is difficult, and the effort is sustainable only briefly.</p>
              </div>
            </article>
            <article className="rpe-level">
              <span className="rpe-level__score">10</span>
              <div>
                <h4>Maximum Effort</h4>
                <p>An all-out effort that lasts only a short time. It is rarely needed in this training plan.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="workout-explainer">
          <header className="workout-explainer__header">
            <span className="workout-explainer__tag">Example Workout</span>
            <h3>Easy + 4×20-Second Strides</h3>
            <p>Finish the scheduled easy run, then add four short, smooth accelerations.</p>
          </header>

          <ol className="workout-steps">
            <li>
              <span>1</span>
              <div><strong>Run easy first</strong><p>Complete the planned easy mileage at conversational RPE 3–4.</p></div>
            </li>
            <li>
              <span>2</span>
              <div><strong>Accelerate smoothly</strong><p>Build speed gradually for about 5 seconds instead of sprinting immediately.</p></div>
            </li>
            <li>
              <span>3</span>
              <div><strong>Run fast but relaxed</strong><p>Hold a quick, controlled effort for about 10 seconds at RPE 7. Keep your shoulders, hands, and face relaxed.</p></div>
            </li>
            <li>
              <span>4</span>
              <div><strong>Ease back down</strong><p>Decelerate smoothly during the final 5 seconds. Do not stop abruptly.</p></div>
            </li>
            <li>
              <span>5</span>
              <div><strong>Recover fully</strong><p>Walk or jog easily for 60–90 seconds, or until your breathing is comfortable, before the next stride.</p></div>
            </li>
            <li>
              <span>6</span>
              <div><strong>Repeat four times</strong><p>Each stride lasts 20 seconds. All four should feel smooth, quick, and controlled—not all-out.</p></div>
            </li>
          </ol>

          <div className="workout-explainer__summary">
            <p><strong>Purpose:</strong> Practice efficient, faster running without the fatigue of a hard interval workout.</p>
            <p><strong>Good location:</strong> A flat, safe, uninterrupted path or track.</p>
            <p><strong>Avoid:</strong> Sprinting at maximum effort, racing the watch, or shortening the recovery.</p>
          </div>
        </section>

        <section className="workout-explainer">
          <header className="workout-explainer__header">
            <span className="workout-explainer__tag">Example Workout</span>
            <h3>Hill Repeats: 7×60 Seconds</h3>
            <p>Run uphill at a strong, controlled effort for 60 seconds, recover downhill, and repeat seven times.</p>
          </header>

          <ol className="workout-steps">
            <li>
              <span>1</span>
              <div><strong>Warm up</strong><p>Run easily for 10–15 minutes, then add a few leg swings or short relaxed accelerations.</p></div>
            </li>
            <li>
              <span>2</span>
              <div><strong>Choose the hill</strong><p>Use a safe, moderate, steady incline that takes at least 60 seconds to climb and has little traffic.</p></div>
            </li>
            <li>
              <span>3</span>
              <div><strong>Run uphill for 60 seconds</strong><p>Hold RPE 7–8: hard and powerful, but controlled enough to complete all seven repeats with good form.</p></div>
            </li>
            <li>
              <span>4</span>
              <div><strong>Recover downhill</strong><p>Walk or jog gently back to the start. Begin again when your breathing is controlled—usually after 90 seconds to 3 minutes.</p></div>
            </li>
            <li>
              <span>5</span>
              <div><strong>Repeat seven times</strong><p>Aim for consistent effort. The final repeat should be challenging, but it should not become a sprint.</p></div>
            </li>
            <li>
              <span>6</span>
              <div><strong>Cool down</strong><p>Finish with 10–15 minutes of easy running or walking to bring your effort down gradually.</p></div>
            </li>
          </ol>

          <div className="workout-explainer__summary">
            <p><strong>What “5 miles” means:</strong> Five miles is the entire session, including the easy warm-up, seven uphill repeats, downhill recoveries, and easy cool-down. Only the 60-second uphill portions are at RPE 7–8.</p>
            <p><strong>Example 5-mile structure:</strong> Run about 1–1.5 easy miles, complete the seven hill repeats with easy downhill recoveries, then run easily until your watch reaches 5 total miles. Exact segment distances will vary with the hill.</p>
            <p><strong>Form:</strong> Stand tall with a slight lean from the ankles, use quick short steps, drive your arms, and look ahead.</p>
            <p><strong>Purpose:</strong> Build running strength, power, aerobic capacity, and efficient form.</p>
            <p><strong>Ignore pace:</strong> Hills make watch pace misleading. Use RPE and consistent effort instead.</p>
            <p><strong>Stop early if:</strong> Your form breaks down, you feel sharp pain, or the route becomes unsafe.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
