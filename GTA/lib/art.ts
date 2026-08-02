/**
 * Central art registry.
 * ---------------------------------------------------------------------------
 * Every character is rendered in the 3D GTA "in-game" style (San Andreas /
 * Vice City look). Images are generated with the fal.ai connector and hosted
 * on fal.media; they load directly in a visitor's browser.
 *
 * TO MAKE THEM PERMANENT (recommended before going live):
 *   1. Open each URL below in your browser and "Save image as…" into
 *      GTA/public/art/  (e.g. public/art/hero.jpg).
 *   2. Replace the URL with the local path, e.g. "/art/hero.jpg".
 * Every component reads from this file, and a neon poster-frame fallback shows
 * if any image is slow or missing.
 * ---------------------------------------------------------------------------
 */
export const ART = {
  // Daytime solo hero (Ocean Drive)
  hero: "https://v3b.fal.media/files/b/0aa4b963/vyKN9BL0-R3ACd-4F3TJD_391e7e3bed56432ba46a15b91f4ff4fa.jpg",
  // Solo man, lowrider + cigar (The Block)
  charCigar:
    "https://v3b.fal.media/files/b/0aa4b957/EIYLxCz7bRLh05ABMJH2__0ed0ffc718bd45b59d0eea49b63652df.jpg",
  // Solo woman, daytime beachfront
  charWoman:
    "https://v3b.fal.media/files/b/0aa4b955/_VelDtWgv2o5SJ_Vv8hDX_933e03160d8a4b59859ad05baa273ff4.jpg",
  // The crew (group)
  group:
    "https://v3b.fal.media/files/b/0aa4b959/0Njfxp9Hn-JtSnWpxhFBC_4abb7be065654673bdeeaf9b1b0ae190.jpg",
  // Premium tee with a GTA character print
  tshirt:
    "https://v3b.fal.media/files/b/0aa4b95f/B6I54R6_Fd617tM-Ex1uL_077734e1ae6348bebe2e50a4327f9b37.jpg",
  // Couple
  couple:
    "https://v3b.fal.media/files/b/0aa4b95c/gtStKU2mBms_lVLodpjx9_afbfbb8110014601bc61311db6a53e4d.jpg",
  // Woman at night beside a luxury car (Neon Night)
  womanSuv:
    "https://v3b.fal.media/files/b/0aa4b95d/rwqTW2rXKc5jSaERl_Vhd_65429f9bb03143e4ba312bc63171c415.jpg",
  // Flagship hero render ("Big Mike") used on the In-Game showcase
  ingameMan1:
    "https://v3b.fal.media/files/b/0aa4b8b2/Wr2FVCY4mLn9UcZfxt6pq_a4d133ec9b014334aaee157d2a95914d.jpg",
} as const;

export type ArtKey = keyof typeof ART;

export type GalleryItem = {
  key: ArtKey;
  title: string;
  tag: string;
  people: string;
};

/** Ordered showcase used by the gallery + hero carousels. */
export const GALLERY: GalleryItem[] = [
  { key: "ingameMan1", title: "Big Mike", tag: "Ocean Drive", people: "Solo" },
  { key: "hero", title: "Sunny Side", tag: "Ocean Drive", people: "Solo" },
  { key: "womanSuv", title: "Night Money", tag: "Neon Night", people: "Solo" },
  { key: "charCigar", title: "The Block", tag: "Lowrider", people: "Solo" },
  { key: "group", title: "The Whole Crew", tag: "The Crew", people: "Squad" },
  { key: "couple", title: "Ride or Die", tag: "Beachfront", people: "Duo" },
  { key: "charWoman", title: "Vice Queen", tag: "Beachfront", people: "Solo" },
];
