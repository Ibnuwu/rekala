'use client';

import { useState } from 'react';
import {
  renderArchiveMemoryCanvas,
  FRAME_THEMES,
  type FrameThemeId,
  type PhotoboothFilterId,
} from '@/lib/photoboothCanvas';

export interface PhotoboothProps {
  photos: string[];
  isCapturing: boolean;
  currentShot: number;
  activeFilter: PhotoboothFilterId;
  setActiveFilter: (filter: PhotoboothFilterId) => void;
  selectedTheme: FrameThemeId;
  setSelectedTheme: (theme: FrameThemeId) => void;
  onStartSequence: () => void;
  onReset: () => void;
  filters: { id: PhotoboothFilterId; label: string; css: string }[];
}

export function Photobooth({
  photos,
  isCapturing,
  currentShot,
  activeFilter,
  setActiveFilter,
  selectedTheme,
  setSelectedTheme,
  onStartSequence,
  onReset,
  filters,
}: PhotoboothProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (photos.length < 3 || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await renderArchiveMemoryCanvas({
        photos,
        filterId: activeFilter,
        themeId: selectedTheme,
      });
      const link = document.createElement('a');
      link.download = `rekala-archive-memory-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Gagal membuat frame photobooth canvas:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const activeCss = filters.find((f) => f.id === activeFilter)?.css || 'none';

  // Preview styling based on selected theme
  const getThemeStyles = () => {
    switch (selectedTheme) {
      case 'noir':
        return {
          wrapper: 'bg-gradient-to-b from-[#1c1a17] via-[#141312] to-[#0c0b0a] text-stone-100 border-amber-600/70 shadow-amber-950/40',
          innerBorder: 'border-amber-700/60',
          title: 'text-stone-100',
          sub: 'text-amber-400/90',
          badge: 'bg-amber-950/80 border-amber-700/60 text-amber-300',
          divider: 'border-amber-700/50',
          card: 'bg-[#22201d] border-amber-500/20 shadow-black/60',
          tag: 'bg-amber-950/90 text-amber-300 border-amber-600/40',
          stamp: 'border-amber-500 text-amber-400',
          barcode: 'text-stone-300',
        };
      case 'amber':
        return {
          wrapper: 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-stone-950 border-amber-900/60 shadow-amber-900/30',
          innerBorder: 'border-amber-900/40',
          title: 'text-stone-950',
          sub: 'text-amber-950 font-medium',
          badge: 'bg-amber-200/90 border-amber-900/40 text-amber-950',
          divider: 'border-amber-900/30',
          card: 'bg-white border-amber-900/15 shadow-amber-950/15',
          tag: 'bg-stone-900/80 text-amber-200 border-amber-800/30',
          stamp: 'border-amber-900 text-amber-900',
          barcode: 'text-stone-950',
        };
      case 'parchment':
      default:
        return {
          wrapper: 'bg-gradient-to-b from-[#faf6ee] via-[#f5efe1] to-[#ede3cd] text-stone-900 border-[#382e25] shadow-stone-900/25',
          innerBorder: 'border-[#8a7968]/70',
          title: 'text-[#26211a]',
          sub: 'text-[#574c3e]',
          badge: 'bg-[#f0e6d2] border-[#c4b59f] text-[#443729]',
          divider: 'border-[#8a7968]/50',
          card: 'bg-white border-[#382e25]/15 shadow-stone-800/15',
          tag: 'bg-stone-900/80 text-[#fef3c7] border-stone-800/30',
          stamp: 'border-red-800 text-red-800',
          barcode: 'text-stone-900',
        };
    }
  };

  const themeUi = getThemeStyles();

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      {/* ── Clamped Photo Strip Scrapbook Preview (Pure CSS & Programmatic Frame) ── */}
      <div
        className={`max-h-[70vh] sm:max-h-[580px] w-auto aspect-[1/3] mx-auto object-contain flex flex-col justify-between shadow-2xl rounded-2xl overflow-hidden p-2.5 sm:p-3 border-2 sm:border-4 relative transition-colors duration-300 select-none ${themeUi.wrapper}`}
      >
        {/* Inner hairline border decoration */}
        <div className={`absolute inset-1 sm:inset-1.5 rounded-xl border pointer-events-none ${themeUi.innerBorder}`} />

        {/* Header Section */}
        <div className="text-center pt-0.5 pb-0.5 relative z-10 space-y-0.5 shrink-0">
          <span className="text-[8px] font-serif tracking-widest block opacity-80 leading-none">✦ ★ ✦</span>
          <h4 className={`text-[8.5px] sm:text-[9.5px] font-serif font-black tracking-widest uppercase leading-tight ${themeUi.title}`}>
            REKALA ARCHIVE MEMORY
          </h4>
          <p className={`text-[6.5px] sm:text-[7px] tracking-wider uppercase font-sans leading-none ${themeUi.sub}`}>
            LEMBAR KENANGAN SEJARAH &bull; BANTEN
          </p>
          <div className="inline-block mt-0.5">
            <span
              className={`text-[6px] sm:text-[6.5px] font-mono tracking-wider px-1.5 py-0.5 rounded-full border leading-none inline-block ${themeUi.badge}`}
            >
              SERI ARSIP: RKL-2026
            </span>
          </div>
          <div className={`border-b mt-1 mx-2 ${themeUi.divider}`} />
        </div>

        {/* 3 Photo Windows (Vertical Strip, flex-distributed) */}
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-1 sm:gap-1.5 my-1 relative z-10 px-0.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 min-h-0 w-full rounded-md overflow-hidden border p-0.5 relative shadow-sm transition-all duration-200 flex items-center justify-center ${themeUi.card}`}
            >
              {photos[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photos[i]}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover rounded-[3px] transition-all duration-200"
                  style={{ filter: activeCss }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100/60 dark:bg-zinc-800/40 text-zinc-400 rounded-[3px]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="animate-pulse"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="text-[6.5px] font-mono mt-0.5 font-semibold">Slot #{i + 1}</span>
                </div>
              )}
              {/* Shot number tag */}
              <span
                className={`absolute top-1 left-1 text-[6px] font-mono font-bold px-1 py-0.5 rounded shadow-sm border leading-none ${themeUi.tag}`}
              >
                FRAME 0{i + 1} / 03
              </span>
            </div>
          ))}
        </div>

        {/* Footer Area: Archival Stamp & Barcode */}
        <div className="relative z-10 pt-0.5 px-0.5 space-y-1 shrink-0">
          <div className={`border-t mx-2 ${themeUi.divider}`} />

          <div className="flex items-center justify-between px-1 pt-0.5">
            {/* Barcode block */}
            <div className="flex flex-col">
              <div className="flex items-end gap-[1px] h-3 sm:h-3.5 opacity-85">
                {[2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 2].map((w, bi) => (
                  <div
                    key={bi}
                    className="bg-current h-full"
                    style={{ width: `${w * 0.9}px` }}
                  />
                ))}
              </div>
              <span className={`text-[5px] sm:text-[5.5px] font-mono tracking-wider mt-0.5 opacity-80 ${themeUi.barcode}`}>
                * RKL-ARC-2026 *
              </span>
            </div>

            {/* Circular Archival Rubber Stamp */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed flex flex-col items-center justify-center text-center -rotate-12 select-none ${themeUi.stamp}`}
            >
              <span className="text-[4.5px] leading-tight font-black tracking-tighter">★ REKALA ★</span>
              <span className="text-[4px] font-mono leading-none tracking-widest font-bold">VERIFIKASI</span>
              <span className="text-[3.5px] font-mono opacity-80 leading-none">BANTEN</span>
            </div>
          </div>

          {/* Archival Motto & Brand */}
          <div className="text-center pt-0.5 pb-0.5 space-y-0.5">
            <p className="text-[6.5px] sm:text-[7px] font-serif italic font-semibold opacity-90 leading-tight">
              &ldquo;Reka Waktu, Hidupkan Sejarah&rdquo;
            </p>
            <p className="text-[5.5px] sm:text-[6px] font-mono opacity-70 leading-none">
              rekala.id &bull; {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Controls Section (Theme & Filter Selectors) ── */}
      <div className="flex flex-col items-center justify-center gap-2 w-full pt-1">
        {/* Theme Switcher Pills */}
        <div className="flex flex-col items-center justify-center gap-1 w-full">
          <span className="text-[9.5px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-bold">
            TEMA BINGKAI:
          </span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {(Object.keys(FRAME_THEMES) as FrameThemeId[]).map((tId) => (
              <button
                key={tId}
                type="button"
                onClick={() => setSelectedTheme(tId)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                  selectedTheme === tId
                    ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm font-bold scale-105'
                    : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {FRAME_THEMES[tId].name}
              </button>
            ))}
          </div>
        </div>

        {/* Historical Filter Pills */}
        <div className="flex flex-col items-center justify-center gap-1 w-full pt-0.5">
          <span className="text-[9.5px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-bold">
            FILTER HISTORIS:
          </span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                  activeFilter === f.id
                    ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 border-amber-600 dark:border-amber-500 shadow-sm font-bold'
                    : 'bg-white dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Foto Ulang & Unduh Photo Strip (Programmatic Canvas) */}
        <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
          {photos.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              <span>Foto Ulang</span>
            </button>
          )}

          {photos.length >= 3 && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-50 active:scale-95"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Membuat Gambar...</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh Photo Strip</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
