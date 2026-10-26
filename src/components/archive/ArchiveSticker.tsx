'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import type { Archive } from '@/data/archives';
import { formatArchiveId, downloadStickerPNG } from '@/lib/stickerExport';

interface ArchiveStickerProps {
  archive: Archive;
  variant?: 'modal' | 'sheet';
  qrSize?: number;
  canvasIdPrefix?: string;
  showCropMarks?: boolean;
  showDownloadButton?: boolean;
  className?: string;
}

export function ArchiveSticker({
  archive,
  variant = 'modal',
  qrSize = variant === 'modal' ? 180 : 145,
  canvasIdPrefix = 'sticker-qr',
  showCropMarks = variant === 'sheet',
  showDownloadButton = false,
  className = '',
}: ArchiveStickerProps) {
  const [downloading, setDownloading] = useState(false);
  const shareUrl = `https://rekala-banten.vercel.app/arsip/${archive.id}`;
  const canvasId = `${canvasIdPrefix}-${archive.id}`;
  const formattedId = formatArchiveId(archive.id);

  // Logo badge scale strictly 19% (~18-20% of QR size)
  const logoBadgeSize = Math.round(qrSize * 0.19);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      const canvasEl = document.getElementById(canvasId) as HTMLCanvasElement | null;
      await downloadStickerPNG(archive, canvasEl);
    } catch (err) {
      console.error('Failed to download sticker PNG:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (variant === 'sheet') {
    return (
      <div
        className={`relative group bg-white border border-dashed border-zinc-300 print:border-zinc-400 p-3 sm:p-3.5 rounded-xl flex flex-col items-center justify-between text-center transition-all break-inside-avoid print:break-inside-avoid shadow-2xs print:shadow-none aspect-[3/4] max-w-[215px] mx-auto w-full ${className}`}
      >
        {/* Subtle Physical Crop Marks for Manual Trimming */}
        {showCropMarks && (
          <>
            <span
              className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-zinc-400 print:border-zinc-600 pointer-events-none"
              aria-hidden="true"
            />
            <span
              className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-zinc-400 print:border-zinc-600 pointer-events-none"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-zinc-400 print:border-zinc-600 pointer-events-none"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-zinc-400 print:border-zinc-600 pointer-events-none"
              aria-hidden="true"
            />
          </>
        )}

        {/* Compact Top Header */}
        <div className="w-full text-center space-y-0.5 pt-0.5">
          <h4 className="font-serif text-[13px] sm:text-sm font-bold text-zinc-900 tracking-wider uppercase leading-none">
            REKALA
          </h4>
          <p className="text-[7.5px] sm:text-[8px] text-zinc-500 tracking-widest font-sans uppercase leading-none mt-0.5">
            ARSIP DIGITAL BANTEN
          </p>
        </div>

        {/* Center Maximized QR Focus with Quiet-Zone */}
        <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-2xs border border-zinc-200/90 relative inline-flex items-center justify-center my-auto">
          <QRCodeCanvas
            id={canvasId}
            value={shareUrl}
            size={qrSize}
            level="H"
            bgColor="#ffffff"
            fgColor="#09090b"
            marginSize={1}
            imageSettings={{
              src: '/logo/logo-warna.png',
              height: logoBadgeSize,
              width: logoBadgeSize,
              excavate: true,
            }}
            className="object-contain block"
          />

          {/* Center Emblem Badge Overlay with Solid White Mask */}
          <div
            className="absolute pointer-events-none flex items-center justify-center bg-white p-0.5 rounded-md shadow-2xs border border-zinc-100"
            style={{
              width: logoBadgeSize,
              height: logoBadgeSize,
            }}
            aria-hidden="true"
          >
            <img
              src="/logo/logo-warna.png"
              alt="REKALA Emblem"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Compact Bottom Footer ID Badge directly under QR */}
        <div className="w-full flex flex-col items-center pb-0.5">
          <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md leading-tight">
            {formattedId}
          </span>
        </div>

        {/* Action Button for Individual Download (Hover only, hidden during print) */}
        {showDownloadButton && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="no-print absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-zinc-700 hover:text-amber-700 bg-white hover:bg-amber-50 border border-zinc-200 hover:border-amber-300 p-1 rounded-md shadow-xs flex items-center gap-1 cursor-pointer"
            title="Download stiker ini saja (PNG)"
            aria-label="Download stiker ini"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="text-[9px]">{downloading ? '...' : 'PNG'}</span>
          </button>
        )}
      </div>
    );
  }

  // Default 'modal' variant: Compact ~3:4 physical card
  return (
    <div
      className={`relative mx-auto w-full max-w-[230px] p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm flex flex-col items-center justify-between text-center aspect-[3/4] ${className}`}
    >
      {/* Top Header */}
      <div className="space-y-0.5 pt-0.5">
        <h3 className="font-serif text-sm sm:text-base font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase leading-none">
          REKALA
        </h3>
        <p className="text-[8px] tracking-widest text-zinc-500 font-sans uppercase leading-none mt-0.5">
          ARSIP DIGITAL BANTEN
        </p>
      </div>

      {/* Center Maximized QR Code */}
      <div className="p-2 bg-white rounded-lg shadow-2xs border border-zinc-200/80 relative inline-flex items-center justify-center my-auto">
        <QRCodeCanvas
          id={canvasId}
          value={shareUrl}
          size={qrSize}
          level="H"
          bgColor="#ffffff"
          fgColor="#09090b"
          marginSize={1}
          imageSettings={{
            src: '/logo/logo-warna.png',
            height: logoBadgeSize,
            width: logoBadgeSize,
            excavate: true,
          }}
          className="w-36 h-36 sm:w-40 sm:h-40 object-contain block"
        />

        {/* Center Emblem Badge Overlay */}
        <div
          className="absolute pointer-events-none flex items-center justify-center bg-white p-0.5 rounded-md shadow-2xs border border-zinc-100"
          style={{
            width: logoBadgeSize,
            height: logoBadgeSize,
          }}
          aria-hidden="true"
        >
          <img
            src="/logo/logo-warna.png"
            alt="REKALA Emblem"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Bottom Footer ID Badge directly under QR */}
      <div className="flex flex-col items-center pb-0.5 w-full">
        <span className="font-mono text-xs font-bold tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 inline-block leading-tight">
          {formattedId}
        </span>
      </div>
    </div>
  );
}
