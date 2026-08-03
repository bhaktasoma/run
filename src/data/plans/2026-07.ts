import type { Plan } from "../../types";

const DASH = "—";
const EASY = "RPE 2–4; about 13:30–14:30/mi only when comfortable";
const RECOVERY = "RPE 2–3; about 14:00–15:00/mi or slower as needed";

const plan: Plan = {
  id: "2026-08",
  title: "August Training Plan",
  intro:
    "A conservative post-race reset after the July 26 San Francisco Half Marathon. Pace ranges are references, not requirements: recovery, normal walking, and pain-free running come first.",
  priorities: [
    "Use four running days at first; add a fifth only in Week 4 if recovery is normal.",
    "Keep every run easy this month. Skip strides if the legs are not fully recovered.",
    "Stop and replace a run with rest or walking for pain that changes stride, swelling, or worsening fatigue.",
  ],
  weeks: [
    {
      title: "Week 1",
      subtitle: "July 27 – August 2",
      note: "Post-race recovery",
      weeklyMileage: "0 planned miles",
      days: [
        { day: "Monday", date: "Jul 27", run: "REST", miles: DASH, pace: DASH, strength: DASH, core: DASH, mobility: "Optional gentle walk" },
        { day: "Tuesday", date: "Jul 28", run: "REST / Easy Walk", miles: DASH, pace: "Conversational", strength: DASH, core: DASH, mobility: "10–20 min" },
        { day: "Wednesday", date: "Jul 29", run: "REST", miles: DASH, pace: DASH, strength: DASH, core: DASH, mobility: "Gentle mobility" },
        { day: "Thursday", date: "Jul 30", run: "Easy Walk", miles: DASH, pace: "Comfortable", strength: DASH, core: "Optional 10 min", mobility: "15–25 min" },
        { day: "Friday", date: "Jul 31", run: "REST", miles: DASH, pace: DASH, strength: DASH, core: DASH, mobility: "Optional stretch" },
        { day: "Saturday", date: "Aug 1", run: "Easy Walk", miles: DASH, pace: "Comfortable", strength: DASH, core: DASH, mobility: "20–30 min" },
        { day: "Sunday", date: "Aug 2", run: "REST", miles: DASH, pace: DASH, strength: DASH, core: DASH, mobility: "Optional gentle walk" },
      ],
    },
    {
      title: "Week 2",
      subtitle: "August 3 – August 9",
      note: "Four run days",
      weeklyMileage: "12 miles",
      days: [
        { day: "Monday", date: "Aug 3", run: "Easy Run", miles: "3", pace: EASY, strength: "Upper Body", core: "10 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 4", run: "Rest / Walk", miles: DASH, pace: DASH, strength: "Light Legs", core: DASH, mobility: "15 min" },
        { day: "Wednesday", date: "Aug 5", run: "Easy Run", miles: "3", pace: EASY, strength: DASH, core: "10 min", mobility: "10 min" },
        { day: "Thursday", date: "Aug 6", run: "Recovery Run", miles: "2", pace: RECOVERY, strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Friday", date: "Aug 7", run: "Rest", miles: DASH, pace: DASH, strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Saturday", date: "Aug 8", run: "Long Easy Run", miles: "4", pace: EASY, strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 9", run: "Rest / Walk", miles: DASH, pace: DASH, strength: DASH, core: "Optional", mobility: "15–25 min" },
      ],
    },
    {
      title: "Week 3",
      subtitle: "August 10 – August 16",
      note: "Four run days",
      weeklyMileage: "15 miles",
      days: [
        { day: "Monday", date: "Aug 10", run: "Easy Run", miles: "3", pace: EASY, strength: "Upper Body", core: "10 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 11", run: "Rest / Walk", miles: DASH, pace: DASH, strength: "Heavy Legs *(controlled; leave 2–3 reps in reserve)*", core: DASH, mobility: "10 min" },
        { day: "Wednesday", date: "Aug 12", run: "Easy Run", miles: "4", pace: EASY, strength: DASH, core: "10 min", mobility: "10 min" },
        { day: "Thursday", date: "Aug 13", run: "Recovery Run", miles: "3", pace: RECOVERY, strength: DASH, core: DASH, mobility: "15 min" },
        { day: "Friday", date: "Aug 14", run: "Rest", miles: DASH, pace: DASH, strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Saturday", date: "Aug 15", run: "Long Easy Run", miles: "5", pace: EASY, strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 16", run: "Rest / Walk", miles: DASH, pace: DASH, strength: DASH, core: "Optional", mobility: "15–25 min" },
      ],
    },
    {
      title: "Week 4",
      subtitle: "August 17 – August 23",
      note: "Optional fifth run",
      weeklyMileage: "15–17 miles",
      days: [
        { day: "Monday", date: "Aug 17", run: "Easy Run", miles: "3", pace: EASY, strength: "Upper Body", core: "10 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 18", run: "Easy Run + optional 4 × 20-sec strides", miles: "3", pace: "RPE 2–4; strides relaxed, only if fully recovered", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Wednesday", date: "Aug 19", run: "Rest / Walk", miles: DASH, pace: DASH, strength: "Heavy Legs *(controlled; leave 2–3 reps in reserve)*", core: "10 min", mobility: "10 min" },
        { day: "Thursday", date: "Aug 20", run: "Easy Run", miles: "3", pace: EASY, strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Friday", date: "Aug 21", run: "Rest", miles: DASH, pace: DASH, strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Saturday", date: "Aug 22", run: "Long Easy Run", miles: "6", pace: EASY, strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 23", run: "Optional Easy Run or Rest", miles: "0–2", pace: RECOVERY, strength: DASH, core: "Optional", mobility: "15 min" },
      ],
    },
    {
      title: "Week 5",
      subtitle: "August 24 – August 30",
      note: "Recovery week · four run days",
      weeklyMileage: "15 miles",
      days: [
        { day: "Monday", date: "Aug 24", run: "Easy Run", miles: "3", pace: EASY, strength: "Upper Body", core: "10 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 25", run: "Rest / Walk", miles: DASH, pace: DASH, strength: "Heavy Legs *(reduced volume)*", core: DASH, mobility: "15 min" },
        { day: "Wednesday", date: "Aug 26", run: "Easy Run", miles: "3", pace: EASY, strength: DASH, core: "10 min", mobility: "10 min" },
        { day: "Thursday", date: "Aug 27", run: "Recovery Run", miles: "3", pace: RECOVERY, strength: DASH, core: DASH, mobility: "15 min" },
        { day: "Friday", date: "Aug 28", run: "Rest", miles: DASH, pace: DASH, strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Saturday", date: "Aug 29", run: "Long Easy Run", miles: "6", pace: EASY, strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 30", run: "Rest / Walk", miles: DASH, pace: DASH, strength: DASH, core: "Optional", mobility: "15–25 min" },
      ],
    },
  ],
};

export default plan;
