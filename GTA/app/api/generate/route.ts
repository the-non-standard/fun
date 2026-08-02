import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Free self-serve generator: turns an uploaded photo into a GTA V cover-art
 * character, shaped by the chosen style + add-ons, via fal.ai image-to-image.
 * Requires FAL_KEY. Returns 503 without it.
 */
const MODEL = process.env.FAL_PREVIEW_MODEL || "fal-ai/nano-banana/edit";

const SCENES: Record<string, string> = {
  "loading-screen": "posed confidently on a Vice City street at sunset with palm trees",
  "neon-night": "at night with neon city lights and a luxury car",
  "cover-grid": "posed like a cover shot with the crew",
  "action-scene": "in a dynamic action street scene with a classic car and palm trees",
};

const ADDON_PHRASES: Record<string, string> = {
  cigar: "smoking a cigar",
  baddies: "with stylish background models",
  "exotic-car": "next to an exotic sports car",
  location: "with a city skyline in the background",
  pet: "with a guard dog on a leash",
  prop: "holding a signature prop",
  ice: "wearing gold chains and diamond jewelry",
  night: "at night under neon lights",
};

export async function POST(request: Request) {
  const key = process.env.FAL_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "The generator is not enabled yet. Add a FAL_KEY environment variable." },
      { status: 503 },
    );
  }

  let photo: File | null = null;
  let styleId = "";
  let addonIds: string[] = [];
  try {
    const form = await request.formData();
    const p = form.get("photo");
    if (p instanceof File && p.size > 0) photo = p;
    styleId = String(form.get("style") || "");
    const a = form.get("addons");
    if (typeof a === "string") addonIds = JSON.parse(a);
  } catch {
    /* handled below */
  }
  if (!photo) {
    return NextResponse.json({ error: "No photo received." }, { status: 400 });
  }
  if (photo.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 413 });
  }

  const scene = SCENES[styleId] ?? SCENES["loading-screen"];
  const extras = addonIds.map((id) => ADDON_PHRASES[id]).filter(Boolean);
  const prompt =
    "Transform this exact person into a character in the Grand Theft Auto V official cover art style: " +
    "cel-shaded illustration with bold clean black outlines and vibrant saturated colors, high contrast " +
    `dramatic lighting, ${scene}${extras.length ? ", " + extras.join(", ") : ""}. ` +
    "Keep the same face, hairstyle, skin tone and outfit so they stay clearly recognizable. " +
    "No text, no watermark, no logo, no UI.";

  try {
    fal.config({ credentials: key });
    const imageUrl = await fal.storage.upload(photo);
    const result = await fal.subscribe(MODEL, {
      input: { prompt, image_urls: [imageUrl] },
    });
    const data = (result as { data?: Record<string, unknown> })?.data ?? {};
    const images = (data.images as { url?: string }[] | undefined) ?? [];
    const single = data.image as { url?: string } | undefined;
    const url = images[0]?.url ?? single?.url;
    if (!url) {
      return NextResponse.json(
        { error: "The character came back empty. Please try another photo." },
        { status: 502 },
      );
    }
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[generate] failed", e);
    return NextResponse.json(
      { error: "Generation failed. Please try again in a moment." },
      { status: 502 },
    );
  }
}
