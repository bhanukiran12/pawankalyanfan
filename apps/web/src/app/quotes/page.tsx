"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, Quote } from "@/lib/api-client";
import { QuoteCard, QuoteFilters } from "@/components/quotes/quote-card";
import { PageHeading } from "@/components/layout/page-heading";
import { PageShell } from "@/components/layout/section-background";
import { FadeIn } from "@/components/motion/fade-in";
import { PageLoader } from "@/components/ui/skeleton";

function QuotesPageContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "";
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [category, setCategory] = useState(urlCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

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

export default function QuotesPage() {
  return (
    <Suspense fallback={
      <PageShell background="quotes">
        <div className="container-page py-8"><PageLoader /></div>
      </PageShell>
    }>
      <QuotesPageContent />
    </Suspense>
  );
}
