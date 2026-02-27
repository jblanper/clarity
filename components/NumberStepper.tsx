"use client";

import { useState, useEffect } from "react";

interface Props {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** Avoids floating-point drift when adding/subtracting decimal steps (e.g. 0.1 + 0.2). */
function addStep(value: number, step: number): number {
  return Math.round((value + step) * 1000) / 1000;
}

export default function NumberStepper({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: Props) {
  // Local string tracks what the user is actively typing before blur
  const [inputValue, setInputValue] = useState(String(value));

  // Keep local string in sync when the parent value changes (e.g. on data load)
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const decrement = () => onChange(clamp(addStep(value, -step), min, max));
  const increment = () => onChange(clamp(addStep(value, step), min, max));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /** Commit the typed value on blur, clamping to valid range. Resets on invalid input. */
  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = clamp(parsed, min, max);
      onChange(clamped);
      setInputValue(String(clamped));
    } else {
      setInputValue(String(value));
    }
  };

  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-baseline gap-2">
        <span className="text-stone-700 dark:text-stone-300">{label}</span>
        <span className="text-xs text-stone-500 dark:text-stone-500">{unit}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-500 transition-colors hover:border-stone-400 dark:hover:border-stone-600 hover:text-stone-800 dark:hover:text-stone-300 active:bg-stone-50 dark:active:bg-stone-800 disabled:opacity-30"
        >
          −
        </button>

        {/* Hide native number spinner arrows */}
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          className="w-12 bg-transparent text-center text-stone-700 dark:text-stone-300 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          onClick={increment}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-500 transition-colors hover:border-stone-400 dark:hover:border-stone-600 hover:text-stone-800 dark:hover:text-stone-300 active:bg-stone-50 dark:active:bg-stone-800 disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
