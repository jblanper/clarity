/** A single day's habit tracking entry. The date field is the primary key. */
export interface HabitEntry {
  // Primary key — format: YYYY-MM-DD
  date: string;

  // Boolean habit values keyed by habit UUID
  booleanHabits: Record<string, boolean>;

  // Numeric habit values keyed by habit UUID
  numericHabits: Record<string, number>;

  // UUIDs of the joy tags selected for this day
  joyTags: string[];

  // Free-text end-of-day reflection
  reflection: string;

  // ISO timestamp set when an entry is updated after its initial save
  lastEdited?: string;
}
