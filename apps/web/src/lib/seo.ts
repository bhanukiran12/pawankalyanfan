import { Metadata } from "next";
import { SITE } from "./constants";

type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
};

export function generateSEO({
  title,
  description = SITE.seoDescription,
  path = "",
  image,
  type = "website",
  publishedTime,
  keywords = [],
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — Pawan Kalyan Fan`;
  const url = `${SITE.url}${path}`;
  const ogImage = image || SITE.logo;

  return {
    title: fullTitle,
    description,
    keywords: [
      "Pawan Kalyan",
      "Pawan Kalyan fan",
      "PK fan",
      "Power Star",
      "PSPK",
      "Telugu cinema",
      "Jana Sena",
      "Jana Sena party",
      "Janasenani",
      "Pawan Kalyan politics",
      "Pawan Kalyan speeches",
      "Pawan Kalyan movies",
      "Pawan Kalyan quotes",
      "Pawan Kalyan wallpapers",
      "Pawan Kalyan blogs",
      "Pawan Kalyan events",
      "Gabbar Singh",
      "Bheemla Nayak",
      "Vakeel Saab",
      "Attarintiki Daredi",
      "iconic dialogues",
      "HD wallpapers",
      "UHD 4K wallpapers",
      "Telugu movies",
      "fan website",
      ...keywords,
    ],
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    icons: {
      icon: SITE.logo,
      apple: SITE.logo,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: ogImage, width: 512, height: 512, alt: "Pawan Kalyan Fan" }],
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function generateJsonLd(type: string, data: Record<string, unknown>) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };
}
