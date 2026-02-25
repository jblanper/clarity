import type { HabitEntry } from "@/types/entry";

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
    return parsed as Record<string, HabitEntry>;
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
