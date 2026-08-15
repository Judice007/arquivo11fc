/**
 * Formats a season for display from its two stored fields.
 * seasonStart === seasonEnd -> "2025"
 * seasonStart !== seasonEnd -> "2025/26"
 */
export function formatSeason(seasonStart: number, seasonEnd: number): string {
  if (seasonStart === seasonEnd) return `${seasonStart}`;
  return `${seasonStart}/${String(seasonEnd).slice(-2)}`;
}

/**
 * Parses a season label typed by an admin ("2025" or "2025/26") into
 * { seasonStart, seasonEnd }. Throws on malformed input.
 */
export function parseSeasonLabel(label: string): { seasonStart: number; seasonEnd: number } {
  const trimmed = label.trim();

  const singleYear = /^(\d{4})$/.exec(trimmed);
  if (singleYear) {
    const year = Number(singleYear[1]);
    return { seasonStart: year, seasonEnd: year };
  }

  const splitYears = /^(\d{4})\/(\d{2})$/.exec(trimmed);
  if (splitYears) {
    const seasonStart = Number(splitYears[1]);
    const century = Math.floor(seasonStart / 100) * 100;
    let seasonEnd = century + Number(splitYears[2]);
    if (seasonEnd <= seasonStart) seasonEnd += 100;
    return { seasonStart, seasonEnd };
  }

  throw new Error(`Temporada inválida: "${label}". Use "2025" ou "2025/26".`);
}

/** Groups a year into the decade label used for "Volte no tempo" ("2020s", "2010s", ...). */
export function decadeLabel(year: number): string {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

/**
 * URL-safe version of a season, used in routes like /clubes/flamengo/2025-26
 * (formatSeason's "2025/26" can't be a single path segment).
 */
export function seasonSlug(seasonStart: number, seasonEnd: number): string {
  if (seasonStart === seasonEnd) return `${seasonStart}`;
  return `${seasonStart}-${String(seasonEnd).slice(-2)}`;
}

/** Inverse of seasonSlug: parses a route segment back into { seasonStart, seasonEnd }. */
export function parseSeasonSlug(slug: string): { seasonStart: number; seasonEnd: number } | null {
  const singleYear = /^(\d{4})$/.exec(slug);
  if (singleYear) {
    const year = Number(singleYear[1]);
    return { seasonStart: year, seasonEnd: year };
  }

  const splitYears = /^(\d{4})-(\d{2})$/.exec(slug);
  if (splitYears) {
    const seasonStart = Number(splitYears[1]);
    const century = Math.floor(seasonStart / 100) * 100;
    let seasonEnd = century + Number(splitYears[2]);
    if (seasonEnd <= seasonStart) seasonEnd += 100;
    return { seasonStart, seasonEnd };
  }

  return null;
}
