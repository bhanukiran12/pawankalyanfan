import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SENANI_STUDENTS_WING } from "@/lib/constants";

type Props = {
  compact?: boolean;
};

/** Promo strip linking to Senani Students Wing registration. */
export function SenaniStudentsCta({ compact }: Props) {
  if (compact) {
    return (
      <div className="rounded-xl glass-card border border-brand-red/35 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <GraduationCap className="h-8 w-8 text-brand-red shrink-0" aria-hidden />
          <div>
            <p className="font-display text-lg tracking-wide">Senani Students Wing</p>
            <p className="text-xs text-muted-foreground mt-1">
              Link to the wing&apos;s external registration form — not hosted on this fan site.
            </p>
          </div>
        </div>
        <Link href="/janasena-students" className="shrink-0">
          <Button size="sm" className="w-full sm:w-auto min-h-[44px]">
            Register <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="rounded-2xl glass-card border border-brand-red/40 overflow-hidden cinematic-shadow">
      <div className="grid md:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SENANI_STUDENTS_WING.flyerImage}
          alt=""
          className="hidden md:block h-full w-full object-cover object-top max-h-[220px] lg:max-h-none"
        />
        <div className="p-5 sm:p-6">
          <p className="text-xs uppercase tracking-wider text-brand-red mb-1">Jana Sena · Students</p>
          <h2 className="font-display text-2xl sm:text-3xl tracking-wide">Senani Students Wing</h2>
          <p className="mt-2 text-sm text-white/75 max-w-xl">
            Fan link to the Senani Students Wing registration survey on their external website — not the
            official wing site hosted here.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/janasena-students">
              <Button className="min-h-[48px]">
                Registration form <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href={SENANI_STUDENTS_WING.registrationUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="min-h-[48px]">
                Open survey directly
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
