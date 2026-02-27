import type { HabitEntry } from "@/types/entry";
import type { AppConfigs } from "@/lib/habitConfig";
import { getAllEntries, getEntry, saveEntry } from "@/lib/storage";
import { getConfigs, saveConfigs } from "@/lib/habitConfig";

const EXPORT_VERSION = 1;

interface ExportFile {
  version: number;
  exportedAt: string;
  configs: AppConfigs;
  entries: HabitEntry[];
}

// ── Validation ────────────────────────────────────────────────────────────────

/** Returns true if v is a non-null, non-array object — i.e. a plain record. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Returns true if v is a valid HabitState: a plain object with boolean done and joy fields. */
function isHabitState(v: unknown): boolean {
  return isPlainObject(v) && typeof v.done === "boolean" && typeof v.joy === "boolean";
}

/** Narrows an unknown value to HabitEntry, checking every required field. */
function isHabitEntry(value: unknown): value is HabitEntry {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.date === "string" &&
    typeof value.reflection === "string" &&
    Array.isArray(value.moments) &&
    (value.moments as unknown[]).every((t) => typeof t === "string") &&
    isPlainObject(value.habits) &&
    Object.values(value.habits).every(isHabitState) &&
    isPlainObject(value.numeric) &&
    Object.values(value.numeric).every((v) => typeof v === "number")
  );
}

/** Narrows an unknown parsed value to the ExportFile shape. */
function isExportFile(value: unknown): value is ExportFile {
  if (!isPlainObject(value)) return false;
  return (
    value.version === EXPORT_VERSION &&
    Array.isArray(value.entries) &&
    isPlainObject(value.configs) &&
    Array.isArray(value.configs.habits) &&
    Array.isArray(value.configs.moments)
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

/**
 * Serialises entries and configs into the canonical export JSON string.
 * Pure function — no side effects, fully testable.
 */
export function prepareExportData(
  entries: HabitEntry[],
  configs: AppConfigs
): string {
  const file: ExportFile = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    configs,
    entries,
  };
  return JSON.stringify(file, null, 2);
}

/** Triggers a browser file download. Not called during SSR. */
function downloadJson(filename: string, content: string): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Reads all entries and configs from localStorage and downloads them as
 * habits-backup.json.
 */
export function exportBackup(): void {
  const entries = getAllEntries();
  const configs = getConfigs();
  const content = prepareExportData(entries, configs);
  downloadJson("habits-backup.json", content);
}

// ── Import ────────────────────────────────────────────────────────────────────

/**
 * Parses and validates a JSON string as an ExportFile.
 * Returns entries and configs from the file.
 * Pure function — no side effects, fully testable.
 * Throws a user-friendly string on any validation failure.
 */
export function parseImportFile(content: string): {
  entries: HabitEntry[];
  configs: AppConfigs;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("The file is not valid JSON. Please choose a habits-backup.json file.");
  }

  if (!isExportFile(parsed)) {
    throw new Error(
      "Unrecognised file format. Only files exported from Clarity are supported."
    );
  }

  const validEntries = parsed.entries.filter(isHabitEntry);
  if (validEntries.length === 0 && parsed.entries.length > 0) {
    throw new Error("No valid entries found in the file.");
  }

  return { entries: validEntries, configs: parsed.configs };
}

/**
 * Merges incoming entries into localStorage.
 * Entries whose date already exists are skipped to avoid overwriting.
 * Returns the count of imported and skipped entries.
 */
export function mergeEntries(
  incoming: HabitEntry[]
): { imported: number; skipped: number } {
  let imported = 0;
  let skipped = 0;

  for (const entry of incoming) {
    if (getEntry(entry.date) !== null) {
      skipped++;
    } else {
      saveEntry(entry);
      imported++;
    }
  }

  return { imported, skipped };
}

/**
 * Reads a File via FileReader, parses it, merges entries into localStorage,
 * and replaces the current configs with the imported ones.
 * Returns import counts. Rejects with a user-friendly message on failure.
 * Uses FileReader instead of file.text() for broader runtime compatibility.
 */
export async function importBackup(
  file: File
): Promise<{ imported: number; skipped: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== "string") {
          reject(new Error("Failed to read the file."));
          return;
        }
        const { entries, configs } = parseImportFile(content);
        saveConfigs(configs);
        resolve(mergeEntries(entries));
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsText(file);
  });
}
