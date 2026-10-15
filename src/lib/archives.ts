import { archives, type Archive, type ArchiveCategory, type ArchiveSource } from '@/data/archives';
import { CATEGORIES, type Category } from '@/data/categories';

export type { Archive, ArchiveCategory, ArchiveSource, Category };

/**
 * Get all archives. Returns a new array (safe to mutate).
 */
export async function getAllArchives(): Promise<Archive[]> {
  return [...archives];
}

/**
 * Get a single archive by its id. Returns undefined if not found.
 */
export async function getArchiveById(id: string): Promise<Archive | undefined> {
  return archives.find((a) => a.id === id);
}

/**
 * Get all archives marked as featured.
 */
export async function getFeaturedArchives(): Promise<Archive[]> {
  return archives.filter((a) => a.featured);
}

/**
 * Get all available categories.
 */
export async function getCategories(): Promise<ArchiveCategory[]> {
  return CATEGORIES.map((c) => c.label);
}

/**
 * Get full category details with current archive counts.
 */
export async function getCategoriesWithCounts(): Promise<(Category & { count: number })[]> {
  return CATEGORIES.map((cat) => ({
    ...cat,
    count: archives.filter((a) => a.category === cat.label).length,
  }));
}

/**
 * Get related archives (same category, excluding the given id).
 * Returns at most `limit` items.
 */
export async function getRelatedArchives(
  id: string,
  limit: number = 3
): Promise<Archive[]> {
  const current = archives.find((a) => a.id === id);
  if (!current) return [];
  return archives
    .filter((a) => a.id !== id && a.category === current.category)
    .slice(0, limit);
}
