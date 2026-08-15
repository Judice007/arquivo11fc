/**
 * Small "acervo" identification shown at the bottom of kit cards, e.g. "A11 · BRA · 2009 · HOME".
 * Country model has no ISO code column (kept out of scope for this visual pass —
 * see docs/PROJECT_SPEC.md), so codes are looked up from a small table and fall
 * back to a derived 3-letter code for countries not yet mapped.
 */
const KNOWN_COUNTRY_CODES: Record<string, string> = {
  brasil: "BRA",
};

export function countryCode(country: { slug: string; name: string }): string {
  return KNOWN_COUNTRY_CODES[country.slug] ?? country.name.slice(0, 3).toUpperCase();
}

export function archiveTag(params: {
  type: string;
  seasonStart: number;
  country: { slug: string; name: string };
}): string {
  return `A11 · ${countryCode(params.country)} · ${params.seasonStart} · ${params.type}`;
}
