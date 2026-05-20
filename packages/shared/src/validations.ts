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

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const forumThreadSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  categoryId: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForumThreadInput = z.infer<typeof forumThreadSchema>;
