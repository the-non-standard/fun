/**
 * Global site configuration.
 * Edit these values to rebrand or update contact details in one place.
 */
export const SITE = {
  name: "WANTED LEVEL",
  tagline: "Get drawn into the game.",
  description:
    "WANTED LEVEL turns your photo into custom GTA-style character art, hand-crafted like a loading screen. Solo, squad, or the whole crew. Add cigars, baddies, exotic cars and your own city. Printed on premium tees too.",
  // Used for absolute URLs (OpenGraph, etc). Update to your Vercel domain.
  url: "https://wanted-level.vercel.app",
  // Where "email us" / WhatsApp fallbacks point. Update to your real handles.
  email: "orders@wantedlevel.art",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  whatsapp: "https://wa.me/10000000000",
  // Rough turnaround shown across the site.
  turnaround: "48 to 72 hours",
} as const;

export const CURRENCY = {
  code: "USD",
  symbol: "$",
} as const;

export function price(amount: number): string {
  return `${CURRENCY.symbol}${amount}`;
}
