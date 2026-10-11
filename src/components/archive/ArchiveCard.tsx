'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Archive } from '@/data/archives';

interface ArchiveCardProps {
  archive: Archive;
  priority?: boolean;
  variant?: 'default' | 'featured';
}

export function ArchiveCard({ archive, priority = false, variant = 'default' }: ArchiveCardProps) {
  const isFeatured = variant === 'featured';
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden archive-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Archival Photo Frame Container with Solid Fallback */}
      <Link
        href={`/arsip/${archive.id}`}
        className="block relative overflow-hidden archive-placeholder-frame focus:outline-none border-b border-[var(--border-subtle)]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className={`relative ${isFeatured ? 'aspect-[16/10] sm:aspect-[4/3]' : 'aspect-[4/3]'} w-full overflow-hidden bg-[var(--image-placeholder-bg)]`}>
          {!imgError ? (
            <Image
              src={archive.image.src}
              alt={archive.image.alt}
              width={archive.image.width}
              height={archive.image.height}
              sizes={
                isFeatured
                  ? '(max-width: 768px) 100vw, 55vw'
                  : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              }
              className="object-cover object-center w-full h-full archive-image opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setImgError(true)}
            />
          ) : (
            /* Elegant dark/black archival placeholder fallback */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[var(--image-placeholder-bg)] text-[var(--text-muted)]">
              <div className="w-12 h-12 rounded-lg border border-[var(--border-medium)] flex items-center justify-center text-[var(--accent-gold)] mb-3 bg-[var(--bg-surface-elevated)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-[var(--accent-gold)] font-medium">
                Arsip Banten
              </span>
              <span className="text-[0.625rem] text-[var(--text-muted)] mt-1 font-mono">
                {archive.id}
              </span>
            </div>
          )}

          {/* Archival Soft Vignette Overlay */}
          {!imgError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
          )}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[0.625rem] font-mono font-bold uppercase tracking-wider bg-[var(--bg-surface-elevated)]/90 text-[var(--accent-gold)] border border-[var(--border-subtle)] backdrop-blur-sm truncate">
              {archive.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[0.5625rem] font-mono uppercase text-zinc-300 bg-black/60 backdrop-blur-sm border border-white/10 shrink-0">
              {archive.id}
            </span>
          </div>

          {/* Period/Year Tag on Bottom Right */}
          {archive.year && !imgError && (
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono text-zinc-200 bg-black/75 backdrop-blur-sm border border-white/10">
                {archive.year}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Body / Caption Layout */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 sm:gap-4">
        <div className="space-y-2">
          {archive.location && (
            <p className="text-[0.6875rem] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              {archive.location}
            </p>
          )}

          <h3 className={`font-serif font-medium leading-snug text-[var(--text-title)] group-hover:text-[var(--accent-gold)] transition-colors break-words ${isFeatured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
            }`}>
            <Link href={`/arsip/${archive.id}`} className="focus:outline-none">
              {archive.title}
            </Link>
          </h3>

          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-sans font-light">
            {archive.shortDescription}
          </p>
        </div>

        {/* Action Link & Archival Source Chip */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
          <Link
            href={`/arsip/${archive.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] transition-colors group/link shrink-0"
          >
            <span>Detail Sejarah</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover/link:translate-x-1"
              aria-hidden="true"
            >
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>

          <span className="text-[0.5625rem] font-mono text-[var(--text-muted)] uppercase truncate max-w-[50%]">
            Naskah Arsip Banten
          </span>
        </div>
      </div>
    </article>
  );
}
