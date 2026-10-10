import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedArchives, getCategoriesWithCounts } from '@/lib/archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';

export const metadata: Metadata = {
  title: 'REKALA — Layanan Arsip Digital Foto Sejarah Banten',
  description:
    'REKALA - Reka Waktu, Hidupkan Sejarah. Layanan arsip digital foto sejarah Provinsi Banten dengan kurasi modern dan akses interaktif kode QR.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const featured = await getFeaturedArchives();
  const categoryList = await getCategoriesWithCounts();

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen transition-colors duration-300">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[var(--border-subtle)]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[var(--accent-gold)]/5 blur-[140px] pointer-events-none rounded-full" />

        <div className="container-editorial relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Typography & Intro */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="badge-gold">
                  Layanan Arsip Digital
                </span>
                <span className="text-xs font-mono text-[var(--accent-gold)]">
                  DPK Banten
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[var(--text-title)] leading-[1.15]">
                  Arsip Digital Foto
                  <br />
                  <span className="italic font-light opacity-90">
                    Sejarah Banten
                  </span>
                </h1>

                {/* Subtitle: EXACT tagline only placed here & About page */}
                <p className="font-serif italic text-base sm:text-lg text-[var(--accent-gold)]">
                  REKALA - Reka Waktu, Hidupkan Sejarah.
                </p>
              </div>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl font-sans font-light">
                Menghubungkan foto-foto bersejarah Provinsi Banten dengan informasi autentik melalui pemindaian QR Code.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link href="/scan" className="btn btn-gold btn-stack-mobile">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                  </svg>
                  <span>Mulai Pindai QR</span>
                </Link>

                <Link href="/galeri" className="btn btn-ghost btn-stack-mobile">
                  <span>Jelajahi Galeri</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: Archival Hero Visual Frame */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--bg-surface)] archive-placeholder-frame">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/archives/Arsip-07.jpg"
                    alt="Dokumentasi arsip sejarah Provinsi Banten — Benteng Speelwijk"
                    width={1024}
                    height={768}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center w-full h-full opacity-95 hover:scale-[1.03] transition-transform duration-700 archive-image"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[0.625rem] font-mono text-[var(--accent-gold)] uppercase tracking-widest block">
                      Dokumen Pilihan
                    </span>
                    <p className="font-serif text-lg text-white font-medium">
                      Benteng Speelwijk (Nampak 2 Buah Meriam)
                    </p>
                    <p className="text-xs text-zinc-300 font-sans">
                      Naskah Arsip Banten
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[0.625rem] font-mono text-zinc-200 bg-black/80 backdrop-blur-md border border-white/20 shrink-0">
                    Tahun 1920
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── "Cara Kerja" Section (3 simple horizontal steps) ── */}
      <section className="py-8 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)]">
        <div className="container-editorial">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
              <span className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--accent-gold)] font-semibold">
                Cara Kerja:
              </span>
            </div>

            {/* 3 Simple Horizontal Steps */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-sans text-[var(--text-primary)]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent-gold)] flex items-center justify-center font-bold">1</span>
                <span className="font-medium">Temukan QR</span>
              </div>
              <span className="text-[var(--text-muted)] hidden sm:inline">&bull;</span>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent-gold)] flex items-center justify-center font-bold">2</span>
                <span className="font-medium">Pindai</span>
              </div>
              <span className="text-[var(--text-muted)] hidden sm:inline">&bull;</span>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent-gold)] flex items-center justify-center font-bold">3</span>
                <span className="font-medium">Baca Sejarah</span>
              </div>
            </div>

            <Link href="/panduan" className="text-xs font-mono uppercase text-[var(--accent-gold)] hover:underline self-start lg:self-auto shrink-0">
              Panduan Lengkap &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Telusuri Kategori (Peristiwa, Bangunan, Tokoh, Budaya) ── */}
      <section className="py-16 lg:py-24 border-b border-[var(--border-subtle)]">
        <div className="container-editorial">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="badge-gold mb-3">
                Klasifikasi Arsip
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">
                Telusuri Berdasarkan Kategori
              </h2>
            </div>
            <Link
              href="/galeri"
              className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] hover:underline inline-flex items-center gap-1.5"
            >
              Semua Koleksi &rarr;
            </Link>
          </div>

          {/* Modern Responsive Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryList.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/galeri?kategori=${cat.id}`}
                className="group p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 hover:bg-[var(--bg-surface-elevated)] transition-all duration-300 flex flex-col justify-between gap-6 hover:-translate-y-1 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[var(--accent-gold)] font-bold tracking-widest">
                      0{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[0.6875rem] font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                      {cat.count} Dokumen
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-title)] group-hover:text-[var(--accent-gold)] transition-colors font-medium">
                    {cat.label}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans font-light">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
                  <span>Buka Kategori</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Koleksi Sorotan ── */}
      <section className="py-16 lg:py-24 bg-[var(--bg-surface-subtle)]">
        <div className="container-editorial">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="badge-gold mb-3">
                Kurasi Pilihan
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">
                Koleksi Sorotan
              </h2>
            </div>
            <Link
              href="/galeri"
              className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] hover:underline inline-flex items-center gap-1.5"
            >
              Lihat Semua Arsip &rarr;
            </Link>
          </div>

          {/* Grid of Highlighted Archival Photo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featured.slice(0, 6).map((archive, i) => (
              <ArchiveCard key={archive.id} archive={archive} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Ambient CTA ── */}
      <section className="py-20 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)]">
        <div className="container-editorial text-center max-w-2xl space-y-6">
          <span className="badge-gold">
            Eksplorasi Arsip
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-title)] font-normal">
            Pindai &amp; Pelajari Sejarah Banten
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Dapatkan informasi mendalam dengan memindai kode QR pada setiap bingkai foto arsip digital Banten.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/scan" className="btn btn-gold w-full sm:w-auto">
              Buka Pemindai QR
            </Link>
            <Link href="/galeri" className="btn btn-ghost w-full sm:w-auto">
              Telusuri Galeri
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
