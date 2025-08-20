/**
 * Simple slug utility for generating URL-safe slugs from titles.
 * Keeps client-only routing human friendly without needing a dedicated slug field.
 */

/**
 * Convert a string to a URL-friendly slug.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // replace apostrophes first to avoid leftover hyphens
    .replace(/['’]/g, '')
    // replace non-alphanumeric with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // collapse multiple hyphens
    .replace(/-+/g, '-')
    // trim trailing hyphens
    .replace(/^-|-$/g, '');
}
