"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GENRES = ["Action", "Drama", "Comedy", "Romance", "Political"];
const YEARS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];

export function MovieFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const activeGenre = params.get("genre") ?? "";
  const activeYear = params.get("year") ?? "";
  const hasFilters = Boolean(params.get("q") || activeGenre || activeYear);

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.push(`/movies?${sp.toString()}`);
  }

  function clearAll() {
    router.push("/movies");
  }

  return (
    <div className="rounded-xl glass-card p-4 sm:p-5 space-y-4 border border-white/10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4 text-brand-red" />
        <span>Find a film</span>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="ml-auto h-8 text-xs" onClick={clearAll}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by title or synopsis..."
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            clearTimeout((window as unknown as { _movieSt?: ReturnType<typeof setTimeout> })._movieSt);
            (window as unknown as { _movieSt?: ReturnType<typeof setTimeout> })._movieSt = setTimeout(
              () => update("q", val),
              400,
            );
          }}
          className="w-full pl-9 min-h-[44px] bg-black/30 border-white/15"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          className="h-11 w-full sm:w-36 min-h-[44px] rounded-md border border-white/15 bg-black/30 px-3 text-sm"
          value={activeYear}
          onChange={(e) => update("year", e.target.value)}
          aria-label="Filter by year"
        >
          <option value="">All years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update("genre", "")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors min-h-[36px]",
            !activeGenre
              ? "bg-brand-red text-white border-brand-red"
              : "border-white/15 bg-white/5 hover:border-brand-red/40",
          )}
        >
          All
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => update("genre", activeGenre === g ? "" : g)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors min-h-[36px]",
              activeGenre === g
                ? "bg-brand-red text-white border-brand-red"
                : "border-white/15 bg-white/5 hover:border-brand-red/40",
            )}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
