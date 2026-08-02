import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ART } from "@/lib/art";
import GtaFrame from "./GtaFrame";
import Reveal from "./Reveal";

export default function InGameSection() {
  return (
    <section id="ingame" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute right-0 top-1/4 -z-10 h-80 w-80 rounded-full bg-neon-cyan/15 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <GtaFrame src={ART.ingameMan1} name="Big Mike" stars={4} />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="chip text-neon-cyan">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-cyan" />
              New · In-Game Mode
            </span>
            <h2 className="title-gta mt-5 text-4xl sm:text-5xl lg:text-6xl">
              Step inside
              <br /> the game
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ash">
              Every character we make drops you into a full GTA in-game
              screenshot, radar map, your name tag, wanted stars and the GTA
              logo. The most realistic flex there is.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/ingame" className="btn btn-primary group">
                See In-Game Mode
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/order" className="btn btn-ghost">
                Start my art
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
