"use client";

import { useState } from "react";
import { Copy, Download, MessageCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUOTE_CATEGORIES } from "@/lib/constants";
import type { Quote } from "@/lib/api-client";
import {
  categoryLabel,
  copyQuoteText,
  downloadBlob,
  generateQuotePoster,
  shareWhatsApp,
  type PosterFormat,
} from "@/lib/quote-poster";

export function QuoteCard({ quote }: { quote: Quote }) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState<PosterFormat | null>(null);
  const [previewFormat, setPreviewFormat] = useState<PosterFormat | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleCopy() {
    await copyQuoteText(quote);
    setCopied(true);
    toast.success("Quote copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload(format: PosterFormat) {
    setDownloading(format);
    try {
      const blob = await generateQuotePoster(quote, format);
      downloadBlob(blob, `pk-quote-${quote.slug}-${format}.png`);
      toast.success(format === "status" ? "Status image saved!" : "Poster downloaded!");
    } catch {
      toast.error("Could not generate image. Try again.");
    } finally {
      setDownloading(null);
    }
  }

  async function handlePreview(format: PosterFormat) {
    if (previewFormat === format && previewUrl) {
      setPreviewFormat(null);
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    try {
      const blob = await generateQuotePoster(quote, format);
      setPreviewUrl(URL.createObjectURL(blob));
      setPreviewFormat(format);
    } catch {
      toast.error("Preview failed");
    }
  }

  async function handleWhatsAppShare() {
    setSharing(true);
    try {
      const result = await shareWhatsApp(quote);
      if (result === "shared") {
        toast.success("Quote card shared!");
      } else {
        toast.success("Quote card saved — attach it in WhatsApp", {
          description: "Caption with site link is ready to paste.",
        });
      }
    } catch {
      toast.error("Could not share quote. Try Download instead.");
    } finally {
      setSharing(false);
    }
  }

  return (
    <Card className="h-full hover:border-brand-red/40 transition-all group overflow-hidden">
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative p-6 pb-4 flex-1 bg-gradient-to-br from-brand-black via-zinc-950 to-brand-black">
          <div className="absolute top-3 right-4 text-5xl text-brand-red/15 font-serif leading-none select-none">&ldquo;</div>
          <p className="relative text-lg md:text-xl italic leading-relaxed text-zinc-100">&ldquo;{quote.text}&rdquo;</p>
          {quote.source && (
            <p className="relative mt-4 text-sm font-medium text-brand-red">— {quote.source}</p>
          )}
        </div>

        {previewUrl && previewFormat && (
          <div className="hidden sm:block px-4 pb-2">
            <div
              className={`mx-auto overflow-hidden rounded-lg border border-brand-red/20 bg-black ${
                previewFormat === "status" ? "max-w-[140px]" : "max-w-[180px]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Quote preview"
                className="w-full h-auto"
              />
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-1">
              {previewFormat === "status" ? "WhatsApp Status (9:16)" : "Download (1:1)"}
            </p>
          </div>
        )}

        <div className="p-4 pt-3 border-t border-border/50 bg-card">
          <Badge variant="outline" className="mb-3 text-[10px]">
            {categoryLabel(quote.category)}
          </Badge>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-[#25D366] hover:bg-[#20bd5a] text-white col-span-1 sm:col-span-2 min-h-[44px]"
              disabled={sharing}
              onClick={handleWhatsAppShare}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              {sharing ? "Preparing…" : "Share on WhatsApp"}
            </Button>
            <Button
              size="sm"
              variant="default"
              className="hidden sm:inline-flex min-h-[44px]"
              disabled={downloading === "status"}
              onClick={() => handleDownload("status")}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              {downloading === "status" ? "Saving…" : "Status"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="hidden sm:inline-flex"
              disabled={downloading === "square"}
              onClick={() => handleDownload("square")}
            >
              <Download className="h-4 w-4 mr-1" />
              {downloading === "square" ? "Saving…" : "Download"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={() => handlePreview("status")}
            >
              Preview
            </Button>
            <Button size="sm" variant="ghost" className="min-h-[44px] w-full sm:w-auto" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuoteFilters({ active, onChange }: { active: string; onChange: (cat: string) => void }) {
  return (
    <div className="flex flex-nowrap gap-2 min-w-min pb-1">
      <Button variant={active === "" ? "default" : "outline"} size="sm" className="shrink-0 min-h-[40px]" onClick={() => onChange("")}>
        All
      </Button>
      {QUOTE_CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          variant={active === cat.value ? "default" : "outline"}
          size="sm"
          className="shrink-0 min-h-[40px] whitespace-nowrap"
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
