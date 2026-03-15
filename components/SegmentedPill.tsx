"use client";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function SegmentedPill<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="inline-flex rounded-full border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`min-h-[44px] rounded-full px-5 text-sm transition-colors ${
            value === opt.value
              ? "bg-white dark:bg-stone-900 font-medium text-stone-900 dark:text-stone-100 shadow-sm"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
