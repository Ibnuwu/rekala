'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/galeri', label: 'Galeri Arsip' },
  { href: '/panduan', label: 'Panduan' },
  { href: '/about', label: 'Tentang' },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-900/90 p-1 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
      aria-label="Navigasi utama"
    >
      {NAV_LINKS.map((link) => {
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              relative px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-200 inline-flex items-center gap-1.5
              ${
                isActive
                  ? 'bg-amber-500/15 dark:bg-amber-400/15 text-amber-800 dark:text-amber-300 font-semibold shadow-xs border border-amber-500/30 dark:border-amber-400/30 ring-1 ring-amber-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)] shrink-0" />
            )}
            <span>{link.label}</span>
          </Link>
        );
      })}

      {/* Gold QR CTA */}
      <Link
        href="/scan"
        className={`
          inline-flex items-center gap-1.5 ml-1 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 shadow-sm
          ${
            pathname === '/scan'
              ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-text-on)] ring-2 ring-[var(--accent-gold)]/50'
              : 'bg-[var(--accent-gold)] text-[var(--accent-gold-text-on)] hover:bg-[var(--accent-gold-hover)] hover:shadow-[0_0_15px_var(--accent-gold-glow)]'
          }
        `}
        aria-current={pathname === '/scan' ? 'page' : undefined}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
        </svg>
        <span>Pindai QR</span>
      </Link>
    </nav>
  );
}
