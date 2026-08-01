import type { Plan } from "../../types";

const DASH = "—";

const plan: Plan = {
  id: "2026-08",
  title: "August Training Plan",
  weeks: [
    {
      title: "Week 1",
      subtitle: "July 27 – August 2",
      note: "Recovery",
      weeklyMileage: "13 miles",
      days: [
        { day: "Monday", date: "Jul 27", run: "REST", miles: DASH, pace: DASH, strength: DASH, core: DASH, mobility: "Walk + Stretch" },
        { day: "Tuesday", date: "Jul 28", run: "Walk / Bike", miles: DASH, pace: DASH, strength: DASH, core: "15 min", mobility: "15 min" },
        { day: "Wednesday", date: "Jul 29", run: "Easy Run", miles: "3", pace: "13:30–14:00", strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Jul 30", run: "Recovery Run", miles: "2", pace: "13:45–14:30", strength: DASH, core: "15 min", mobility: "15 min" },
        { day: "Friday", date: "Jul 31", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs *(70% effort)*", core: "15 min", mobility: "15 min" },
        { day: "Saturday", date: "Aug 1", run: "Long Run", miles: "5", pace: "13:15–13:45", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 2", run: "Easy Run", miles: "3", pace: "13:30–14:00", strength: "Upper Body", core: "Optional", mobility: "10 min" },
      ],
    },
    {
      title: "Week 2",
      subtitle: "August 3 – August 9",
      weeklyMileage: "24 miles",
      days: [
        { day: "Monday", date: "Aug 3", run: "Easy Run", miles: "4", pace: "13:15–13:45", strength: "Heavy Upper Body", core: "15 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 4", run: "Easy Run + 4 × 20 sec Strides", miles: "4", pace: "Easy", strength: "Light Legs", core: "15 min", mobility: "10 min" },
        { day: "Wednesday", date: "Aug 5", run: "Easy Run", miles: "4", pace: "13:15–13:45", strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Aug 6", run: "Recovery Run", miles: "3", pace: "13:45–14:15", strength: DASH, core: "15 min", mobility: "15 min" },
        { day: "Friday", date: "Aug 7", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "15 min", mobility: "15 min" },
        { day: "Saturday", date: "Aug 8", run: "Long Run", miles: "6", pace: "13:15–13:45", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 9", run: "Easy Run", miles: "3", pace: "13:30–14:00", strength: "Upper Body", core: "Optional", mobility: "10 min" },
      ],
    },
    {
      title: "Week 3",
      subtitle: "August 10 – August 16",
      weeklyMileage: "27 miles",
      days: [
        { day: "Monday", date: "Aug 10", run: "Easy Run", miles: "4", pace: "13:00–13:30", strength: "Heavy Upper Body", core: "15 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 11", run: "Easy Run + 6 × 20 sec Strides", miles: "5", pace: "Easy", strength: "Light Legs", core: "15 min", mobility: "10 min" },
        { day: "Wednesday", date: "Aug 12", run: "Easy Run", miles: "4", pace: "13:00–13:30", strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Aug 13", run: "Recovery Run", miles: "3", pace: "13:30–14:00", strength: DASH, core: "15 min", mobility: "15 min" },
        { day: "Friday", date: "Aug 14", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "15 min", mobility: "15 min" },
        { day: "Saturday", date: "Aug 15", run: "Long Run", miles: "7", pace: "13:00–13:30", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 16", run: "Easy Run", miles: "4", pace: "13:15–13:45", strength: "Upper Body", core: "Optional", mobility: "10 min" },
      ],
    },
    {
      title: "Week 4",
      subtitle: "August 17 – August 23",
      weeklyMileage: "27 miles",
      days: [
        { day: "Monday", date: "Aug 17", run: "Easy Run", miles: "4", pace: "13:00–13:30", strength: "Heavy Upper Body", core: "15 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 18", run: "**Tempo:** 1 mi easy + 2 mi @ Tempo + 1 mi easy", miles: "4", pace: "Tempo: **11:45–12:15**", strength: "Light Legs", core: "15 min", mobility: "10 min" },
        { day: "Wednesday", date: "Aug 19", run: "Easy Run", miles: "4", pace: "13:00–13:30", strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Aug 20", run: "Recovery Run", miles: "3", pace: "13:30–14:00", strength: DASH, core: "15 min", mobility: "15 min" },
        { day: "Friday", date: "Aug 21", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs", core: "15 min", mobility: "15 min" },
        { day: "Saturday", date: "Aug 22", run: "Long Run", miles: "8", pace: "13:00–13:30", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 23", run: "Easy Run", miles: "4", pace: "13:15–13:45", strength: "Upper Body", core: "Optional", mobility: "10 min" },
      ],
    },
    {
      title: "Week 5",
      subtitle: "August 24 – August 30",
      note: "Recovery Week",
      weeklyMileage: "21 miles",
      days: [
        { day: "Monday", date: "Aug 24", run: "Easy Run", miles: "3", pace: "13:15–13:45", strength: "Upper Body", core: "15 min", mobility: "10 min" },
        { day: "Tuesday", date: "Aug 25", run: "Easy Run", miles: "4", pace: "13:15–13:45", strength: "Light Legs", core: "15 min", mobility: "10 min" },
        { day: "Wednesday", date: "Aug 26", run: "Easy Run", miles: "3", pace: "13:15–13:45", strength: "Upper Body", core: DASH, mobility: "10 min" },
        { day: "Thursday", date: "Aug 27", run: "Recovery Run", miles: "2", pace: "13:45–14:15", strength: DASH, core: "15 min", mobility: "15 min" },
        { day: "Friday", date: "Aug 28", run: "Rest", miles: DASH, pace: DASH, strength: "Heavy Legs *(reduced volume)*", core: "15 min", mobility: "15 min" },
        { day: "Saturday", date: "Aug 29", run: "Long Run", miles: "6", pace: "13:15–13:45", strength: DASH, core: DASH, mobility: "10 min" },
        { day: "Sunday", date: "Aug 30", run: "Easy Run", miles: "3", pace: "13:30–14:00", strength: "Upper Body", core: "Optional", mobility: "10 min" },
      ],
    },
  ],
};

export default plan;
