/**
 * Build wallpapers.ts from public/wallpapers/* and import manifest.
 * Run: node scripts/generate-wallpapers-seed.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicWallpapers = path.join(root, "apps/web/public/wallpapers");
const manifestPath = path.join(root, "scripts/wallpaper-import-manifest.json");
const out = path.join(root, "packages/database/prisma/data/wallpapers.ts");

const SEO_KEYWORDS = [
  "pawan kalyan",
  "power star",
  "pspk",
  "telugu cinema",
  "janasena",
  "janasena party",
  "pawan kalyan politics",
  "pawan kalyan speeches",
  "pawan kalyan movies",
  "bheemla nayak",
  "vakeel saab",
  "gabbar singh",
  "attarintiki daredi",
  "hd wallpaper",
  "uhd wallpaper",
  "4k wallpaper",
  "telugu hero",
  "andhra pradesh",
  "fan wallpaper download",
];

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : [];
const manifestBySlug = Object.fromEntries(manifest.map((m) => [m.slug, m]));

function scanDir(subdir) {
  const dir = path.join(publicWallpapers, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
    .map((f) => ({
      subdir,
      file: f,
      slug: f.replace(/\.[^.]+$/, ""),
      url: `/wallpapers/${subdir}/${f}`,
    }));
}

function titleFromSlug(slug, subdir) {
  const m = manifestBySlug[slug];
  if (m?.source === "political") {
    return `Pawan Kalyan Jana Sena Political Wallpaper UHD #${m.index}`;
  }
  if (m?.source === "movie" && m.movieName) {
    return `${m.movieName} — Pawan Kalyan 4K Movie Wallpaper #${m.index}`;
  }

  const map = {
    "bheemlanayak-desktop-wallpaper-edit-by-g-1": "Bheemla Nayak Desktop Wallpaper UHD",
    "do-your-work-disappear-desktop-wallpaper-2": "Do Your Work & Disappear — Pawan Kalyan Desktop",
    "do-your-work-disappear-desktop-wallpaper-3": "Do Your Work & Disappear — Power Star Desktop",
    "just-do-don-t-talk-desktop-wallpaper-4": "Just Do Don't Talk — Pawan Kalyan Speech Wallpaper",
    "senani-desktop-wallpaper-edit-by-charane-5": "Janasenani Pawan Kalyan Desktop Wallpaper",
    "bheemla-altposter-wm-11": "Bheemla Nayak Alt Poster — Pawan Kalyan Wallpaper",
    "digital-paint-12": "Pawan Kalyan Digital Art UHD Wallpaper",
    "pawan-kalyan-19": "Power Star Pawan Kalyan UHD Portrait",
    "pk-neonart-f-23": "PK Neon Art — Pawan Kalyan Wallpaper",
    "pk-25": "Power Star PSPK Wallpaper UHD",
    "vakeel-saab-walking-wallpaper-edit-by-ga-32": "Vakeel Saab Walking — Pawan Kalyan Wallpaper",
    "vak-31": "Vakeel Saab Pawan Kalyan 4K Wallpaper",
    "jalssa-2-wm-15": "Jana Sena Pawan Kalyan Rally Wallpaper",
    "panjasswallpaperwwm-18": "Jana Sena Party Rally Wallpaper UHD",
  };
  if (map[slug]) return map[slug];

  if (subdir === "pk-political") {
    return `Pawan Kalyan Jana Sena Politics Wallpaper — ${slug.replace(/janasena-political-/, "").replace(/-\d+$/, "")}`;
  }
  if (subdir === "pk-movie") {
    const movie = slug.includes("bheemla") ? "Bheemla Nayak" : slug.includes("vakeel") ? "Vakeel Saab" : "Pawan Kalyan Movie";
    return `${movie} — Power Star 4K Cinema Wallpaper`;
  }

  return (
    slug
      .replace(/-\d+$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") + " — Pawan Kalyan UHD"
  );
}

function categoryFor(entry) {
  const { slug, subdir } = entry;
  const m = manifestBySlug[slug];
  if (m?.source === "political" || subdir === "pk-political") return "Political";
  if (m?.source === "movie" || subdir === "pk-movie") return "Cinema";
  if (/mobile|naxalite/.test(slug)) return "Mobile";
  if (/desktop|walking|senani/.test(slug)) return "Desktop";
  if (/bheemla|vakeel|vak|senani|jalssa|panja/.test(slug)) return "Cinema";
  if (/vector|neon|digital|paint/.test(slug)) return "Art";
  if (/janasena|political|rally|senani/.test(slug)) return "Political";
  return "Portrait";
}

function tagsFor(item) {
  const base = [
    item.category.toLowerCase(),
    "pawan kalyan",
    "power star",
    "pspk",
    "hd wallpaper",
    "uhd",
    "4k wallpaper",
    "telugu",
    "telugu cinema",
    "pawan kalyan fan",
  ];

  if (item.category === "Political") {
    base.push(
      "janasena",
      "janasena party",
      "pawan kalyan politics",
      "pawan kalyan speeches",
      "janasenani",
      "political rally",
      "andhra pradesh politics",
    );
  }
  if (item.category === "Cinema") {
    base.push(
      "pawan kalyan movies",
      "telugu movies",
      "power star movies",
      "cinema stills",
      "movie wallpaper",
    );
    if (/bheemla/i.test(item.slug)) base.push("bheemla nayak", "bheemla nayak wallpaper");
    if (/vakeel/i.test(item.slug)) base.push("vakeel saab", "vakeel saab wallpaper");
    if (/gabbar|gabber/.test(item.slug)) base.push("gabbar singh");
    if (/jalsa|jalssa/.test(item.slug)) base.push("jalsa", "pawan kalyan jalsa");
  }
  if (item.category === "Art") base.push("pawan kalyan art", "fan art", "vector wallpaper");
  if (item.category === "Desktop") base.push("desktop wallpaper", "pc wallpaper");
  if (item.category === "Mobile") base.push("mobile wallpaper", "phone wallpaper");
  if (item.featured) base.push("featured");

  return [...new Set(base)];
}

const allFiles = [
  ...scanDir("pk-uhd"),
  ...scanDir("pk-political"),
  ...scanDir("pk-movie"),
];

const items = allFiles.map((entry, i) => {
  const category = categoryFor(entry);
  const title = titleFromSlug(entry.slug, entry.subdir);
  const item = {
    title,
    slug: entry.slug,
    imageUrl: entry.url,
    thumbnailUrl: entry.url,
    premium: false,
    category,
    downloads: 1200 + i * 37,
    featured: i < 12 || category === "Political" || category === "Cinema",
  };
  return { ...item, seoTags: tagsFor(item) };
});

const ts = `export type WallpaperSeed = {
  title: string;
  slug: string;
  imageUrl: string;
  thumbnailUrl: string;
  premium: boolean;
  category: string;
  downloads: number;
  featured: boolean;
  seoTags?: string[];
};

/** PK UHD + political + cinema wallpapers — served from /public/wallpapers */
export const wallpapers: WallpaperSeed[] = ${JSON.stringify(
  items.map(({ seoTags, ...rest }) => rest),
  null,
  2,
)};

/** Rich SEO tag sets per wallpaper (stored in DB tags column). */
export const wallpaperSeoTagMap: Record<string, string[]> = ${JSON.stringify(
  Object.fromEntries(items.map((it) => [it.slug, it.seoTags])),
  null,
  2,
)};

export const WALLPAPER_SEO_KEYWORDS: string[] = ${JSON.stringify(SEO_KEYWORDS, null, 2)};

export function wallpaperTags(item: WallpaperSeed): string[] {
  if (wallpaperSeoTagMap[item.slug]?.length) return wallpaperSeoTagMap[item.slug];
  const tags = [
    item.category.toLowerCase(),
    "pawan kalyan",
    "power star",
    "janasena",
    "pawan kalyan movies",
    "pawan kalyan politics",
    "hd wallpaper",
    "uhd",
    "telugu",
  ];
  if (item.featured) tags.push("featured");
  return tags;
}

export function wallpaperSeoAlt(item: WallpaperSeed): string {
  return \`\${item.title} | Pawan Kalyan Jana Sena Power Star HD wallpaper download — PawanKalyanFan\`;
}

export function wallpaperSeoDescription(item: WallpaperSeed): string {
  const kw = item.category === "Political"
    ? "Jana Sena party, Pawan Kalyan politics & speeches"
    : item.category === "Cinema"
      ? "Pawan Kalyan movies — Power Star Telugu cinema"
      : "Power Star Pawan Kalyan fan collection";
  return \`Download \${item.title} — free \${item.category.toLowerCase()} UHD wallpaper. \${kw}. HD 4K mobile & desktop wallpapers at PawanKalyanFan.\`;
}
`;

fs.writeFileSync(out, ts);
console.log(`Wrote ${items.length} wallpapers (${scanDir("pk-uhd").length} uhd + ${scanDir("pk-political").length} political + ${scanDir("pk-movie").length} cinema) → ${out}`);
