import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedArchives, getCategoriesWithCounts } from '@/lib/archives';
import { ArchiveCard } from '@/components/archive/ArchiveCard';

export const metadata: Metadata = {
  title: 'REKALA — Layanan Arsip Digital Foto Sejarah Banten',
  description:
    'REKALA — Reka Waktu, Hidupkan Sejarah. Layanan arsip digital foto sejarah Provinsi Banten dengan kurasi modern dan akses interaktif kode QR.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const featured = await getFeaturedArchives();
  const categoryList = await getCategoriesWithCounts();

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen pt-14 transition-colors duration-300">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-3 pb-6 sm:pt-12 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-[var(--border-subtle)]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[var(--accent-gold)]/5 blur-[140px] pointer-events-none rounded-full" />

        <div className="container-editorial relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Typography & Intro */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center">
                <span className="badge-gold">
                  Layanan Arsip Digital
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

                {/* Subtitle: Standardized brand motto */}
                <p className="font-serif italic text-base sm:text-lg text-[var(--accent-gold)]">
                  REKALA — Reka Waktu, Hidupkan Sejarah.
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
              <Link
                href="/arsip/Arsip-05"
                className="group block relative rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--bg-surface)] archive-placeholder-frame hover:border-[var(--accent-gold)]/50 transition-all duration-500"
                aria-label="Lihat detail arsip Benteng Speelwijk (Tahun 1920)"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/archives/Arsip-05.jpg"
                    alt="Dokumentasi arsip sejarah Provinsi Banten — Benteng Speelwijk (Tampak 2 Buah Meriam), Tahun 1920"
                    width={1024}
                    height={768}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center w-full h-full opacity-95 group-hover:scale-[1.03] transition-transform duration-700 archive-image"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[0.625rem] font-mono text-[var(--accent-gold)] uppercase tracking-widest block">
                      Dokumen Pilihan &bull; Arsip-05
                    </span>
                    <p className="font-serif text-lg text-white font-medium group-hover:text-[var(--accent-gold)] transition-colors">
                      Benteng Speelwijk (Tampak 2 Buah Meriam)
                    </p>
                    <p className="text-xs text-zinc-300 font-sans">
                      Banten Lama &bull; Kemendikbudristek
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[0.625rem] font-mono text-zinc-200 bg-black/80 backdrop-blur-md border border-white/20 shrink-0">
                    Tahun 1920
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Minimalist Workflow Steps Bar ── */}
      <section className="py-4 sm:py-5 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] transition-colors duration-200">
        <div className="container-editorial">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* 3 Steps — Balanced, consistent spacing with subtle arrow dividers */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-6 w-full sm:w-auto flex-nowrap overflow-x-auto py-1 scrollbar-none">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[0.625rem] font-mono text-[var(--accent-gold)] flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                  Temukan QR
                </span>
              </div>

              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)] opacity-40 shrink-0" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[0.625rem] font-mono text-[var(--accent-gold)] flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                  Pindai
                </span>
              </div>

              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)] opacity-40 shrink-0" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[0.625rem] font-mono text-[var(--accent-gold)] flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                  Telusuri Arsip
                </span>
              </div>
            </div>

            <Link
              href="/panduan"
              className="text-xs font-mono uppercase text-[var(--accent-gold)] hover:underline inline-flex items-center gap-1 shrink-0 self-center sm:self-auto"
            >
              <span>Panduan Lengkap</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Telusuri Kategori (Peristiwa, Bangunan, Tokoh, Budaya) ── */}
      <section className="py-10 sm:py-16 lg:py-24 border-b border-[var(--border-subtle)]">
        <div className="container-editorial">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-12">
            <div>
              <span className="badge-gold mb-2 sm:mb-3">
                Klasifikasi Arsip
              </span>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[var(--text-title)] font-normal">
                Telusuri Berdasarkan Kategori
              </h2>
            </div>
            <Link
              href="/galeri"
              className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Semua Koleksi &rarr;
            </Link>
          </div>

          {/* Clean, compact 2-column grid on mobile (< sm), 4-column on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {categoryList.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/galeri?kategori=${cat.id}`}
                className="group p-3.5 sm:p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 hover:bg-[var(--bg-surface-elevated)] transition-all duration-300 flex flex-col justify-between gap-3 sm:gap-6 hover:-translate-y-1 shadow-sm touch-manipulation"
              >
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="hidden sm:inline font-mono text-[0.6875rem] sm:text-xs text-[var(--accent-gold)] font-bold tracking-widest">
                      0{idx + 1}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded text-[0.625rem] sm:text-[0.6875rem] font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] truncate">
                      {cat.count} Dokumen
                    </span>
                  </div>

                  <h3 className="font-serif text-sm sm:text-xl lg:text-2xl text-[var(--text-title)] group-hover:text-[var(--accent-gold)] transition-colors font-medium leading-tight">
                    {cat.label}
                  </h3>

                  <p className="hidden sm:block text-xs text-[var(--text-secondary)] leading-relaxed font-sans font-light">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-4 border-t border-[var(--border-subtle)] hidden sm:flex items-center justify-between text-[0.6875rem] sm:text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
                  <span>
                    <span className="inline sm:hidden">Buka</span>
                    <span className="hidden sm:inline">Buka Kategori</span>
                  </span>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1 shrink-0" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Koleksi Sorotan ── */}
      <section className="py-16 lg:py-24 bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)]">
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

      {/* ── Tentang REKALA Teaser ── */}
      <section className="py-16 lg:py-20 bg-white dark:bg-zinc-950/60 transition-colors duration-200">
        <div className="container-editorial max-w-3xl">
          <div className="relative rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden transition-colors duration-200">
            {/* Subtle ambient glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/5 dark:bg-amber-400/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 p-6 sm:p-8">
              {/* REKALA Logo with subtle rounded backdrop */}
              <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40 flex items-center justify-center transition-colors duration-200">
                <Image
                  src="/logo/logo-warna.png"
                  alt="Logo REKALA"
                  width={80}
                  height={80}
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <h2 className="font-serif text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100 font-normal transition-colors duration-200">
                  Tentang REKALA
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans font-light transition-colors duration-200">
                  REKALA — Reka Waktu, Hidupkan Sejarah.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs tracking-wider uppercase font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-amber-400 dark:text-zinc-950 dark:hover:bg-amber-300 transition-all duration-200 shadow-sm group"
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
