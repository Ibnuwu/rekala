'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'BERANDA',
    subtitle: 'Halaman Utama',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/galeri',
    label: 'GALERI ARSIP',
    subtitle: 'Koleksi Foto Sejarah',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    href: '/panduan',
    label: 'PANDUAN',
    subtitle: 'Petunjuk Pemindaian',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'TENTANG',
    subtitle: 'Filosofi & Tim',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/scan',
    label: 'PINDAI QR',
    subtitle: 'Akses Cepat Arsip',
    isSpecial: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
      </svg>
    ),
  },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      toggleBtnRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
    toggleBtnRef.current?.focus();
  };

  const menuDrawer = isOpen && mounted ? (
    createPortal(
      <>
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 z-[99998] bg-black/40 dark:bg-black/75 backdrop-blur-sm transition-opacity duration-200"
          onClick={closeMenu}
          aria-hidden="true"
          style={{
            animation: 'mobile-drawer-fade-in 0.2s ease-out forwards',
          }}
        />

        {/* Slide-over drawer panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Mobile"
          className="fixed inset-y-0 right-0 z-[99999] w-[min(320px,85vw)] flex flex-col overflow-hidden bg-stone-50/95 dark:bg-zinc-950/95 backdrop-blur-md border-l border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xl transition-colors duration-200"
          style={{
            animation: 'mobile-drawer-slide-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none"
              aria-label="REKALA — Beranda"
            >
              <Image
                src="/logo/logo-warna.png"
                alt="REKALA Logo"
                width={120}
                height={32}
                className="object-contain block dark:hidden h-7 w-auto"
              />
              <Image
                src="/logo/logo-putih.png"
                alt="REKALA Logo"
                width={120}
                height={32}
                className="object-contain hidden dark:block h-7 w-auto"
              />
              <span className="font-serif font-bold text-base tracking-[0.2em] text-zinc-900 dark:text-zinc-100 leading-none">
                REKALA
              </span>
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-900/60 active:scale-95 transition-all cursor-pointer touch-manipulation focus:outline-none"
              aria-label="Tutup menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Separator */}
          <div className="mx-5 h-px bg-zinc-200/80 dark:bg-zinc-800/80" />

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto px-4 py-5 overscroll-contain" aria-label="Menu Mobile">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`
                      group flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-150 cursor-pointer touch-manipulation min-h-[48px]
                      ${
                        item.isSpecial
                          ? isActive
                            ? 'bg-amber-500/20 dark:bg-amber-400/20 text-amber-900 dark:text-amber-200 border border-amber-500 dark:border-amber-400 font-semibold shadow-xs ring-1 ring-amber-500/30'
                            : 'bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/30 font-medium'
                          : isActive
                          ? 'bg-amber-500/10 dark:bg-amber-400/15 text-amber-900 dark:text-amber-300 font-semibold border border-amber-500/30 dark:border-amber-400/30 shadow-xs'
                          : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-white/[0.04]'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Icon */}
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        ${
                          item.isSpecial
                            ? 'bg-amber-600 dark:bg-amber-400 text-white dark:text-zinc-950'
                            : isActive
                            ? 'bg-amber-500/20 dark:bg-amber-400/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-200/60 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'
                        }
                      `}
                    >
                      {item.icon}
                    </div>

                    {/* Label & Subtitle */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[0.8125rem] tracking-[0.08em] leading-none ${item.isSpecial || isActive ? 'font-semibold' : 'font-medium'}`}>
                          {item.label}
                        </span>
                        {item.isSpecial && (
                          <span className="px-1.5 py-0.5 rounded text-[0.5rem] font-mono font-bold tracking-wider bg-amber-600 dark:bg-amber-400 text-white dark:text-zinc-950 uppercase leading-none">
                            SCAN
                          </span>
                        )}
                      </div>
                      <p className="text-[0.6875rem] text-zinc-500 dark:text-zinc-500 mt-1 leading-none font-sans">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Separator */}
          <div className="mx-5 h-px bg-zinc-200/80 dark:bg-zinc-800/80" />

          {/* Drawer Footer */}
          <div className="px-5 py-4 text-center shrink-0">
            <p className="text-[0.625rem] text-zinc-500 dark:text-zinc-500 font-sans tracking-wide">
              © 2026 REKALA — Proyek OJT BBPVP Serang
            </p>
          </div>
        </div>
      </>,
      document.body
    )
  ) : null;

  return (
    <div className="lg:hidden">
      {/* High-contrast mobile menu icon button */}
      <button
        ref={toggleBtnRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka navigasi'}
        className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm hover:border-amber-500/50 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer touch-manipulation select-none flex items-center justify-center"
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        )}
      </button>

      {menuDrawer}
    </div>
  );
}
