interface Props {
  direction: "up" | "down" | "left" | "right";
  size?: number;
  className?: string;
}

const ROTATIONS: Record<Props["direction"], number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

/** Inline SVG chevron. Inherits color from parent via currentColor. Sizes to 1em by default. */
export default function Chevron({ direction, size, className = "" }: Props) {
  const rotation = ROTATIONS[direction];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size ?? "1em"}
      height={size ?? "1em"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`inline-block align-[-0.125em] opacity-50 dark:opacity-100 ${className}`}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
