"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Upload,
  X,
  Check,
  Minus,
  Plus,
  Loader2,
  ImageIcon,
  Download,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { STYLES, ADDONS, MAX_PEOPLE } from "@/lib/pricing";
import { ART } from "@/lib/art";
import Icon from "@/components/site/Icon";
import Art from "@/components/site/Art";
import WantedStars from "@/components/site/WantedStars";

type Props = {
  initialPeople?: number;
};

/** Downscale + compress an image so uploads stay small and fast. */
async function compressImage(
  file: File,
): Promise<{ blob: Blob; dataUrl: string; name: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
  const MAX = 1600;
  let { width, height } = img;
  if (width > MAX || height > MAX) {
    const scale = Math.min(MAX / width, MAX / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: file, dataUrl, name: file.name };
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  const outUrl = canvas.toDataURL("image/jpeg", 0.85);
  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return { blob: blob ?? file, dataUrl: outUrl, name };
}

/**
 * Draws the generated art onto a canvas and burns the name on, GTA style.
 * The image is loaded same-origin (via /api/download?inline) so the canvas
 * can be exported without tainting. Returns an object URL.
 */
async function burnName(proxiedUrl: string, name: string): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = proxiedUrl;
  });
  const W = Math.min(img.naturalWidth || 1200, 1400);
  const scale = W / (img.naturalWidth || W);
  const H = Math.round((img.naturalHeight || W) * scale);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no ctx");
  ctx.drawImage(img, 0, 0, W, H);

  const label = (name || "").trim().toUpperCase();
  if (label) {
    const size = Math.round(W / 11);
    ctx.font = `700 ${size}px Impact, "Arial Black", sans-serif`;
    ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round";
    const x = Math.round(W * 0.05);
    const y = Math.round(H - H * 0.055);
    ctx.strokeStyle = "#050309";
    ctx.lineWidth = Math.max(4, size / 7);
    ctx.strokeText(label, x, y);
    ctx.fillStyle = "#f4f1ea";
    ctx.fillText(label, x, y);
  }
  const out = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, "image/jpeg", 0.92),
  );
  if (!out) throw new Error("compose failed");
  return URL.createObjectURL(out);
}

export default function OrderBuilder({ initialPeople = 1 }: Props) {
  const [styleId, setStyleId] = useState(STYLES[0].id);
  const [people, setPeople] = useState(
    Math.min(Math.max(initialPeople, 1), MAX_PEOPLE),
  );
  const [artName, setArtName] = useState("");
  const [addons, setAddons] = useState<Set<string>>(new Set());

  const [photo, setPhoto] = useState<{
    blob: Blob;
    dataUrl: string;
    name: string;
  } | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">(
    "idle",
  );
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const style = STYLES.find((s) => s.id === styleId)!;
  const selectedAddons = useMemo(
    () => ADDONS.filter((a) => addons.has(a.id)),
    [addons],
  );

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleFile = useCallback(async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (JPG or PNG).");
      return;
    }
    setErrorMsg("");
    setPhotoBusy(true);
    try {
      setPhoto(await compressImage(file));
    } catch {
      setErrorMsg("Couldn't read that image. Try another one.");
    } finally {
      setPhotoBusy(false);
    }
  }, []);

  const valid = !!photo;

  const generate = async () => {
    if (!photo) return;
    setStatus("generating");
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("photo", photo.blob, photo.name);
      fd.append("style", styleId);
      fd.append("addons", JSON.stringify([...addons]));
      const res = await fetch("/api/generate", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Generation failed.");
      const falUrl: string = j.url;

      // Burn the name on via a same-origin proxy; fall back to the raw art.
      let display = falUrl;
      let download = `/api/download?url=${encodeURIComponent(falUrl)}`;
      try {
        const composed = await burnName(
          `/api/download?url=${encodeURIComponent(falUrl)}&inline=1`,
          artName,
        );
        display = composed;
        download = composed;
      } catch {
        /* keep raw art fallback */
      }
      setResultUrl(display);
      setDownloadUrl(download);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const reset = () => {
    setStatus("idle");
    setResultUrl(null);
    setDownloadUrl("");
    setErrorMsg("");
  };

  /* ---------------- result screen ---------------- */
  if (status === "done" && resultUrl) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#050309] bg-gradient-to-br from-money to-neon-cyan text-[#06120b]">
          <Sparkles size={30} />
        </div>
        <h1 className="title-gta mt-6 text-4xl sm:text-5xl">You&rsquo;re in the game</h1>
        <p className="mx-auto mt-3 max-w-md text-ash">
          Here&rsquo;s your GTA-style character. Download it, or generate another.
        </p>

        <div className="mx-auto mt-8 max-w-md">
          <Art
            src={resultUrl}
            alt={`${artName || "Your"} GTA V character`}
            className="aspect-[4/5] w-full"
          />
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={downloadUrl} download="wanted-level.jpg" className="btn btn-primary">
            <Download size={18} /> Download
          </a>
          <button onClick={reset} className="btn btn-ghost">
            <RefreshCw size={16} /> Generate another
          </button>
        </div>
        <Link
          href="/#gallery"
          className="mt-6 inline-block text-sm text-neon-cyan underline-offset-4 hover:underline"
        >
          See more characters in the gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      <div className="max-w-2xl">
        <Link href="/" className="text-sm text-ash transition-colors hover:text-bone">
          ← Back to home
        </Link>
        <h1 className="title-gta mt-4 text-4xl sm:text-5xl lg:text-6xl">
          Build your character
        </h1>
        <p className="mt-3 text-lg text-ash">
          Set your scene, drop a photo and generate your GTA V character. Free to
          download.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* ---------------- builder ---------------- */}
        <div className="flex flex-col gap-12">
          {/* Step 1: style */}
          <Step n={1} title="Choose your style">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STYLES.map((s) => {
                const active = s.id === styleId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyleId(s.id)}
                    className={`group overflow-hidden rounded-2xl border-2 text-left transition-all ${
                      active
                        ? "border-neon-pink shadow-[0_18px_40px_-20px_rgba(255,45,149,0.7)]"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="art-fallback relative aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ART[s.art as keyof typeof ART]}
                        alt={s.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="h-full w-full object-cover"
                      />
                      {active && (
                        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neon-pink text-white">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="font-display text-lg uppercase text-bone">
                        {s.name}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-ash">{s.blurb}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Step 2: people */}
          <Step n={2} title="How many people?">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-noir-800/60 p-5">
              <div>
                <p className="font-display text-lg uppercase text-bone">
                  {people} {people === 1 ? "character" : "characters"}
                </p>
                <p className="text-sm text-ash">
                  We use whoever is in your photo
                  {people === MAX_PEOPLE && " · a whole crew? drop a group shot"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StepperBtn
                  onClick={() => setPeople((p) => Math.max(1, p - 1))}
                  disabled={people <= 1}
                  label="Fewer people"
                >
                  <Minus size={18} />
                </StepperBtn>
                <span className="w-8 text-center font-display text-2xl text-bone">
                  {people}
                </span>
                <StepperBtn
                  onClick={() => setPeople((p) => Math.min(MAX_PEOPLE, p + 1))}
                  disabled={people >= MAX_PEOPLE}
                  label="More people"
                >
                  <Plus size={18} />
                </StepperBtn>
              </div>
            </div>
          </Step>

          {/* Step 3: photo */}
          <Step n={3} title="Upload your photo">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {!photo ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                  dragOver
                    ? "border-neon-cyan bg-neon-cyan/5"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                {photoBusy ? (
                  <Loader2 size={28} className="animate-spin text-neon-cyan" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#050309] bg-gradient-to-br from-neon-cyan to-vice-purple text-[#0a0510]">
                    <Upload size={24} />
                  </span>
                )}
                <span className="font-display text-lg uppercase text-bone">
                  Drop your photo here
                </span>
                <span className="text-sm text-ash">
                  or click to browse · JPG or PNG · one clear shot works best
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-noir-800/60 p-4">
                <div className="poster-frame h-24 w-24 flex-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.dataUrl}
                    alt="Your uploaded photo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-semibold text-bone">
                    <ImageIcon size={16} className="text-neon-cyan" /> Photo ready
                  </p>
                  <p className="truncate text-sm text-ash">{photo.name}</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-1 text-sm text-neon-cyan underline-offset-4 hover:underline"
                  >
                    Change photo
                  </button>
                </div>
                <button
                  onClick={() => setPhoto(null)}
                  aria-label="Remove photo"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-white/15 text-ash hover:border-neon-hot hover:text-neon-hot"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </Step>

          {/* Step 4: name */}
          <Step n={4} title="The name on your art" optional>
            <input
              value={artName}
              onChange={(e) => setArtName(e.target.value)}
              maxLength={22}
              placeholder="e.g. BIG MIKE, THE TWINS, 305 CREW…"
              className="w-full rounded-xl border border-white/15 bg-noir-800/60 px-4 py-3.5 text-bone placeholder:text-ash/60 focus:border-neon-pink focus:outline-none"
            />
            <div className="mt-4 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-noir-700 to-noir-800 p-6">
              <span className="title-gta text-center text-3xl sm:text-4xl">
                {artName.trim() || "YOUR NAME"}
              </span>
            </div>
          </Step>

          {/* Step 5: add-ons */}
          <Step n={5} title="Stack your add-ons" optional>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ADDONS.map((a) => {
                const on = addons.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAddon(a.id)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                      on
                        ? "border-neon-pink bg-neon-pink/10"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg border-2 border-[#050309] ${
                        on ? "bg-neon-pink text-white" : "bg-noir-700 text-neon-cyan"
                      }`}
                    >
                      <Icon name={a.icon} size={18} />
                    </span>
                    <span className="text-sm font-semibold text-bone">{a.name}</span>
                  </button>
                );
              })}
            </div>
          </Step>
        </div>

        {/* ---------------- sticky generate panel ---------------- */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-white/10 bg-noir-800/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl uppercase text-bone">Your setup</h2>
              <WantedStars level={5} size={15} />
            </div>

            <dl className="mt-5 flex flex-col gap-2.5 text-sm">
              <Line label="Style" value={style.name} />
              <Line label="People" value={String(people)} />
              <Line
                label="Add-ons"
                value={
                  selectedAddons.length
                    ? selectedAddons.map((a) => a.name).join(", ")
                    : "None"
                }
              />
            </dl>

            <button
              onClick={generate}
              disabled={!valid || status === "generating"}
              className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "generating" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Wand2 size={18} /> Generate my character
                </>
              )}
            </button>

            {!valid && (
              <p className="mt-3 text-center text-xs text-ash">
                Add a photo to generate.
              </p>
            )}
            {status === "generating" && (
              <p className="mt-3 text-center text-xs text-ash">
                This takes up to a minute. Hang tight.
              </p>
            )}
            {status === "error" && (
              <p className="mt-3 rounded-xl border border-neon-hot/40 bg-neon-hot/10 p-3 text-sm text-bone">
                {errorMsg}
              </p>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ash">
              <Sparkles size={14} className="text-money" />
              Free to generate and download.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- small building blocks ---------------- */

function Step({
  n,
  title,
  optional,
  children,
}: {
  n: number;
  title: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border-2 border-[#050309] bg-gradient-to-br from-neon-pink to-vice-purple font-display text-sm text-bone">
          {n}
        </span>
        <h2 className="font-display text-xl uppercase tracking-wide text-bone sm:text-2xl">
          {title}
        </h2>
        {optional && (
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-ash">
            optional
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function StepperBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white/15 text-bone transition-colors hover:border-neon-pink disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-ash">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-bone">{value}</dd>
    </div>
  );
}
