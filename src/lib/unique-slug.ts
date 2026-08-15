/**
 * Appends "-2", "-3", ... to `base` until `exists` reports no collision.
 * Used by admin create actions so slugs are derived from the name automatically
 * instead of being typed by hand (see docs/PROJECT_SPEC.md: "nunca usar nome como
 * chave primária", slugs únicos por contexto).
 */
export async function ensureUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  let candidate = base;
  let attempt = 2;
  while (await exists(candidate)) {
    candidate = `${base}-${attempt}`;
    attempt += 1;
  }
  return candidate;
}
