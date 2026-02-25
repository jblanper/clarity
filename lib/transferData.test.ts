import {
  prepareExportData,
  parseImportFile,
  mergeEntries,
  importEntries,
} from "@/lib/transferData";
import { getAllEntries, getEntry, saveEntry } from "@/lib/storage";
import type { HabitEntry } from "@/types/entry";

jest.mock("@/lib/storage");
const mockedGetAllEntries = jest.mocked(getAllEntries);
const mockedGetEntry = jest.mocked(getEntry);
const mockedSaveEntry = jest.mocked(saveEntry);

// ── Fixtures ─────────────────────────────────────────────────────────────────

const makeEntry = (overrides: Partial<HabitEntry> = {}): HabitEntry => ({
  date: "2026-02-25",
  meditation: true,
  exercise: false,
  reading: true,
  journaling: false,
  drawing: false,
  sleep: 7.5,
  water: 6,
  screenTime: 3,
  coffee: 1,
  decafCoffee: 2,
  joyTags: ["walked outside"],
  reflection: "Good day.",
  ...overrides,
});

/** Wraps entries in the canonical export envelope. */
const makeExportJson = (entries: HabitEntry[], version = 1): string =>
  JSON.stringify({ version, exportedAt: "2026-02-25T10:00:00.000Z", entries }, null, 2);

beforeEach(() => {
  jest.clearAllMocks();
});

// ── prepareExportData ─────────────────────────────────────────────────────────

describe("prepareExportData", () => {
  it("produces valid JSON", () => {
    const json = prepareExportData([makeEntry()]);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("includes version and exportedAt fields", () => {
    const parsed = JSON.parse(prepareExportData([makeEntry()]));
    expect(parsed.version).toBe(1);
    expect(typeof parsed.exportedAt).toBe("string");
  });

  it("includes all provided entries", () => {
    const entries = [makeEntry({ date: "2026-02-24" }), makeEntry({ date: "2026-02-25" })];
    const parsed = JSON.parse(prepareExportData(entries));
    expect(parsed.entries).toHaveLength(2);
    expect(parsed.entries[0]).toEqual(entries[0]);
    expect(parsed.entries[1]).toEqual(entries[1]);
  });

  it("produces an empty entries array when given no entries", () => {
    const parsed = JSON.parse(prepareExportData([]));
    expect(parsed.entries).toEqual([]);
  });
});

// ── parseImportFile ───────────────────────────────────────────────────────────

describe("parseImportFile", () => {
  it("returns entries from a valid export file", () => {
    const entry = makeEntry();
    const result = parseImportFile(makeExportJson([entry]));
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(entry);
  });

  it("throws on malformed JSON", () => {
    expect(() => parseImportFile("not json{{{")).toThrow(
      "The file is not valid JSON"
    );
  });

  it("throws if the version field is missing or wrong", () => {
    const bad = JSON.stringify({ entries: [makeEntry()] });
    expect(() => parseImportFile(bad)).toThrow("Unrecognised file format");
  });

  it("throws if entries array is missing", () => {
    const bad = JSON.stringify({ version: 1, exportedAt: "2026-02-25" });
    expect(() => parseImportFile(bad)).toThrow("Unrecognised file format");
  });

  it("silently drops entries that fail validation and keeps the rest", () => {
    const valid = makeEntry({ date: "2026-02-25" });
    const invalid = { date: "2026-02-24", meditation: "yes" }; // wrong type
    const json = JSON.stringify({
      version: 1,
      exportedAt: "2026-02-25T10:00:00.000Z",
      entries: [valid, invalid],
    });
    const result = parseImportFile(json);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(valid);
  });

  it("throws if all entries fail validation", () => {
    const json = JSON.stringify({
      version: 1,
      exportedAt: "2026-02-25T10:00:00.000Z",
      entries: [{ date: "bad", meditation: "nope" }],
    });
    expect(() => parseImportFile(json)).toThrow("No valid entries found");
  });
});

// ── mergeEntries ──────────────────────────────────────────────────────────────

describe("mergeEntries", () => {
  it("saves entries for dates not already in storage", () => {
    mockedGetEntry.mockReturnValue(null);
    const entry = makeEntry();

    const result = mergeEntries([entry]);

    expect(mockedSaveEntry).toHaveBeenCalledWith(entry);
    expect(result).toEqual({ imported: 1, skipped: 0 });
  });

  it("skips entries whose date already exists in storage", () => {
    mockedGetEntry.mockReturnValue(makeEntry());
    const entry = makeEntry();

    const result = mergeEntries([entry]);

    expect(mockedSaveEntry).not.toHaveBeenCalled();
    expect(result).toEqual({ imported: 0, skipped: 1 });
  });

  it("handles a mix of new and existing entries", () => {
    const newEntry = makeEntry({ date: "2026-02-24" });
    const existingEntry = makeEntry({ date: "2026-02-25" });

    mockedGetEntry.mockImplementation((date) =>
      date === "2026-02-25" ? existingEntry : null
    );

    const result = mergeEntries([newEntry, existingEntry]);

    expect(mockedSaveEntry).toHaveBeenCalledTimes(1);
    expect(mockedSaveEntry).toHaveBeenCalledWith(newEntry);
    expect(result).toEqual({ imported: 1, skipped: 1 });
  });

  it("returns zero counts for an empty array", () => {
    const result = mergeEntries([]);
    expect(result).toEqual({ imported: 0, skipped: 0 });
  });
});

// ── importEntries ─────────────────────────────────────────────────────────────

interface MockFileReader {
  onload: ((e: ProgressEvent<FileReader>) => void) | null;
  onerror: (() => void) | null;
  readAsText: (blob: Blob) => void;
}

/** Builds a FileReader stand-in that fires onload synchronously with the given content. */
function makeMockFileReader(content: string): MockFileReader {
  const reader: MockFileReader = {
    onload: null,
    onerror: null,
    readAsText() {
      reader.onload?.({
        target: { result: content },
      } as unknown as ProgressEvent<FileReader>);
    },
  };
  return reader;
}

describe("importEntries", () => {
  afterEach(() => {
    // Restore the real FileReader after each test
    (global as Record<string, unknown>).FileReader = globalThis.FileReader;
  });

  it("reads a File, parses it, and merges entries", async () => {
    mockedGetEntry.mockReturnValue(null);
    const entry = makeEntry();
    (global as Record<string, unknown>).FileReader = jest.fn(
      () => makeMockFileReader(makeExportJson([entry]))
    );

    const result = await importEntries(new File([], "habits-backup.json"));

    expect(mockedSaveEntry).toHaveBeenCalledWith(entry);
    expect(result).toEqual({ imported: 1, skipped: 0 });
  });

  it("rejects with a user-friendly message for an invalid file", async () => {
    (global as Record<string, unknown>).FileReader = jest.fn(
      () => makeMockFileReader("not json{{{")
    );

    await expect(importEntries(new File([], "bad.json"))).rejects.toThrow(
      "not valid JSON"
    );
  });
});

// ── exportEntries (data layer only) ──────────────────────────────────────────

describe("exportEntries — data preparation", () => {
  it("throws a user-friendly message when there are no entries to export", () => {
    mockedGetAllEntries.mockReturnValue([]);

    // Import here so the mock is in place before the module-level call
    const { exportEntries } = require("@/lib/transferData");
    expect(() => exportEntries()).toThrow("No entries to export");
  });
});
