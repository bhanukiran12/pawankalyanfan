import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Pawan Kalyan Wallpapers — Power Star HD UHD 4K Download",
  description:
    "Free Pawan Kalyan UHD HD 4K wallpapers — Power Star portraits, Jana Sena party politics & speeches, Bheemla Nayak, Vakeel Saab, Gabbar Singh, Telugu cinema movie stills, mobile & desktop fan wallpapers download.",
  path: "/wallpapers",
  keywords: [
    "Pawan Kalyan wallpaper",
    "Power Star HD wallpaper",
    "Pawan Kalyan UHD",
    "Pawan Kalyan 4K wallpaper",
    "PSPK wallpaper download",
    "Jana Sena wallpaper",
    "Jana Sena party",
    "Pawan Kalyan politics",
    "Pawan Kalyan speeches",
    "Janasenani wallpaper",
    "Bheemla Nayak wallpaper",
    "Vakeel Saab wallpaper",
    "Gabbar Singh wallpaper",
    "Attarintiki Daredi wallpaper",
    "Pawan Kalyan movies wallpaper",
    "Telugu cinema wallpaper",
    "Telugu hero wallpaper",
    "Power Star fan wallpaper",
    "Pawan Kalyan mobile wallpaper",
    "Pawan Kalyan desktop wallpaper",
    "Andhra Pradesh politics wallpaper",
  ],
});

export default function WallpapersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
