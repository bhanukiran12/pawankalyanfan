import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Pawan Kalyan Blogs — Latest News, Movies & Power Star Updates",
  description:
    "Read Pawan Kalyan blogs: latest news, Deputy CM updates, Jana Sena, OG, HHVM, best movies, dialogues, wallpapers, birthday, age, and Power Star / PSPK fan guides. Unofficial fan site.",
  path: "/blogs",
  keywords: [
    "Pawan Kalyan",
    "Pawan Kalyan latest news",
    "Pawan Kalyan movies",
    "Power Star",
    "PSPK",
    "Pawan Kalyan Deputy CM",
    "Jana Sena",
    "Janasenani",
    "They Call Him OG",
    "Bheemla Nayak",
    "Gabbar Singh",
    "Pawan Kalyan dialogues",
    "Pawan Kalyan wallpapers",
    "Telugu cinema",
    "Andhra Pradesh politics",
  ],
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
