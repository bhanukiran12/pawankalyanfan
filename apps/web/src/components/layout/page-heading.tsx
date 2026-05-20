import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
};

export function PageHeading({
  title,
  subtitle,
  className,
  titleClassName,
  children,
}: PageHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <h1 className={cn("page-title", titleClassName)}>{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
