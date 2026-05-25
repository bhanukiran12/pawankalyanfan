import { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { blogSitemapEntries } from "@/lib/blog-sitemap-entries";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/movies",
    "/pk-birthday",
    "/quotes",
    "/wallpapers",
    "/janasena-news",
    "/janasena-students",
    "/blogs",
    "/events",
    "/contact",
    "/jana-seva",
    "/jana-seva/need-help",
    "/jana-seva/offer-help",
    "/jana-seva/blood",
    "/jana-seva/camps",
    "/jana-seva/workshops",
    "/jana-seva/scholarships",
    "/jana-seva/volunteers",
    "/jana-seva/volunteers/register",
    "/blood-donation/hyderabad",
    "/blood-donation/vijayawada",
    "/privacy",
    "/terms",
    "/ai",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : path === "/blogs" ? 0.9 : 0.8,
  }));

  const blogPages = blogSitemapEntries.map((b) => ({
    url: `${SITE.url}/blogs/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...blogPages];
}
