import Link from "next/link";
import { ADDONS } from "@/lib/pricing";
import { price } from "@/lib/config";
import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function AddonsShowcase() {
  return (
    <section id="addons" className="relative py-20 sm:py-28">
      {/* hazard divider */}
      <div className="hazard absolute inset-x-0 top-0 h-1.5 opacity-70" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Load out"
          title={<>Stack the add-ons</>}
          subtitle="Build the scene you want. Mix and match — every add-on is drawn straight into your art."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {ADDONS.map((addon, i) => (
            <Reveal key={addon.id} delay={(i % 4) * 90}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-noir-800/60 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-neon-pink/50 hover:shadow-[0_18px_40px_-20px_rgba(255,45,149,0.6)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#050309] bg-gradient-to-br from-noir-600 to-noir-700 text-neon-cyan transition-colors group-hover:text-neon-pink">
                    <Icon name={addon.icon} size={22} />
                  </span>
                  <span className="font-display text-lg text-money">
                    +{price(addon.price)}
                  </span>
                </div>
                <h3 className="font-display text-lg uppercase text-bone">
                  {addon.name}
                </h3>
                <p className="mt-1 text-sm leading-snug text-ash">{addon.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link href="/order" className="btn btn-ghost">
            Build my load-out
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
