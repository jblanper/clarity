/** Three-state value for a boolean habit: not done, done, or done with joy. */
export interface HabitState {
  done: boolean;
  joy: boolean;
}

/** A single day's habit tracking entry. The date field is the primary key. */
export interface HabitEntry {
  // Primary key — format: YYYY-MM-DD
  date: string;

  // Boolean habit states keyed by habit UUID
  habits: Record<string, HabitState>;

  // Numeric habit values keyed by habit UUID
  numeric: Record<string, number>;

  // UUIDs of the moments selected for this day
  moments: string[];

  // Free-text end-of-day reflection
  reflection: string;

  // ISO timestamp set when an entry is updated after its initial save
  lastEdited?: string;
}
