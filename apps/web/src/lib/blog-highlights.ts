export type BlogHighlightType = "trivia" | "quote" | "speech" | "dialogue";

export type BlogHighlight = {
  type: BlogHighlightType;
  label?: string;
  text: string;
  source?: string;
};

export type BlogLocaleContent = {
  title: string;
  excerpt: string;
  highlights: BlogHighlight[];
  body: string;
};

export type BlogLang = "te" | "en";

export type ParsedBlogContent = {
  highlights: BlogHighlight[];
  body: string;
  te?: BlogLocaleContent;
};

const HIGHLIGHTS_MARKER = "---BLOG-HIGHLIGHTS---";
const LOCALE_TE_MARKER = "---BLOG-LOCALE-TE---";

const DEFAULT_LABELS: Record<BlogLang, Record<BlogHighlightType, string>> = {
  en: {
    trivia: "Did you know?",
    quote: "Famous Quote",
    speech: "Speech Excerpt",
    dialogue: "Movie Dialogue",
  },
  te: {
    trivia: "మీకు తెలుసా?",
    quote: "ప్రసిద్ధ మాట",
    speech: "ప్రసంగ విశేషం",
    dialogue: "సినిమా Dialogue",
  },
};

export function highlightLabel(block: BlogHighlight, lang: BlogLang = "te"): string {
  return block.label ?? DEFAULT_LABELS[lang][block.type];
}

export function parseBlogContent(content: string): ParsedBlogContent {
  if (!content.startsWith(HIGHLIGHTS_MARKER)) {
    return { highlights: [], body: content };
  }

  const afterFirst = content.slice(HIGHLIGHTS_MARKER.length + 1);
  const secondHl = afterFirst.indexOf(`\n${HIGHLIGHTS_MARKER}`);
  if (secondHl === -1) {
    return { highlights: [], body: content };
  }

  let highlights: BlogHighlight[] = [];
  try {
    highlights = JSON.parse(afterFirst.slice(0, secondHl)) as BlogHighlight[];
  } catch {
    return { highlights: [], body: content };
  }

  let rest = afterFirst.slice(secondHl + HIGHLIGHTS_MARKER.length + 1);
  if (rest.startsWith("\n\n")) rest = rest.slice(2);
  else if (rest.startsWith("\n")) rest = rest.slice(1);

  let te: BlogLocaleContent | undefined;
  if (rest.startsWith(LOCALE_TE_MARKER)) {
    const afterLocale = rest.slice(LOCALE_TE_MARKER.length + 1);
    const endLocale = afterLocale.indexOf(`\n${LOCALE_TE_MARKER}`);
    if (endLocale !== -1) {
      try {
        te = JSON.parse(afterLocale.slice(0, endLocale)) as BlogLocaleContent;
      } catch {
        te = undefined;
      }
      rest = afterLocale.slice(endLocale + LOCALE_TE_MARKER.length + 1);
      if (rest.startsWith("\n\n")) rest = rest.slice(2);
      else if (rest.startsWith("\n")) rest = rest.slice(1);
    }
  }

  return { highlights, body: rest, te };
}

export function resolveBlogDisplay(
  parsed: ParsedBlogContent,
  en: { title: string; excerpt: string },
  lang: BlogLang
) {
  if (lang === "te" && parsed.te) {
    return {
      title: parsed.te.title,
      excerpt: parsed.te.excerpt,
      highlights: parsed.te.highlights,
      body: parsed.te.body,
    };
  }
  return {
    title: en.title,
    excerpt: en.excerpt,
    highlights: parsed.highlights,
    body: parsed.body,
  };
}
