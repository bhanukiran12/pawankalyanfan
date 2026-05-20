import type { EventType } from "@prisma/client";

export type TimelineEventSeed = {
  title: string;
  slug: string;
  eventDate: string;
  category: "Personal" | "Cinema" | "Politics";
  description: string;
  featured: boolean;
  movieSlug?: string;
  imageUrl?: string;
};

export const eventsTimeline: TimelineEventSeed[] = [
  {
    title: "Deputy Chief Minister — Oath as Andhra Pradesh DCM",
    slug: "deputy-cm-oath-2024",
    eventDate: "2024-06-12",
    category: "Politics",
    description: "Pawan Kalyan sworn in as Deputy Chief Minister of Andhra Pradesh.",
    featured: true,
  },
  {
    title: "OG Production Era",
    slug: "og-era",
    eventDate: "2025-12-01",
    category: "Cinema",
    description: "Anticipation around They Call Him OG.",
    featured: true,
    movieSlug: "they-call-him-og",
  },
  {
    title: "Bheemla Nayak",
    slug: "bheemla-nayak",
    eventDate: "2022-02-25",
    category: "Cinema",
    description: "High-energy action drama release.",
    featured: true,
    movieSlug: "bheemla-nayak",
  },
  {
    title: "Vakeel Saab Return",
    slug: "vakeel-saab-return",
    eventDate: "2021-04-09",
    category: "Cinema",
    description: "Return to cinema after political focus.",
    featured: true,
    movieSlug: "vakeel-saab",
  },
  {
    title: "Jana Sena Party Launch",
    slug: "jana-sena-launch",
    eventDate: "2014-03-14",
    category: "Politics",
    description: "Official political movement launch.",
    featured: true,
  },
  {
    title: "Gabbar Singh Comeback",
    slug: "gabbar-singh-comeback",
    eventDate: "2012-05-11",
    category: "Cinema",
    description: "Major mass blockbuster comeback.",
    featured: true,
    movieSlug: "gabbar-singh",
  },
  {
    title: "Jalsa Release",
    slug: "jalsa-release",
    eventDate: "2008-04-02",
    category: "Cinema",
    description: "Major action-comedy success.",
    featured: true,
    movieSlug: "jalsa",
  },
  {
    title: "Kushi Era",
    slug: "kushi-era",
    eventDate: "2001-04-26",
    category: "Cinema",
    description: "One of the defining youth blockbusters.",
    featured: true,
    movieSlug: "kushi",
  },
  {
    title: "Tholi Prema Success",
    slug: "tholi-prema-success",
    eventDate: "1998-07-24",
    category: "Cinema",
    description: "Breakthrough romantic blockbuster.",
    featured: true,
    movieSlug: "tholi-prema",
  },
  {
    title: "Film Debut",
    slug: "film-debut",
    eventDate: "1996-10-11",
    category: "Cinema",
    description: "Debut with Akkada Ammayi Ikkada Abbayi.",
    featured: true,
    movieSlug: "akkada-ammayi-ikkada-abbayi",
  },
  {
    title: "Birth",
    slug: "birth",
    eventDate: "1971-09-02",
    category: "Personal",
    description: "Born in Andhra Pradesh.",
    featured: true,
  },
];

export function mapEventType(category: TimelineEventSeed["category"]): EventType {
  switch (category) {
    case "Cinema":
      return "MOVIE_RELEASE";
    case "Politics":
      return "POLITICAL";
    default:
      return "OTHER";
  }
}
