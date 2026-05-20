import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
};

export function SiteLogo({ size = 44, showText = false, className, textClassName }: SiteLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SITE.logo}
        alt="Pawan Kalyan Fan"
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-brand-red/40 shadow-lg shadow-black/40"
      />
      {showText && (
        <span className={cn("font-display tracking-wider leading-none", textClassName)}>
          <span className="text-brand-red">PAWAN KALYAN</span>
          <span className="block text-white text-[0.65em] mt-0.5">FAN</span>
        </span>
      )}
    </span>
  );
}
