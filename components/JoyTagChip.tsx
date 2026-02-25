"use client";

interface Props {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export default function JoyTagChip({ label, selected, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        selected
          ? "bg-stone-700 text-white"
          : "border border-stone-200 bg-stone-50 text-stone-500"
      }`}
    >
      {label}
    </button>
  );
}
