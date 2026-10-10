'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Archive } from '@/data/archives';

interface ArchiveViewerProps {
  archive: Archive;
}

export function ArchiveViewer({ archive }: ArchiveViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${archive.title} — REKALA`,
          text: archive.shortDescription,
          url,
        });
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

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
          aria-label="Perbesar foto arsip"
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

              {/* Zoom Overlay Prompt */}
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 pointer-events-none group-hover:border-[var(--accent-gold)] group-hover:text-[var(--accent-gold)] transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <span className="font-mono text-[0.6875rem]">Perbesar</span>
              </div>
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

        {/* Action Caption Strip */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)] text-xs">
          <span className="text-[var(--text-secondary)] font-mono text-[0.6875rem] truncate max-w-[60%]">
            {archive.image.alt}
          </span>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-[var(--text-primary)] hover:text-[var(--accent-gold)] flex items-center gap-1.5 transition-colors font-medium text-xs cursor-pointer"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              <span>Layar Penuh</span>
            </button>

            <span className="text-[var(--border-medium)]">|</span>

            <button
              type="button"
              onClick={handleShare}
              className="text-[var(--text-primary)] hover:text-[var(--accent-gold)] flex items-center gap-1.5 transition-colors font-medium text-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-emerald-500 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>
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
