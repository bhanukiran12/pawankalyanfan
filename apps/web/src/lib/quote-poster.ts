import { SITE } from "./constants";

export type QuotePosterInput = {
  text: string;
  source?: string | null;
  category?: string;
  slug?: string;
};

export type PosterFormat = "status" | "square";

const FORMATS: Record<PosterFormat, { width: number; height: number }> = {
  status: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawPoster(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  quote: QuotePosterInput
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0a0a0a");
  gradient.addColorStop(0.45, "#1a0505");
  gradient.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(220, 38, 38, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  const accentY = height * 0.12;
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(width / 2 - 60, accentY, 120, 4);

  ctx.font = "700 120px Georgia, serif";
  ctx.fillStyle = "rgba(220, 38, 38, 0.25)";
  ctx.fillText("\u201C", 80, height * 0.28);

  const padding = 120;
  const maxWidth = width - padding * 2;
  const fontSize = quote.text.length > 120 ? 44 : quote.text.length > 80 ? 52 : 60;
  ctx.font = `600 ${fontSize}px Georgia, "Times New Roman", serif`;
  ctx.fillStyle = "#f5f5f5";
  ctx.textAlign = "center";

  const lines = wrapText(ctx, quote.text, maxWidth);
  const lineHeight = fontSize * 1.45;
  const blockHeight = lines.length * lineHeight;
  let y = height / 2 - blockHeight / 2 + fontSize;

  for (const line of lines) {
    ctx.fillText(line, width / 2, y);
    y += lineHeight;
  }

  const attribution = quote.source || "Pawan Kalyan";
  ctx.font = "500 36px system-ui, sans-serif";
  ctx.fillStyle = "#dc2626";
  ctx.fillText(`— ${attribution}`, width / 2, y + 48);

  if (quote.category) {
    ctx.font = "600 24px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillText(quote.category.replace(/_/g, " "), width / 2, y + 100);
  }

  ctx.font = "700 28px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText("PawanKalyanFan.com", width / 2, height - 80);
}

export async function generateQuotePoster(
  quote: QuotePosterInput,
  format: PosterFormat = "status"
): Promise<Blob> {
  const { width, height } = FORMATS[format];
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  drawPoster(ctx, width, height, quote);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create image"))),
      "image/png",
      1
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function getQuoteShareUrl(): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : SITE.url.replace(/\/$/, "");
  return `${base}/quotes`;
}

export function formatQuoteShareText(quote: QuotePosterInput): string {
  const attribution = quote.source || "Pawan Kalyan";
  const siteLink = getQuoteShareUrl();
  return `"${quote.text}"\n\n— ${attribution}\n\n${siteLink}`;
}

export async function shareWhatsApp(quote: QuotePosterInput): Promise<"shared" | "fallback"> {
  const blob = await generateQuotePoster(quote, "square");
  const filename = `pk-quote-${quote.slug || "quote"}.png`;
  const file = new File([blob], filename, { type: "image/png" });
  const text = formatQuoteShareText(quote);

  if (typeof navigator !== "undefined" && navigator.share) {
    const shareData: ShareData = {
      title: "Pawan Kalyan Quote",
      text,
      files: [file],
    };
    if (navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return "shared";
      } catch (err) {
        if ((err as Error).name === "AbortError") return "shared";
      }
    }
  }

  downloadBlob(blob, filename);
  window.open(
    `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer"
  );
  return "fallback";
}

export async function copyQuoteText(quote: QuotePosterInput): Promise<void> {
  await navigator.clipboard.writeText(formatQuoteShareText(quote));
}

export function categoryLabel(category: string): string {
  return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
