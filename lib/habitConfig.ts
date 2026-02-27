const CONFIGS_KEY = "clarity-configs";

export interface BooleanHabitConfig {
  id: string;
  label: string;
  type: "boolean";
  // When toggled on, default to done-with-joy
  joyByDefault: boolean;
  archived: boolean;
}

export interface NumericHabitConfig {
  id: string;
  label: string;
  type: "numeric";
  unit: string;
  step: number;
  archived: boolean;
}

export type HabitConfig = BooleanHabitConfig | NumericHabitConfig;

export interface MomentConfig {
  id: string;
  label: string;
  archived: boolean;
}

export interface AppConfigs {
  habits: HabitConfig[];
  moments: MomentConfig[];
}

// Defaults use stable hardcoded IDs so they're consistent across sessions and environments.
// New user-created habits get IDs from crypto.randomUUID() at creation time.
export const DEFAULT_HABIT_CONFIGS: HabitConfig[] = [
  { id: "00000000-0000-4000-8000-000000000001", label: "Meditation", type: "boolean", joyByDefault: true,  archived: false },
  { id: "00000000-0000-4000-8000-000000000002", label: "Exercise",   type: "boolean", joyByDefault: false, archived: false },
  { id: "00000000-0000-4000-8000-000000000003", label: "Reading",    type: "boolean", joyByDefault: true,  archived: false },
  { id: "00000000-0000-4000-8000-000000000004", label: "Journaling", type: "boolean", joyByDefault: false, archived: false },
  { id: "00000000-0000-4000-8000-000000000006", label: "Sleep",        type: "numeric", unit: "hrs",     step: 0.5, archived: false },
  { id: "00000000-0000-4000-8000-000000000007", label: "Water",        type: "numeric", unit: "glasses", step: 1,   archived: false },
  { id: "00000000-0000-4000-8000-000000000008", label: "Screen time",  type: "numeric", unit: "hrs",     step: 0.5, archived: false },
  { id: "00000000-0000-4000-8000-000000000009", label: "Coffee",       type: "numeric", unit: "cups",    step: 1,   archived: false },
];

export const DEFAULT_MOMENT_CONFIGS: MomentConfig[] = [
  { id: "00000000-0000-4000-8000-000000000011", label: "Good meal",                 archived: false },
  { id: "00000000-0000-4000-8000-000000000012", label: "Interesting conversation",  archived: false },
  { id: "00000000-0000-4000-8000-000000000013", label: "Inspiring song",            archived: false },
  { id: "00000000-0000-4000-8000-000000000014", label: "Time in nature",            archived: false },
];

const DEFAULT_CONFIGS: AppConfigs = {
  habits: DEFAULT_HABIT_CONFIGS,
  moments: DEFAULT_MOMENT_CONFIGS,
};

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__clarity_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/** Returns saved configs, falling back to defaults if nothing is stored or data is malformed. */
export function getConfigs(): AppConfigs {
  if (!isLocalStorageAvailable()) return DEFAULT_CONFIGS;
  const raw = localStorage.getItem(CONFIGS_KEY);
  if (raw === null) return DEFAULT_CONFIGS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !Array.isArray((parsed as Record<string, unknown>).habits) ||
      !Array.isArray((parsed as Record<string, unknown>).moments)
    ) {
      return DEFAULT_CONFIGS;
    }
    return parsed as AppConfigs;
  } catch {
    return DEFAULT_CONFIGS;
  }
}

/** Persists the full config object to localStorage. */
export function saveConfigs(configs: AppConfigs): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(CONFIGS_KEY, JSON.stringify(configs));
}
