'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Archive } from '@/data/archives';
import { ArchiveSticker } from './ArchiveSticker';
import { downloadStickerPNG } from '@/lib/stickerExport';

interface ShareModalProps {
  archive: Archive;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ archive, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const shareUrl = `https://rekala-banten.vercel.app/arsip/${archive.id}`;

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Exports the entire sticker card (Header + QR Code + ID Footer) as a high-DPI image canvas
  const handleDownloadSticker = async () => {
    try {
      setIsDownloading(true);
      const canvas = document.getElementById(`modal-sticker-qr-${archive.id}`) as HTMLCanvasElement | null;
      await downloadStickerPNG(archive, canvas);
    } catch (err) {
      console.error('Failed to export sticker PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    let success = false;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        success = true;
      }
    } catch {
      // Fallback below
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        // Ignored
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-zinc-900 dark:text-zinc-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 id="share-modal-title" className="font-serif text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Stiker QR & Bagikan Arsip
            </h2>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-[250px] sm:max-w-[320px]">
              {archive.id} &bull; {archive.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Tutup modal bagikan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Vertical Sticker Layout Structure */}
        <div className="py-1">
          <ArchiveSticker
            archive={archive}
            variant="modal"
            qrSize={200}
            canvasIdPrefix="modal-sticker-qr"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Button 1: Download Sticker PNG (Full Card: Header + QR + Footer) */}
          <button
            type="button"
            onClick={handleDownloadSticker}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-zinc-950 transition-colors shadow-xs cursor-pointer disabled:opacity-70"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isDownloading ? 'Menyiapkan Kanvas...' : 'Unduh Stiker (PNG)'}</span>
          </button>

          {/* Button 2: Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
            }`}
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-semibold">Tautan Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Salin Tautan</span>
              </>
            )}
          </button>

          {/* Button 3: Link to Bulk Sticker Exporter */}
          <div className="pt-2 text-center border-t border-zinc-100 dark:border-zinc-800/80">
            <Link
              href="/admin/stickers"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Buka Lembar Cetak Stiker Massal (Semua 21 Arsip)</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
