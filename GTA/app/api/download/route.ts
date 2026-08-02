import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Streams a generated image back with an attachment header so a browser saves
 * it directly (cross-origin `download` attributes are otherwise ignored).
 * Only fal.media URLs are allowed, to avoid being an open proxy.
 */
export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("url");
  if (!src) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return NextResponse.json({ error: "Bad url." }, { status: 400 });
  }
  const okHost =
    target.protocol === "https:" &&
    (target.hostname === "fal.media" || target.hostname.endsWith(".fal.media"));
  if (!okHost) {
    return NextResponse.json({ error: "Host not allowed." }, { status: 400 });
  }

  try {
    const res = await fetch(target.toString());
    if (!res.ok || !res.body) {
      return NextResponse.json({ error: "Could not fetch image." }, { status: 502 });
    }
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : "jpg";
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="wanted-level.${ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Download failed." }, { status: 502 });
  }
}
