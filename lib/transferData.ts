import type { HabitEntry } from "@/types/entry";
import { getAllEntries, getEntry, saveEntry } from "@/lib/storage";

// Bump this if the export schema ever changes incompatibly
const EXPORT_VERSION = 1;

interface ExportFile {
  version: number;
  exportedAt: string;
  entries: HabitEntry[];
}

// ── Validation ────────────────────────────────────────────────────────────────

/** Narrows an unknown value to HabitEntry, checking every required field. */
function isHabitEntry(value: unknown): value is HabitEntry {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.date === "string" &&
    typeof e.meditation === "boolean" &&
    typeof e.exercise === "boolean" &&
    typeof e.reading === "boolean" &&
    typeof e.journaling === "boolean" &&
    typeof e.drawing === "boolean" &&
    typeof e.sleep === "number" &&
    typeof e.water === "number" &&
    typeof e.screenTime === "number" &&
    typeof e.coffee === "number" &&
    typeof e.decafCoffee === "number" &&
    Array.isArray(e.joyTags) &&
    (e.joyTags as unknown[]).every((t) => typeof t === "string") &&
    typeof e.reflection === "string"
  );
}

/** Narrows an unknown parsed value to the ExportFile shape. */
function isExportFile(value: unknown): value is ExportFile {
  if (typeof value !== "object" || value === null) return false;
  const f = value as Record<string, unknown>;
  return (
    f.version === EXPORT_VERSION &&
    Array.isArray(f.entries)
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

/**
 * Serialises a list of entries into the canonical export JSON string.
 * Pure function — no side effects, fully testable.
 */
export function prepareExportData(entries: HabitEntry[]): string {
  const file: ExportFile = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
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
 * Reads all entries from localStorage and downloads them as
 * habits-backup.json. Throws a user-friendly message if there
 * is nothing to export.
 */
export function exportEntries(): void {
  const entries = getAllEntries();
  if (entries.length === 0) {
    throw new Error("No entries to export yet. Start tracking to create a backup.");
  }
  const content = prepareExportData(entries);
  downloadJson("habits-backup.json", content);
}

// ── Import ────────────────────────────────────────────────────────────────────

/**
 * Parses and validates a JSON string as an ExportFile.
 * Returns the contained entries array.
 * Pure function — no side effects, fully testable.
 * Throws a user-friendly string on any validation failure.
 */
export function parseImportFile(content: string): HabitEntry[] {
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

  const valid = parsed.entries.filter(isHabitEntry);
  if (valid.length === 0) {
    throw new Error("No valid entries found in the file.");
  }

  return valid;
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
 * Reads a File via FileReader, parses it, and merges its entries into localStorage.
 * Returns import counts. Rejects with a user-friendly message on failure.
 * Uses FileReader instead of file.text() for broader runtime compatibility.
 */
export async function importEntries(
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
        const entries = parseImportFile(content);
        resolve(mergeEntries(entries));
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsText(file);
  });
}
