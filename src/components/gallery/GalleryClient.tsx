'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Archive, ArchiveCategory } from '@/data/archives';
import { CATEGORIES } from '@/data/categories';
import { isArchiveInCategory } from '@/lib/archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';

interface GalleryClientProps {
  initialArchives: Archive[];
  categories: ArchiveCategory[];
}

export function GalleryClient({ initialArchives, categories }: GalleryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getCategoryFromUrl = useCallback(() => {
    const categoryParam = searchParams.get('kategori')?.toLowerCase() || 'all';
    if (!categoryParam || categoryParam === 'all') return 'all';
    const matched = CATEGORIES.find(
      (c) => c.id.toLowerCase() === categoryParam || c.label.toLowerCase() === categoryParam
    );
    return matched ? matched.label : 'all';
  }, [searchParams]);

  const [selectedCategory, setSelectedCategory] = useState<string>(getCategoryFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'title-asc' | 'title-desc'>('default');

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedCategory(getCategoryFromUrl());
  }, [getCategoryFromUrl]);

  const handleCategoryChange = useCallback(
    (catLabel: string) => {
      setSelectedCategory(catLabel);

      const params = new URLSearchParams(searchParams.toString());

      if (catLabel === 'all') {
        params.delete('kategori');
      } else {
        const found = CATEGORIES.find(
          (c) => c.label.toLowerCase() === catLabel.toLowerCase() || c.id.toLowerCase() === catLabel.toLowerCase()
        );
        if (found) {
          params.set('kategori', found.id);
        }
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const filteredArchives = useMemo(() => {
    let list = [...initialArchives];

    if (selectedCategory !== 'all') {
      list = list.filter((item) => isArchiveInCategory(item.category, selectedCategory));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.year?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [initialArchives, selectedCategory, searchQuery, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || sortBy !== 'default';

  const resetFilters = () => {
    setSearchQuery('');
    handleCategoryChange('all');
    setSortBy('default');
  };

  return (
    <div className="space-y-8">
      {/* Modern Filter & Search Controls */}
      <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 shadow-sm">
        {/* Search Bar */}
        <div className="relative">
          <label htmlFor="search-archive" className="sr-only">
            Cari arsip foto
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-[var(--text-secondary)] pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              id="search-archive"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul, lokasi, tahun, atau peristiwa..."
              className="w-full pl-11 pr-10 py-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs & Sort Selection */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
          {/* Category Pills */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
            role="group"
            aria-label="Filter kategori arsip"
          >
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer touch-manipulation active:scale-95 ${
                selectedCategory === 'all'
                  ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-text-on)] shadow-sm'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
              }`}
            >
              Semua ({initialArchives.length})
            </button>

            {categories.map((cat) => {
              const count = initialArchives.filter((a) => isArchiveInCategory(a.category, cat)).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer touch-manipulation active:scale-95 ${
                    isSelected
                      ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-text-on)] shadow-sm'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <label htmlFor="sort-select" className="text-xs font-mono uppercase text-[var(--text-secondary)]">
              Urutan:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'default' | 'title-asc' | 'title-desc')}
              className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-xs py-1.5 px-3 focus:outline-none focus:border-[var(--accent-gold)] cursor-pointer touch-manipulation"
            >
              <option value="default">Pilihan Arsip</option>
              <option value="title-asc">Judul (A - Z)</option>
              <option value="title-desc">Judul (Z - A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Status */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] flex-wrap gap-2">
        <p>
          Menampilkan <span className="text-[var(--accent-gold)] font-semibold">{filteredArchives.length}</span> arsip
          {selectedCategory !== 'all' && <span> dalam kategori <strong className="text-[var(--text-title)]">&ldquo;{selectedCategory}&rdquo;</strong></span>}
          {searchQuery && <span> dengan kata kunci <strong className="text-[var(--text-title)]">&ldquo;{searchQuery}&rdquo;</strong></span>}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[var(--accent-gold)] hover:underline font-mono text-xs flex items-center gap-1.5 ml-auto cursor-pointer touch-manipulation active:scale-95"
          >
            <span>Reset Filter</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>

      {/* Grid of Archives */}
      {filteredArchives.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArchives.map((archive) => (
            <ArchiveCard key={archive.id} archive={archive} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-16 px-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-[var(--text-title)]">Tidak ada arsip yang cocok</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Tidak ditemukan dokumen foto yang sesuai. Coba gunakan kata kunci lain atau tampilkan seluruh arsip.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-ghost inline-flex items-center gap-2 mt-2 cursor-pointer"
          >
            Tampilkan Semua Arsip
          </button>
        </div>
      )}
    </div>
  );
}
