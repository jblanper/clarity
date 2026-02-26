"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveEntry, getEntry } from "@/lib/storage";
import {
  BOOLEAN_HABITS,
  NUMERIC_HABITS,
  DEFAULT_JOY_TAGS,
  EMPTY_ENTRY_FIELDS,
  type BooleanHabitKey,
  type NumericHabitKey,
} from "@/lib/habits";
import type { HabitEntry } from "@/types/entry";
import HabitToggle from "@/components/HabitToggle";
import NumberStepper from "@/components/NumberStepper";
import JoyTagChip from "@/components/JoyTagChip";

interface Props {
  /** When provided, the form runs in edit mode for that specific date. */
  date?: string;
}

/** Returns today's date as a YYYY-MM-DD string in local time. */
function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Formats a YYYY-MM-DD string as a human-readable date, e.g. "Tuesday, February 25". */
function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Formats a YYYY-MM-DD for the edit-mode label, e.g. "Monday, 24 February 2026". */
function formatEditDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const weekdays = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ];
  return `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** Strips the date key from a full HabitEntry so it can be used as form state. */
function toFormFields(entry: HabitEntry): Omit<HabitEntry, "date" | "lastEdited"> {
  return {
    meditation: entry.meditation,
    exercise: entry.exercise,
    reading: entry.reading,
    journaling: entry.journaling,
    drawing: entry.drawing,
    sleep: entry.sleep,
    water: entry.water,
    screenTime: entry.screenTime,
    coffee: entry.coffee,
    decafCoffee: entry.decafCoffee,
    joyTags: [...entry.joyTags],
    reflection: entry.reflection,
  };
}

export default function CheckInForm({ date }: Props) {
  const router = useRouter();
  const isEditMode = !!date;
  const today = getTodayDate();
  const targetDate = date ?? today;

  const [fields, setFields] = useState<Omit<HabitEntry, "date" | "lastEdited">>(EMPTY_ENTRY_FIELDS);
  const [saved, setSaved] = useState(false);

  // Pre-populate form with any existing entry for the target date
  useEffect(() => {
    const existing = getEntry(targetDate);
    if (existing !== null) {
      setFields(toFormFields(existing));
    }
  }, [targetDate]);

  const setBooleanHabit = (key: BooleanHabitKey, value: boolean) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const setNumericHabit = (key: NumericHabitKey, value: number) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const toggleJoyTag = (tag: string) => {
    setFields((prev) => ({
      ...prev,
      joyTags: prev.joyTags.includes(tag)
        ? prev.joyTags.filter((t) => t !== tag)
        : [...prev.joyTags, tag],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: HabitEntry = { date: targetDate, ...fields };

    if (isEditMode) {
      // Record when the entry was last edited
      entry.lastEdited = new Date().toISOString();
      saveEntry(entry);
      // Return to the History page and auto-reopen the day detail for this date
      router.push(`/history?open=${targetDate}`);
    } else {
      saveEntry(entry);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSave} className={`mx-auto max-w-md px-5 pt-10 ${isEditMode ? "pb-12" : "pb-28"}`}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
            {isEditMode ? formatEditDate(targetDate) : "Today"}
          </h1>
          {!isEditMode && (
            <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
              {formatDisplayDate(today)}
            </p>
          )}
        </div>
        {isEditMode ? (
          <Link
            href="/history"
            className="mt-2 text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 transition-colors hover:text-stone-600 dark:hover:text-stone-300"
          >
            ← history
          </Link>
        ) : (
          <Link
            href="/settings"
            className="mt-2 text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 transition-colors hover:text-stone-600 dark:hover:text-stone-300"
          >
            Settings
          </Link>
        )}
      </header>

      {/* ── Boolean habits ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Habits
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {BOOLEAN_HABITS.map(({ key, label }) => (
            <HabitToggle
              key={key}
              label={label}
              checked={fields[key]}
              onChange={(value) => setBooleanHabit(key, value)}
            />
          ))}
        </div>
      </section>

      {/* ── Numeric habits ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500">
          By the numbers
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {NUMERIC_HABITS.map(({ key, label, unit, min, max, step }) => (
            <NumberStepper
              key={key}
              label={label}
              unit={unit}
              value={fields[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => setNumericHabit(key, value)}
            />
          ))}
        </div>
      </section>

      {/* ── Joy tags ───────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Joy
        </h2>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_JOY_TAGS.map((tag) => (
            <JoyTagChip
              key={tag}
              label={tag}
              selected={fields.joyTags.includes(tag)}
              onToggle={() => toggleJoyTag(tag)}
            />
          ))}
        </div>
      </section>

      {/* ── Reflection ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Reflection
        </h2>
        <textarea
          value={fields.reflection}
          onChange={(e) =>
            setFields((prev) => ({ ...prev, reflection: e.target.value }))
          }
          placeholder="Anything about today worth remembering?"
          rows={4}
          className="w-full resize-none rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:border-stone-400 dark:focus:border-stone-500 focus:outline-none"
        />
      </section>

      {/* ── Save ───────────────────────────────────────────────────── */}
      <button
        type="submit"
        className="w-full rounded-2xl bg-stone-800 dark:bg-stone-200 py-4 text-sm tracking-widest text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-stone-300 active:bg-stone-900 dark:active:bg-stone-100"
      >
        {!isEditMode && saved ? "Saved ✓" : "Save"}
      </button>

    </form>
  );
}
