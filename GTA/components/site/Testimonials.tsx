"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import SectionHeading from "./SectionHeading";
import WantedStars from "./WantedStars";

/**
 * Placeholder testimonials — replace with real customer reviews before launch.
 */
const REVIEWS = [
  {
    quote:
      "Sent one blurry selfie and got back the coldest cover art I've ever seen. Made it my profile pic on everything.",
    name: "Marcus O.",
    handle: "@marcusonthebeat",
  },
  {
    quote:
      "Got the whole squad done as a GTA cover for my brother's birthday. He genuinely teared up. Unreal detail.",
    name: "Priya R.",
    handle: "@priyaruns",
  },
  {
    quote:
      "The cigar + lowrider add-ons hit different. Then I ordered the tee. Everyone asks where I got it.",
    name: "Deej",
    handle: "@deej_305",
  },
  {
    quote:
      "Turnaround was faster than promised and they nailed the vibe first try. This is the flex I didn't know I needed.",
    name: "Sam T.",
    handle: "@samtakesphotos",
  },
];

export default function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4200, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Word on the street"
          title={<>Five stars, no cops needed</>}
        />

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="min-w-0 flex-[0_0_88%] rounded-2xl border border-white/10 bg-noir-800/60 p-7 sm:flex-[0_0_46%] lg:flex-[0_0_31%]"
              >
                <WantedStars level={5} size={18} />
                <blockquote className="mt-4 text-lg leading-relaxed text-bone/90">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#050309] bg-gradient-to-br from-neon-pink to-vice-purple font-display text-sm text-bone">
                    {r.name.charAt(0)}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-semibold text-bone">{r.name}</span>
                    <span className="text-xs text-ash">{r.handle}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to review ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                selected === i ? "w-7 bg-neon-pink" : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
