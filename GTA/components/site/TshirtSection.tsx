import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ART } from "@/lib/art";
import { PREMIUM } from "@/lib/pricing";
import { price } from "@/lib/config";
import Art from "./Art";
import Reveal from "./Reveal";

const PERKS = [
  "Heavyweight premium tee, sizes S to 3XL",
  "Your character printed front & center",
  "Full digital art file included",
  "Worldwide shipping",
];

export default function TshirtSection() {
  return (
    <section id="tees" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vice-purple/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-2 lg:order-1">
          <div className="absolute -left-3 -top-3 z-20 rotate-[-8deg] rounded-xl border-2 border-[#050309] bg-gradient-to-br from-sun to-neon-pink px-4 py-2 font-display text-lg uppercase text-[#0a0510] shadow-xl">
            Premium
          </div>
          <Art
            src={ART.tshirt}
            alt="WANTED LEVEL premium t-shirt with GTA-style character print"
            label="Premium Tee"
            className="aspect-square w-full"
          />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 text-sun">
              <span className="h-px w-8 bg-sun/70" />
              Wear it
            </span>
            <h2 className="title-gta mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Put your level
              <br /> on a tee
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ash">
              {PREMIUM.tshirt.blurb} The ultimate flex. Walk around as your own GTA
              character.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-sm text-bone/90">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-money/20 text-money">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-bone">
                  {price(PREMIUM.tshirt.price)}
                </span>
                <span className="text-sm text-ash">art included</span>
              </div>
              <Link href="/order?tshirt=1" className="btn btn-money group">
                Get the tee
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
