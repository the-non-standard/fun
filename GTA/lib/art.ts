/**
 * Central art registry.
 * ---------------------------------------------------------------------------
 * These images were generated with the fal.ai connector in the GTA
 * loading-screen style. They are hosted on fal.media and load directly in a
 * visitor's browser.
 *
 * TO MAKE THEM PERMANENT (recommended before going live):
 *   1. Open each URL below in your browser and "Save image as…" into
 *      GTA/public/art/  (e.g. public/art/hero.jpg).
 *   2. Replace the URL with the local path, e.g. "/art/hero.jpg".
 * Nothing else needs to change — every component reads from this file, and a
 * neon poster-frame fallback shows if any image is slow or missing.
 * ---------------------------------------------------------------------------
 */
export const ART = {
  hero: "https://v3b.fal.media/files/b/0aa4b71c/laygdrRTF_bKTIeCD_idL_3a825782bcd14b358ee7ef4a32bbbc6d.jpg",
  charCigar:
    "https://v3b.fal.media/files/b/0aa4b72e/Khi7cBD2yw_UT-NSx7A-r_11f69f02b0fd462a8097a62aa9796906.jpg",
  charWoman:
    "https://v3b.fal.media/files/b/0aa4b721/Lmjuui1nf7LGrVVXSQz-i_8cea8c512ddb47768cabdb4c4f2d34a2.png",
  group:
    "https://v3b.fal.media/files/b/0aa4b723/Mvu7GENyRvFOq-9YCdJNO_6bc4165648174995b2657bdb0f87207b.jpg",
  tshirt:
    "https://v3b.fal.media/files/b/0aa4b74c/Q70MoTw6-G_h2LgYuhr7j_366d6c93ebbc48ea9b8e66dee98326b7.jpg",
  couple:
    "https://v3b.fal.media/files/b/0aa4b74d/9-MuPRutm6fi7B_Sfkz6a_027e9ade56b14d94b9eaf1038a25434c.jpg",
  womanSuv:
    "https://v3b.fal.media/files/b/0aa4b752/1h5Cx_pKt7PTviCO86cZF_ae154bd6cbfc4b189656ed5e6b112de2.jpg",
} as const;

export type ArtKey = keyof typeof ART;

export type GalleryItem = {
  key: ArtKey;
  title: string;
  tag: string;
  people: string;
};

/** Ordered showcase used by the gallery carousel. */
export const GALLERY: GalleryItem[] = [
  { key: "hero", title: "Beach Boulevard", tag: "Loading Screen", people: "Solo" },
  { key: "charCigar", title: "Sunset Kingpin", tag: "Cigar · Lowrider", people: "Solo" },
  { key: "womanSuv", title: "Night Money", tag: "Exotic Car · Neon Night", people: "Solo" },
  { key: "group", title: "The Whole Crew", tag: "Cover Grid", people: "Squad" },
  { key: "couple", title: "Ride or Die", tag: "Custom City", people: "Duo" },
  { key: "charWoman", title: "Club Favela", tag: "Baddie · Gold & Ice", people: "Solo" },
];
