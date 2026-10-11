'use client';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-transparent border-t border-zinc-800/80 py-8 px-4 text-xs text-[var(--text-secondary)] text-center transition-colors duration-300">
      <div className="container-editorial max-w-4xl flex flex-col items-center">
        {/* Horizontal Logo Row — All 4 logos in a single row */}
        <div className="flex items-center justify-center gap-6 flex-nowrap">
          {/* REKALA Brand Logo */}
          <div
            className="flex items-center justify-center opacity-85 hover:opacity-100 transition-all duration-300 hover:scale-105 shrink-0"
            title="REKALA"
          >
            <Image
              src="/logo/logo-warna.png"
              alt="Logo REKALA"
              width={120}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>

          {/* Provinsi Banten */}
          <div
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105 shrink-0"
            title="Pemerintah Provinsi Banten"
          >
            <Image
              src="/logo/banten-logo.png"
              alt="Logo Pemerintah Provinsi Banten"
              width={120}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain footer-logo-adaptive"
            />
          </div>

          {/* Kemnaker RI */}
          <div
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105 shrink-0"
            title="Kementerian Ketenagakerjaan RI"
          >
            <Image
              src="/logo/kemnaker-logo.png"
              alt="Logo Kemnaker RI"
              width={120}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain footer-logo-adaptive"
            />
          </div>

          {/* Perpusda / DPK Banten */}
          <div
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105 shrink-0"
            title="Dinas Perpustakaan dan Kearsipan Provinsi Banten"
          >
            <Image
              src="/logo/perpusda-logo.png"
              alt="Logo Perpusda / DPK Banten"
              width={120}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain footer-logo-adaptive"
            />
          </div>
        </div>

        {/* Copyright Line */}
        <p className="mt-6 font-sans text-xs text-[var(--text-secondary)]">
          © 2026 REKALA — Proyek OJT BBPVP Serang × DPK Banten
        </p>
      </div>
    </footer>
  );
}
