"use client";

import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { SocialShareLinks } from "@/lib/api-client";

type Props = {
  share: SocialShareLinks;
  size?: "sm" | "default";
  className?: string;
};

export function JanaSevaSocialShare({ share, size = "default", className = "" }: Props) {
  async function copyShare() {
    try {
      await navigator.clipboard.writeText(share.copyText);
      toast.success("Copied — paste on Instagram, Facebook, WhatsApp, or anywhere!");
    } catch {
      toast.error("Could not copy");
    }
  }

  const btnClass = size === "sm" ? "glass border-white/20" : "glass border-white/20 min-h-[48px]";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={share.whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button size={size} variant="outline" className={btnClass}>
          <Share2 className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </a>
      <a href={share.twitterUrl} target="_blank" rel="noopener noreferrer">
        <Button size={size} variant="outline" className={btnClass}>
          Share on X
        </Button>
      </a>
      <a href={share.facebookUrl} target="_blank" rel="noopener noreferrer">
        <Button size={size} variant="outline" className={btnClass}>
          Facebook
        </Button>
      </a>
      <Button size={size} variant="outline" className={btnClass} onClick={copyShare}>
        <Copy className="h-4 w-4 mr-2" />
        Copy caption
      </Button>
    </div>
  );
}
