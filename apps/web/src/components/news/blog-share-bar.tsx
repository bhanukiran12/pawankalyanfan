"use client";

import { useEffect, useState } from "react";
import { Check, Link2, MessageCircle, Send, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogLang } from "@/lib/blog-highlights";
import { cn } from "@/lib/utils";

type ShareIconProps = { className?: string };

function IconFacebook({ className }: ShareIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconX({ className }: ShareIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconLinkedIn({ className }: ShareIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

type ShareLink = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon | React.ComponentType<ShareIconProps>;
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
      icon: IconFacebook,
      className: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400",
    },
    {
      id: "twitter",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: IconX,
      className: "hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-300",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: IconLinkedIn,
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
