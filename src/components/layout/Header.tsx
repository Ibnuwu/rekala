'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MobileMenu } from './MobileMenu';
import { DesktopNav } from './DesktopNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-200">
      <div className="container-editorial flex items-center justify-between h-14 sm:h-16">
        {/* Left: Clean Standalone Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[var(--accent-gold)]"
          aria-label="REKALA — Beranda"
        >
          <Image
            src="/logo/logo-warna.png"
            alt="REKALA Logo"
            width={120}
            height={32}
            className="block dark:hidden h-7 w-auto object-contain"
            priority
          />
          <Image
            src="/logo/logo-putih.png"
            alt="REKALA Logo"
            width={120}
            height={32}
            className="hidden dark:block h-7 w-auto object-contain"
            priority
          />
          <span className="font-serif font-bold text-base sm:text-lg tracking-wider brand-logo-text leading-none text-zinc-900 dark:text-zinc-100">
            REKALA
          </span>
        </Link>

        {/* Right: Desktop Nav Items + Theme Switcher */}
        <div className="hidden lg:flex items-center gap-3.5">
          <DesktopNav />
          <ThemeToggle />
        </div>

        {/* Right: Mobile Controls (Theme Switcher + Mobile Menu) */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
