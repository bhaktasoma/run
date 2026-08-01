import type { WorkoutPlan } from "../types";

const workoutPlan: WorkoutPlan = {
  liftDays: [
    {
      day: "Monday",
      title: "Heavy Upper Body",
      duration: "60 min",
      rows: [
        { exercise: "Bench Press (or Chest Press)", sets: "4", reps: "6–8" },
        { exercise: "Seated Cable Row", sets: "4", reps: "8" },
        { exercise: "Lat Pulldown", sets: "3", reps: "8–10" },
        { exercise: "Dumbbell Shoulder Press", sets: "3", reps: "8" },
        { exercise: "Incline Dumbbell Press", sets: "3", reps: "10" },
        { exercise: "Cable Face Pull", sets: "3", reps: "12" },
        { exercise: "Triceps Pushdown", sets: "3", reps: "12" },
        { exercise: "Dumbbell Curl", sets: "3", reps: "12" },
      ],
      restNote: "Rest: 90 sec for compound lifts, 60 sec for accessory lifts.",
    },
    {
      day: "Tuesday",
      title: "Runner's Leg Stability",
      duration: "30 min",
      note: "Focus on balance and injury prevention rather than heavy loading.",
      rows: [
        { exercise: "Bulgarian Split Squat", sets: "3", reps: "10/leg" },
        { exercise: "Step-ups", sets: "3", reps: "10/leg" },
        { exercise: "Single-leg Romanian Deadlift", sets: "3", reps: "10/leg" },
        { exercise: "Glute Bridge", sets: "3", reps: "12" },
        { exercise: "Mini-band Lateral Walk", sets: "3", reps: "15 steps each direction" },
        { exercise: "Standing Calf Raise", sets: "3", reps: "15" },
      ],
    },
    {
      day: "Wednesday",
      title: "Upper Body (Moderate)",
      rows: [
        { exercise: "Incline Dumbbell Press", sets: "3", reps: "10" },
        { exercise: "Cable Row", sets: "3", reps: "10" },
        { exercise: "Assisted Pull-up or Pulldown", sets: "3", reps: "10" },
        { exercise: "Lateral Raise", sets: "3", reps: "12" },
        { exercise: "Reverse Fly", sets: "3", reps: "12" },
        { exercise: "Hammer Curl", sets: "3", reps: "12" },
        { exercise: "Rope Triceps Extension", sets: "3", reps: "12" },
      ],
    },
    {
      day: "Friday",
      title: "Heavy Legs",
      duration: "60–75 min",
      note: "This is your primary lower-body strength session.",
      rows: [
        { exercise: "Back Squat (or Goblet Squat if preferred)", sets: "4", reps: "6–8" },
        { exercise: "Romanian Deadlift", sets: "4", reps: "8" },
        { exercise: "Walking Lunge", sets: "3", reps: "10/leg" },
        { exercise: "Leg Press (if available) or Front Squat", sets: "3", reps: "10" },
        { exercise: "Hamstring Curl", sets: "3", reps: "12" },
        { exercise: "Standing Calf Raise", sets: "4", reps: "15" },
      ],
      finishNote: "Finish with: 5–10 minutes of hip mobility and gentle stretching.",
    },
    {
      day: "Sunday",
      title: "Upper Body (Light / Hypertrophy)",
      rows: [
        { exercise: "Push-ups or Chest Press", sets: "3", reps: "12" },
        { exercise: "Seated Cable Row", sets: "3", reps: "12" },
        { exercise: "Arnold Press", sets: "3", reps: "12" },
        { exercise: "Lat Pulldown", sets: "3", reps: "12" },
        { exercise: "Lateral Raise", sets: "3", reps: "15" },
        { exercise: "Biceps Curl", sets: "3", reps: "15" },
        { exercise: "Triceps Pushdown", sets: "3", reps: "15" },
      ],
      finishNote: "Use lighter weights and focus on smooth, controlled movement.",
    },
  ],

  coreDays: [
    {
      day: "Monday",
      label: "Core A",
      rows: [
        { exercise: "Front Plank", sets: "3 × 45 sec" },
        { exercise: "Dead Bug", sets: "3 × 10/side" },
        { exercise: "Bird Dog", sets: "3 × 10/side" },
        { exercise: "Pallof Press", sets: "3 × 12/side" },
      ],
    },
    {
      day: "Tuesday",
      label: "Core B",
      rows: [
        { exercise: "Side Plank", sets: "3 × 30 sec/side" },
        { exercise: "Cable Wood Chop", sets: "3 × 12/side" },
        { exercise: "Farmer Carry", sets: "3 × 30–40 m" },
        { exercise: "Glute Bridge March", sets: "3 × 12" },
      ],
    },
    {
      day: "Thursday",
      label: "Core C",
      rows: [
        { exercise: "Hanging Knee Raise (or Captain's Chair)", sets: "3 × 10" },
        { exercise: "Mountain Climber", sets: "3 × 20" },
        { exercise: "Russian Twist (light weight)", sets: "3 × 20" },
        { exercise: "Superman", sets: "3 × 15" },
      ],
    },
    {
      day: "Friday",
      label: "Core D",
      rows: [
        { exercise: "Plank with Shoulder Tap", sets: "3 × 20 taps" },
        { exercise: "Suitcase Carry", sets: "3 × 30–40 m" },
        { exercise: "Copenhagen Plank (modified as needed)", sets: "3 × 20 sec/side" },
        { exercise: "Dead Bug", sets: "3 × 10/side" },
      ],
    },
  ],

  mobilityBefore: {
    title: "Before Running (5–7 min)",
    rows: [
      { exercise: "Leg Swings (front/back)", reps: "10/leg" },
      { exercise: "Leg Swings (side-to-side)", reps: "10/leg" },
      { exercise: "Walking Lunges", reps: "10/leg" },
      { exercise: "High Knees", reps: "30 sec" },
      { exercise: "Butt Kicks", reps: "30 sec" },
      { exercise: "Ankle Circles", reps: "10 each direction" },
    ],
  },

  mobilityAfter: {
    title: "After Running (8–10 min)",
    note: "Hold each stretch for 30–45 seconds.",
    items: [
      "Hip Flexor Stretch",
      "Hamstring Stretch",
      "Calf Stretch",
      "Figure-4 Glute Stretch",
      "Quad Stretch",
      "Child's Pose",
      "Thoracic Rotation",
    ],
  },

  progression: [
    { weeks: "1–4", goal: "Learn the movements and recover from the race", intensity: "~70% effort" },
    { weeks: "5–8", goal: "Increase weights gradually", intensity: "~75–80% effort" },
    { weeks: "9–12", goal: "Build strength", intensity: "~80–85% effort" },
    {
      weeks: "Recovery Week (every 4th week)",
      goal: "Reduce weight by ~20% and/or perform one fewer set",
      intensity: "Focus on quality movement",
    },
  ],

  recommendation: {
    title: "Recommendation",
    guidelines: [
      "Finish each set feeling like you could have done 1–2 more good reps.",
      "If you could easily do 4–5 more reps, the weight is too light.",
      "If you can't complete the target reps with good form, it's too heavy.",
    ],
    summary:
      "That approach is simple, sustainable, and effective for building lean muscle while leaving enough energy for the running workouts. It's the balance recommended for someone pursuing both endurance performance and strength.",
  },
};

export default workoutPlan;
