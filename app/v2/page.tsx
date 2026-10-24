import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Site } from "@/components/Site";
import { ImageVersionProvider } from "@/components/ui/ImageVersion";
import { V2_FILES, toV2 } from "@/lib/v2";

const hasV2 = (src: string) => existsSync(path.join(process.cwd(), "public", toV2(src)));
const og = existsSync(path.join(process.cwd(), "public/images-v2/brand/og-image.jpg")) ? "/images-v2/brand/og-image.jpg" : "/brand/og-image.jpg";

export const metadata: Metadata = {
  title: "OSMAYA — Liquid Dusk Eau de Parfum",
  openGraph: { images: [{ url: og }] },
  twitter: { images: [og] },
  alternates: { canonical: "/" },
};

/** Version 2: identical to the homepage, but bottle shots come from public/images-v2 wherever a file has been added. */
export default function PageV2() {
  return (
    <ImageVersionProvider available={V2_FILES.filter(hasV2)}>
      <Site />
    </ImageVersionProvider>
  );
}
