/**
 * Pricing model. Drives both the homepage pricing section and the
 * live order-builder calculator. Change numbers here and both update.
 * Currency is configured in lib/config.ts (USD by default).
 */

export type Style = {
  id: string;
  name: string;
  blurb: string;
  /** key into lib/art.ts galleries for the preview image */
  art: string;
};

export const STYLES: Style[] = [
  {
    id: "ocean-drive",
    name: "Ocean Drive",
    blurb: "Daytime Miami beachfront, palms and pastel buildings behind you.",
    art: "hero",
  },
  {
    id: "neon-night",
    name: "Neon Night",
    blurb: "Nighttime neon and city lights, with a luxury ride.",
    art: "womanSuv",
  },
  {
    id: "the-block",
    name: "The Block",
    blurb: "Neighborhood energy with a lowrider at golden hour.",
    art: "charCigar",
  },
  {
    id: "the-crew",
    name: "The Crew",
    blurb: "Bring the whole squad into one in-game scene.",
    art: "group",
  },
];

export type Package = {
  id: string;
  name: string;
  people: string;
  peopleMax: number;
  price: number;
  blurb: string;
  popular?: boolean;
};

export const PACKAGES: Package[] = [
  {
    id: "solo",
    name: "Solo",
    people: "1 person",
    peopleMax: 1,
    price: 29,
    blurb: "One character, fully styled, dropped into the GTA world.",
  },
  {
    id: "duo",
    name: "Duo",
    people: "2 people",
    peopleMax: 2,
    price: 49,
    blurb: "You and your ride-or-die, drawn side by side.",
    popular: true,
  },
  {
    id: "crew",
    name: "The Crew",
    people: "3 to 6 people",
    peopleMax: 6,
    price: 89,
    blurb: "The whole gang on one cover. Friends, family, or the whole squad.",
  },
];

/** Base price for a given number of people (order builder). */
export const PERSON_PRICE: Record<number, number> = {
  1: 29,
  2: 49,
  3: 69,
  4: 85,
  5: 99,
  6: 115,
};
export const MAX_PEOPLE = 6;

export type Addon = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  /** lucide-react icon name */
  icon: string;
};

export const ADDONS: Addon[] = [
  { id: "cigar", name: "Cigar / Blunt", price: 6, icon: "Flame", blurb: "Light one up. Instant boss energy." },
  { id: "baddies", name: "Baddies", price: 10, icon: "Users", blurb: "Add background models to your scene." },
  { id: "exotic-car", name: "Exotic Car", price: 9, icon: "Car", blurb: "Supercar, lowrider or muscle. Your pick." },
  { id: "location", name: "Custom City", price: 8, icon: "MapPin", blurb: "Your hometown skyline in the backdrop." },
  { id: "pet", name: "Pet / Guard Dog", price: 8, icon: "PawPrint", blurb: "Dobermans, a bulldog, or your real pet." },
  { id: "prop", name: "Prop / Weapon", price: 7, icon: "Crosshair", blurb: "A bat, a mic, a controller. A signature prop." },
  { id: "ice", name: "Gold & Ice", price: 5, icon: "Gem", blurb: "Chains, grills and diamonds. Drip maxed." },
  { id: "night", name: "Neon Night", price: 6, icon: "Moon", blurb: "Swap the sunset for a neon night city." },
];

/** Premium / upsell options. */
export const PREMIUM = {
  tshirt: {
    id: "tshirt",
    name: "Premium T-Shirt",
    price: 34,
    blurb:
      "Your character printed on a heavyweight tee. Includes the full digital art.",
  },
  hires: {
    id: "hires",
    name: "Hi-Res Print File",
    price: 12,
    blurb: "Ultra high-resolution file, ready for poster printing.",
  },
  rush: {
    id: "rush",
    name: "24h Rush",
    price: 15,
    blurb: "Skip the line. Delivered within 24 hours.",
  },
} as const;
