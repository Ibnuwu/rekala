'use client';

import Link from 'next/link';
import { MobileMenu } from './MobileMenu';
import { DesktopNav } from './DesktopNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--header-bg)] border-b border-[var(--border-subtle)] transition-colors duration-300">
      <div className="container-editorial flex items-center justify-between h-16 sm:h-[68px]">
        {/* Left: Clean Standalone Brand Logo (No DPK sub-branding attached) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[var(--accent-gold)]"
          aria-label="REKALA — Beranda"
        >
          {/* Adaptive Minimalist Archival Stamp Icon */}
          <div className="w-8 h-8 rounded-lg brand-logo-stamp flex items-center justify-center group-hover:border-[var(--accent-gold)] transition-all">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h10M7 12h7M7 17h10" />
            </svg>
          </div>

          <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.18em] brand-logo-text leading-none">
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
