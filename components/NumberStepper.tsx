"use client";

interface Props {
  label: string;
  unit: string;
  value: number;
  min?: number;
  max?: number;
  step: number;
  startAt?: number;
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
  min = 0,
  max = Infinity,
  step,
  startAt,
  onChange,
}: Props) {
  const handleTap = () => {
    if (value === 0 && startAt && startAt > 0) {
      onChange(clamp(startAt, min, max));
    } else {
      onChange(clamp(addStep(value, step), min, max));
    }
  };
  const decrement = () => onChange(clamp(addStep(value, -step), min, max));

  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
        <span className="text-xs text-stone-500 dark:text-stone-500">{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        {value > 0 && (
          <button
            type="button"
            onClick={decrement}
            aria-label={`Decrease ${label}`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 dark:text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200 active:opacity-70"
          >
            −
          </button>
        )}
        <button
          type="button"
          onClick={handleTap}
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-label={label}
          className={`min-h-[44px] min-w-[44px] px-4 text-sm rounded-full transition-colors active:opacity-70 ${
            value > 0
              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
          }`}
        >
          {value}
        </button>
      </div>
    </div>
  );
}
