"use client";

interface Props {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function HabitToggle({ label, checked, onChange }: Props) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-stone-700 dark:text-stone-300">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
          checked
            ? "bg-stone-500 dark:bg-stone-300"
            : "bg-stone-300 dark:bg-stone-600"
        }`}
      >
        {/* Thumb: slides between left-1 (off) and left-6 (on).
            Using explicit `left` instead of translate to avoid transform
            initialisation issues in Tailwind v4. */}
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
