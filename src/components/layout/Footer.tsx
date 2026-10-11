'use client';

import Image from 'next/image';
import Link from 'next/link';

const FOOTER_NAV = [
  { href: '/', label: 'Beranda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/panduan', label: 'Panduan' },
  { href: '/about', label: 'Tentang' },
];

const PARTNERS = [
  {
    src: '/logo/banten-logo.png',
    alt: 'Pemerintah Provinsi Banten',
    title: 'Pemerintah Provinsi Banten',
  },
  {
    src: '/logo/kemnaker-logo.png',
    alt: 'Kementerian Ketenagakerjaan RI',
    title: 'Kemnaker RI',
  },
  {
    src: '/logo/perpusda-logo.png',
    alt: 'Dinas Perpustakaan dan Kearsipan Provinsi Banten',
    title: 'DPK Banten',
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-100/80 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-10 px-4 sm:px-8 transition-colors duration-200">
      <div className="container-editorial max-w-6xl">
        {/* ── Top Tier: Brand & Partners ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo/logo-warna.png"
              alt="Logo REKALA"
              width={120}
              height={40}
              className="h-9 sm:h-10 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-serif font-bold text-base sm:text-lg tracking-wider text-zinc-900 dark:text-zinc-100 leading-none transition-colors duration-200">
                REKALA
              </span>
              <span className="text-[0.6875rem] text-zinc-500 dark:text-zinc-500 font-sans leading-snug">
                Merangkai jejak waktu, menghidupkan sejarah Banten.
              </span>
            </div>
          </div>

          {/* Right: Partner Logos */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <span className="text-[0.625rem] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
              Kolaborasi Kearsipan:
            </span>
            <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
              {PARTNERS.map((partner) => (
                <div
                  key={partner.src}
                  className="flex items-center justify-center shrink-0"
                  title={partner.title}
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={120}
                    height={36}
                    className="h-7 sm:h-8 w-auto object-contain grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 my-6" />

        {/* ── Bottom Tier: Copyright & Links ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Copyright */}
          <p className="text-xs text-zinc-500 dark:text-zinc-500 font-sans">
            © 2026 REKALA — Proyek OJT BBPVP Serang × DPK Banten
          </p>

          {/* Right: Quick Nav + Scroll to Top */}
          <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
            {FOOTER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={scrollToTop}
              className="text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-200 font-medium inline-flex items-center gap-1 cursor-pointer"
              aria-label="Kembali ke atas halaman"
            >
              Ke Atas
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
