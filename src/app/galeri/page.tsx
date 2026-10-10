import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllArchives, getCategories } from '@/lib/archives';
import { GalleryClient } from '@/components/gallery/GalleryClient';

export const metadata: Metadata = {
  title: 'Galeri Foto Sejarah Banten — Peristiwa, Bangunan, Tokoh',
  description:
    'Telusuri koleksi lengkap dokumentasi foto sejarah Provinsi Banten berdasarkan kategori Peristiwa, Bangunan, dan Tokoh.',
  alternates: {
    canonical: '/galeri',
  },
};

export default async function GaleriPage() {
  const archives = await getAllArchives();
  const categories = await getCategories();

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen py-12 lg:py-20 transition-colors duration-300">
      <div className="container-editorial">
        {/* Header Title */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <span className="badge-gold">
            Koleksi Visual
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-title)] font-normal">
            Galeri Foto Sejarah
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
            Jelajahi rekaman visual sejarah Provinsi Banten yang dikurasi dalam empat kategori utama:
            <span className="text-[var(--accent-gold)] font-medium"> Peristiwa</span>,
            <span className="text-[var(--accent-gold)] font-medium"> Bangunan</span>,
            <span className="text-[var(--accent-gold)] font-medium"> Tokoh</span>, dan
            <span className="text-[var(--accent-gold)] font-medium"> Budaya</span>.
          </p>
        </div>

        {/* Gallery Interface */}
        <Suspense
          fallback={
            <div className="py-24 text-center text-[var(--text-secondary)] font-mono text-xs uppercase tracking-widest">
              Memuat galeri foto kearsipan...
            </div>
          }
        >
          <GalleryClient initialArchives={archives} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
