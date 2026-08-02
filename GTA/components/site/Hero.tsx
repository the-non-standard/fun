"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { ART, GALLERY } from "@/lib/art";
import Art from "./Art";
import WantedStars from "./WantedStars";

const SLIDES = GALLERY.slice(0, 5);

export default function Hero() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 3200, stopOnInteraction: false }),
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
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      {/* decorative sun */}
      <div className="pointer-events-none absolute -right-24 top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-sun/30 via-neon-pink/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-vice-purple/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Copy */}
        <div className="max-w-xl">
          <div className="reveal is-in flex flex-wrap items-center gap-3">
            <span className="chip text-neon-cyan">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-cyan" />
              Vice City character studio
            </span>
            <span className="flex items-center gap-2 text-sm text-ash">
              <WantedStars level={5} size={16} />
              <span className="font-semibold text-bone">4.9</span> · 500+ drawn
            </span>
          </div>

          <h1 className="mt-6 text-balance">
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

          <p className="mt-6 text-lg leading-relaxed text-ash">
            Send us a photo (solo, your duo, or the whole crew) and we hand-craft
            you into a{" "}
            <span className="text-bone">GTA-style character</span>, straight off a
            loading screen. Your name on it. Cigars, baddies, exotic cars, your city.
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

        {/* Poster slider */}
        <div className="relative">
          {/* floating stickers */}
          <div className="absolute -left-3 top-6 z-20 -rotate-6 rounded-xl border-2 border-[#050309] bg-money px-3 py-1.5 font-display text-sm uppercase text-[#06120b] shadow-lg animate-float-slow">
            from $29
          </div>
          <div className="absolute -right-2 bottom-16 z-20 rotate-6 rounded-xl border-2 border-[#050309] bg-gradient-to-br from-sun to-neon-pink px-3 py-1.5 font-display text-sm uppercase text-[#0a0510] shadow-lg animate-float-slow [animation-delay:1.2s]">
            ★ Wanted ★
          </div>

          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {SLIDES.map((item) => (
                <div
                  key={item.key}
                  className="relative min-w-0 flex-[0_0_100%] px-1"
                >
                  <div className="relative">
                    <Art
                      src={ART[item.key]}
                      alt={`${item.title}, GTA style character art`}
                      label={item.title}
                      eager
                      className="aspect-[4/5] w-full"
                    />
                    {/* caption overlay */}
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
                      <div>
                        <p className="font-display text-2xl uppercase text-bone drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                          {item.title}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-neon-cyan drop-shadow">
                          {item.tag}
                        </p>
                      </div>
                      <span className="chip border-white/25 bg-black/40 text-bone">
                        {item.people}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* dots */}
          <div className="mt-4 flex justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => embla?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  selected === i
                    ? "w-7 bg-neon-pink"
                    : "w-2 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
