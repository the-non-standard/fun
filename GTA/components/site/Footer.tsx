import Link from "next/link";
import { SITE } from "@/lib/config";
import WantedStars from "./WantedStars";

/* Inline brand glyphs (lucide dropped social brand icons over trademarks). */
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TiktokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.6 3.7 3.7 4v2.6c-1.3.1-2.6-.3-3.7-1v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.7a2.9 2.9 0 1 0 2 2.8V3h2.7z" />
    </svg>
  );
}
function WhatsappIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.6 12.5c-.2.3-.9 1.6-1.2 1.9l.5-.1-2.9.8.8-2.8a8 8 0 0 1 .1-.2A8 8 0 0 1 12 4zm-2.6 4.2c-.1 0-.4 0-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.4 1.9.8 2.3.6 2.7.6.4 0 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3l-1.3-.6c-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.7-.3-1.3-.6-1.9-1.4-.2-.3 0-.4.1-.6l.4-.5c.1-.2 0-.4 0-.5l-.6-1.4c-.1-.3-.3-.3-.5-.3h-.5z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-noir-800/60">
      <div className="hazard h-1.5 w-full opacity-60" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#050309] bg-gradient-to-br from-sun via-neon-pink to-vice-purple">
                <WantedStars level={1} total={1} size={18} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg tracking-wide text-bone">WANTED</span>
                <span className="-mt-1 font-display text-lg tracking-[0.35em] text-neon-pink">
                  LEVEL
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              Custom GTA-style character art from your photos. Solo, squad, or the
              whole crew — drawn like a loading screen and printed on premium tees.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { href: SITE.instagram, icon: InstagramIcon, label: "Instagram" },
                { href: SITE.tiktok, icon: TiktokIcon, label: "TikTok" },
                { href: SITE.whatsapp, icon: WhatsappIcon, label: "WhatsApp" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-ash transition-all hover:border-neon-pink hover:text-neon-pink"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Explore"
              links={[
                { href: "/#how", label: "How it works" },
                { href: "/#gallery", label: "Gallery" },
                { href: "/#addons", label: "Add-ons" },
                { href: "/#pricing", label: "Pricing" },
              ]}
            />
            <FooterCol
              title="Order"
              links={[
                { href: "/order", label: "Start my art" },
                { href: "/order?tshirt=1", label: "Premium tee" },
                { href: "/#faq", label: "FAQ" },
              ]}
            />
            <FooterCol
              title="Contact"
              links={[
                { href: `mailto:${SITE.email}`, label: "Email us" },
                { href: SITE.whatsapp, label: "WhatsApp" },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WANTED LEVEL. All rights reserved.</p>
          <p className="max-w-md sm:text-right">
            An independent art studio. Not affiliated with or endorsed by Rockstar
            Games. GTA is a trademark of its respective owner.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-sm uppercase tracking-widest text-bone">
        {title}
      </h4>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-ash transition-colors hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
