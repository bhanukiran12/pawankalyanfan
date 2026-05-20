"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 pt-[env(safe-area-inset-top)]",
        scrolled
          ? "glass shadow-lg border-b border-white/5"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent",
      )}
    >
      <div className="container-page flex h-14 sm:h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
        >
          <SiteLogo size={36} showText className="hidden sm:inline-flex" textClassName="text-base sm:text-lg truncate max-w-[140px] md:max-w-none" />
          <SiteLogo size={36} className="sm:hidden shrink-0" />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 lg:px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white hover:bg-white/5 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="touch-target md:hidden inline-flex items-center justify-center rounded-lg text-white hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-white/10 glass px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-1 max-h-[min(70dvh,400px)] overflow-y-auto scrollbar-vertical"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center rounded-md px-3 text-base text-muted-foreground hover:text-white hover:bg-white/5 active:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
