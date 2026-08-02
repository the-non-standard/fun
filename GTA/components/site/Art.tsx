"use client";

import { useState } from "react";

type ArtProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** shown centered if the image fails to load */
  label?: string;
  eager?: boolean;
};

/**
 * Image wrapped in a GTA poster frame with a neon fallback.
 * If the remote art URL fails, the frame still reads as an intentional
 * neon panel instead of a broken image box.
 */
export default function Art({
  src,
  alt,
  className = "",
  imgClassName = "",
  label,
  eager = false,
}: ArtProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`poster-frame art-fallback ${className}`}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="font-display text-2xl uppercase tracking-wide text-bone/90">
            {label ?? "WANTED LEVEL"}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-bone/50">
            character art
          </span>
        </div>
      )}
    </div>
  );
}
