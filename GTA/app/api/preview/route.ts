import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Live "preview from your photo": restyles an uploaded photo into a GTA
 * in-game character via fal.ai image-to-image, keeping the person's likeness.
 *
 * Requires FAL_KEY in the environment (fal.ai API key). Model is configurable
 * via FAL_PREVIEW_MODEL. Without a key it returns 503 so the UI can explain.
 *
 * Note: each call spends fal credits. For a public page you should add rate
 * limiting / a captcha before heavy traffic.
 */
const MODEL = process.env.FAL_PREVIEW_MODEL || "fal-ai/nano-banana/edit";

const PROMPT =
  "Transform this exact person into a 3D character in the style of the Grand Theft Auto San Andreas and Vice City video game, PS2 era in-game render, standing full body on a sunny Miami Ocean Drive sidewalk with palm trees and pastel art deco buildings, third person in-game camera. Keep the same face, hairstyle, skin tone and outfit so they are clearly recognizable. No text, no watermark, no UI.";

export async function POST(request: Request) {
  const key = process.env.FAL_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          "Live preview is not enabled yet. Add a FAL_KEY environment variable to switch it on.",
      },
      { status: 503 },
    );
  }

  let photo: File | null = null;
  try {
    const form = await request.formData();
    const p = form.get("photo");
    if (p instanceof File && p.size > 0) photo = p;
  } catch {
    /* fallthrough */
  }
  if (!photo) {
    return NextResponse.json({ error: "No photo received." }, { status: 400 });
  }
  if (photo.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 413 });
  }

  try {
    fal.config({ credentials: key });
    const imageUrl = await fal.storage.upload(photo);
    const result = await fal.subscribe(MODEL, {
      input: { prompt: PROMPT, image_urls: [imageUrl] },
    });

    // Different models nest the output slightly differently; cover both.
    const data = (result as { data?: Record<string, unknown> })?.data ?? {};
    const images = (data.images as { url?: string }[] | undefined) ?? [];
    const single = (data.image as { url?: string } | undefined) ?? undefined;
    const url = images[0]?.url ?? single?.url;

    if (!url) {
      return NextResponse.json(
        { error: "The preview came back empty. Please try another photo." },
        { status: 502 },
      );
    }
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[preview] failed", e);
    return NextResponse.json(
      { error: "Preview failed. Please try again in a moment." },
      { status: 502 },
    );
  }
}
