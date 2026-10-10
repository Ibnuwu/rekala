'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Archive } from '@/data/archives';

interface ArchiveViewerProps {
  archive: Archive;
}

export function ArchiveViewer({ archive }: ArchiveViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      {/* Archival Photo Card Frame Container with Solid Fallback */}
      <div className="relative group rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg">
        <div
          onClick={() => !imgError && setIsOpen(true)}
          className={`relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden archive-placeholder-frame flex items-center justify-center bg-[var(--image-placeholder-bg)] ${
            !imgError ? 'cursor-zoom-in' : ''
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => !imgError && (e.key === 'Enter' || e.key === ' ') && setIsOpen(true)}
          aria-label="Lihat foto arsip ukuran penuh"
        >
          {!imgError ? (
            <>
              <Image
                src={archive.image.src}
                alt={archive.image.alt}
                width={archive.image.width}
                height={archive.image.height}
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="w-full h-full object-contain sm:object-cover opacity-95 group-hover:scale-[1.02] transition-transform duration-500 archive-image"
                onError={() => setImgError(true)}
              />

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[var(--image-placeholder-bg)] text-[var(--text-muted)]">
              <div className="w-16 h-16 rounded-xl border border-[var(--border-medium)] flex items-center justify-center text-[var(--accent-gold)] mb-3 bg-[var(--bg-surface-elevated)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-gold)] font-medium">
                Naskah Arsip Banten
              </span>
              <span className="text-[0.6875rem] text-[var(--text-muted)] mt-1 font-mono">
                {archive.id}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto arsip"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 z-50 text-zinc-300 hover:text-white p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Full Image */}
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <Image
              src={archive.image.src}
              alt={archive.image.alt}
              width={archive.image.width}
              height={archive.image.height}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="text-center text-zinc-300 text-xs mt-4 max-w-xl space-y-1">
            <p className="font-serif text-sm text-white font-medium">{archive.title}</p>
            <p className="font-mono text-[0.6875rem] text-zinc-400">{[archive.year, archive.location, archive.category].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
      )}
    </>
  );
}
