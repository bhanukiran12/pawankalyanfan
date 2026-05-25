import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { movies, upcomingMovies, parseGenre, type MovieSeed } from "./data/movies";
import { quotes as quoteData, mapQuoteCategory, makeQuoteSlug, type QuoteSeed } from "./data/quotes";
import { eventsTimeline, mapEventType, type TimelineEventSeed } from "./data/events-timeline";
import { news as newsData, newsPayload, type NewsSeed } from "./data/news";
import { blogs as blogData, blogPayload, type BlogSeed } from "./data/blogs";
import { wallpapers as wallpaperData, wallpaperTags, type WallpaperSeed } from "./data/wallpapers";
import { forumThreads as forumThreadData, FORUM_CATEGORY_SLUG, type ForumThreadSeed } from "./data/forum-threads";
import { fanEdits as fanEditData, type FanEditSeed } from "./data/fan-edits";
import {
  charityBloodRequests,
  charityBloodCamps,
  charityWorkshops,
  charityScholarships,
  charityVolunteers,
  charityEmergencies,
} from "./data/charity-seed";
import type { User } from "@prisma/client";

const prisma = new PrismaClient();

function moviePayload(m: MovieSeed) {
  return {
    title: m.title,
    releaseDate: new Date(m.releaseDate),
    synopsis: m.synopsis,
    genre: parseGenre(m.genre),
    posterUrl: m.posterUrl,
    bannerUrl: m.posterUrl,
    trailerUrl: m.trailerUrl,
    rating: m.rating ?? 0,
    featured: m.featured,
    published: true,
    trivia: `Wikipedia: ${m.wikiUrl}`,
  };
}

async function seedMovie(m: MovieSeed) {
  return prisma.movie.upsert({
    where: { slug: m.slug },
    update: moviePayload(m),
    create: { slug: m.slug, ...moviePayload(m) },
  });
}

function quotePayload(q: QuoteSeed, index: number) {
  const slug = makeQuoteSlug(q.text, index);
  return {
    text: q.text,
    slug,
    category: mapQuoteCategory(q.category),
    source: `${q.attributedTo} · ${q.source}`,
    featured: q.featured ?? false,
    isPremium: false,
  };
}

async function seedQuote(q: QuoteSeed, index: number) {
  const slug = makeQuoteSlug(q.text, index);
  const payload = quotePayload(q, index);
  return prisma.quote.upsert({
    where: { slug },
    update: payload,
    create: payload,
  });
}

async function seedNewsItem(item: NewsSeed) {
  const payload = newsPayload(item);
  return prisma.newsPost.upsert({
    where: { slug: item.slug },
    update: payload,
    create: { slug: item.slug, ...payload },
  });
}

async function seedBlogItem(item: BlogSeed) {
  const payload = blogPayload(item);
  return prisma.newsPost.upsert({
    where: { slug: item.slug },
    update: payload,
    create: { slug: item.slug, ...payload },
  });
}

async function seedTimelineEvent(
  event: TimelineEventSeed,
  movieBySlug: Record<string, string>
) {
  const payload = {
    title: event.title,
    description: event.description,
    date: new Date(event.eventDate),
    type: mapEventType(event.category),
    featured: event.featured,
    imageUrl: event.imageUrl ?? null,
    movieId: event.movieSlug ? movieBySlug[event.movieSlug] : undefined,
  };

  const existing = await prisma.timelineEvent.findFirst({ where: { title: event.title } });
  if (existing) {
    return prisma.timelineEvent.update({ where: { id: existing.id }, data: payload });
  }
  return prisma.timelineEvent.create({ data: payload });
}

let seedUserPasswordHash: string | null = null;

async function getOrCreateSeedUser(name: string, cache: Map<string, User>): Promise<User> {
  const cached = cache.get(name);
  if (cached) return cached;

  if (!seedUserPasswordHash) {
    seedUserPasswordHash = await bcrypt.hash("seed123", 12);
  }

  const handle = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "fan";
  const email = `${handle}@seed.pawankalyanfan.local`;
  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: {
      email,
      name,
      password: seedUserPasswordHash,
      role: "USER",
    },
  });
  cache.set(name, user);
  return user;
}

async function seedWallpaper(item: WallpaperSeed) {
  const payload = {
    title: item.title,
    imageUrl: item.imageUrl,
    thumbnailUrl: item.thumbnailUrl,
    tags: wallpaperTags(item),
    isPremium: item.premium,
    downloadCount: item.downloads,
    published: true,
  };
  return prisma.wallpaper.upsert({
    where: { slug: item.slug },
    update: payload,
    create: { slug: item.slug, ...payload },
  });
}

async function seedForumThread(
  thread: ForumThreadSeed,
  categoryBySlug: Record<string, string>,
  userCache: Map<string, User>
) {
  const author = await getOrCreateSeedUser(thread.authorName, userCache);
  const categorySlug = FORUM_CATEGORY_SLUG[thread.category] || "general";
  const categoryId = categoryBySlug[categorySlug];

  const payload = {
    title: thread.title,
    content: thread.content,
    categoryId,
    userId: author.id,
    isPinned: thread.featured,
  };

  const existing = await prisma.forumThread.findUnique({ where: { slug: thread.slug } });
  let record;
  if (existing) {
    await prisma.forumReply.deleteMany({ where: { threadId: existing.id } });
    await prisma.forumLike.deleteMany({ where: { threadId: existing.id } });
    record = await prisma.forumThread.update({ where: { id: existing.id }, data: payload });
  } else {
    record = await prisma.forumThread.create({ data: { slug: thread.slug, ...payload } });
  }

  const likeUsers = new Set<string>([author.id]);
  for (const reply of thread.replies) {
    const replyUser = await getOrCreateSeedUser(reply.authorName, userCache);
    await prisma.forumReply.create({
      data: { content: reply.content, threadId: record.id, userId: replyUser.id },
    });
    likeUsers.add(replyUser.id);
  }

  for (const userId of likeUsers) {
    await prisma.forumLike.upsert({
      where: { userId_threadId: { userId, threadId: record.id } },
      create: { userId, threadId: record.id },
      update: {},
    });
  }

  return record;
}

async function seedFanEdit(edit: FanEditSeed, userCache: Map<string, User>) {
  const creator = await getOrCreateSeedUser(edit.creatorName, userCache);
  const description = edit.featured ? `[Featured] ${edit.description}` : edit.description;
  const payload = {
    title: edit.title,
    description,
    mediaUrl: edit.imageUrl,
    mediaType: "image",
    status: edit.approved ? ("APPROVED" as const) : ("PENDING" as const),
    likeCount: edit.likes,
    userId: creator.id,
  };

  const existing = await prisma.fanSubmission.findFirst({
    where: { title: edit.title, userId: creator.id },
  });
  if (existing) {
    return prisma.fanSubmission.update({ where: { id: existing.id }, data: payload });
  }
  return prisma.fanSubmission.create({ data: payload });
}

async function removeGabbarIntroDialogue() {
  const removed = await prisma.movieDialogue.deleteMany({
    where: {
      text: { in: ["Naa Peru Gabbar Singh", "Naa peru Gabbar Singh", "naa peru gabbar singh"] },
    },
  });
  if (removed.count > 0) {
    console.log("✅ Removed Naa Peru Gabbar Singh movie dialogue:", removed.count);
  }
}

async function seedMovieExtras() {
  const gabbar = await prisma.movie.findUnique({
    where: { slug: "gabbar-singh" },
    include: { cast: true, dialogues: true, songs: true },
  });

  if (gabbar && gabbar.cast.length === 0) {
    await prisma.movie.update({
      where: { id: gabbar.id },
      data: {
        trivia:
          "Gabbar Singh was inspired by the Hindi film Dabangg and became one of the highest-grossing Telugu films. Wikipedia: https://en.wikipedia.org/wiki/Gabbar_Singh",
        cast: {
          create: [
            { name: "Pawan Kalyan", role: "Venkata Rathnam Naidu / Gabbar Singh" },
            { name: "Shruti Haasan", role: "Bhagyalakshmi" },
          ],
        },
        dialogues: {
          create: [{ text: "Evadu kodithe daniki thodu", context: "Power dialogue" }],
        },
        songs: {
          create: [
            { title: "Kevvu Keka", singer: "Karthik" },
            { title: "Dil Se", singer: "Karthik" },
          ],
        },
      },
    });
  }

  const atd = await prisma.movie.findUnique({
    where: { slug: "attarintiki-daredi" },
    include: { cast: true, dialogues: true },
  });

  if (atd && atd.cast.length === 0) {
    await prisma.movie.update({
      where: { id: atd.id },
      data: {
        cast: {
          create: [
            { name: "Pawan Kalyan", role: "Gautham Nanda" },
            { name: "Samantha", role: "Sashi" },
          ],
        },
        dialogues: {
          create: [
            {
              text: "Family ante enti, blood kaadu... it's about standing together",
              context: "Emotional scene",
            },
          ],
        },
      },
    });
  }
}

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
  const adminEmail = process.env.ADMIN_EMAIL || "admin@pawankalyanfan.com";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      isPremium: true,
      premiumBadge: true,
    },
    create: {
      email: adminEmail,
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      isPremium: true,
      premiumBadge: true,
    },
  });
  console.log("✅ Admin user:", admin.email);

  const categories = await Promise.all([
    prisma.forumCategory.upsert({ where: { slug: "movies" }, update: {}, create: { name: "Movies", slug: "movies", description: "Discuss PK films", sortOrder: 1 } }),
    prisma.forumCategory.upsert({ where: { slug: "politics" }, update: {}, create: { name: "Politics", slug: "politics", description: "Political discussions", sortOrder: 2 } }),
    prisma.forumCategory.upsert({ where: { slug: "fan-theories" }, update: {}, create: { name: "Fan Theories", slug: "fan-theories", description: "Speculations and theories", sortOrder: 3 } }),
    prisma.forumCategory.upsert({ where: { slug: "events" }, update: {}, create: { name: "Events", slug: "events", description: "Public appearances", sortOrder: 4 } }),
    prisma.forumCategory.upsert({ where: { slug: "general" }, update: {}, create: { name: "General", slug: "general", description: "General discussion", sortOrder: 5 } }),
  ]);
  console.log("✅ Forum categories:", categories.length);

  const allMovies = [...movies, ...upcomingMovies];
  const seededMovies = await Promise.all(allMovies.map(seedMovie));
  await prisma.movie.deleteMany({
    where: { slug: { notIn: allMovies.map((m) => m.slug) } },
  });
  await seedMovieExtras();
  await removeGabbarIntroDialogue();
  console.log("✅ Movies:", seededMovies.length);

  const seededQuotes = await Promise.all(quoteData.map((q, i) => seedQuote(q, i)));
  console.log("✅ Quotes:", seededQuotes.length);

  const seededNews = await Promise.all(newsData.map(seedNewsItem));
  console.log("✅ News:", seededNews.length);

  const seededBlogs = await Promise.all(blogData.map(seedBlogItem));
  await prisma.newsPost.deleteMany({
    where: {
      category: "Blog",
      slug: { notIn: blogData.map((b) => b.slug) },
    },
  });
  console.log("✅ Blogs:", seededBlogs.length);

  const seededWallpapers = await Promise.all(wallpaperData.map(seedWallpaper));
  await prisma.wallpaper.deleteMany({
    where: { slug: { notIn: wallpaperData.map((w) => w.slug) } },
  });
  console.log("✅ Wallpapers:", seededWallpapers.length);

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  const userCache = new Map<string, User>();
  const seededForumThreads = await Promise.all(
    forumThreadData.map((t) => seedForumThread(t, categoryBySlug, userCache))
  );
  console.log("✅ Forum threads:", seededForumThreads.length);

  const seededFanEdits = await Promise.all(fanEditData.map((e) => seedFanEdit(e, userCache)));
  console.log("✅ Fan edits:", seededFanEdits.length);

  const adSlots = ["header", "sidebar", "in-content", "footer", "mobile-sticky"];
  for (const slot of adSlots) {
    await prisma.adPlacement.upsert({
      where: { name: slot },
      update: {},
      create: { name: slot, slot, enabled: false },
    });
  }
  console.log("✅ Ad placements configured");

  await prisma.affiliateProduct.upsert({
    where: { id: "seed-book-1" },
    update: {},
    create: {
      id: "seed-book-1",
      title: "Pawan Kalyan Biography Book",
      description: "Official biography covering his film and political journey",
      affiliateUrl: "https://amazon.in/example",
      category: "Books",
      commission: 5,
      active: true,
    },
  });

  await prisma.aiPrompt.upsert({
    where: { name: "chatbot" },
    update: {},
    create: {
      name: "chatbot",
      system: "You are PK Fan AI, a knowledgeable assistant for the Pawan Kalyan fan community.",
      active: true,
    },
  });

  const movieBySlug = Object.fromEntries(
    (await prisma.movie.findMany({ select: { id: true, slug: true } })).map((m) => [m.slug, m.id])
  );

  await prisma.timelineEvent.deleteMany({});
  const seededTimeline = await Promise.all(
    eventsTimeline.map((e) => seedTimelineEvent(e, movieBySlug))
  );
  console.log("✅ Timeline events:", seededTimeline.length);

  for (const row of charityBloodRequests) {
    await prisma.bloodRequest.upsert({ where: { slug: row.slug }, update: row, create: row });
  }
  for (const row of charityBloodCamps) {
    await prisma.bloodCamp.upsert({ where: { slug: row.slug }, update: row, create: row });
  }
  for (const row of charityWorkshops) {
    await prisma.workshop.upsert({ where: { slug: row.slug }, update: row, create: row });
  }
  for (const row of charityScholarships) {
    await prisma.scholarship.upsert({ where: { slug: row.slug }, update: row, create: row });
  }
  for (const row of charityVolunteers) {
    const existing = await prisma.charityProfile.findFirst({
      where: { displayName: row.displayName, city: row.city },
    });
    if (existing) {
      await prisma.charityProfile.update({ where: { id: existing.id }, data: row });
    } else {
      await prisma.charityProfile.create({ data: row });
    }
  }
  for (const row of charityEmergencies) {
    await prisma.emergencyPost.upsert({ where: { slug: row.slug }, update: row, create: row });
  }
  console.log("✅ Jana Seva sample listings seeded");

  console.log("🎉 Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
