'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { archives } from '@/data/archives';
import { ArchiveSticker } from '@/components/archive/ArchiveSticker';
import { downloadAllStickersZip } from '@/lib/stickerExport';

// Group archives into chunks of 9 stickers (3 columns x 3 rows) per standard A4 sheet
const STICKERS_PER_PAGE = 9;

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export default function AdminStickersPage() {
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState({ current: 0, total: archives.length });
  const [viewMode, setViewMode] = useState<'a4' | 'grid'>('a4');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(archives.map((a) => a.category)))];

  const filteredArchives =
    selectedCategory === 'all'
      ? archives
      : archives.filter((a) => a.category === selectedCategory);

  const sheets = chunkArray(filteredArchives, STICKERS_PER_PAGE);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      setZipProgress({ current: 0, total: filteredArchives.length });
      await downloadAllStickersZip(filteredArchives, (current, total) => {
        setZipProgress({ current, total });
      });
    } catch (err) {
      console.error('Failed to export ZIP:', err);
      alert('Terjadi kesalahan saat mengekspor ZIP stiker.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 print:bg-white print:text-black py-6 sm:py-10 print:py-0 transition-colors">
      {/* ── Top Header & Actions Bar (Hidden during print) ── */}
      <header className="no-print max-w-5xl mx-auto px-4 mb-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/arsip" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Koleksi Arsip
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-semibold">Admin Stiker QR</span>
        </div>

        {/* Title and Controls Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 sm:p-6 space-y-5 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800/60">
                  Tool Internal
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {filteredArchives.length} Stiker Terpilih
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
                Lembar Cetak Stiker QR Arsip REKALA
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
                Format stiker vertikal kompak (~3:4) siap cetak ukuran standar A4 dengan crop marks
                dan QR code resolusi tinggi (Tingkat Koreksi Kesalahan &apos;H&apos;).
              </p>
            </div>

            {/* Action Buttons (Clean SVG icons without emojis) */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Button 1: Print / PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 active:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-white shadow-sm transition-all cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Cetak / Simpan PDF (Semua)</span>
              </button>

              {/* Button 2: Download All PNG as ZIP */}
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-zinc-950 shadow-sm transition-all cursor-pointer disabled:opacity-70"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>
                  {isZipping
                    ? `Mengekspor ZIP (${zipProgress.current}/${zipProgress.total})...`
                    : 'Download Semua PNG (.ZIP)'}
                </span>
              </button>
            </div>
          </div>

          {/* Filtering and View Options */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Kategori:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-stone-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              >
                <option value="all">Semua Kategori ({archives.length})</option>
                {categories
                  .filter((cat) => cat !== 'all')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({archives.filter((a) => a.category === cat).length})
                    </option>
                  ))}
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
              <button
                type="button"
                onClick={() => setViewMode('a4')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'a4'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Simulasi Lembar A4 (9 / lembar)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Kisi Kontinu (Semua)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sticker Canvas / Print Sheet Section (Always pure white ink-friendly paper) ── */}
      <main className="max-w-[210mm] mx-auto px-4 print:px-0">
        {viewMode === 'a4' ? (
          // A4 Paginated Sheets
          sheets.map((sheetArchives, sheetIdx) => (
            <div key={`sheet-${sheetIdx}`} className="mb-10 print:mb-0">
              {/* Sheet Indicator Header (Screen only) */}
              <div className="no-print flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2 px-1">
                <span className="font-mono font-medium">
                  Lembar A4 {sheetIdx + 1} dari {sheets.length}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  {sheetArchives.length} stiker pada lembar ini
                </span>
              </div>

              {/* Standard A4 Paper Canvas: Pure clean white for printing & export */}
              <div className="page-break bg-white text-zinc-900 shadow-md print:shadow-none border border-zinc-200 dark:border-zinc-800/80 rounded-xl print:rounded-none print:border-none p-6 sm:p-8 max-w-[210mm] mx-auto">
                <div className="grid grid-cols-3 gap-5 sm:gap-6">
                  {sheetArchives.map((archive) => (
                    <ArchiveSticker
                      key={archive.id}
                      archive={archive}
                      variant="sheet"
                      qrSize={145}
                      canvasIdPrefix="sticker-qr"
                      showCropMarks={true}
                      showDownloadButton={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Continuous 3-Column Grid
          <div className="bg-white text-zinc-900 shadow-md print:shadow-none border border-zinc-200 dark:border-zinc-800/80 rounded-xl print:rounded-none print:border-none p-6 sm:p-8 max-w-[210mm] mx-auto">
            <div className="grid grid-cols-3 gap-5 sm:gap-6">
              {filteredArchives.map((archive) => (
                <ArchiveSticker
                  key={archive.id}
                  archive={archive}
                  variant="sheet"
                  qrSize={145}
                  canvasIdPrefix="sticker-qr"
                  showCropMarks={true}
                  showDownloadButton={true}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Inline styles ensuring proper print rendering */}
      <style jsx global>{`
        @media print {
          html, body {
            background: white !important;
            color: black !important;
            font-size: 12pt;
          }
          header, footer, nav, .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
}
