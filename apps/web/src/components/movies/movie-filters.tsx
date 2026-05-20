"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const GENRES = ["Action", "Drama", "Comedy", "Romance", "Political"];
const YEARS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];

export function MovieFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.push(`/movies?${sp.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 w-full sm:flex-row sm:flex-wrap">
      <Input
        placeholder="Search movies..."
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          clearTimeout((window as unknown as { _st?: ReturnType<typeof setTimeout> })._st);
          (window as unknown as { _st?: ReturnType<typeof setTimeout> })._st = setTimeout(() => update("q", val), 400);
        }}
        className="w-full sm:max-w-xs min-h-[44px]"
      />
      <select
        className="h-11 sm:h-10 w-full sm:w-auto min-h-[44px] rounded-md border border-input bg-secondary/50 px-3 text-sm"
        value={params.get("genre") ?? ""}
        onChange={(e) => update("genre", e.target.value)}
      >
        <option value="">All Genres</option>
        {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
      <select
        className="h-11 sm:h-10 w-full sm:w-auto min-h-[44px] rounded-md border border-input bg-secondary/50 px-3 text-sm"
        value={params.get("year") ?? ""}
        onChange={(e) => update("year", e.target.value)}
      >
        <option value="">All Years</option>
        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}
