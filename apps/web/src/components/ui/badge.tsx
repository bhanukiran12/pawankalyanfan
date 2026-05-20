import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "premium" | "outline" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variant === "default" && "bg-brand-red/20 text-brand-red-light border border-brand-red/30",
      variant === "premium" && "bg-gradient-to-r from-brand-gold/20 to-brand-red/20 text-brand-gold border border-brand-gold/30",
      variant === "outline" && "border border-white/20 text-muted-foreground",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
