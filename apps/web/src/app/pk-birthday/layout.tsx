import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Power Star Birthday Countdown | PawanKalyanFan",
  description:
    "Live countdown to Pawan Kalyan birthday on 2 September. Share the countdown on WhatsApp, X, and Facebook with fellow fans.",
  openGraph: {
    title: "PK Birthday Countdown",
    url: `${SITE.url}/pk-birthday`,
  },
};

export default function PkBirthdayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
