/**
 * Extract 24 curated wallpapers (12 political + 12 cinema) from PK zip collections.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "apps/web/public/wallpapers");

const POLITICAL_ZIP = path.join(
  process.env.USERPROFILE || "",
  "Documents",
  "PK Political Pics UHD (@PawanKalyanHD)-20260520T133031Z-3-001.zip",
);
const MOVIE_ZIP = path.join(
  process.env.USERPROFILE || "",
  "Documents",
  "PK Movie Pics UHD (@PawanKalyanHD)-20260520T133257Z-3-003.zip",
);

function listZipImages(zipPath) {
  const raw = execSync(`tar -tf "${zipPath}"`, {
    encoding: "utf8",
    maxBuffer: 80 * 1024 * 1024,
  });
  return raw
    .split(/\r?\n/)
    .filter((line) => /\.(jpg|jpeg|png|webp)$/i.test(line) && !line.endsWith("/"));
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extractPolitical(zipPath, entry, destFile) {
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  const tmp = path.join(root, "_tmp-wallpaper-extract");
  fs.mkdirSync(tmp, { recursive: true });
  execSync(`tar -xf "${zipPath}" -C "${tmp}" "${entry.replace(/"/g, '\\"')}"`, {
    stdio: "pipe",
    maxBuffer: 50 * 1024 * 1024,
  });
  const extracted = path.join(tmp, entry.split("/").join(path.sep));
  if (!fs.existsSync(extracted)) throw new Error(`Extract failed: ${entry}`);
  fs.copyFileSync(extracted, destFile);
  fs.rmSync(tmp, { recursive: true, force: true });
}

function extractMovie(entry, destFile) {
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  const buf = execSync(`tar -xOf "${MOVIE_ZIP}" "${entry.replace(/"/g, '\\"')}"`, {
    maxBuffer: 250 * 1024 * 1024,
  });
  fs.writeFileSync(destFile, buf);
}

function pickN(items, n) {
  if (items.length <= n) return items;
  const step = items.length / n;
  const picked = [];
  for (let i = 0; i < n; i++) picked.push(items[Math.floor(i * step)]);
  return picked;
}

function movieNameFromEntry(entry) {
  const m = entry.match(/\/([^/]+) UHD/i);
  return m ? m[1] : "Pawan Kalyan";
}

const politicalAll = listZipImages(POLITICAL_ZIP).sort();
const movieAll = listZipImages(MOVIE_ZIP).sort();

const politicalPicks = pickN(politicalAll, 12);
const bheemla = movieAll.filter((e) => /bheemla/i.test(e) && /\.jpe?g$/i.test(e));
const vakeel = movieAll.filter((e) => /vakeel/i.test(e) && /\.png$/i.test(e));
const moviePicks = [...bheemla.slice(0, 6), ...pickN(vakeel, Math.max(12 - bheemla.length, 6))].slice(0, 12);

const politicalDir = path.join(publicRoot, "pk-political");
const movieDir = path.join(publicRoot, "pk-movie");

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      fs.unlinkSync(path.join(dir, f));
    }
  }
  fs.mkdirSync(dir, { recursive: true });
}

cleanDir(politicalDir);
cleanDir(movieDir);

const manifest = [];

for (let i = 0; i < politicalPicks.length; i++) {
  const entry = politicalPicks[i];
  const base = path.basename(entry);
  const slug = `janasena-political-${slugify(base)}-${i + 1}`;
  const ext = path.extname(base).toLowerCase();
  const dest = path.join(politicalDir, `${slug}${ext}`);
  console.log(`Political ${i + 1}/12: ${base}`);
  extractPolitical(POLITICAL_ZIP, entry, dest);
  manifest.push({ source: "political", slug, file: `/wallpapers/pk-political/${slug}${ext}`, original: base, index: i + 1 });
}

for (let i = 0; i < moviePicks.length; i++) {
  const entry = moviePicks[i];
  const base = path.basename(entry);
  const movieName = movieNameFromEntry(entry);
  const slug = `pk-movie-${slugify(movieName)}-${slugify(base)}-${i + 1}`;
  const ext = path.extname(base).toLowerCase();
  const dest = path.join(movieDir, `${slug}${ext}`);
  console.log(`Movie ${i + 1}/12: ${movieName} — ${base}`);
  try {
    extractMovie(entry, dest);
    manifest.push({
      source: "movie",
      slug,
      file: `/wallpapers/pk-movie/${slug}${ext}`,
      original: base,
      movieName,
      index: i + 1,
    });
  } catch (err) {
    console.warn(`  Skip: ${err.message?.slice(0, 120)}`);
  }
}

const manifestPath = path.join(root, "scripts/wallpaper-import-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nImported ${manifest.length} wallpapers → ${manifestPath}`);
