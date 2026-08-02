import { Camera, Wand2, Download } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: Camera,
    title: "Send your photo",
    body: "One clear photo — solo, your duo or the whole crew. Phone selfies work great.",
    accent: "from-neon-cyan to-vice-purple",
  },
  {
    icon: Wand2,
    title: "Pick your vibe",
    body: "Choose a style, drop in add-ons — cigar, baddies, exotic car, your city — and the name for your cover.",
    accent: "from-neon-pink to-sun",
  },
  {
    icon: Download,
    title: "Get your character",
    body: "In 48–72h you get your GTA-style art, ready to post. Want it on a tee? We print it.",
    accent: "from-sun to-money",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title={<>Three steps to the streets</>}
          subtitle="No app, no waiting rooms. Just send a photo and we handle the rest — hand-drawn, not a cheap filter."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-noir-800/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20">
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${step.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
                />
                <span className="font-display text-6xl text-white/10">
                  0{i + 1}
                </span>
                <div
                  className={`-mt-6 mb-5 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#050309] bg-gradient-to-br ${step.accent} text-[#0a0510] shadow-lg`}
                >
                  <step.icon size={26} strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-2xl uppercase text-bone">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ash">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
