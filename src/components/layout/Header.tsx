'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MobileMenu } from './MobileMenu';
import { DesktopNav } from './DesktopNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--header-bg)] border-b border-[var(--border-subtle)] transition-colors duration-300">
      <div className="container-editorial flex items-center justify-between h-16 sm:h-[68px]">
        {/* Left: Clean Standalone Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-[var(--accent-gold)]"
          aria-label="REKALA — Beranda"
        >
          <Image
            src="/logo/logo-dark.png"
            alt="REKALA Logo"
            width={28}
            height={28}
            className="block dark:hidden object-contain"
            priority
          />
          <Image
            src="/logo/logo-light.png"
            alt="REKALA Logo"
            width={28}
            height={28}
            className="hidden dark:block object-contain"
            priority
          />
          <span className="font-serif font-bold text-lg sm:text-xl tracking-wider brand-logo-text leading-none">
            REKALA
          </span>
        </Link>

        {/* Right: Desktop Nav Items + Theme Switcher + Language Pill */}
        <div className="hidden lg:flex items-center gap-3.5">
          <DesktopNav />
          <ThemeToggle />
          <div className="flex items-center gap-1.5 text-[0.6875rem] font-mono text-[var(--text-secondary)] px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
            <span className="text-[var(--accent-gold)] font-bold">ID</span>
            <span className="opacity-40">|</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">EN</span>
          </div>
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
