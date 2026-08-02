"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ART, GALLERY } from "@/lib/art";
import Art from "./Art";
import SectionHeading from "./SectionHeading";

export default function GalleryCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });
  // loop:true means both directions are always scrollable
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <section id="gallery" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="The lineup"
            title={<>Straight off the loading screen</>}
            subtitle="Every character is drawn from scratch — no two are the same. Drag to browse the lineup."
            className="!mx-0"
          />
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => embla?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/15 text-bone transition-all hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-30"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => embla?.scrollNext()}
              disabled={!canNext}
              aria-label="Next"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/15 text-bone transition-all hover:border-neon-pink hover:text-neon-pink disabled:opacity-30"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]" ref={emblaRef}>
          <div className="flex gap-5">
            {GALLERY.map((item) => (
              <div
                key={item.key}
                className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_44%] lg:flex-[0_0_28%]"
              >
                <div className="group relative">
                  <Art
                    src={ART[item.key]}
                    alt={`${item.title} — GTA style character art`}
                    label={item.title}
                    className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
                    <div>
                      <p className="font-display text-xl uppercase text-bone drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                        {item.title}
                      </p>
                      <p className="text-[0.7rem] uppercase tracking-widest text-neon-cyan drop-shadow">
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

        <div className="mt-10 flex justify-center">
          <Link href="/order" className="btn btn-primary group">
            Put me in the game
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
