"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Facebook,
  Link2,
  Linkedin,
  MessageCircle,
  Send,
  Share2,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogLang } from "@/lib/blog-highlights";
import { cn } from "@/lib/utils";

type ShareLink = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
};

function buildShareLinks(title: string, url: string): ShareLink[] {
  const text = encodeURIComponent(`${title}\n${url}`);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${text}`,
      icon: MessageCircle,
      className: "hover:bg-green-600/20 hover:border-green-500/40 hover:text-green-400",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      className: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400",
    },
    {
      id: "twitter",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
      className: "hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-300",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
      className: "hover:bg-blue-700/20 hover:border-blue-600/40 hover:text-blue-300",
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
      className: "hover:bg-cyan-500/20 hover:border-cyan-400/40 hover:text-cyan-300",
    },
  ];
}

export function BlogLanguageToggle({
  lang,
  onChange,
}: {
  lang: BlogLang;
  onChange: (lang: BlogLang) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-white/20 overflow-hidden glass-card">
      <button
        type="button"
        onClick={() => onChange("te")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors",
          lang === "te" ? "bg-brand-red text-white" : "text-white/70 hover:text-white hover:bg-white/5"
        )}
      >
        తెలుగు
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors border-l border-white/20",
          lang === "en" ? "bg-brand-red text-white" : "text-white/70 hover:text-white hover:bg-white/5"
        )}
      >
        English
      </button>
    </div>
  );
}

export function BlogShareBar({
  title,
  slug,
  lang,
  compact = false,
}: {
  title: string;
  slug: string;
  lang: BlogLang;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blogs/${slug}`
      : `https://pawankalyanfan.com/blogs/${slug}`;

  const links = buildShareLinks(title, url);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${title}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {
        /* user cancelled */
      }
    }
  }

  return (
    <div className={compact ? "" : "w-full"}>
      {!compact && (
        <p className="text-sm text-muted-foreground mb-3">
          {lang === "te" ? "ఈ బ్లాగ్‌ను షేర్ చేయండి" : "Share this blog"}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {canNativeShare && (
          <Button variant="outline" size="sm" className="glass border-white/20" onClick={nativeShare}>
            <Share2 className="mr-2 h-4 w-4" />
            {lang === "te" ? "షేర్" : "Share"}
          </Button>
        )}
        {links.map(({ id, label, href, icon: Icon, className }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm transition-colors glass-card",
              className
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          title={lang === "te" ? "లింక్ కాపీ" : "Copy link"}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm transition-colors glass-card hover:bg-white/10"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Link2 className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {copied ? (lang === "te" ? "కాపీ!" : "Copied!") : lang === "te" ? "లింక్" : "Copy"}
          </span>
        </button>
      </div>
    </div>
  );
}
