import WantedStars from "./WantedStars";

type MarqueeProps = {
  items: string[];
  reverse?: boolean;
  className?: string;
};

/** Infinite neon ticker. Content is duplicated for a seamless loop. */
export default function Marquee({ items, reverse, className = "" }: MarqueeProps) {
  const row = [...items, ...items];
  return (
    <div className={`marquee-pause overflow-hidden ${className}`}>
      <div className={`marquee ${reverse ? "marquee-rev" : ""}`}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-display text-lg uppercase tracking-wide text-bone/80 sm:text-xl">
              {item}
            </span>
            <span className="mx-5 flex items-center sm:mx-7">
              <WantedStars level={1} total={1} size={16} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
