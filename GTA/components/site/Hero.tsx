"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { ART, GALLERY } from "@/lib/art";
import WantedStars from "./WantedStars";

// Crew shot leads, then the rest of the lineup.
const HERO_SLIDES = [
  ...GALLERY.filter((g) => g.key === "group"),
  ...GALLERY.filter((g) => g.key !== "group"),
];

export default function Hero() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [
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
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* full-bleed image slider */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {HERO_SLIDES.map((s) => (
            <div
              key={s.key}
              className="art-fallback relative h-full min-w-0 flex-[0_0_100%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ART[s.key]}
                alt={`${s.title}, GTA V style character art`}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* readability scrims (kept light so the art stays vibrant) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-noir via-noir/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir/85 via-transparent to-noir/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-noir/60 to-transparent sm:hidden" />

      {/* content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pb-28 pt-28 sm:px-6">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="chip text-neon-cyan">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-cyan" />
              Vice City character studio
            </span>
            <span className="flex items-center gap-2 text-sm text-ash">
              <WantedStars level={5} size={16} />
              <span className="font-semibold text-bone">4.9</span> · 500+ drawn
            </span>
          </div>

          <h1 className="mt-6">
            <span className="title-gta block text-5xl sm:text-6xl lg:text-7xl">
              Get drawn
            </span>
            <span className="title-gta block text-5xl sm:text-6xl lg:text-7xl">
              into the{" "}
              <span className="text-vice" style={{ WebkitTextStroke: "0" }}>
                game
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/85">
            Send us a photo (solo, your duo, or the whole crew) and we hand-craft
            you into a <span className="text-bone">GTA-style character</span>. Your
            name on it. Cigars, baddies, exotic cars, your city.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/order" className="btn btn-primary group">
              Start my art
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link href="/#gallery" className="btn btn-ghost group">
              <Play size={16} className="fill-current" />
              See the gallery
            </Link>
          </div>

          <Link
            href="/preview"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-neon-cyan underline-offset-4 hover:underline"
          >
            <Sparkles size={15} /> Try a free preview from your photo
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {[
              ["48-72h", "Delivery"],
              ["From $29", "Solo art"],
              ["Print-ready", "Tees & posters"],
            ].map(([big, small]) => (
              <div key={small} className="flex flex-col">
                <span className="font-display text-2xl text-bone">{big}</span>
                <span className="text-xs uppercase tracking-widest text-ash">
                  {small}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* big GTA wordmark, corner logo */}
      <div className="pointer-events-none absolute bottom-14 right-4 z-10 sm:bottom-12 sm:right-8">
        <span className="title-gta text-6xl leading-none sm:text-8xl lg:text-9xl">
          GTA
        </span>
      </div>

      {/* slide dots */}
      <div className="absolute bottom-6 left-4 z-10 flex gap-2 sm:left-6">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              selected === i
                ? "w-7 bg-neon-pink"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
