"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

type AdBlockProps = {
  slot: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal";
};

export function AdBlock({ slot, className = "" }: AdBlockProps) {
  const [adCode, setAdCode] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    api.getAdSlot(slot).then((data) => {
      setEnabled(data.enabled);
      setAdCode(data.adCode);
    }).catch(() => setEnabled(false));
  }, [slot]);

  if (!enabled || !clientId) return null;

  if (adCode) {
    return <div className={`ad-block ad-${slot} ${className}`} dangerouslySetInnerHTML={{ __html: adCode }} />;
  }

  return (
    <div className={`ad-block ad-${slot} ${className}`}>
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={clientId} data-ad-slot={slot} data-full-width-responsive="true" />
    </div>
  );
}

export function HeaderAd() {
  return <AdBlock slot="header" className="w-full max-h-[90px] overflow-hidden my-2" />;
}

export function SidebarAd() {
  return <AdBlock slot="sidebar" className="sticky top-20 w-full min-h-[250px]" />;
}

export function InContentAd() {
  return <AdBlock slot="in-content" className="my-8 w-full min-h-[90px]" />;
}

export function MobileStickyAd() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
      <AdBlock slot="mobile-sticky" className="w-full min-h-[50px]" />
    </div>
  );
}
