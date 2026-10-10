'use client';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-transparent border-t border-[var(--border-subtle)] py-10 sm:py-12 text-xs text-[var(--text-secondary)] text-center transition-colors duration-300">
      <div className="container-editorial max-w-4xl flex flex-col items-center">
        {/* Direct Horizontal Logo Row without Boxes */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
          {/* 1. Provinsi Banten */}
          <div
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105"
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

          {/* 2. Kemnaker RI */}
          <div
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105"
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

          {/* 3. Perpusda / DPK Banten */}
          <div
            className="flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105"
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

        {/* Dual-Theme REKALA Brand Logo Centered */}
        <div className="mt-8 mb-3 flex items-center justify-center">
          <Image
            src="/logo/logo-dark.png"
            alt="REKALA Logo"
            width={38}
            height={38}
            className="block dark:hidden object-contain"
          />
          <Image
            src="/logo/logo-light.png"
            alt="REKALA Logo"
            width={38}
            height={38}
            className="hidden dark:block object-contain"
          />
        </div>

        {/* Centered Footer Text Directly Below Logos */}
        <p className="font-sans text-xs text-[var(--text-secondary)]">
          © 2026 REKALA - Proyek OJT BBPVP Serang × DPK Banten
        </p>
      </div>
    </footer>
  );
}
