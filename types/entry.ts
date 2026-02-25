/** A single day's habit tracking entry. The date field is the primary key. */
export interface HabitEntry {
  // Primary key — format: YYYY-MM-DD
  date: string;

  // Boolean habits
  meditation: boolean;
  exercise: boolean;
  reading: boolean;
  journaling: boolean;
  drawing: boolean;

  // Numeric habits
  sleep: number;       // hours
  water: number;       // glasses
  screenTime: number;  // hours
  coffee: number;      // cups
  decafCoffee: number; // cups

  // Multiple selectable joy tags (e.g. "walked outside", "cooked", "called a friend")
  joyTags: string[];

  // Free-text end-of-day reflection
  reflection: string;
}
