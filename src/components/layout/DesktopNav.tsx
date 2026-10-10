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
      className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-full border border-[var(--border-subtle)]"
      aria-label="Navigasi utama"
    >
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              relative px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-200
              ${
                isActive
                  ? 'bg-[var(--bg-surface)] text-[var(--accent-gold)] shadow-xs border border-[var(--border-medium)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/50'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
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
