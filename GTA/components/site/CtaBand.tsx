import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import WantedStars from "./WantedStars";

export default function CtaBand() {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#050309] bg-gradient-to-br from-vice-purple via-neon-pink to-sun p-8 text-center shadow-[0_30px_80px_-30px_rgba(255,45,149,0.7)] sm:p-14">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#fff_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="relative">
            <WantedStars level={5} size={26} className="justify-center" />
            <h2 className="title-gta mt-5 text-4xl text-[#0a0510] sm:text-6xl" style={{ WebkitTextStroke: "0", textShadow: "0 3px 0 rgba(0,0,0,0.25)" }}>
              Your city needs a legend
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-[#1a0a18]">
              Drop a photo, pick your load-out, and we&rsquo;ll draw you into the game.
              Delivered in days.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/order"
                className="btn group border-[#050309] bg-[#0a0510] text-bone hover:bg-[#161022]"
              >
                Start my art
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="font-display text-sm uppercase tracking-wider text-[#1a0a18]">
                From $29 · No account needed
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
