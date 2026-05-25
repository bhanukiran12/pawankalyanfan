export type SuccessStoryShareInput = {
  slug: string;
  caption: string;
  helpedDisplay: string;
  volunteerName: string;
  sevaTypeLabel: string;
  hashtags: string[];
};

export function normalizeHashtags(raw: unknown): string[] {
  const list: string[] = [];
  if (Array.isArray(raw)) {
    for (const t of raw) list.push(String(t));
  } else if (typeof raw === "string") {
    list.push(
      ...raw
        .split(/[\s,#]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    );
  }
  const normalized = list.map((t) => (t.startsWith("#") ? t : `#${t.replace(/^#+/, "")}`));
  const defaults = ["#JanaSeva", "#PawanKalyanFan", "#PowerStar"];
  return [...new Set([...normalized, ...defaults])];
}

export function buildSuccessStoryShare(siteUrl: string, story: SuccessStoryShareInput) {
  const base = siteUrl.replace(/\/$/, "");
  const url = `${base}/jana-seva/stories/${story.slug}`;
  const tags = story.hashtags.join(" ");
  const text = [
    story.caption,
    "",
    `🙏 Helped: ${story.helpedDisplay}`,
    `✨ ${story.sevaTypeLabel} · by ${story.volunteerName}`,
    tags,
    url,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    shareText: text,
    storyUrl: url,
    twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    whatsappUrl: `https://wa.me/?text=${encodeURIComponent(text)}`,
    facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(story.caption.slice(0, 200))}`,
    copyText: text,
  };
}

export const SEVA_TYPE_LABELS: Record<string, string> = {
  BLOOD: "Blood donation",
  BLOOD_CAMP: "Blood camp",
  WORKSHOP: "Free workshop",
  SCHOLARSHIP: "Education / scholarship",
  EMERGENCY: "Emergency help",
  EDUCATION: "Education help",
  OTHER: "Jana Seva",
};
