import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppProviders } from "@/components/app-providers";
import { MobileStickyAd } from "@/components/ads/ad-block";
import { generateSEO } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });

export const metadata: Metadata = generateSEO({});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${bebas.variable} font-sans min-h-screen overflow-x-hidden pb-[env(safe-area-inset-bottom)]`}
      >
        <AppProviders>
          <SiteHeader />
          <main className="min-h-[calc(100dvh-4rem)] pt-16 pb-20 md:pb-8 bg-transparent">
            {children}
          </main>
          <SiteFooter />
          <MobileStickyAd />
        </AppProviders>
      </body>
    </html>
  );
}
