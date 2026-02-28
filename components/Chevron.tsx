interface Props {
  direction: "left" | "right";
  className?: string;
}

/** Inline SVG chevron. Inherits color from parent via currentColor. Sizes to 1em. */
export default function Chevron({ direction, className = "" }: Props) {
  const d =
    direction === "left"
      ? "M 11 3 L 5 8 L 11 13"
      : "M 5 3 L 11 8 L 5 13";

  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block align-[-0.125em] opacity-50 dark:opacity-100 ${className}`}
    >
      <path d={d} />
    </svg>
  );
}
