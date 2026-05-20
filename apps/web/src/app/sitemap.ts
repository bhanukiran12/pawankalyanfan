import { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "", "/movies", "/quotes", "/wallpapers",
    "/blogs", "/events", "/contact", "/privacy", "/terms", "/ai",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return staticPages;
}
