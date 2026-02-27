"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveEntry, getEntry } from "@/lib/storage";
import {
  getConfigs,
  DEFAULT_HABIT_CONFIGS,
  DEFAULT_JOY_TAG_CONFIGS,
  type AppConfigs,
  type NumericHabitConfig,
} from "@/lib/habitConfig";
import type { HabitEntry } from "@/types/entry";
import HabitToggle from "@/components/HabitToggle";
import NumberStepper from "@/components/NumberStepper";
import JoyTagChip from "@/components/JoyTagChip";

interface Props {
  /** When provided, the form runs in edit mode for that specific date. */
  date?: string;
}

type SaveState = "idle" | "saving" | "confirmed";

type FormFields = {
  booleanHabits: Record<string, boolean>;
  numericHabits: Record<string, number>;
  joyTags: string[];
  reflection: string;
};

const emptyFields: FormFields = {
  booleanHabits: {},
  numericHabits: {},
  joyTags: [],
  reflection: "",
};

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

/** Extracts mutable form fields from a saved HabitEntry. */
function toFormFields(entry: HabitEntry): FormFields {
  return {
    booleanHabits: { ...entry.booleanHabits },
    numericHabits: { ...entry.numericHabits },
    joyTags: [...entry.joyTags],
    reflection: entry.reflection,
  };
}

export default function CheckInForm({ date }: Props) {
  const router = useRouter();
  const isEditMode = !!date;
  const today = getTodayDate();
  const targetDate = date ?? today;

  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Initialise with defaults so first render matches SSR; updated on mount.
  const [configs, setConfigs] = useState<AppConfigs>({
    habits: DEFAULT_HABIT_CONFIGS,
    joyTags: DEFAULT_JOY_TAG_CONFIGS,
  });

  useEffect(() => {
    setConfigs(getConfigs());
  }, []);

  // Pre-populate form with any existing entry for the target date
  useEffect(() => {
    const existing = getEntry(targetDate);
    if (existing !== null) {
      setFields(toFormFields(existing));
    }
  }, [targetDate]);

  const activeBoolean = configs.habits.filter((h) => h.type === "boolean" && !h.archived);
  const activeNumeric = configs.habits.filter(
    (h): h is NumericHabitConfig => h.type === "numeric" && !h.archived
  );
  const activeJoyTags = configs.joyTags.filter((t) => !t.archived);

  const setBooleanHabit = (id: string, value: boolean) => {
    setFields((prev) => ({
      ...prev,
      booleanHabits: { ...prev.booleanHabits, [id]: value },
    }));
  };

  const setNumericHabit = (id: string, value: number) => {
    setFields((prev) => ({
      ...prev,
      numericHabits: { ...prev.numericHabits, [id]: value },
    }));
  };

  const toggleJoyTag = (id: string) => {
    setFields((prev) => ({
      ...prev,
      joyTags: prev.joyTags.includes(id)
        ? prev.joyTags.filter((t) => t !== id)
        : [...prev.joyTags, id],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveState !== "idle") return;

    setSaveState("saving");

    const entry: HabitEntry = {
      date: targetDate,
      booleanHabits: fields.booleanHabits,
      numericHabits: fields.numericHabits,
      joyTags: fields.joyTags,
      reflection: fields.reflection,
    };

    if (isEditMode) {
      entry.lastEdited = new Date().toISOString();
    }

    // Defer save to next tick so "Saving..." renders before the write
    setTimeout(() => {
      saveEntry(entry);
      setSaveState("confirmed");

      // Redirect 1200ms after confirmation
      const destination = isEditMode
        ? `/history?open=${targetDate}`
        : "/history";
      setTimeout(() => router.push(destination), 1200);
    }, 0);
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
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-500">
              {formatDisplayDate(today)}
            </p>
          )}
        </div>
        {isEditMode ? (
          <Link
            href="/history"
            className="mt-2 text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
          >
            ← history
          </Link>
        ) : (
          <Link
            href="/settings?back=/"
            className="mt-2 text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
          >
            Settings
          </Link>
        )}
      </header>

      {/* ── Boolean habits ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Habits
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {activeBoolean.map((h) => (
            <HabitToggle
              key={h.id}
              label={h.label}
              checked={fields.booleanHabits[h.id] ?? false}
              onChange={(value) => setBooleanHabit(h.id, value)}
            />
          ))}
        </div>
      </section>

      {/* ── Numeric habits ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          By the numbers
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {activeNumeric.map((h) => (
            <NumberStepper
              key={h.id}
              label={h.label}
              unit={h.unit}
              value={fields.numericHabits[h.id] ?? 0}
              step={h.step}
              onChange={(value) => setNumericHabit(h.id, value)}
            />
          ))}
        </div>
      </section>

      {/* ── Joy tags ───────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Joy
        </h2>
        <div className="flex flex-wrap gap-2">
          {activeJoyTags.map((t) => (
            <JoyTagChip
              key={t.id}
              label={t.label}
              selected={fields.joyTags.includes(t.id)}
              onToggle={() => toggleJoyTag(t.id)}
            />
          ))}
        </div>
      </section>

      {/* ── Reflection ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Reflection
        </h2>
        <textarea
          value={fields.reflection}
          onChange={(e) =>
            setFields((prev) => ({ ...prev, reflection: e.target.value }))
          }
          placeholder="Anything about today worth remembering?"
          rows={4}
          className="w-full resize-none rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-600 focus:border-stone-500 dark:focus:border-stone-500 focus:outline-none"
        />
      </section>

      {/* ── Save ───────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={saveState !== "idle"}
        className={`w-full rounded-2xl py-4 text-sm tracking-widest transition-colors duration-500 ${
          saveState === "confirmed"
            ? "bg-stone-300 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
            : "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300 active:bg-stone-900 dark:active:bg-stone-100"
        }`}
      >
        {saveState === "saving"
          ? "Saving..."
          : saveState === "confirmed"
            ? "Day captured"
            : "Save"}
      </button>

    </form>
  );
}
