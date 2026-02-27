import {
  prepareExportData,
  parseImportFile,
  mergeEntries,
  importBackup,
} from "@/lib/transferData";
import { getEntry, saveEntry, getAllEntries } from "@/lib/storage";
import { saveConfigs } from "@/lib/habitConfig";
import type { HabitEntry } from "@/types/entry";
import type { AppConfigs } from "@/lib/habitConfig";

jest.mock("@/lib/storage");
jest.mock("@/lib/habitConfig");

const mockedGetEntry = jest.mocked(getEntry);
const mockedSaveEntry = jest.mocked(saveEntry);
const mockedGetAllEntries = jest.mocked(getAllEntries);
const mockedSaveConfigs = jest.mocked(saveConfigs);

// ── Fixtures ─────────────────────────────────────────────────────────────────

const makeEntry = (overrides: Partial<HabitEntry> = {}): HabitEntry => ({
  date: "2026-02-25",
  habits: {
    "00000000-0000-4000-8000-000000000001": { done: true,  joy: true  },
    "00000000-0000-4000-8000-000000000002": { done: false, joy: false },
  },
  numeric: {
    "00000000-0000-4000-8000-000000000006": 7.5,
  },
  moments: ["00000000-0000-4000-8000-000000000011"],
  reflection: "Good day.",
  ...overrides,
});

const makeConfigs = (overrides: Partial<AppConfigs> = {}): AppConfigs => ({
  habits: [
    { id: "00000000-0000-4000-8000-000000000001", label: "Meditation", type: "boolean", joyByDefault: true, archived: false },
  ],
  moments: [
    { id: "00000000-0000-4000-8000-000000000011", label: "Good meal", archived: false },
  ],
  ...overrides,
});

/** Wraps entries and configs in the canonical export envelope. */
const makeExportJson = (entries: HabitEntry[], configs = makeConfigs()): string =>
  JSON.stringify(
    { version: 1, exportedAt: "2026-02-25T10:00:00.000Z", configs, entries },
    null,
    2
  );

beforeEach(() => {
  jest.clearAllMocks();
});

// ── prepareExportData ─────────────────────────────────────────────────────────

describe("prepareExportData", () => {
  it("produces valid JSON", () => {
    const json = prepareExportData([makeEntry()], makeConfigs());
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("includes version and exportedAt fields", () => {
    const parsed = JSON.parse(prepareExportData([makeEntry()], makeConfigs()));
    expect(parsed.version).toBe(1);
    expect(typeof parsed.exportedAt).toBe("string");
  });

  it("includes all provided entries", () => {
    const entries = [makeEntry({ date: "2026-02-24" }), makeEntry({ date: "2026-02-25" })];
    const parsed = JSON.parse(prepareExportData(entries, makeConfigs()));
    expect(parsed.entries).toHaveLength(2);
    expect(parsed.entries[0]).toEqual(entries[0]);
    expect(parsed.entries[1]).toEqual(entries[1]);
  });

  it("produces an empty entries array when given no entries", () => {
    const parsed = JSON.parse(prepareExportData([], makeConfigs()));
    expect(parsed.entries).toEqual([]);
  });

  it("includes configs with habits and moments arrays", () => {
    const configs = makeConfigs();
    const parsed = JSON.parse(prepareExportData([], configs));
    expect(parsed.configs).toEqual(configs);
    expect(Array.isArray(parsed.configs.habits)).toBe(true);
    expect(Array.isArray(parsed.configs.moments)).toBe(true);
  });
});

// ── parseImportFile ───────────────────────────────────────────────────────────

describe("parseImportFile", () => {
  it("returns entries and configs from a valid export file", () => {
    const entry = makeEntry();
    const configs = makeConfigs();
    const result = parseImportFile(makeExportJson([entry], configs));
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toEqual(entry);
    expect(result.configs).toEqual(configs);
  });

  it("throws on malformed JSON", () => {
    expect(() => parseImportFile("not json{{{")).toThrow(
      "The file is not valid JSON"
    );
  });

  it("throws if the version field is missing or wrong", () => {
    const bad = JSON.stringify({ configs: makeConfigs(), entries: [makeEntry()] });
    expect(() => parseImportFile(bad)).toThrow("Unrecognised file format");
  });

  it("throws if entries array is missing", () => {
    const bad = JSON.stringify({ version: 1, exportedAt: "2026-02-25", configs: makeConfigs() });
    expect(() => parseImportFile(bad)).toThrow("Unrecognised file format");
  });

  it("throws if configs field is missing", () => {
    const bad = JSON.stringify({ version: 1, exportedAt: "2026-02-25", entries: [] });
    expect(() => parseImportFile(bad)).toThrow("Unrecognised file format");
  });

  it("throws if configs is missing habits or moments arrays", () => {
    const bad = JSON.stringify({
      version: 1,
      exportedAt: "2026-02-25",
      configs: { habits: [] }, // missing moments
      entries: [],
    });
    expect(() => parseImportFile(bad)).toThrow("Unrecognised file format");
  });

  it("silently drops entries that fail validation and keeps the rest", () => {
    const valid = makeEntry({ date: "2026-02-25" });
    const invalid = { date: "2026-02-24", habits: "not-an-object" };
    const json = JSON.stringify({
      version: 1,
      exportedAt: "2026-02-25T10:00:00.000Z",
      configs: makeConfigs(),
      entries: [valid, invalid],
    });
    const result = parseImportFile(json);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toEqual(valid);
  });

  it("throws if all entries fail validation", () => {
    const json = JSON.stringify({
      version: 1,
      exportedAt: "2026-02-25T10:00:00.000Z",
      configs: makeConfigs(),
      entries: [{ date: "bad", habits: "nope" }],
    });
    expect(() => parseImportFile(json)).toThrow("No valid entries found");
  });

  it("succeeds with zero entries when the entries array is empty", () => {
    const json = JSON.stringify({
      version: 1,
      exportedAt: "2026-02-25T10:00:00.000Z",
      configs: makeConfigs(),
      entries: [],
    });
    const result = parseImportFile(json);
    expect(result.entries).toHaveLength(0);
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

// ── importBackup ──────────────────────────────────────────────────────────────

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

describe("importBackup", () => {
  afterEach(() => {
    (global as Record<string, unknown>).FileReader = globalThis.FileReader;
  });

  it("reads a File, parses it, merges entries, and saves configs", async () => {
    mockedGetEntry.mockReturnValue(null);
    const entry = makeEntry();
    const configs = makeConfigs();
    (global as Record<string, unknown>).FileReader = jest.fn(
      () => makeMockFileReader(makeExportJson([entry], configs))
    );

    const result = await importBackup(new File([], "habits-backup.json"));

    expect(mockedSaveEntry).toHaveBeenCalledWith(entry);
    expect(mockedSaveConfigs).toHaveBeenCalledWith(configs);
    expect(result).toEqual({ imported: 1, skipped: 0 });
  });

  it("replaces configs even when all entries are skipped", async () => {
    mockedGetEntry.mockReturnValue(makeEntry());
    const configs = makeConfigs();
    (global as Record<string, unknown>).FileReader = jest.fn(
      () => makeMockFileReader(makeExportJson([makeEntry()], configs))
    );

    const result = await importBackup(new File([], "habits-backup.json"));

    expect(mockedSaveConfigs).toHaveBeenCalledWith(configs);
    expect(result).toEqual({ imported: 0, skipped: 1 });
  });

  it("rejects with a user-friendly message for an invalid file", async () => {
    (global as Record<string, unknown>).FileReader = jest.fn(
      () => makeMockFileReader("not json{{{")
    );

    await expect(importBackup(new File([], "bad.json"))).rejects.toThrow(
      "not valid JSON"
    );
  });
});

// ── unused import guard ───────────────────────────────────────────────────────
// Silence the "unused variable" lint warning for mockedGetAllEntries —
// it's mocked to prevent real localStorage calls during the test run.
void mockedGetAllEntries;
