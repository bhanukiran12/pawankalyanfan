import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/section-background";

export default function NotFound() {
  return (
    <PageShell background="home" overlay="dark">
      <div className="container-page flex min-h-[50dvh] flex-col items-center justify-center py-12 text-center px-4">
        <h1 className="font-display text-6xl sm:text-8xl text-brand-red drop-shadow-lg">404</h1>
        <p className="mt-4 text-lg sm:text-xl text-white/80">Page not found</p>
        <Link href="/" className="mt-8 w-full sm:w-auto">
          <Button className="w-full sm:w-auto min-h-[48px]">Back Home</Button>
        </Link>
      </div>
    </PageShell>
  );
}
