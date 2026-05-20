import { Film, Lightbulb, Megaphone, Quote } from "lucide-react";
import { BlogHighlight, BlogLang, highlightLabel } from "@/lib/blog-highlights";
import { cn } from "@/lib/utils";

const ICONS = {
  trivia: Lightbulb,
  quote: Quote,
  speech: Megaphone,
  dialogue: Film,
} as const;

function HighlightBlock({
  block,
  compact = false,
  lang = "te",
}: {
  block: BlogHighlight;
  compact?: boolean;
  lang?: BlogLang;
}) {
  const Icon = ICONS[block.type];
  const label = highlightLabel(block, lang);
  const isTrivia = block.type === "trivia";
  const isQuoted = block.type === "quote" || block.type === "speech" || block.type === "dialogue";

  return (
    <div
      className={cn(
        "rounded-xl border border-brand-red/25 bg-gradient-to-br from-brand-red/10 via-black/40 to-black/60",
        compact ? "p-4" : "p-5 md:p-6"
      )}
    >
      <div className="flex items-center gap-2 text-brand-red">
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      {isQuoted ? (
        <blockquote className={cn("mt-3 italic text-white/90 leading-relaxed", compact ? "text-sm" : "text-base md:text-lg")}>
          &ldquo;{block.text}&rdquo;
        </blockquote>
      ) : (
        <p className={cn("mt-3 text-white/90 leading-relaxed", compact ? "text-sm" : "text-base")}>
          {block.text}
        </p>
      )}
      {block.source && (
        <p className={cn("mt-2 text-muted-foreground", compact ? "text-xs" : "text-sm")}>
          {isTrivia ? block.source : `— ${block.source}`}
        </p>
      )}
    </div>
  );
}

export function BlogHighlightBlocks({
  highlights,
  compact = false,
  className,
  lang = "te",
}: {
  highlights: BlogHighlight[];
  compact?: boolean;
  className?: string;
  lang?: BlogLang;
}) {
  if (highlights.length === 0) return null;

  return (
    <div
      className={cn(
        compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {highlights.map((block, i) => (
        <HighlightBlock key={`${block.type}-${i}`} block={block} compact={compact} lang={lang} />
      ))}
    </div>
  );
}
