"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Upload, Loader2, X, Sparkles, RefreshCw } from "lucide-react";
import Art from "@/components/site/Art";

async function compress(file: File): Promise<Blob> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = dataUrl;
  });
  const MAX = 1200;
  let { width, height } = img;
  if (width > MAX || height > MAX) {
    const s = Math.min(MAX / width, MAX / height);
    width = Math.round(width * s);
    height = Math.round(height * s);
  }
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  c.getContext("2d")?.drawImage(img, 0, 0, width, height);
  return new Promise<Blob>((res) =>
    c.toBlob((b) => res(b ?? file), "image/jpeg", 0.85),
  );
}

export default function PhotoPreview() {
  const [srcPreview, setSrcPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback(async (f?: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    setError("");
    setResultUrl(null);
    setStatus("idle");
    setSrcPreview(URL.createObjectURL(f));
    setBlob(await compress(f));
  }, []);

  const run = async () => {
    if (!blob) return;
    setStatus("loading");
    setError("");
    try {
      const fd = new FormData();
      fd.append("photo", blob, "photo.jpg");
      const res = await fetch("/api/preview", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Preview failed.");
      setResultUrl(j.url);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preview failed.");
      setStatus("error");
    }
  };

  const reset = () => {
    setSrcPreview(null);
    setBlob(null);
    setResultUrl(null);
    setStatus("idle");
    setError("");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid items-center gap-8 md:grid-cols-2">
        {/* controls */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />

          {!srcPreview ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                onFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                drag ? "border-neon-cyan bg-neon-cyan/5" : "border-white/20 hover:border-white/40"
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#050309] bg-gradient-to-br from-neon-cyan to-vice-purple text-[#0a0510]">
                <Upload size={24} />
              </span>
              <span className="font-display text-lg uppercase text-bone">Drop a clear selfie</span>
              <span className="text-sm text-ash">or click to browse · a well-lit face works best</span>
            </button>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-noir-800/60 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcPreview} alt="Your photo" className="h-20 w-20 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-bone">Photo ready</p>
                <button onClick={() => fileRef.current?.click()} className="text-sm text-neon-cyan hover:underline">
                  Change photo
                </button>
              </div>
              <button onClick={reset} aria-label="Remove" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-ash hover:border-neon-hot hover:text-neon-hot">
                <X size={18} />
              </button>
            </div>
          )}

          <button
            onClick={run}
            disabled={!blob || status === "loading"}
            className="btn btn-primary mt-4 w-full disabled:opacity-40"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Rendering… up to a minute
              </>
            ) : (
              <>
                <Sparkles size={18} /> Generate my preview
              </>
            )}
          </button>

          {status === "error" && (
            <div className="mt-3 rounded-xl border border-neon-hot/40 bg-neon-hot/10 p-3 text-sm">
              <p className="text-bone">{error}</p>
              <Link href="/order" className="mt-1 inline-block text-neon-cyan hover:underline">
                Order the full version instead →
              </Link>
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-ash">
            This is an instant AI preview. Your real order is refined by hand for the
            best likeness and delivered in high resolution.
          </p>
        </div>

        {/* result */}
        <div>
          {resultUrl ? (
            <div>
              <Art src={resultUrl} alt="Your GTA V style preview" className="aspect-[4/5] w-full" />
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/order?tshirt=0" className="btn btn-primary flex-1">
                  Order this for real
                </Link>
                <button onClick={reset} className="btn btn-ghost">
                  <RefreshCw size={16} /> New photo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 p-8 text-center">
              {status === "loading" ? (
                <>
                  <Loader2 size={34} className="animate-spin text-neon-pink" />
                  <p className="mt-4 font-display text-lg uppercase text-bone">Dropping you into the game…</p>
                  <p className="mt-1 text-sm text-ash">Rendering your character, hang tight.</p>
                </>
              ) : (
                <>
                  <span className="font-display text-2xl uppercase text-bone/60">Your preview</span>
                  <p className="mt-1 text-sm text-ash">appears here in GTA V style</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
