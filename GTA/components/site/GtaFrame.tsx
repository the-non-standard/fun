import Art from "./Art";

type GtaFrameProps = {
  src: string;
  /** the name that appears top-left, like a player tag */
  name: string;
  /** wanted level, 0-5 */
  stars?: number;
  className?: string;
};

/**
 * Composites a character image inside a pixel-perfect Grand Theft Auto style
 * in-game HUD: rounded border, radar minimap (bottom-left), GTA wordmark
 * (bottom-right), player name tag (top-left) and a sun/compass emblem
 * (top-right). The HUD is pure code, so it is identical on every order.
 */
export default function GtaFrame({
  src,
  name,
  stars = 3,
  className = "",
}: GtaFrameProps) {
  return (
    <div
      className={`@container relative aspect-square w-full overflow-hidden rounded-[22px] border-[6px] border-[#0a0a0f] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      {/* character */}
      <Art src={src} alt={`${name}, GTA in-game style`} label={name} className="!rounded-none !border-0 h-full w-full" imgClassName="scale-[1.01]" />

      {/* game grain + vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_120%_at_50%_40%,transparent_55%,rgba(0,0,0,0.55))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_3px)]" />

      {/* top-left: player name tag */}
      <div className="absolute left-3 top-3 -rotate-2 sm:left-4 sm:top-4">
        <span
          className="font-display text-[clamp(1.4rem,5cqw,2.4rem)] uppercase italic leading-none text-bone"
          style={{
            WebkitTextStroke: "clamp(1px,0.4cqw,2.5px) #0a0a0f",
            paintOrder: "stroke fill",
            textShadow: "0 3px 0 rgba(0,0,0,0.5)",
          }}
        >
          {name || "YOUR NAME"}
        </span>
      </div>

      {/* top-right: sun / compass emblem */}
      <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
        <SunEmblem />
      </div>

      {/* bottom-left: radar minimap */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
        <Radar stars={stars} />
      </div>

      {/* bottom-right: GTA wordmark */}
      <div className="absolute bottom-2 right-3 sm:bottom-3 sm:right-4">
        <span
          className="font-display text-[clamp(2rem,9cqw,4rem)] uppercase leading-none text-bone"
          style={{
            WebkitTextStroke: "clamp(1.5px,0.6cqw,4px) #0a0a0f",
            paintOrder: "stroke fill",
            textShadow: "0 3px 0 rgba(0,0,0,0.55)",
          }}
        >
          GTA
        </span>
      </div>
    </div>
  );
}

function SunEmblem() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
      <circle cx="23" cy="23" r="21" fill="#0a0a0f" />
      <circle cx="23" cy="23" r="17" fill="none" stroke="#e8c14a" strokeWidth="2.5" strokeDasharray="2 3" />
      <circle cx="23" cy="23" r="9" fill="url(#sun)" />
      <defs>
        <radialGradient id="sun" cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#fff3c0" />
          <stop offset="1" stopColor="#e8a020" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Radar({ stars }: { stars: number }) {
  return (
    <div className="flex flex-col items-start gap-1">
      {/* wanted stars above radar */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24">
            <path
              d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"
              fill={i < stars ? "#ffd23f" : "rgba(255,255,255,0.25)"}
              stroke="#0a0a0f"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
      {/* radar */}
      <svg width="86" height="86" viewBox="0 0 86 86" className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
        <defs>
          <clipPath id="rc">
            <rect x="3" y="3" width="80" height="80" rx="14" />
          </clipPath>
        </defs>
        <rect x="1.5" y="1.5" width="83" height="83" rx="16" fill="#0a0a0f" />
        <g clipPath="url(#rc)">
          <rect x="3" y="3" width="80" height="80" fill="#3f6b4a" />
          {/* water */}
          <rect x="3" y="55" width="80" height="30" fill="#2f6f8f" />
          {/* land blocks */}
          <rect x="10" y="12" width="24" height="18" fill="#5a5f66" />
          <rect x="48" y="10" width="26" height="22" fill="#6b7178" />
          <rect x="12" y="36" width="20" height="14" fill="#6b7178" />
          <rect x="52" y="40" width="20" height="12" fill="#5a5f66" />
          {/* roads */}
          <path d="M43 3 V83 M3 33 H83 M3 52 H83" stroke="#e8c14a" strokeWidth="3" />
          <path d="M43 3 V83 M3 33 H83" stroke="#fff" strokeWidth="0.8" strokeDasharray="3 4" />
          {/* blips */}
          <circle cx="60" cy="20" r="3.5" fill="#e0483d" />
          <circle cx="20" cy="60" r="3.5" fill="#2fa84f" />
          {/* player arrow */}
          <path d="M43 38 l5 10 -5 -3 -5 3 z" fill="#fff" stroke="#0a0a0f" strokeWidth="1" strokeLinejoin="round" />
        </g>
        {/* compass N */}
        <text x="43" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" stroke="#0a0a0f" strokeWidth="0.6">N</text>
      </svg>
    </div>
  );
}
