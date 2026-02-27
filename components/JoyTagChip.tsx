"use client";

interface Props {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export default function JoyTagChip({ label, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        selected
          ? "bg-stone-500 dark:bg-stone-300 text-white dark:text-stone-900"
          : "border border-stone-200 dark:border-stone-700 bg-transparent dark:bg-stone-800 text-stone-500 dark:text-stone-400"
      }`}
    >
      {label}
    </button>
  );
}
