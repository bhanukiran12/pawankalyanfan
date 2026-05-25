import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JANA_SEVA_LEGAL, SITE, STUDENTS_WING_LEGAL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Variant = "jana-seva" | "students-wing";

const COPY = {
  "jana-seva": JANA_SEVA_LEGAL,
  "students-wing": STUDENTS_WING_LEGAL,
} as const;

export function FanDisclaimerNotice({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const c = COPY[variant];
  const Icon = variant === "jana-seva" ? AlertTriangle : Info;

  return (
    <aside
      className={cn(
        "rounded-xl border p-4 sm:p-5",
        variant === "jana-seva"
          ? "border-amber-500/40 bg-amber-950/25"
          : "border-sky-500/35 bg-sky-950/20",
        className,
      )}
      role="note"
      aria-label="Important notice"
    >
      <div className="flex gap-3">
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 mt-0.5",
            variant === "jana-seva" ? "text-amber-400" : "text-sky-400",
          )}
          aria-hidden
        />
        <div className="min-w-0 space-y-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs border-0",
              variant === "jana-seva"
                ? "bg-amber-500/20 text-amber-100"
                : "bg-sky-500/20 text-sky-100",
            )}
          >
            {c.badge}
          </Badge>
          <p className="font-semibold text-white text-sm sm:text-base">{c.title}</p>
          <p className="text-sm text-white/75 leading-relaxed">{c.summary}</p>
          {variant === "jana-seva" && "noDonations" in c && (
            <p className="text-sm font-medium text-amber-100/95 leading-relaxed">{c.noDonations}</p>
          )}
          {variant === "jana-seva" && "notOfficial" in c && (
            <p className="text-sm text-white/65 leading-relaxed">{c.notOfficial}</p>
          )}
          {variant === "jana-seva" && "verify" in c && (
            <p className="text-xs text-white/55 leading-relaxed">{c.verify}</p>
          )}
          {variant === "students-wing" && "notOurForm" in c && (
            <p className="text-sm text-white/70 leading-relaxed">{c.notOurForm}</p>
          )}
          {variant === "students-wing" && "unofficial" in c && (
            <p className="text-sm text-white/65 leading-relaxed">{c.unofficial}</p>
          )}
          <p className="text-xs text-white/45 pt-1">{SITE.disclaimer}</p>
        </div>
      </div>
    </aside>
  );
}
