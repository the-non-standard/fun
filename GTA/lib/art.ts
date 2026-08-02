/**
 * Central art registry.
 * ---------------------------------------------------------------------------
 * Every character is drawn in the GTA V cover-art illustration style
 * (cel-shaded, bold black outlines, vibrant colors). Images are generated with
 * the fal.ai connector and hosted on fal.media; they load directly in a
 * visitor's browser.
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
  // Solo hero, Ocean Drive at sunset
  hero: "https://v3b.fal.media/files/b/0aa4ba26/o7S_YDvmwJLvlcmw1DNhj_be4ef2658d0c45fc806180843e779bd9.jpg",
  // Solo woman, beach + convertible
  charWoman:
    "https://v3b.fal.media/files/b/0aa4ba90/O3Xw8wYtEbEHFj_dY63d9_ac6ff9d4e60d4e5db28c9c1f2c5cf3fa.jpg",
  // Man walking two dobermans
  dogs: "https://v3b.fal.media/files/b/0aa4ba29/upYzeDttVzZV627YRirCY_3bcb5e32026f420494d6c810e8654db6.jpg",
  // The crew (group)
  group:
    "https://v3b.fal.media/files/b/0aa4ba2a/BEkYdgzv7pOgjT47llPnh_361aa60980b94cea9a3be946e9f2900f.jpg",
  // Couple at sunset
  couple:
    "https://v3b.fal.media/files/b/0aa4ba2d/IuANHIyOeFJuOaeWqWzF3_a17afc20678141ee82807df9b8bcefe2.jpg",
  // Woman at night beside a luxury car (neon)
  womanSuv:
    "https://v3b.fal.media/files/b/0aa4ba96/4kIk37p_3DiT_Q3uviYv3_55b030e507e14cb4b5585e3e7000e239.jpg",
  // Premium tee with a GTA V character print
  tshirt:
    "https://v3b.fal.media/files/b/0aa4ba30/jRf9qaNUWrGFAA23T2-Br_2753a2febf3941c8a819080268aeb0a3.jpg",
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
  { key: "hero", title: "Sunset King", tag: "Loading Screen", people: "Solo" },
  { key: "womanSuv", title: "Night Money", tag: "Neon Night", people: "Solo" },
  { key: "dogs", title: "Guard of the Gang", tag: "Dobermans", people: "Solo" },
  { key: "group", title: "The Whole Crew", tag: "Cover Grid", people: "Squad" },
  { key: "couple", title: "Ride or Die", tag: "Sunset Strip", people: "Duo" },
  { key: "charWoman", title: "Vice Queen", tag: "Beachfront", people: "Solo" },
];
