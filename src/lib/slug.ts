/**
 * Converts free text into a URL-safe slug: lowercase, no accents, words joined by "-".
 * Example: "São Paulo" -> "sao-paulo", "Grêmio FBPA" -> "gremio-fbpa".
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Builds the canonical slug for a Kit from its owner (club or national team),
 * type and season, e.g. "flamengo-home-2009" or "brasil-away-2025-26".
 */
export function buildKitSlug(params: {
  ownerSlug: string;
  type: string;
  seasonStart: number;
  seasonEnd: number;
}): string {
  const { ownerSlug, type, seasonStart, seasonEnd } = params;
  const season =
    seasonStart === seasonEnd ? `${seasonStart}` : `${seasonStart}-${String(seasonEnd).slice(-2)}`;
  return slugify(`${ownerSlug}-${type}-${season}`);
}
