type WantedStarsProps = {
  level?: number;
  total?: number;
  size?: number;
  className?: string;
  pulse?: boolean;
};

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={filled ? "star-badge" : ""}
      aria-hidden="true"
    >
      <path
        d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"
        fill={filled ? "var(--color-star)" : "transparent"}
        stroke={filled ? "#050309" : "rgba(244,241,234,0.35)"}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** GTA-style wanted-level stars. */
export default function WantedStars({
  level = 5,
  total = 5,
  size = 20,
  className = "",
  pulse = false,
}: WantedStarsProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${pulse ? "animate-pulse-glow" : ""} ${className}`}
      role="img"
      aria-label={`${level} out of ${total} wanted stars`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <Star key={i} filled={i < level} size={size} />
      ))}
    </span>
  );
}
