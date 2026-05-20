"use client";

import { useEffect, useState } from "react";
import { Download, MessageCircle } from "lucide-react";
import { api, Quote } from "@/lib/api-client";
import { QuoteCard, QuoteFilters } from "@/components/quotes/quote-card";
import { PageHeading } from "@/components/layout/page-heading";
import { PageShell } from "@/components/layout/section-background";
import { FadeIn } from "@/components/motion/fade-in";
import { PageLoader } from "@/components/ui/skeleton";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { limit: "50" };
    if (category) params.category = category;
    api
      .getQuotes(params)
      .then((d) => setQuotes(d.quotes))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <PageShell background="quotes">
      <div className="container-page py-6 sm:py-8">
      <FadeIn>
        <PageHeading
          title="His Words"
          subtitle="Dialogues that echo in every heart — share them instantly."
        />

        <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg glass-card p-4">
            <SmartphoneIcon />
            <div>
              <p className="font-medium text-sm">WhatsApp Status</p>
              <p className="text-xs text-muted-foreground">Download 1080×1920 PNG ready to post</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg glass-card border-[#25D366]/30 p-4">
            <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">One-Tap Share</p>
              <p className="text-xs text-muted-foreground">Send quote text directly to WhatsApp</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg glass-card p-4">
            <Download className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Download Poster</p>
              <p className="text-xs text-muted-foreground">1080×1080 PNG for feeds &amp; sharing</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="mt-6 sm:mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-2 scrollbar-rail">
        <QuoteFilters active={category} onChange={setCategory} />
      </div>

      {loading ? (
        <div className="mt-8">
          <PageLoader />
        </div>
      ) : quotes.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">No quotes found in this category.</p>
      ) : (
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {quotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
      </div>
    </PageShell>
  );
}

function SmartphoneIcon() {
  return (
    <svg className="h-5 w-5 text-brand-red shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
}
