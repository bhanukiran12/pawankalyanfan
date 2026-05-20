import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Blogs",
  description:
    "Pawan Kalyan fan blogs — Deputy Chief Minister of Andhra Pradesh, Jana Sena, Jal Jeevan Mission, rural development, and Power Star journey.",
  path: "/blogs",
  keywords: [
    "Pawan Kalyan Deputy CM",
    "Andhra Pradesh politics",
    "Jana Sena blog",
    "Jal Jeevan Mission AP",
    "Pawan Kalyan governance",
  ],
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
