import type { HabitEntry } from "@/types/entry";

/** Creates a blank entry for the given date with no habit values recorded. */
export function createEmptyEntry(date: string): HabitEntry {
  return {
    date,
    habits: {},
    numeric: {},
    moments: [],
    reflection: "",
  };
}
