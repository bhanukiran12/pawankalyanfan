import type { QuoteCategory } from "@prisma/client";

export type QuoteSeed = {
  category: keyof typeof QUOTE_CATEGORY_MAP;
  text: string;
  source: string;
  attributedTo: string;
  featured?: boolean;
};

const QUOTE_CATEGORY_MAP = {
  Motivational: "MOTIVATIONAL",
  Political: "POLITICAL",
  Devotional: "DEVOTIONAL",
  Movie: "MOVIE_DIALOGUE",
  Leadership: "LEADERSHIP",
} as const satisfies Record<string, QuoteCategory>;

export function mapQuoteCategory(category: QuoteSeed["category"]): QuoteCategory {
  return QUOTE_CATEGORY_MAP[category];
}

export function makeQuoteSlug(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join("-");
  return `${base || "quote"}-${index}`;
}

export const quotes: QuoteSeed[] = [
  {
    category: "Motivational",
    text: "Nature, philosophy and social issues are the three things that always occupy my mind.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Motivational",
    text: "You do not have any power over others but can only change yourself.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Motivational",
    text: "Life is bigger than cinema. Cinema is just a part of life.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Motivational",
    text: "I never feel low about my failures.",
    source: "Public speech",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Motivational",
    text: "Failure is half-way to success.",
    source: "Public speech",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Motivational",
    text: "In trying to achieve something, if you fail, don't regret.",
    source: "Public speech",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Motivational",
    text: "It's a passing phase. Never ever lose the spirit.",
    source: "Public speech",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Motivational",
    text: "I always allowed myself to walk into the unknown.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Motivational",
    text: "Do your duty and disappear.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Motivational",
    text: "To live greatly, you have to risk greatly.",
    source: "Attributed quote",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Political",
    text: "Politics organizes our lives. We can't disregard it.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Political",
    text: "Societal good comes first for me.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Political",
    text: "I'm Indian. I care for our Motherland.",
    source: "Public quote",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Political",
    text: "If I do not respond to some situation, my conscience kills me.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Political",
    text: "Politics is for my country.",
    source: "Speech",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Political",
    text: "Public life demands responsibility.",
    source: "Speech",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Political",
    text: "Democracy needs courageous citizens.",
    source: "Speech paraphrase",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Political",
    text: "I was never apolitical.",
    source: "Harvard talk",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Political",
    text: "History and social sciences always interested me.",
    source: "Harvard talk",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Political",
    text: "Politics decides our day-to-day life.",
    source: "Harvard talk",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Devotional",
    text: "Right from childhood, I believed in a Supreme Power.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Devotional",
    text: "I don't own my success. Neither do I own my failure.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Devotional",
    text: "This understanding makes me scared even in success.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Devotional",
    text: "It's not my intelligence. It's not my abilities.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Movie",
    text: "I never wanted to become an actor.",
    source: "Harvard talk",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Movie",
    text: "I wanted to be a farmer.",
    source: "Harvard talk",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Movie",
    text: "I don't choose films. I want films to choose me.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Movie",
    text: "Cinema needs emotion, action, sentiment and humour.",
    source: "Interview",
    attributedTo: "Pawan Kalyan",
  },
  {
    category: "Leadership",
    text: "To succeed in life, I had a purpose, aim and justification.",
    source: "Speech",
    attributedTo: "Pawan Kalyan",
    featured: true,
  },
  {
    category: "Leadership",
    text: "I developed clear rules and principles for life.",
    source: "Speech",
    attributedTo: "Pawan Kalyan",
  },
];
