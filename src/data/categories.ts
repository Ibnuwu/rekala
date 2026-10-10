export type CategoryId = 'tokoh' | 'bangunan' | 'peristiwa' | 'budaya';
export type CategoryLabel = 'Tokoh' | 'Bangunan' | 'Peristiwa' | 'Budaya';

export interface Category {
  id: CategoryId;
  label: CategoryLabel;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'tokoh',
    label: 'Tokoh',
    description: 'Sosok yang berperan dalam perjalanan sejarah Banten.',
  },
  {
    id: 'bangunan',
    label: 'Bangunan',
    description: 'Gedung, situs, dan bangunan bersejarah di Banten.',
  },
  {
    id: 'peristiwa',
    label: 'Peristiwa',
    description: 'Momen dan kejadian penting dalam sejarah Banten.',
  },
  {
    id: 'budaya',
    label: 'Budaya',
    description: 'Tradisi, adat istiadat, dan ragam budaya masyarakat Banten.',
  },
];

export const CATEGORY_IDS: CategoryId[] = ['tokoh', 'bangunan', 'peristiwa', 'budaya'];
export const CATEGORY_LABELS: CategoryLabel[] = ['Tokoh', 'Bangunan', 'Peristiwa', 'Budaya'];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}

