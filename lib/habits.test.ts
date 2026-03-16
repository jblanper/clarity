import { createEmptyEntry } from "@/lib/habits";

it("createEmptyEntry returns a blank entry for the given date", () => {
  const entry = createEmptyEntry("2026-03-16");
  expect(entry.date).toBe("2026-03-16");
  expect(entry.habits).toEqual({});
  expect(entry.numeric).toEqual({});
  expect(entry.moments).toEqual([]);
  expect(entry.reflection).toBe("");
});
