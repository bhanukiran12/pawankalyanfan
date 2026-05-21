import { fetchJanasenaFeed } from "./janasena-news";
import { notifyNewJanasenaArticles } from "./push";

let cachedFeed: Awaited<ReturnType<typeof fetchJanasenaFeed>> | null = null;
let cachedAt = 0;
let syncInFlight: Promise<void> | null = null;

const CACHE_MS = 5 * 60 * 1000;
const POLL_MS = 10 * 60 * 1000;

export async function getJanasenaFeed(force = false) {
  const stale = Date.now() - cachedAt > CACHE_MS;
  if (!force && cachedFeed && !stale) return cachedFeed;

  const feed = await fetchJanasenaFeed();
  cachedFeed = feed;
  cachedAt = Date.now();
  return feed;
}

export function scheduleJanasenaPolling(): void {
  const tick = () => {
    syncInFlight = syncJanasenaNews().finally(() => {
      syncInFlight = null;
    });
  };
  tick();
  setInterval(tick, POLL_MS);
}

export async function syncJanasenaNews(): Promise<void> {
  if (syncInFlight) return syncInFlight;
  const run = async () => {
    const feed = await fetchJanasenaFeed();
    cachedFeed = feed;
    cachedAt = Date.now();
    await notifyNewJanasenaArticles(feed);
  };
  syncInFlight = run();
  return syncInFlight;
}
