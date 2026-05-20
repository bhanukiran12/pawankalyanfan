import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { SECTION_BACKGROUNDS, type SectionBackgroundKey } from "@/lib/constants";

export type OverlayVariant = "hero" | "gradient" | "dark" | "darker" | "red-tint" | "events";

const OVERLAY_LAYERS: Record<OverlayVariant, string[]> = {
  hero: [
    "overlay-radial-vignette",
    "overlay-hero-linear",
    "overlay-top-scrim",
  ],
  gradient: [
    "overlay-radial-soft",
    "overlay-content-linear",
    "overlay-edge-fade",
  ],
  dark: [
    "overlay-radial-center",
    "overlay-form-linear",
    "overlay-top-scrim",
  ],
  darker: [
    "overlay-radial-heavy",
    "overlay-detail-linear",
    "overlay-edge-fade",
  ],
  "red-tint": [
    "overlay-radial-red-glow",
    "overlay-radial-vignette",
    "overlay-premium-linear",
  ],
  events: [
    "overlay-events-radial",
    "overlay-events-linear",
    "overlay-top-scrim",
  ],
};

const BG_POSITION: Partial<Record<SectionBackgroundKey, string>> = {
  events: "center top",
};

export function sectionBgUrl(url: string, width = 1400): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

function OverlayStack({ variant }: { variant: OverlayVariant }) {
  return (
    <>
      {OVERLAY_LAYERS[variant].map((layer) => (
        <div key={layer} className={cn("absolute inset-0 -z-10 pointer-events-none", layer)} aria-hidden />
      ))}
    </>
  );
}

type SectionBackgroundProps = {
  image: string;
  overlay?: OverlayVariant;
  backgroundPosition?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  fixed?: boolean;
};

export function SectionBackground({
  image,
  overlay = "gradient",
  backgroundPosition = "center",
  children,
  className,
  contentClassName,
  fixed = false,
}: SectionBackgroundProps) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 -z-20 bg-cover bg-no-repeat scale-[1.02]",
          fixed && "bg-scroll md:bg-fixed",
        )}
        style={{
          backgroundImage: `url(${sectionBgUrl(image)})`,
          backgroundPosition,
        }}
        aria-hidden
      />
      <OverlayStack variant={overlay} />
      <div className={cn("relative z-0", contentClassName)}>{children}</div>
    </section>
  );
}

type PageShellProps = {
  background?: SectionBackgroundKey;
  overlay?: OverlayVariant;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function PageShell({
  background = "home",
  overlay,
  children,
  className,
  contentClassName,
}: PageShellProps) {
  const resolvedOverlay = overlay ?? (background === "events" ? "events" : "gradient");

  return (
    <SectionBackground
      image={SECTION_BACKGROUNDS[background]}
      overlay={resolvedOverlay}
      backgroundPosition={BG_POSITION[background] ?? "center"}
      className={cn("min-h-[calc(100dvh-4rem)]", className)}
      contentClassName={contentClassName}
    >
      {children}
    </SectionBackground>
  );
}
