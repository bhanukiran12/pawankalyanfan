const JANASENA_API = "https://janasenanewportal.azurewebsites.net/content";
const JANASENA_SOURCE = "https://janasenanewsletter.com";

export type JanasenaRawItem = {
  ContentId: string;
  PublishDate?: string;
  ContentTitle: string;
  ContentText?: string;
  VideoURL?: string | null;
  ImageURL1?: string | null;
  ImageURL2?: string | null;
  isBreakingNews?: boolean;
  IsActive?: boolean;
};

export type JanasenaArticle = {
  id: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  imageUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
  breaking: boolean;
  sourceUrl: string;
  siteUrl: string;
};

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseJanasenaDate(raw?: string): string {
  if (!raw) return new Date().toISOString();
  const parsed = Date.parse(raw.replace(/(\d{1,2}):(\d{2})(AM|PM)/i, " $1:$2 $3"));
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
}

export function normalizeJanasenaItem(item: JanasenaRawItem): JanasenaArticle {
  const contentHtml = item.ContentText || "";
  const excerpt = stripHtml(contentHtml).slice(0, 280);
  return {
    id: item.ContentId,
    title: item.ContentTitle,
    excerpt: excerpt || item.ContentTitle,
    contentHtml,
    imageUrl: item.ImageURL1 || item.ImageURL2 || null,
    videoUrl: item.VideoURL || null,
    publishedAt: parseJanasenaDate(item.PublishDate),
    breaking: Boolean(item.isBreakingNews),
    sourceUrl: `${JANASENA_SOURCE}/#/contentdetail/${item.ContentId}`,
    siteUrl: `/janasena-news/${item.ContentId}`,
  };
}

async function postJson<T>(path: string, body: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${JANASENA_API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Jana Sena API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchJanasenaFeed(): Promise<JanasenaArticle[]> {
  const data = await postJson<{ AllContents?: JanasenaRawItem[] }>("GetMainContents", {});
  const items = data.AllContents ?? [];
  return items
    .filter((item) => item.IsActive !== false && item.ContentTitle)
    .map(normalizeJanasenaItem)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function fetchJanasenaArticle(id: string): Promise<JanasenaArticle | null> {
  const res = await fetch(`${JANASENA_API}/GetContent?contentID=${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const item = (await res.json()) as JanasenaRawItem;
  if (!item?.ContentId) return null;
  return normalizeJanasenaItem(item);
}
