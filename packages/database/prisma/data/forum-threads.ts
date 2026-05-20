export type ForumReplySeed = {
  authorName: string;
  content: string;
};

export type ForumThreadSeed = {
  title: string;
  slug: string;
  category: string;
  authorName: string;
  content: string;
  likes: number;
  featured: boolean;
  replies: ForumReplySeed[];
};

export const forumThreads: ForumThreadSeed[] = [
  {
    title: "Which movie defines Pawan Kalyan's legacy?",
    slug: "which-movie-defines-legacy",
    category: "Movies",
    authorName: "PowerFan99",
    content: "For some it's Kushi. For others Gabbar Singh. What defines the true legacy?",
    likes: 154,
    featured: true,
    replies: [
      { authorName: "JalsaArmy", content: "Jalsa. Dialogue timing + charisma unmatched." },
      { authorName: "CinemaSoul", content: "Tholi Prema changed the game emotionally." },
    ],
  },
  {
    title: "Best political speech ever?",
    slug: "best-political-speech-ever",
    category: "Politics",
    authorName: "JanaVoice",
    content: "Which speech had the strongest emotional and ideological impact?",
    likes: 88,
    featured: true,
    replies: [
      { authorName: "CitizenAndhra", content: "Jana Sena formation speech without question." },
    ],
  },
  {
    title: "OG expectations thread",
    slug: "og-expectations-thread",
    category: "Movies",
    authorName: "OGWatcher",
    content: "What do you expect from OG? Mass? Stylish? Career-defining?",
    likes: 203,
    featured: true,
    replies: [
      { authorName: "DarkFrame", content: "Need a pure stylish gangster storm." },
      { authorName: "MassPulse", content: "Opening day will be absolute madness." },
    ],
  },
  {
    title: "Most underrated performance?",
    slug: "most-underrated-performance",
    category: "Cinema",
    authorName: "RetroViewer",
    content: "Which role deserved more appreciation?",
    likes: 47,
    featured: false,
    replies: [
      { authorName: "ClassicFan", content: "Johnny. Emotionally layered performance." },
    ],
  },
  {
    title: "Favorite dialogue thread",
    slug: "favorite-dialogue-thread",
    category: "Dialogues",
    authorName: "MassDialogue",
    content: "Drop your all-time favorite dialogue here.",
    likes: 129,
    featured: false,
    replies: [
      { authorName: "DialogueHunter", content: "Too many. Jalsa alone has classics." },
    ],
  },
];

export const FORUM_CATEGORY_SLUG: Record<string, string> = {
  Movies: "movies",
  Politics: "politics",
  Cinema: "movies",
  Dialogues: "general",
};
