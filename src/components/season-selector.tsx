import Link from "next/link";

import { formatSeason, seasonSlug } from "@/lib/season";

export function SeasonSelector({
  basePath,
  seasons,
  activeSeason,
}: {
  basePath: string;
  seasons: { seasonStart: number; seasonEnd: number }[];
  activeSeason?: { seasonStart: number; seasonEnd: number };
}) {
  if (seasons.length === 0) return null;

  return (
    <nav aria-label="Temporadas" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <ul className="flex gap-2">
        {seasons.map((season) => {
          const slug = seasonSlug(season.seasonStart, season.seasonEnd);
          const isActive =
            activeSeason?.seasonStart === season.seasonStart &&
            activeSeason?.seasonEnd === season.seasonEnd;
          return (
            <li key={slug}>
              <Link
                href={`${basePath}/${slug}`}
                className={`inline-flex whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-paper"
                    : "border-line text-ink-muted hover:border-accent hover:text-accent"
                }`}
              >
                {formatSeason(season.seasonStart, season.seasonEnd)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
