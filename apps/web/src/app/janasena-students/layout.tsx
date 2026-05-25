import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Senani Students Wing Registration",
  description:
    "Join Senani Students Wing — Jana Sena student leadership, welfare programs, and registration for change. Official survey form for students.",
  path: "/janasena-students",
  keywords: ["Senani Students Wing", "Jana Sena students", "Pawan Kalyan students", "registration"],
});

export default function JanasenaStudentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
