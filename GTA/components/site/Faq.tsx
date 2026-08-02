"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SITE } from "@/lib/config";
import SectionHeading from "./SectionHeading";

const FAQS = [
  {
    q: "What kind of photo should I send?",
    a: "One clear, well-lit photo where faces are easy to see. A good phone selfie is perfect. For groups, a photo where everyone is visible works best, or send separate photos and tell us who's who.",
  },
  {
    q: "How long does it take?",
    a: `Most orders are delivered in ${SITE.turnaround}. Need it sooner? Add the 24h Rush option at checkout and we'll jump the queue.`,
  },
  {
    q: "Can you do groups and the whole family?",
    a: "Absolutely. Solo, duo, or a crew of up to 6 on one cover. Bigger than that or a business/team order, message us for a custom quote.",
  },
  {
    q: "What do I actually get?",
    a: "A high-quality digital image of your GTA-style character art with your name on it, ready to post anywhere. Add the Hi-Res file for poster printing, or order the premium tee to wear it.",
  },
  {
    q: "Do I get revisions?",
    a: "Yes, every order includes one free revision round so we can tweak details until it's right.",
  },
  {
    q: "Is this an official GTA / Rockstar product?",
    a: "No. WANTED LEVEL is an independent custom art studio inspired by that iconic loading-screen style. We're not affiliated with or endorsed by Rockstar Games.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg uppercase tracking-wide text-bone sm:text-xl">
          {q}
        </span>
        <span
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/20 text-neon-pink transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          <Plus size={18} />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl leading-relaxed text-ash">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="Questions" title={<>Need-to-knows</>} />
        <div className="mt-10">
          {FAQS.map((f) => (
            <Item key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
