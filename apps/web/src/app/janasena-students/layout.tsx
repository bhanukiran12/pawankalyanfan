import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Senani Students Wing — External Registration Link",
  description:
    "Unofficial PawanKalyanFan page linking to the Senani Students Wing registration survey on their external website — not hosted on pawankalyanfan.com.",
  path: "/janasena-students",
  keywords: ["Senani Students Wing", "Jana Sena students", "student registration link", "external form"],
});

export default function JanasenaStudentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
