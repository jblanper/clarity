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

  // Heart only visible when done; toggles joy without affecting done
  const handleHeart = () => {
    if (value.joy) {
      onChange({ done: true, joy: false });
    } else {
      onChange({ done: true, joy: true });
    }
  };

  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-stone-700 dark:text-stone-300">{label}</span>
      <div className="flex items-center gap-3">
        {/* Heart — only rendered when done: true */}
        {value.done && (
          <button
            type="button"
            onClick={handleHeart}
            aria-label={value.joy ? "Remove joy" : "Mark as done with joy"}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors duration-150"
          >
            <span
              className={`text-lg leading-none ${
                value.joy
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-stone-400"
              }`}
            >
              {value.joy ? "♥" : "♡"}
            </span>
          </button>
        )}
        {/* Toggle switch — slides left (off) / right (on).
            Uses explicit `left` instead of translate to avoid transform
            initialisation issues in Tailwind v4. */}
        <button
          type="button"
          role="switch"
          aria-checked={value.done}
          aria-label={label}
          onClick={handleToggle}
          className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
            value.done
              ? "bg-stone-500 dark:bg-stone-300"
              : "bg-stone-300 dark:bg-stone-600"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
              value.done ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
