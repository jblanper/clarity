import type { HabitEntry } from "@/types/entry";

// Narrow key types derived from HabitEntry so configs stay in sync with the interface
export type BooleanHabitKey = Extract<
  keyof HabitEntry,
  "meditation" | "exercise" | "reading" | "journaling" | "drawing"
>;
export type NumericHabitKey = Extract<
  keyof HabitEntry,
  "sleep" | "water" | "screenTime" | "coffee" | "decafCoffee"
>;

export interface BooleanHabitConfig {
  key: BooleanHabitKey;
  label: string;
}

export interface NumericHabitConfig {
  key: NumericHabitKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export const BOOLEAN_HABITS: BooleanHabitConfig[] = [
  { key: "meditation", label: "Meditation" },
  { key: "exercise", label: "Exercise" },
  { key: "reading", label: "Reading" },
  { key: "journaling", label: "Journaling" },
  { key: "drawing", label: "Drawing" },
];

export const NUMERIC_HABITS: NumericHabitConfig[] = [
  { key: "sleep", label: "Sleep", unit: "hours", min: 0, max: 24, step: 0.5 },
  { key: "water", label: "Water", unit: "glasses", min: 0, max: 20, step: 1 },
  { key: "screenTime", label: "Screen time", unit: "hours", min: 0, max: 24, step: 0.5 },
  { key: "coffee", label: "Coffee", unit: "cups", min: 0, max: 10, step: 1 },
  { key: "decafCoffee", label: "Decaf coffee", unit: "cups", min: 0, max: 10, step: 1 },
];

export const DEFAULT_JOY_TAGS: string[] = [
  "Time in nature",
  "Great conversation",
  "Good food",
  "Calligraphy",
  "Drawing",
  "Poetry",
  "Music listening",
  "Music playing",
  "Gardening",
  "Making bread",
  "Meditation",
  "Time with friends",
];

/** Blank entry fields used to initialise the form before any saved data is loaded. */
export const EMPTY_ENTRY_FIELDS: Omit<HabitEntry, "date"> = {
  meditation: false,
  exercise: false,
  reading: false,
  journaling: false,
  drawing: false,
  sleep: 0,
  water: 0,
  screenTime: 0,
  coffee: 0,
  decafCoffee: 0,
  joyTags: [],
  reflection: "",
};
