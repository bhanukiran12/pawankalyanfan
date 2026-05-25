import type { Metadata } from "next";
import { FanDisclaimerNotice } from "@/components/layout/fan-disclaimer-notice";
import { JANA_SEVA_LEGAL, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Jana Seva — Fan Volunteer Help | PawanKalyanFan",
  description:
    "Unofficial fan-made Jana Seva: community blood requests, camps, workshops, and volunteer coordination. No donations accepted on this site.",
  openGraph: {
    title: "Jana Seva (fan volunteer service) | PawanKalyanFan",
    description: JANA_SEVA_LEGAL.summary,
    url: `${SITE.url}/jana-seva`,
  },
};

export default function JanaSevaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jana-seva-layout">
      <div className="container-page pt-6 sm:pt-8 pb-2">
        <FanDisclaimerNotice variant="jana-seva" />
      </div>
      {children}
    </div>
  );
}
