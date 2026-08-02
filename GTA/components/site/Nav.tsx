"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/config";
import WantedStars from "./WantedStars";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#addons", label: "Add-ons" },
  { href: "/#tees", label: "Tees" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-noir/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#050309] bg-gradient-to-br from-sun via-neon-pink to-vice-purple shadow-[0_6px_18px_-6px_rgba(255,45,149,0.7)]">
            <WantedStars level={1} total={1} size={18} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-wide text-bone">WANTED</span>
            <span className="-mt-1 font-display text-lg tracking-[0.35em] text-neon-pink">
              LEVEL
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ash transition-colors hover:text-bone"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/order" className="btn btn-primary !py-2.5 !text-sm">
            Start my art
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-bone lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-b border-white/10 bg-noir/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-bone/90 hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-2"
          >
            Start my art
          </Link>
          <a
            href={SITE.whatsapp}
            className="btn btn-ghost mt-1"
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
