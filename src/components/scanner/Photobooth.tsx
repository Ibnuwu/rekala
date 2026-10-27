'use client';

import { useState } from 'react';
import {
  renderArchiveMemoryCanvas,
  getPhotoboothDateStamp,
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
  const dateFormatted = getPhotoboothDateStamp();

  const isRollFilm = selectedTheme === 'roll_film';

  // Roll Film Analog strictly enforces monochrome/grayscale
  const effectivePhotoFilterCss = isRollFilm
    ? 'grayscale(100%) contrast(120%)'
    : (filters.find((f) => f.id === activeFilter)?.css || 'none');

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
      link.download = `rekala-photobooth-${selectedTheme}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Gagal membuat frame photobooth canvas:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Sprocket hole count for preview strip
  const sprocketHoles = Array.from({ length: 16 });

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      {/* ── Photo Strip Scrapbook Preview (Aspect 1:3 Live Screen Simulation) ── */}
      <div
        className={`max-h-[72vh] sm:max-h-[590px] w-auto aspect-[1/3] mx-auto object-contain flex flex-col justify-between shadow-2xl rounded-2xl overflow-hidden relative transition-all duration-300 select-none ${
          isRollFilm
            ? 'bg-[#121212] text-white border-2 border-zinc-800 shadow-black/80 p-2 sm:p-2.5'
            : 'bg-[#F5EFE6] text-[#4A3525] border-2 border-[#8B5E3C]/30 shadow-[0_12px_36px_rgba(74,53,37,0.15)] p-2.5 sm:p-3'
        }`}
      >
        {/* ── Theme 1: Kertas Kuno Perimeter Line ── */}
        {!isRollFilm && (
          <div className="absolute inset-1 sm:inset-1.5 rounded-xl border border-[#8B5E3C]/25 pointer-events-none" />
        )}

        {/* ── Theme 2: Roll Film Analog Sprocket Rails ── */}
        {isRollFilm && (
          <>
            {/* Left Sprocket Column */}
            <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between items-center pointer-events-none z-10">
              {sprocketHoles.map((_, idx) => (
                <div
                  key={`sprocket-l-${idx}`}
                  className="w-1.5 h-2.5 sm:w-2 sm:h-3 rounded-[2px] bg-white border border-zinc-400/50 shadow-inner"
                />
              ))}
            </div>

            {/* Right Sprocket Column */}
            <div className="absolute right-1 top-2 bottom-2 flex flex-col justify-between items-center pointer-events-none z-10">
              {sprocketHoles.map((_, idx) => (
                <div
                  key={`sprocket-r-${idx}`}
                  className="w-1.5 h-2.5 sm:w-2 sm:h-3 rounded-[2px] bg-white border border-zinc-400/50 shadow-inner"
                />
              ))}
            </div>
          </>
        )}

        {/* ── Header Section ── */}
        <div
          className={`text-center pt-0.5 pb-0.5 relative z-10 shrink-0 space-y-0.5 ${
            isRollFilm ? 'px-4 sm:px-5' : 'px-1'
          }`}
        >
          {isRollFilm ? (
            // Theme 2 Header: Minimalist white monospace text 35MM FILM • REKALA
            <div className="space-y-0.5">
              <h4 className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-white uppercase leading-tight">
                35MM FILM • REKALA
              </h4>
              <p className="font-mono text-[6px] sm:text-[6.5px] text-zinc-400 tracking-wider uppercase leading-none">
                EXP 03 &bull; PROCESS B&amp;W
              </p>
              <div className="w-10 h-px bg-zinc-800 mx-auto mt-1" />
            </div>
          ) : (
            // Theme 1 Header: Minimalist serif text REKALA ARCHIVE in tracked uppercase
            <div className="space-y-0.5">
              <span className="text-[8px] font-serif text-[#8B5E3C] block leading-none">✦</span>
              <h4 className="font-serif text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.2em] text-[#4A3525] uppercase leading-tight">
                REKALA ARCHIVE
              </h4>
              <p className="italic font-serif text-[7px] sm:text-[7.5px] text-[#8B5E3C] leading-none">
                ~ reka waktu, hidupkan sejarah ~
              </p>
              <div className="w-12 h-px bg-[#8B5E3C]/20 mx-auto mt-1" />
            </div>
          )}
        </div>

        {/* ── 3 Photo Windows (Vertical Strip) ── */}
        <div
          className={`flex-1 min-h-0 flex flex-col justify-between gap-1.5 sm:gap-2 my-1 relative z-10 ${
            isRollFilm ? 'px-3.5 sm:px-4' : 'px-0.5'
          }`}
        >
          {[0, 1, 2].map((i) => {
            const hasPhoto = !!photos[i];

            return (
              <div
                key={i}
                className={`flex-1 min-h-0 w-full relative transition-all duration-200 flex items-center justify-center ${
                  isCapturing && currentShot === i ? 'ring-2 ring-amber-400 ring-offset-1 animate-pulse' : ''
                } ${
                  isRollFilm
                    ? 'rounded-none border-2 border-white overflow-hidden bg-black shadow-md'
                    : 'rounded-xl p-1 sm:p-1.5 bg-[#FAF6F0] border border-[#8B5E3C] shadow-sm'
                }`}
              >
                {/* Inner slot container */}
                <div
                  className={`w-full h-full relative overflow-hidden flex items-center justify-center ${
                    isRollFilm ? 'rounded-none bg-black' : 'rounded-lg bg-[#E8DFD5]'
                  }`}
                >
                  {hasPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photos[i]}
                      alt={`Foto ${i + 1}`}
                      className={`w-full h-full object-cover transition-all duration-200 ${
                        isRollFilm ? 'rounded-none' : 'rounded-md'
                      }`}
                      style={{ filter: effectivePhotoFilterCss }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={onStartSequence}
                      disabled={isCapturing}
                      className={`w-full h-full flex flex-col items-center justify-center transition-colors cursor-pointer disabled:cursor-default ${
                        isRollFilm
                          ? 'bg-zinc-950 text-zinc-500 hover:text-white'
                          : 'bg-[#F2ECE3] text-[#8B5E3C]/70 hover:text-[#4A3525]'
                      }`}
                      title="Mulai berfoto"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className={isCapturing && currentShot === i ? 'animate-bounce text-amber-500' : 'animate-pulse'}
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span className="text-[6.5px] font-mono mt-0.5 font-semibold">
                        {isCapturing && currentShot === i ? 'Mengambil...' : `Slot #${i + 1}`}
                      </span>
                    </button>
                  )}

                  {/* Theme 1: Korea-style discreet index */}
                  {!isRollFilm && (
                    <span className="absolute top-1 left-1.5 text-[6.5px] font-mono font-semibold text-[#8B5E3C] pointer-events-none leading-none select-none">
                      0{i + 1} / 03
                    </span>
                  )}

                  {/* Theme 2: Roll Film Frame Tag */}
                  {isRollFilm && (
                    <span className="absolute top-1 left-1.5 bg-black/80 text-white text-[6px] font-mono font-bold px-1 py-0.5 rounded-[2px] pointer-events-none leading-none select-none border border-white/20">
                      FRAME 0{i + 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer Section ── */}
        <div
          className={`relative z-10 pt-0.5 shrink-0 space-y-1 ${
            isRollFilm ? 'px-4 sm:px-5 pb-1' : 'px-1 pb-0.5'
          }`}
        >
          {isRollFilm ? (
            // Theme 2 Footer: Minimalist white monospace text 35MM FILM • REKALA + clean date
            <div className="space-y-1 text-center">
              <div className="w-full h-px bg-zinc-800 mx-auto" />
              {/* White Minimalist Barcode */}
              <div className="flex flex-col items-center pt-0.5">
                <div className="flex items-end gap-[1px] h-2.5 opacity-90">
                  {[2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 2, 1, 3].map((w, bi) => (
                    <div
                      key={bi}
                      className="bg-white h-full"
                      style={{ width: `${w * 0.8}px` }}
                    />
                  ))}
                </div>
                <span className="text-[5px] font-mono tracking-widest text-zinc-400 mt-0.5">
                  * DX-35MM-FILM *
                </span>
              </div>

              <div className="text-center pt-0.5 space-y-0.5">
                <p className="font-mono text-[8px] sm:text-[8.5px] font-bold tracking-[0.2em] text-white uppercase leading-tight">
                  35MM FILM • REKALA
                </p>
                <p className="font-mono text-[6.5px] tracking-widest text-zinc-400 leading-tight">
                  DATE : {dateFormatted}
                </p>
                <p className="font-mono text-[5.5px] tracking-wider text-zinc-500 leading-none">
                  SAFETY FILM &bull; ARCHIVE MEMORY STRIP
                </p>
              </div>
            </div>
          ) : (
            // Theme 1 Footer: Small vintage seal stamp and clean date timestamp
            <div className="space-y-1 text-center">
              <div className="w-full h-px bg-[#8B5E3C]/20 mx-auto" />
              <div className="flex items-center justify-between px-1">
                {/* Clean Barcode */}
                <div className="flex flex-col items-start">
                  <div className="flex items-end gap-[1px] h-3 opacity-90">
                    {[2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 2].map((w, bi) => (
                      <div
                        key={bi}
                        className="bg-[#4A3525] h-full"
                        style={{ width: `${w * 0.85}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[5px] font-mono tracking-widest text-[#4A3525] mt-0.5">
                    * REKALA *
                  </span>
                </div>

                {/* Small Vintage Seal Stamp */}
                <div className="w-6 h-6 rounded-full border border-[#8B5E3C] border-dashed flex flex-col items-center justify-center -rotate-12 text-[#8B5E3C] select-none">
                  <span className="text-[5px] leading-none">✦</span>
                  <span className="text-[3.5px] font-mono font-bold leading-none">ARCHIVE</span>
                </div>
              </div>

              {/* Clean Date Timestamp */}
              <div className="text-center pt-0.5 space-y-0.5">
                <p className="font-mono text-[7.5px] sm:text-[8px] font-bold tracking-[0.2em] text-[#4A3525] leading-tight">
                  {dateFormatted}
                </p>
                <p className="italic font-serif text-[6.5px] text-[#8B5E3C] leading-tight">
                  &ldquo;Reka Waktu, Hidupkan Sejarah&rdquo;
                </p>
                <p className="text-[5px] font-mono text-[#8B5E3C]/80 leading-none">
                  rekala.id &bull; photoism archive strip
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Controls Section (STRICTLY 2 Theme Switcher Pills & Filters) ── */}
      <div className="flex flex-col items-center justify-center gap-2.5 w-full pt-1">
        {/* Strictly 2 Theme Switcher Pills */}
        <div className="flex flex-col items-center justify-center gap-1.5 w-full">
          <span className="text-[9.5px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-bold">
            TEMA BINGKAI PHOTO STRIP:
          </span>
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {(Object.keys(FRAME_THEMES) as FrameThemeId[]).map((tId) => {
              const isSelected = selectedTheme === tId;
              const theme = FRAME_THEMES[tId];

              let activeStyles = '';
              if (tId === 'kertas_kuno') {
                activeStyles =
                  'bg-[#FAF6F0] text-[#4A3525] border-[#8B5E3C] shadow-[0_0_16px_rgba(139,94,60,0.35)] ring-2 ring-[#8B5E3C]/50 font-bold';
              } else {
                activeStyles =
                  'bg-zinc-900 text-white border-zinc-400 shadow-[0_0_16px_rgba(255,255,255,0.2)] ring-2 ring-white/40 font-bold';
              }

              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => setSelectedTheme(tId)}
                  className={`rounded-full text-xs font-semibold px-5 py-2 transition-all cursor-pointer flex items-center gap-2 border active:scale-95 hover:scale-105 ${
                    isSelected
                      ? activeStyles
                      : 'bg-white dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                    style={{ background: theme.bgColor }}
                  />
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Historical Filter Pills (Active for Kertas Kuno, Auto-B&W note for Roll Film) */}
        <div className="flex flex-col items-center justify-center gap-1 w-full pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[9.5px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-bold">
              FILTER HISTORIS:
            </span>
            {isRollFilm && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium">
                Auto B&amp;W 35mm
              </span>
            )}
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                disabled={isRollFilm}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                  isRollFilm
                    ? 'opacity-40 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    : activeFilter === f.id
                    ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 border-amber-600 dark:border-amber-500 shadow-xs font-bold cursor-pointer'
                    : 'bg-white dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Foto Ulang & Unduh Photo Strip (600x1800 Canvas) */}
        <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
          {photos.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
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
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-50 active:scale-95"
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
                  <span>Mengekspor 600×1800...</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh Photo Strip (600×1800)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
