import type { HabitEntry, HabitState } from "@/types/entry";

const STORAGE_KEY = "clarity_entries";

/** Returns true if localStorage is accessible (unavailable in SSR or some private modes). */
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

/**
 * Coerces a potentially partial or corrupted habit state value into a valid HabitState.
 * Enforces the invariant that joy: true always implies done: true.
 */
export function sanitizeHabitState(state: Partial<HabitState>): HabitState {
  const joy = state.joy === true;
  const done = joy || state.done === true; // joy implies done
  return { done, joy };
}

/** Reads and parses the full entries map from localStorage. Returns an empty map on failure. */
function readStore(): Record<string, HabitEntry> {
  if (!isLocalStorageAvailable()) return {};

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.error("Clarity: stored data is malformed — resetting.");
      return {};
    }
    const store = parsed as Record<string, HabitEntry>;

    // Sanitize all habit states to fix any corrupted or legacy data at read time
    for (const entry of Object.values(store)) {
      if (entry.habits && typeof entry.habits === "object") {
        for (const [id, raw] of Object.entries(entry.habits)) {
          entry.habits[id] = sanitizeHabitState(raw as Partial<HabitState>);
        }
      }
    }

    return store;
  } catch {
    console.error("Clarity: failed to parse stored data — resetting.");
    return {};
  }
}

/** Persists the full entries map to localStorage. */
function writeStore(store: Record<string, HabitEntry>): void {
  if (!isLocalStorageAvailable()) {
    console.error("Clarity: localStorage is unavailable — entry not saved.");
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Saves (or overwrites) a habit entry. The entry's date is used as the key. */
export function saveEntry(entry: HabitEntry): void {
  const store = readStore();
  store[entry.date] = entry;
  writeStore(store);
}

/** Retrieves the entry for a given date, or null if none exists. */
export function getEntry(date: string): HabitEntry | null {
  const store = readStore();
  return store[date] ?? null;
}

/** Returns all saved entries sorted chronologically (oldest first). */
export function getAllEntries(): HabitEntry[] {
  const store = readStore();
  return Object.values(store).sort((a, b) => a.date.localeCompare(b.date));
}

/** Removes all saved entries from localStorage. */
export function clearAllEntries(): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(STORAGE_KEY);
}
