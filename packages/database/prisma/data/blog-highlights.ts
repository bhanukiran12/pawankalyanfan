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

export type ParsedBlogContent = {
  highlights: BlogHighlight[];
  body: string;
  te?: BlogLocaleContent;
};

const HIGHLIGHTS_MARKER = "---BLOG-HIGHLIGHTS---";
const LOCALE_TE_MARKER = "---BLOG-LOCALE-TE---";

export function encodeBlogContent(
  highlights: BlogHighlight[],
  body: string,
  te?: BlogLocaleContent
): string {
  let result = `${HIGHLIGHTS_MARKER}\n${JSON.stringify(highlights)}\n${HIGHLIGHTS_MARKER}`;
  if (te) {
    result += `\n\n${LOCALE_TE_MARKER}\n${JSON.stringify(te)}\n${LOCALE_TE_MARKER}`;
  }
  result += `\n\n${body}`;
  return result;
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
