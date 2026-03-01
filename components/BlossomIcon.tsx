interface Props {
  filled: boolean;
  size?: number;
}

export default function BlossomIcon({ filled, size = 20 }: Props) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
          className="fill-amber-400 dark:fill-amber-500 stroke-amber-500 dark:stroke-amber-600"
          strokeWidth="0.75" opacity="0.9"/>
        <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
          className="fill-amber-400 dark:fill-amber-500 stroke-amber-500 dark:stroke-amber-600"
          strokeWidth="0.75" opacity="0.9"
          transform="rotate(72 12 12)"/>
        <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
          className="fill-amber-400 dark:fill-amber-500 stroke-amber-500 dark:stroke-amber-600"
          strokeWidth="0.75" opacity="0.9"
          transform="rotate(144 12 12)"/>
        <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
          className="fill-amber-400 dark:fill-amber-500 stroke-amber-500 dark:stroke-amber-600"
          strokeWidth="0.75" opacity="0.9"
          transform="rotate(216 12 12)"/>
        <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
          className="fill-amber-400 dark:fill-amber-500 stroke-amber-500 dark:stroke-amber-600"
          strokeWidth="0.75" opacity="0.9"
          transform="rotate(288 12 12)"/>
        <circle cx="12" cy="12" r="2.2"
          className="fill-amber-500 dark:fill-amber-400"/>
        <circle cx="12" cy="12" r="1"
          className="fill-amber-100"/>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
        stroke="currentColor" strokeWidth="1.3" opacity="0.4"/>
      <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
        stroke="currentColor" strokeWidth="1.3" opacity="0.4"
        transform="rotate(72 12 12)"/>
      <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
        stroke="currentColor" strokeWidth="1.3" opacity="0.4"
        transform="rotate(144 12 12)"/>
      <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
        stroke="currentColor" strokeWidth="1.3" opacity="0.4"
        transform="rotate(216 12 12)"/>
      <ellipse cx="12" cy="5.5" rx="2.2" ry="3.5"
        stroke="currentColor" strokeWidth="1.3" opacity="0.4"
        transform="rotate(288 12 12)"/>
      <circle cx="12" cy="12" r="2"
        className="fill-stone-200 dark:fill-stone-700"/>
    </svg>
  );
}
