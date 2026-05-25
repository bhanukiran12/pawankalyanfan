import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Jana Seva — Verified Help | PawanKalyanFan",
  description:
    "Verified blood donation requests, camps, free workshops, scholarships, volunteers, and emergency help — a transparent community coordination platform on pawankalyanfan.com.",
  openGraph: {
    title: "Jana Seva | PawanKalyanFan",
    description: "Help someone today. Blood, workshops, scholarships, volunteers — verified community help.",
    url: `${SITE.url}/jana-seva`,
  },
};

export default function JanaSevaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
