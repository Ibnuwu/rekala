'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Beranda',
    subtitle: 'Halaman Utama & Koleksi Sorotan',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/galeri',
    label: 'Galeri Arsip',
    subtitle: 'Koleksi Foto Sejarah Banten',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    href: '/scan',
    label: 'Pindai QR',
    subtitle: 'Kamera Akses Cepat Koleksi Arsip',
    isSpecial: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
      </svg>
    ),
  },
  {
    href: '/panduan',
    label: 'Panduan Pengunjung',
    subtitle: 'Petunjuk Pemindaian & Akses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'Tentang REKALA',
    subtitle: 'Filosofi Nama, Tim & Kolaborasi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu Navigasi Mobile"
        className="fixed inset-0 z-[99999] pointer-events-auto flex flex-col bg-[var(--bg-overlay)] text-[var(--text-primary)] backdrop-blur-2xl animate-in fade-in duration-200 overflow-hidden"
        style={{ width: '100vw', height: '100dvh' }}
      >
        {/* Top Header inside Drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface-elevated)]/90">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="REKALA — Beranda"
          >
            <Image
              src="/logo/logo-dark.png"
              alt="REKALA Logo"
              width={28}
              height={28}
              className="block dark:hidden object-contain"
            />
            <Image
              src="/logo/logo-light.png"
              alt="REKALA Logo"
              width={28}
              height={28}
              className="hidden dark:block object-contain"
            />
            <span className="font-serif font-bold text-lg tracking-wider brand-logo-text leading-none">
              REKALA
            </span>
          </Link>

          {/* Minimal Close Button */}
          <button
            type="button"
            onClick={closeMenu}
            className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-95 transition-all cursor-pointer touch-manipulation"
            aria-label="Tutup menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2 overscroll-contain">
          <nav className="space-y-2.5" aria-label="Menu Mobile">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`
                    group relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer touch-manipulation
                    ${
                      item.isSpecial
                        ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)]/40 text-[var(--text-primary)]'
                        : isActive
                        ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent-gold)]/60 text-[var(--accent-gold)] font-medium shadow-xs'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`
                        w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                        ${
                          item.isSpecial
                            ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-text-on)]'
                            : isActive
                            ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]'
                            : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
                        }
                      `}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base leading-tight">
                          {item.label}
                        </span>
                        {item.isSpecial && (
                          <span className="px-1.5 py-0.5 rounded text-[0.5625rem] font-mono font-bold tracking-wider bg-[var(--accent-gold)] text-[var(--accent-gold-text-on)] uppercase">
                            Scanner
                          </span>
                        )}
                      </div>
                      <p className="text-[0.6875rem] text-[var(--text-secondary)] mt-0.5 line-clamp-1 font-sans">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] shrink-0 ml-2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Minimal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/90 text-center text-xs text-[var(--text-secondary)] font-sans shrink-0">
          © 2026 REKALA - Proyek OJT BBPVP Serang × DPK Banten
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <div className="lg:hidden">
      {/* Minimal Icon Button for Mobile Toggle */}
      <button
        ref={toggleBtnRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka navigasi'}
        className="w-9 h-9 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-gold)] active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[var(--accent-gold)] cursor-pointer touch-manipulation select-none"
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

