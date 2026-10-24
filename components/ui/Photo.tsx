"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { useState } from "react";
import { queueRefresh } from "@/lib/gsap";
import { useVersionedSrc } from "./ImageVersion";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  /** classes on the outer clipping box (set aspect ratio / size here) */
  className?: string;
  /** classes on the inner moving layer, e.g. "-inset-y-[12%]" for parallax headroom */
  innerClassName?: string;
  imgClassName?: string;
  priority?: boolean;
  /** natural intrinsic mode instead of fill (for transparent cutouts) */
  intrinsic?: { width: number; height: number };
};

/** next/image with a same-ratio gradient fallback when the file is missing; serves the v2 (branded) file on /v2 when it exists. */
export function Photo({ src: baseSrc, alt, sizes, className = "", innerClassName = "inset-0", imgClassName = "object-cover", priority, intrinsic }: Props) {
  const versioned = useVersionedSrc(baseSrc);
  // a v2 file that fails falls back to the v1 image before giving up to the gradient
  const [stage, setStage] = useState<"versioned" | "base" | "failed">("versioned");
  const src = stage === "versioned" ? versioned : baseSrc;
  const failed = stage === "failed";
  const onError = () => setStage(stage === "versioned" && versioned !== baseSrc ? "base" : "failed");

  if (intrinsic) {
    return failed ? (
      <div className={`photo-fallback rounded-[20px] ${className}`} style={{ aspectRatio: `${intrinsic.width}/${intrinsic.height}` }} role="img" aria-label={alt || undefined} />
    ) : (
      <Image
        src={asset(src)}
        alt={alt}
        width={intrinsic.width}
        height={intrinsic.height}
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        className={`${className} ${imgClassName}`}
        onLoad={queueRefresh}
        onError={onError}
        draggable={false}
      />
    );
  }

  return (
    <div className={`${/\babsolute\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`}>
      <div data-photo-inner className={`absolute ${innerClassName}`}>
        {failed ? (
          <div className="photo-fallback absolute inset-0" role="img" aria-label={alt || undefined} />
        ) : (
          <Image
            src={asset(src)}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            className={imgClassName}
            onLoad={queueRefresh}
            onError={onError}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}
