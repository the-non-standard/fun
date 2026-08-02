import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import GtaFrame from "@/components/site/GtaFrame";
import PhotoPreview from "@/components/order/PhotoPreview";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { ART } from "@/lib/art";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "In-Game Mode",
  description:
    "Get turned into a full GTA in-game screenshot, complete with the radar map, your name tag and the GTA logo. The ultimate San Andreas flex.",
};

const SAMPLES = [
  { src: ART.ingameMan1, name: "Big Mike", stars: 4 },
  { src: ART.charWoman, name: "Nova", stars: 3 },
  { src: ART.charCigar, name: "305 King", stars: 5 },
];

const PERKS = [
  "Full in-game screenshot look, radar map included",
  "Your name as the on-screen tag",
  "The GTA logo + wanted stars, pixel-perfect every time",
  "Delivered from your photo, drawn to match your face",
];

export default function InGamePage() {
  return (
    <>
      <Nav />
      <main className="pt-28 sm:pt-32">
        {/* hero */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <Reveal>
              <span className="chip text-neon-cyan">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-cyan" />
                New · In-Game Mode
              </span>
              <h1 className="title-gta mt-5 text-4xl sm:text-6xl">
                Step inside
                <br /> the game
              </h1>
              <p className="mt-5 max-w-lg text-lg text-ash">
                Not just a portrait. We drop you into a full GTA in-game
                screenshot, radar map, name tag, wanted stars and the GTA logo,
                exactly like the loading screen you grew up on.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-bone/90">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-money/20 text-money">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/order" className="btn btn-primary group">
                  Get me in the game
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="font-display text-sm uppercase tracking-wider text-ash">
                  Delivered in {SITE.turnaround}
                </span>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <GtaFrame src={ART.ingameMan1} name="Big Mike" stars={4} />
            </Reveal>
          </div>
        </section>

        {/* live preview from your photo */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <SectionHeading
            eyebrow="Try it now"
            title={<>See yourself in the game</>}
            subtitle="Upload a selfie and get an instant AI preview of your GTA character, right inside the frame. Free to try."
          />
          <div className="mt-12">
            <PhotoPreview />
          </div>
        </section>

        {/* sample grid */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLES.map((s, i) => (
              <Reveal key={s.name} delay={i * 120}>
                <GtaFrame src={s.src} name={s.name} stars={s.stars} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 flex justify-center">
            <Link href="/order" className="btn btn-primary group">
              Start my in-game art
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
