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

  const activeCss = filters.find((f) => f.id === activeFilter)?.css || 'none';

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      {/* ── Photo Strip Scrapbook Preview (Aspect 1:3 Live Screen Simulation) ── */}
      <div
        className={`max-h-[72vh] sm:max-h-[590px] w-auto aspect-[1/3] mx-auto object-contain flex flex-col justify-between shadow-2xl rounded-2xl overflow-hidden p-2.5 sm:p-3 relative transition-all duration-300 select-none ${
          selectedTheme === 'parchment'
            ? 'bg-gradient-to-b from-[#f7f3ee] via-[#f2ebe0] to-[#ebd9c8] text-[#3d2616] border-2 border-[#cfc3b3]'
            : selectedTheme === 'amber'
            ? 'bg-gradient-to-b from-[#c86a28] via-[#b44e28] to-[#98321e] text-white border-2 border-amber-900/40 shadow-orange-950/40'
            : 'bg-gradient-to-b from-[#171615] via-[#121110] to-[#0a0908] text-stone-100 border-2 border-[#453a2f]'
        }`}
      >
        {/* Theme 1: Inner Minimalist Line */}
        {selectedTheme === 'parchment' && (
          <div className="absolute inset-1 sm:inset-1.5 rounded-xl border border-[#dfd3c3] pointer-events-none" />
        )}
        {/* Theme 2: Retro Corner Sparkles */}
        {selectedTheme === 'amber' && (
          <>
            <span className="absolute top-1.5 left-2 text-[10px] text-white/90 pointer-events-none select-none">✧</span>
            <span className="absolute top-1.5 right-2 text-[10px] text-white/90 pointer-events-none select-none">✧</span>
            <span className="absolute bottom-1.5 left-2 text-[10px] text-white/90 pointer-events-none select-none">✧</span>
            <span className="absolute bottom-1.5 right-2 text-[10px] text-white/90 pointer-events-none select-none">✧</span>
          </>
        )}

        {/* ── Header Section ── */}
        <div className="text-center pt-0.5 pb-0.5 relative z-10 shrink-0 space-y-0.5">
          {selectedTheme === 'parchment' ? (
            // Theme 1: Kertas Kuno — Aesthetic Korea-Style Minimalist Beige
            <>
              <span className="text-[8px] font-serif text-[#8c6b4f] block leading-none">✦</span>
              <h4 className="font-serif text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.25em] text-amber-950/80 uppercase leading-tight">
                REKALA MEMORIES
              </h4>
              <p className="italic font-serif text-[7px] sm:text-[7.5px] text-amber-900/60 leading-none">
                ~ reka waktu, hidupkan sejarah ~
              </p>
              <div className="w-12 h-px bg-[#dfd3c3] mx-auto mt-1" />
            </>
          ) : selectedTheme === 'amber' ? (
            // Theme 2: Banten Emas — Bold Y2K Pop / Retro Magazine Cutout
            <>
              <div className="flex items-center justify-center gap-1 text-[9px] text-white/90 leading-none">
                <span>✦</span>
                <span className="text-[7px]">✧</span>
                <span>✦</span>
              </div>
              <h4 className="font-serif font-black tracking-[0.3em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] text-[12px] sm:text-[13px] uppercase leading-tight">
                R E K A L A
              </h4>
              <p className="text-[6.5px] sm:text-[7px] font-sans font-bold tracking-widest text-amber-200 uppercase leading-none">
                INDIE ARCHIVE PHOTO STRIP
              </p>
            </>
          ) : (
            // Theme 3: Noir
            <>
              <span className="text-[8px] font-serif text-amber-400 block leading-none">✦ ★ ✦</span>
              <h4 className="font-serif text-[10.5px] font-bold tracking-widest text-stone-100 uppercase leading-tight">
                REKALA ARCHIVE MEMORY
              </h4>
              <p className="text-[6.5px] font-sans text-amber-400/90 tracking-wider uppercase leading-none">
                LEMBAR KENANGAN ARSIP &bull; BANTEN
              </p>
            </>
          )}
        </div>

        {/* ── 3 Photo Windows (Vertical Strip) ── */}
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 sm:gap-2 my-1 relative z-10 px-0.5">
          {[0, 1, 2].map((i) => {
            const hasPhoto = !!photos[i];
            const isBottomSlot = i === 2;

            return (
              <div
                key={i}
                className={`flex-1 min-h-0 w-full relative transition-all duration-200 flex items-center justify-center ${
                  isCapturing && currentShot === i ? 'ring-2 ring-amber-400 ring-offset-1 animate-pulse' : ''
                } ${
                  selectedTheme === 'amber'
                    ? 'border-[3px] sm:border-4 border-white rounded-xl shadow-md overflow-hidden bg-white'
                    : selectedTheme === 'parchment'
                    ? 'rounded-xl overflow-hidden bg-white border border-[#e8dfd5] shadow-[0_2px_8px_rgba(60,40,20,0.08)]'
                    : 'rounded-xl overflow-hidden bg-[#1f1d1a] border border-amber-500/20 shadow-md shadow-black/50'
                }`}
              >
                {hasPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photos[i]}
                    alt={`Foto ${i + 1}`}
                    className={`w-full h-full object-cover transition-all duration-200 ${
                      selectedTheme === 'amber' ? 'rounded-[4px]' : 'rounded-lg'
                    }`}
                    style={{ filter: activeCss }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={onStartSequence}
                    disabled={isCapturing}
                    className="w-full h-full flex flex-col items-center justify-center bg-zinc-100/70 dark:bg-zinc-800/40 text-zinc-400 hover:text-amber-600 transition-colors cursor-pointer disabled:cursor-default"
                    title="Mulai berfoto"
                  >
                    <svg
                      width="16"
                      height="16"
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
                {selectedTheme === 'parchment' && (
                  <span className="absolute top-1 left-1.5 text-[6.5px] font-mono font-medium text-[#8c735d] pointer-events-none leading-none select-none">
                    0{i + 1} / 03
                  </span>
                )}

                {/* Theme 2: Retro badge */}
                {selectedTheme === 'amber' && (
                  <span className="absolute top-1 left-1 bg-black/65 text-white text-[5.5px] font-sans font-bold px-1.5 py-0.5 rounded-full pointer-events-none leading-none select-none">
                    SHOT 0{i + 1}
                  </span>
                )}

                {/* Theme 2: Cute Mini Star Sticker on the bottom slot */}
                {selectedTheme === 'amber' && isBottomSlot && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-amber-400 text-zinc-950 rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow-md border-2 border-white rotate-12 select-none pointer-events-none"
                    title="Y2K Star"
                  >
                    ★
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer Section ── */}
        <div className="relative z-10 pt-0.5 px-0.5 shrink-0 space-y-1">
          {selectedTheme === 'parchment' ? (
            // Theme 1 Footer: Clean barcode + Typewriter date stamp
            <div className="space-y-1 text-center">
              <div className="w-full h-px bg-[#dfd3c3] mx-auto" />
              <div className="flex items-center justify-between px-1">
                {/* Clean Barcode SVG */}
                <div className="flex flex-col items-start">
                  <div className="flex items-end gap-[1px] h-3 opacity-90">
                    {[2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 2].map((w, bi) => (
                      <div
                        key={bi}
                        className="bg-[#4a382a] h-full"
                        style={{ width: `${w * 0.85}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[5px] font-mono tracking-widest text-[#4a382a] mt-0.5">
                    * REKALA *
                  </span>
                </div>

                {/* Minimal Stamp */}
                <div className="w-6 h-6 rounded-full border border-[#8c6b4f] border-dashed flex flex-col items-center justify-center -rotate-12 text-[#8c6b4f] select-none">
                  <span className="text-[5px] leading-none">✦</span>
                  <span className="text-[3.5px] font-mono font-bold leading-none">MEMORIES</span>
                </div>
              </div>

              {/* Minimal date stamp in typewriter/monospace font */}
              <div className="text-center pt-0.5">
                <p className="font-mono text-[7.5px] sm:text-[8px] font-bold tracking-[0.2em] text-[#4a382a] leading-tight">
                  {dateFormatted}
                </p>
                <p className="italic font-serif text-[6.5px] text-[#7a583e] leading-tight mt-0.5">
                  &ldquo;Reka Waktu, Hidupkan Sejarah&rdquo;
                </p>
                <p className="text-[5px] font-mono text-[#9c846f] leading-none mt-0.5">
                  rekala.id &bull; photoism memory strip
                </p>
              </div>
            </div>
          ) : selectedTheme === 'amber' ? (
            // Theme 2 Footer: Retro Y2K Pop — Sleek circular badge + Barcode
            <div className="space-y-1 text-center">
              <div className="w-full h-px border-t border-dashed border-white/40 mx-auto" />
              <div className="flex items-center justify-between px-1">
                {/* Circular Badge "LIMITED ARCHIVE EDITION" */}
                <div className="w-7 h-7 rounded-full border-2 border-white flex flex-col items-center justify-center text-white rotate-6 select-none shadow-xs">
                  <span className="text-[3.5px] font-sans font-black tracking-tighter leading-none">LIMITED</span>
                  <span className="text-[3px] font-sans font-bold tracking-tighter leading-none">ARCHIVE</span>
                  <span className="text-[3px] font-mono opacity-80 leading-none">EDITION</span>
                </div>

                {/* Barcode in white */}
                <div className="flex flex-col items-end">
                  <div className="flex items-end gap-[1px] h-3 opacity-95">
                    {[2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 1, 2].map((w, bi) => (
                      <div
                        key={bi}
                        className="bg-white h-full"
                        style={{ width: `${w * 0.85}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[5px] font-mono tracking-widest text-white/90 mt-0.5">
                    * Y2K-RKL *
                  </span>
                </div>
              </div>

              {/* Bold date stamp & motto */}
              <div className="text-center pt-0.5">
                <p className="font-mono text-[7.5px] sm:text-[8px] font-extrabold tracking-widest text-white leading-tight">
                  DATE : {dateFormatted}
                </p>
                <p className="font-serif italic font-bold text-[6.5px] text-white/95 leading-tight mt-0.5">
                  &ldquo;Reka Waktu, Hidupkan Sejarah&rdquo;
                </p>
                <p className="text-[5px] font-sans font-bold tracking-wider text-amber-200 leading-none mt-0.5">
                  REKALA INDIE ZINE &bull; BANTEN
                </p>
              </div>
            </div>
          ) : (
            // Theme 3 Footer: Noir
            <div className="space-y-1 text-center">
              <div className="w-full h-px bg-amber-700/40 mx-auto" />
              <p className="font-mono text-[7.5px] font-bold tracking-widest text-amber-400">
                {dateFormatted}
              </p>
              <p className="font-serif italic text-[6.5px] text-stone-300">
                &ldquo;Reka Waktu, Hidupkan Sejarah&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Controls Section (Theme Switcher Pills & Filters) ── */}
      <div className="flex flex-col items-center justify-center gap-2.5 w-full pt-1">
        {/* Sleek Theme Switcher Pills with Dynamic Glow */}
        <div className="flex flex-col items-center justify-center gap-1.5 w-full">
          <span className="text-[9.5px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-bold">
            TEMA BINGKAI PHOTO STRIP:
          </span>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {(Object.keys(FRAME_THEMES) as FrameThemeId[]).map((tId) => {
              const isSelected = selectedTheme === tId;
              const theme = FRAME_THEMES[tId];

              // Dynamic glow styling per theme
              let activeGlow = '';
              if (tId === 'amber') {
                activeGlow =
                  'bg-[#c86a28] text-white border-amber-300 shadow-[0_0_16px_rgba(200,106,40,0.45)] ring-2 ring-amber-400/40';
              } else if (tId === 'parchment') {
                activeGlow =
                  'bg-[#4a382a] text-[#f7f3ee] border-[#ebd9c8] shadow-[0_0_16px_rgba(180,150,120,0.35)] ring-2 ring-[#ebd9c8]/60';
              } else {
                activeGlow =
                  'bg-zinc-900 text-amber-400 border-amber-500/80 shadow-[0_0_16px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/30';
              }

              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => setSelectedTheme(tId)}
                  className={`rounded-full text-xs font-semibold px-5 py-2 transition-all cursor-pointer flex items-center gap-2 border active:scale-95 hover:scale-105 ${
                    isSelected
                      ? `${activeGlow} font-bold`
                      : 'bg-white dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                    style={{ background: theme.accentColor }}
                  />
                  <span>{theme.name}</span>
                </button>
              );
            })}
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
                    ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 border-amber-600 dark:border-amber-500 shadow-xs font-bold'
                    : 'bg-white dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
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
