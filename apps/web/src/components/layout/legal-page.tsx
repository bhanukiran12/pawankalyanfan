import { ReactNode } from "react";
import { PageShell } from "@/components/layout/section-background";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <PageShell background="form" overlay="dark">
      <article className="container-page max-w-3xl py-8 sm:py-12">
        <h1 className="page-title">{title}</h1>
        <div className="mt-6 sm:mt-8 space-y-6 text-white/85 leading-relaxed text-sm sm:text-base glass-card rounded-xl p-5 sm:p-8">
          {children}
        </div>
      </article>
    </PageShell>
  );
}
