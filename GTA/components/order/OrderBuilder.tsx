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
  Mail,
  PartyPopper,
  ShieldCheck,
} from "lucide-react";
import {
  STYLES,
  ADDONS,
  PREMIUM,
  PERSON_PRICE,
  MAX_PEOPLE,
} from "@/lib/pricing";
import { ART } from "@/lib/art";
import { price, SITE } from "@/lib/config";
import Icon from "@/components/site/Icon";
import WantedStars from "@/components/site/WantedStars";

const TSHIRT_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

type Props = {
  initialPeople?: number;
  initialTshirt?: boolean;
};

/** Downscale + compress an image so submissions stay small and fast. */
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

export default function OrderBuilder({
  initialPeople = 1,
  initialTshirt = false,
}: Props) {
  const [styleId, setStyleId] = useState(STYLES[0].id);
  const [people, setPeople] = useState(
    Math.min(Math.max(initialPeople, 1), MAX_PEOPLE),
  );
  const [artName, setArtName] = useState("");
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [tshirt, setTshirt] = useState(initialTshirt);
  const [tshirtSize, setTshirtSize] = useState("L");
  const [hires, setHires] = useState(false);
  const [rush, setRush] = useState(false);

  const [photo, setPhoto] = useState<{
    blob: Blob;
    dataUrl: string;
    name: string;
  } | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [custName, setCustName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const style = STYLES.find((s) => s.id === styleId)!;
  const basePrice = PERSON_PRICE[people] ?? PERSON_PRICE[MAX_PEOPLE];

  const selectedAddons = useMemo(
    () => ADDONS.filter((a) => addons.has(a.id)),
    [addons],
  );

  const total = useMemo(() => {
    let t = basePrice;
    selectedAddons.forEach((a) => (t += a.price));
    if (tshirt) t += PREMIUM.tshirt.price;
    if (hires) t += PREMIUM.hires.price;
    if (rush) t += PREMIUM.rush.price;
    return t;
  }, [basePrice, selectedAddons, tshirt, hires, rush]);

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
      const out = await compressImage(file);
      setPhoto(out);
    } catch {
      setErrorMsg("Couldn't read that image. Try another one.");
    } finally {
      setPhotoBusy(false);
    }
  }, []);

  const valid =
    !!photo && artName.trim().length > 0 && /\S+@\S+\.\S+/.test(email);

  const buildMailto = () => {
    const lines = [
      `New WANTED LEVEL order`,
      ``,
      `Style: ${style.name}`,
      `People: ${people}`,
      `Name on art: ${artName}`,
      `Add-ons: ${selectedAddons.map((a) => a.name).join(", ") || "none"}`,
      `Premium: ${[
        tshirt ? `T-shirt (${tshirtSize})` : null,
        hires ? "Hi-res file" : null,
        rush ? "24h rush" : null,
      ]
        .filter(Boolean)
        .join(", ") || "none"}`,
      `Total: ${price(total)}`,
      ``,
      `From: ${custName || "(name)"} <${email || "(email)"}>`,
      `Notes: ${notes || "-"}`,
      ``,
      `(Attach your photo to this email.)`,
    ];
    return `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Order: ${artName || "GTA art"} — ${style.name}`,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const submit = async () => {
    if (!valid || !photo) return;
    setStatus("sending");
    setErrorMsg("");
    const payload = {
      style: style.id,
      styleName: style.name,
      people,
      artName: artName.trim(),
      addons: selectedAddons.map((a) => ({ name: a.name, price: a.price })),
      premium: {
        tshirt,
        tshirtSize: tshirt ? tshirtSize : null,
        hires,
        rush,
      },
      customer: { name: custName.trim(), email: email.trim(), notes: notes.trim() },
      total,
    };
    try {
      const fd = new FormData();
      fd.append("order", JSON.stringify(payload));
      fd.append("photo", photo.blob, photo.name);
      const res = await fetch("/api/order", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Submission failed");
      }
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setStatus("error");
      setErrorMsg(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
    }
  };

  /* ---------- success screen ---------- */
  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#050309] bg-gradient-to-br from-money to-neon-cyan text-[#06120b]">
          <PartyPopper size={38} />
        </div>
        <h1 className="title-gta mt-6 text-4xl sm:text-5xl">You&rsquo;re in the game</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ash">
          Your order for <span className="text-bone">{artName}</span> is in. We&rsquo;ll
          email <span className="text-bone">{email}</span> within a few hours to
          confirm the details and arrange payment. No charge yet.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary">
            Message us on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      {/* header */}
      <div className="max-w-2xl">
        <Link href="/" className="text-sm text-ash transition-colors hover:text-bone">
          ← Back to home
        </Link>
        <h1 className="title-gta mt-4 text-4xl sm:text-5xl lg:text-6xl">
          Build your character
        </h1>
        <p className="mt-3 text-lg text-ash">
          Set your scene, drop a photo and we&rsquo;ll draw you into the game. Delivered
          in {SITE.turnaround}.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* ---------------- builder ---------------- */}
        <div className="flex flex-col gap-12">
          {/* Step 1 — style */}
          <Step n={1} title="Choose your style">
            <div className="grid gap-4 sm:grid-cols-3">
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
                    <div className="relative aspect-[4/3] art-fallback overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ART[s.art as keyof typeof ART]}
                        alt={s.name}
                        loading="lazy"
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

          {/* Step 2 — people */}
          <Step n={2} title="How many people?">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-noir-800/60 p-5">
              <div>
                <p className="font-display text-lg uppercase text-bone">
                  {people} {people === 1 ? "character" : "characters"}
                </p>
                <p className="text-sm text-ash">
                  Base price {price(basePrice)}
                  {people === MAX_PEOPLE && " · 6+? message us for a quote"}
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

          {/* Step 3 — photo */}
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

          {/* Step 4 — name */}
          <Step n={4} title="The name on your art">
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

          {/* Step 5 — add-ons */}
          <Step n={5} title="Stack your add-ons" optional>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ADDONS.map((a) => {
                const on = addons.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAddon(a.id)}
                    className={`flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
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
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-bone">
                        {a.name}
                      </span>
                      <span className="block text-xs text-money">
                        +{price(a.price)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Step 6 — premium */}
          <Step n={6} title="Premium add-ons" optional>
            <div className="flex flex-col gap-3">
              <PremiumRow
                active={tshirt}
                onToggle={() => setTshirt((v) => !v)}
                name={PREMIUM.tshirt.name}
                blurb={PREMIUM.tshirt.blurb}
                priceLabel={`+${price(PREMIUM.tshirt.price)}`}
              >
                {tshirt && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-ash">Size:</span>
                    {TSHIRT_SIZES.map((sz) => (
                      <button
                        key={sz}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTshirtSize(sz);
                        }}
                        className={`h-9 w-11 rounded-lg border-2 text-sm font-semibold transition-colors ${
                          tshirtSize === sz
                            ? "border-neon-pink bg-neon-pink/15 text-bone"
                            : "border-white/15 text-ash hover:border-white/30"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </PremiumRow>
              <PremiumRow
                active={hires}
                onToggle={() => setHires((v) => !v)}
                name={PREMIUM.hires.name}
                blurb={PREMIUM.hires.blurb}
                priceLabel={`+${price(PREMIUM.hires.price)}`}
              />
              <PremiumRow
                active={rush}
                onToggle={() => setRush((v) => !v)}
                name={PREMIUM.rush.name}
                blurb={PREMIUM.rush.blurb}
                priceLabel={`+${price(PREMIUM.rush.price)}`}
              />
            </div>
          </Step>

          {/* Step 7 — details */}
          <Step n={7} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Jane Doe"
                  className="input"
                />
              </Field>
              <Field label="Email *">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="input"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Anything else? (optional)">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Who's who in the photo, outfit ideas, the city you want in the background…"
                    className="input resize-none"
                  />
                </Field>
              </div>
            </div>
          </Step>
        </div>

        {/* ---------------- sticky summary ---------------- */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-white/10 bg-noir-800/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl uppercase text-bone">
                Your order
              </h2>
              <WantedStars level={5} size={15} />
            </div>

            <dl className="mt-5 flex flex-col gap-2.5 text-sm">
              <Line label={`${style.name} · ${people} ${people === 1 ? "person" : "people"}`} value={price(basePrice)} />
              {selectedAddons.map((a) => (
                <Line key={a.name} label={a.name} value={`+${price(a.price)}`} muted />
              ))}
              {tshirt && (
                <Line label={`T-shirt (${tshirtSize})`} value={`+${price(PREMIUM.tshirt.price)}`} muted />
              )}
              {hires && <Line label="Hi-res file" value={`+${price(PREMIUM.hires.price)}`} muted />}
              {rush && <Line label="24h rush" value={`+${price(PREMIUM.rush.price)}`} muted />}
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-5">
              <span className="text-sm uppercase tracking-wider text-ash">Total</span>
              <span className="font-display text-4xl text-bone">{price(total)}</span>
            </div>

            <button
              onClick={submit}
              disabled={!valid || status === "sending"}
              className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending…
                </>
              ) : (
                "Place my order"
              )}
            </button>

            {!valid && (
              <p className="mt-3 text-center text-xs text-ash">
                Add a photo, a name and your email to continue.
              </p>
            )}

            {status === "error" && (
              <div className="mt-4 rounded-xl border border-neon-hot/40 bg-neon-hot/10 p-3 text-sm text-bone">
                <p className="font-semibold">Couldn&rsquo;t submit automatically.</p>
                <p className="mt-1 text-ash">{errorMsg}</p>
                <a href={buildMailto()} className="mt-2 inline-flex items-center gap-1.5 text-neon-cyan underline-offset-4 hover:underline">
                  <Mail size={14} /> Email your order instead
                </a>
              </div>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ash">
              <ShieldCheck size={14} className="text-money" />
              No payment now — we confirm first.
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

function PremiumRow({
  active,
  onToggle,
  name,
  blurb,
  priceLabel,
  children,
}: {
  active: boolean;
  onToggle: () => void;
  name: string;
  blurb: string;
  priceLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
        active ? "border-sun bg-sun/5" : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg uppercase text-bone">{name}</p>
          <p className="mt-0.5 text-sm text-ash">{blurb}</p>
        </div>
        <div className="flex flex-none items-center gap-3">
          <span className="font-display text-money">{priceLabel}</span>
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md border-2 border-[#050309] ${
              active ? "bg-sun text-[#0a0510]" : "bg-noir-700 text-transparent"
            }`}
          >
            <Check size={14} strokeWidth={3} />
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ash">{label}</span>
      {children}
    </label>
  );
}

function Line({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={muted ? "text-ash" : "text-bone"}>{label}</dt>
      <dd className={muted ? "text-ash" : "font-semibold text-bone"}>{value}</dd>
    </div>
  );
}
