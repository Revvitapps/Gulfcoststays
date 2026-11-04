import Image from "next/image";
import { photos, type PhotoKey } from "@/lib/photos";

/**
 * A photo slot. Serves the real file through next/image when it exists;
 * otherwise a branded plate that names the shot, so the page reads as a
 * shot list for Matthew rather than a broken site.
 */
/** `quiet` draws the plate without the label (hero backgrounds, where copy sits on top). `plate` forces the shot-list plate even if an interim src is set. */
export function Photo({ slot, className = "", sizes = "100vw", priority, quiet, plate }: { slot: PhotoKey; className?: string; sizes?: string; priority?: boolean; quiet?: boolean; plate?: boolean }) {
  const p = photos[slot];
  if (p.src && !plate) {
    return (
      <div className={`photo ${className}`}>
        <Image src={p.src} alt={p.alt} fill sizes={sizes} priority={priority} quality={90} style={{ objectFit: "cover", objectPosition: p.position ?? "center" }} />
      </div>
    );
  }
  return (
    <div className={`photo ${className}`} role="img" aria-label={`Photo coming: ${p.label}`}>
      <div className="photo-plate">
        {quiet ? null : (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gcs-badge.webp" alt="" width={120} height={120} style={{ margin: "0 auto" }} />
          <span>Photo coming</span>
          <b>{p.label}</b>
        </div>
        )}
      </div>
    </div>
  );
}
