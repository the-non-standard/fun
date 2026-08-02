import Link from "next/link";
import { Check, Star } from "lucide-react";
import { PACKAGES } from "@/lib/pricing";
import { price, SITE } from "@/lib/config";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const INCLUDES = [
  "Hand-crafted GTA-style art",
  "Your name on the cover",
  "1 free revision round",
  `Delivered in ${SITE.turnaround}`,
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The damage"
          title={<>Pick your crew size</>}
          subtitle="Simple, upfront pricing. Add-ons and the premium tee are optional. Build your exact order on the next page."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 120}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                  pkg.popular
                    ? "border-neon-pink/60 bg-gradient-to-b from-neon-pink/10 to-noir-800/60 shadow-[0_24px_60px_-28px_rgba(255,45,149,0.7)]"
                    : "border-white/10 bg-noir-800/60 hover:border-white/20"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-[#050309] bg-gradient-to-r from-sun to-neon-pink px-3 py-1 font-display text-xs uppercase text-[#0a0510]">
                    <Star size={12} className="fill-current" /> Most wanted
                  </span>
                )}
                <h3 className="font-display text-2xl uppercase text-bone">{pkg.name}</h3>
                <p className="text-sm text-ash">{pkg.people}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl text-bone">
                    {price(pkg.price)}
                  </span>
                  <span className="text-sm text-ash">start</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ash">{pkg.blurb}</p>

                <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-6">
                  {INCLUDES.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-bone/90">
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-neon-cyan/15 text-neon-cyan">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/order?people=${pkg.peopleMax}`}
                  className={`btn mt-7 w-full ${pkg.popular ? "btn-primary" : "btn-ghost"}`}
                >
                  Choose {pkg.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ash">
          Bigger squad or a business order?{" "}
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="text-neon-cyan underline-offset-4 hover:underline">
            Message us for a custom quote →
          </a>
        </p>
      </div>
    </section>
  );
}
