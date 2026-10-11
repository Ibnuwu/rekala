'use client';

import Image from 'next/image';
import Link from 'next/link';

const FOOTER_NAV = [
  { href: '/', label: 'Beranda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/panduan', label: 'Panduan' },
  { href: '/about', label: 'Tentang' },
];

const INSTITUTIONAL_LOGOS = [
  {
    src: '/logo/logo-warna.png',
    alt: 'Logo REKALA',
    title: 'REKALA',
  },
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
    <footer className="bg-stone-100/80 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="container-editorial max-w-4xl flex flex-col items-center text-center gap-6 p-6 sm:py-10 sm:px-8">
        {/* 1. Brand Header: REKALA logo + title + short tagline */}
        <div className="flex flex-col items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group focus:outline-none"
            aria-label="REKALA Beranda"
          >
            <Image
              src="/logo/logo-warna.png"
              alt="Logo REKALA"
              width={40}
              height={40}
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-serif font-bold text-lg sm:text-xl tracking-wider text-zinc-900 dark:text-zinc-100 leading-none">
              REKALA
            </span>
          </Link>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans max-w-sm leading-relaxed">
            Merangkai jejak waktu, menghidupkan sejarah Banten.
          </p>
        </div>

        {/* 2. Partner Logos Grid: Display all 4 institutional logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-1">
          {INSTITUTIONAL_LOGOS.map((logo) => (
            <div
              key={logo.src}
              className="flex items-center justify-center shrink-0"
              title={logo.title}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={36}
                className="h-7 sm:h-8 w-auto object-contain grayscale hover:grayscale-0 dark:brightness-105 opacity-80 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* 3. Separator */}
        <div className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 my-2" />

        {/* 4. Copyright & Nav Links */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
            © 2026 REKALA — Proyek OJT BBPVP Serang × DPK Banten
          </p>

          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {FOOTER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={scrollToTop}
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 font-medium inline-flex items-center gap-1 cursor-pointer"
              aria-label="Kembali ke atas halaman"
            >
              <span>Ke Atas</span>
              <span aria-hidden="true">&uarr;</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
