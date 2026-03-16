"use client";

import type { HabitState } from "@/types/entry";

interface Props {
  label: string;
  value: HabitState;
  joyByDefault: boolean;
  onChange: (state: HabitState) => void;
}

export default function HabitToggle({ label, value, joyByDefault, onChange }: Props) {
  // Turning off always resets joy; turning on respects joyByDefault
  const handleToggle = () => {
    if (value.done) {
      onChange({ done: false, joy: false });
    } else {
      onChange({ done: true, joy: joyByDefault });
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value.done}
      aria-label={label}
      onClick={handleToggle}
      className={`w-full flex items-center gap-3 min-h-[44px] py-3 rounded-xl px-2 -mx-2 transition-[background-color] duration-150 active:opacity-70 ${
        value.done ? "bg-amber-50 dark:bg-amber-900/15" : ""
      }`}
    >
      <span
        className={`h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors ${
          value.done
            ? "bg-amber-500 dark:bg-amber-400"
            : "bg-stone-300 dark:bg-stone-600"
        }`}
      />
      <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
    </button>
  );
}
