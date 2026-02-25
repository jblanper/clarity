"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

/** Strips the date key from a full HabitEntry so it can be used as form state. */
function toFormFields(entry: HabitEntry): Omit<HabitEntry, "date"> {
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

export default function CheckInForm() {
  const today = getTodayDate();
  const [fields, setFields] = useState<Omit<HabitEntry, "date">>(EMPTY_ENTRY_FIELDS);
  const [saved, setSaved] = useState(false);

  // Pre-populate form if an entry for today already exists
  useEffect(() => {
    const existing = getEntry(today);
    if (existing !== null) {
      setFields(toFormFields(existing));
    }
  }, [today]);

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
    saveEntry({ date: today, ...fields });
    setSaved(true);
    // Reset the "Saved" label after a short delay
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-md px-5 pb-12 pt-10">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-widest text-stone-800">
            Clarity
          </h1>
          <p className="mt-1 text-sm text-stone-400">{formatDisplayDate(today)}</p>
        </div>
        <Link
          href="/settings"
          className="mt-2 text-xs uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-600"
        >
          Settings
        </Link>
      </header>

      {/* ── Boolean habits ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-400">
          Habits
        </h2>
        <div className="divide-y divide-stone-100">
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
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-400">
          By the numbers
        </h2>
        <div className="divide-y divide-stone-100">
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
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-400">
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
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-400">
          Reflection
        </h2>
        <textarea
          value={fields.reflection}
          onChange={(e) =>
            setFields((prev) => ({ ...prev, reflection: e.target.value }))
          }
          placeholder="Anything about today worth remembering?"
          rows={4}
          className="w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-700 placeholder-stone-300 focus:border-stone-400 focus:outline-none"
        />
      </section>

      {/* ── Save ───────────────────────────────────────────────────── */}
      <button
        type="submit"
        className="w-full rounded-2xl bg-stone-800 py-4 text-sm tracking-widest text-white transition-colors hover:bg-stone-700 active:bg-stone-900"
      >
        {saved ? "Saved ✓" : "Save"}
      </button>

    </form>
  );
}
