import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const movieSchema = z.object({
  title: z.string().min(1),
  releaseDate: z.string(),
  synopsis: z.string().min(10),
  genre: z.array(z.string()),
  posterUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  trailerUrl: z.string().optional(),
  trivia: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const quoteSchema = z.object({
  text: z.string().min(5),
  category: z.enum(["MOTIVATIONAL", "POLITICAL", "MOVIE_DIALOGUE", "DEVOTIONAL", "LEADERSHIP"]),
  source: z.string().optional(),
  isPremium: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const newsSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  category: z.string().min(1),
  tags: z.array(z.string()),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
});

export const forumThreadSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  categoryId: z.string(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const affiliateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  affiliateUrl: z.string().url(),
  category: z.string().min(1),
  imageUrl: z.string().optional(),
  commission: z.number().min(0).default(0),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MovieInput = z.infer<typeof movieSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type NewsInput = z.infer<typeof newsSchema>;
export type ForumThreadInput = z.infer<typeof forumThreadSchema>;
