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
 * Helper to match an archive against primary categories or subcategories.
 */
export function isArchiveInCategory(archiveCategory: string, targetCategory: string): boolean {
  if (archiveCategory === targetCategory) return true;
  if (targetCategory === 'Bangunan') {
    return ['Infrastruktur', 'Bangunan Bersejarah'].includes(archiveCategory);
  }
  if (targetCategory === 'Budaya') {
    return [
      'Pertahanan & Cagar Budaya',
      'Seni & Seni Tradisional',
      'Tradisi & Sosial',
      'Tradisi & Adat',
      'Cagar Budaya',
      'Alam & Pesisir',
    ].includes(archiveCategory);
  }
  if (targetCategory === 'Tokoh') {
    return ['Sosial & Tokoh'].includes(archiveCategory);
  }
  if (targetCategory === 'Peristiwa') {
    return ['Peristiwa Sejarah'].includes(archiveCategory);
  }
  return false;
}

/**
 * Get full category details with current archive counts.
 */
export async function getCategoriesWithCounts(): Promise<(Category & { count: number })[]> {
  return CATEGORIES.map((cat) => ({
    ...cat,
    count: archives.filter((a) => isArchiveInCategory(a.category, cat.label)).length,
  }));
}

/**
 * Get related archives (same category or related pillar, excluding the given id).
 * Returns at most `limit` items.
 */
export async function getRelatedArchives(
  id: string,
  limit: number = 3
): Promise<Archive[]> {
  const current = archives.find((a) => a.id === id);
  if (!current) return [];

  const getParentPillar = (cat: string) => {
    if (['Bangunan', 'Infrastruktur', 'Bangunan Bersejarah'].includes(cat)) return 'Bangunan';
    if (
      [
        'Budaya',
        'Pertahanan & Cagar Budaya',
        'Seni & Seni Tradisional',
        'Tradisi & Sosial',
        'Tradisi & Adat',
        'Cagar Budaya',
        'Alam & Pesisir',
      ].includes(cat)
    ) {
      return 'Budaya';
    }
    if (['Tokoh', 'Sosial & Tokoh'].includes(cat)) return 'Tokoh';
    if (['Peristiwa', 'Peristiwa Sejarah'].includes(cat)) return 'Peristiwa';
    return cat;
  };

  const currentPillar = getParentPillar(current.category);

  return archives
    .filter(
      (a) =>
        a.id !== id &&
        (a.category === current.category || getParentPillar(a.category) === currentPillar)
    )
    .slice(0, limit);
}

