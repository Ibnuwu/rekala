'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Archive } from '@/data/archives';
import { ShareModal } from '@/components/archive/ShareModal';

interface ArchiveViewerProps {
  archive: Archive;
}

export function ArchiveViewer({ archive }: ArchiveViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="space-y-0">
      {/* ── Archival Photo Container (Natural Borderless Span & Sleek Corner Overlay) ── */}
      <div
        onClick={() => !imgError && setIsOpen(true)}
        className={`relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-900/5 dark:bg-zinc-900/40 group transition-all duration-300 ${
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
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-[1.02] transition-transform duration-500 archive-image"
              onError={() => setImgError(true)}
            />

            {/* Sleek Overlay Action Buttons in Corner */}
            <div
              className="absolute bottom-3 right-3 flex items-center gap-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareOpen(true);
                }}
                className="backdrop-blur-md bg-black/60 text-white p-2 sm:px-3 sm:py-1.5 rounded-full border border-white/10 hover:bg-black/80 transition-all text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer touch-manipulation"
                title="Buka opsi bagikan dan kode QR"
                aria-label="Bagikan arsip"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-300">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">Bagikan</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!imgError) setIsOpen(true);
                }}
                className="backdrop-blur-md bg-black/60 text-white p-2 sm:px-3 sm:py-1.5 rounded-full border border-white/10 hover:bg-black/80 transition-all text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer touch-manipulation"
                title="Buka penampil ukuran penuh"
                aria-label="Perbesar foto"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-300">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">Zoom</span>
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-transparent sm:bg-white dark:bg-zinc-900/45 text-zinc-500 dark:text-zinc-400 rounded-xl sm:rounded-2xl border-0 border-none dark:border dark:border-zinc-800/80">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 mb-3 bg-zinc-100 dark:bg-zinc-800">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              Naskah Arsip Banten
            </span>
            <span className="text-[0.6875rem] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
              {archive.id}
            </span>
          </div>
        )}
      </div>

      {/* ── Share & QR Code Modal ── */}
      <ShareModal
        archive={archive}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* ── Lightbox Modal ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto arsip"
          onClick={() => setIsOpen(false)}
        >
          {/* Lightbox Topbar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-zinc-300 py-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                {archive.id}
              </span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-xs text-zinc-400 font-mono">
                {archive.category}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-zinc-300 hover:text-white p-2 rounded-lg bg-zinc-900/80 border border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Tutup jendela zoom"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Full Image Canvas */}
          <div className="relative max-w-5xl max-h-[75vh] w-full flex-1 flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
            <Image
              src={archive.image.src}
              alt={archive.image.alt}
              width={archive.image.width}
              height={archive.image.height}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Lightbox Caption Card */}
          <div className="w-full max-w-xl text-center p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 space-y-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-sm sm:text-base text-white font-medium">{archive.title}</p>
            <p className="font-mono text-[0.6875rem] text-zinc-400">
              {[archive.year && `Tahun ${archive.year}`, archive.location, archive.category].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
