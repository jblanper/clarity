"use client";

interface Props {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export default function MomentChip({ label, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`min-h-[44px] flex items-center rounded-full px-4 py-2 text-sm transition-colors ${
        selected
          ? "bg-amber-50 border border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:border dark:border-amber-700/40 dark:text-amber-300"
          : "border border-stone-200 dark:border-stone-700 bg-transparent text-stone-500 dark:text-stone-400"
      }`}
    >
      {label}
    </button>
  );
}
