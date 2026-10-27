/**
 * REKALA — Archive Memory Photobooth Canvas Renderer
 * 
 * Programmatically renders high-resolution 600x1800 Archive Memory Photobooth Strips
 * using pure HTML5 Canvas 2D with strict clipping and authentic design presets.
 * 
 * STRICTLY 2 THEMES SUPPORTED:
 * 1. Kertas Kuno (Refined Aesthetic Parchment)
 * 2. Roll Film Analog (Black & White Camera Roll)
 */

export type FrameThemeId = 'kertas_kuno' | 'roll_film';
export type PhotoboothFilterId = 'normal' | 'bw' | 'sepia' | 'vintage';

export interface ThemeConfig {
  id: FrameThemeId;
  name: string;
  tagline: string;
  bgColor: string;
  accentColor: string;
  borderColor: string;
  titleColor: string;
  textColor: string;
}

export const FRAME_THEMES: Record<FrameThemeId, ThemeConfig> = {
  kertas_kuno: {
    id: 'kertas_kuno',
    name: 'Kertas Kuno',
    tagline: 'Refined Aesthetic Parchment • Soft Cream',
    bgColor: '#F5EFE6',
    accentColor: '#8B5E3C',
    borderColor: '#8B5E3C',
    titleColor: '#4A3525',
    textColor: '#8B5E3C',
  },
  roll_film: {
    id: 'roll_film',
    name: 'Roll Film Analog',
    tagline: 'Black & White Camera Roll • 35mm Strip',
    bgColor: '#121212',
    accentColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    titleColor: '#FFFFFF',
    textColor: '#A1A1AA',
  },
};

export interface RenderCanvasOptions {
  photos: string[]; // 3 snapshot data URLs
  filterId: PhotoboothFilterId;
  themeId: FrameThemeId;
  dateStr?: string;
  serialNumber?: string;
}

const FILTER_CSS_MAP: Record<PhotoboothFilterId, string> = {
  normal: 'none',
  bw: 'grayscale(100%) contrast(125%) brightness(95%)',
  sepia: 'sepia(80%) contrast(110%) brightness(90%)',
  vintage: 'sepia(40%) contrast(115%) brightness(105%) saturate(120%)',
};

export function getPhotoboothDateStamp(dateStr?: string): string {
  if (dateStr) return dateStr;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Cross-browser rounded rectangle path helper for canvas clipping and drawing
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  if (typeof (ctx as unknown as { roundRect?: Function }).roundRect === 'function') {
    (ctx as unknown as { roundRect: Function }).roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  ctx.closePath();
}

/**
 * Draws procedural barcode
 */
function drawCleanBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  caption: string
) {
  ctx.save();
  ctx.fillStyle = color;

  const pattern = [
    2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2,
    1, 4, 2, 1, 1, 3, 2, 1, 3, 1, 2, 1, 4, 1, 2, 2, 1, 3, 1, 1, 2, 4
  ];
  let curX = x;
  const barUnit = width / 110;

  for (let i = 0; i < pattern.length; i++) {
    const w = pattern[i] * barUnit;
    if (i % 2 === 0) {
      ctx.fillRect(curX, y, w, height);
    }
    curX += w;
    if (curX > x + width) break;
  }

  // Barcode caption
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '700 9px ui-monospace, monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(caption, x + width / 2, y + height + 5);

  ctx.restore();
}

/**
 * Draws vintage circular seal / stamp for Kertas Kuno
 */
function drawVintageSealStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  year: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-8 * Math.PI) / 180);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // Outer solid ring
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dashed ring
  ctx.lineWidth = 1.1;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.arc(0, 0, radius - 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner decorative star
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12px serif';
  ctx.fillText('✦', 0, -13);

  // Central Seal text
  ctx.font = '700 8.5px "Playfair Display", Georgia, serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('REKALA', 0, 1);

  ctx.font = '600 6.5px ui-monospace, monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText(`ARCHIVE ${year}`, 0, 13);

  ctx.restore();
}

/**
 * Main programmatic renderer for 600x1800 Archive Memory Photobooth Strip
 */
export async function renderArchiveMemoryCanvas({
  photos,
  filterId,
  themeId,
  dateStr,
  serialNumber,
}: RenderCanvasOptions): Promise<HTMLCanvasElement> {
  const W = 600;
  const H = 1800;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context from canvas');

  // Load fonts if available in document context
  try {
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }
  } catch {
    // Continue with system fallbacks
  }

  const isRollFilm = themeId === 'roll_film';
  const theme = FRAME_THEMES[themeId] || FRAME_THEMES.kertas_kuno;
  const serial = serialNumber || Math.floor(100000 + Math.random() * 900000).toString();
  const dateFormatted = getPhotoboothDateStamp(dateStr);
  const yearStr = dateFormatted.slice(0, 4);

  // Roll Film Analog forces high-contrast monochrome
  const photoFilterCss = isRollFilm
    ? 'grayscale(100%) contrast(120%)'
    : (FILTER_CSS_MAP[filterId] || 'none');

  /* ─────────────────────────────────────────────────────────────
     1. BASE BACKGROUND & THEME TEXTURES
     ───────────────────────────────────────────────────────────── */
  if (isRollFilm) {
    // Deep obsidian black
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, W, H);

    // Subtle edge border
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, W - 8, H - 8);

    /* ── Sprocket Holes along left and right outer edges ── */
    const sprocketW = 22;
    const sprocketH = 32;
    const sprocketRadius = 4.5;
    const leftRailX = 14;
    const rightRailX = W - 14 - sprocketW; // 564
    const startHoleY = 30;
    const holeStep = 48;
    const totalHoles = Math.floor((H - 60) / holeStep);

    for (let hIdx = 0; hIdx <= totalHoles; hIdx++) {
      const holeY = startHoleY + hIdx * holeStep;

      // Left perforation
      drawRoundRect(ctx, leftRailX, holeY, sprocketW, sprocketH, sprocketRadius);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#D4D4D8';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Right perforation
      drawRoundRect(ctx, rightRailX, holeY, sprocketW, sprocketH, sprocketRadius);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#D4D4D8';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Film roll side markings between holes
      if (hIdx % 4 === 1) {
        ctx.save();
        ctx.fillStyle = '#71717A';
        ctx.font = '700 8.5px ui-monospace, monospace';
        ctx.letterSpacing = '1px';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const frameIdx = Math.floor(hIdx / 4) + 1;
        // Left text: "SAFETY FILM" / "35MM FILM"
        ctx.fillText(frameIdx % 2 === 1 ? '35MM' : 'SAFETY', 44, holeY + sprocketH / 2);
        // Right frame marker: "▶ 1A"
        ctx.fillText(`▶ ${frameIdx}A`, W - 44, holeY + sprocketH / 2);
        ctx.restore();
      }
    }
  } else {
    // Kertas Kuno: Soft cream paper texture tone (#F5EFE6)
    ctx.fillStyle = '#F5EFE6';
    ctx.fillRect(0, 0, W, H);

    // Warm organic paper grain simulation
    for (let i = 0; i < 2800; i++) {
      const gx = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) * 0.5 * W;
      const gy = (Math.cos(i * 78.233) * 43758.5453 % 1 + 1) * 0.5 * H;
      const gr = ((i % 3) + 1) * 0.45;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(139, 94, 60, 0.035)' : 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Elegant subtle inner perimeter frame
    ctx.strokeStyle = '#8B5E3C';
    ctx.lineWidth = 1.2;
    drawRoundRect(ctx, 22, 22, W - 44, H - 44, 18);
    ctx.stroke();
  }

  /* ─────────────────────────────────────────────────────────────
     2. HEADER SECTION
     ───────────────────────────────────────────────────────────── */
  ctx.save();
  ctx.textAlign = 'center';

  if (isRollFilm) {
    // Minimalist white monospace text: 35MM FILM • REKALA
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 17px ui-monospace, "SF Mono", Menlo, monospace';
    ctx.letterSpacing = '4.5px';
    ctx.fillText('35MM FILM • REKALA', W / 2, 78);

    ctx.fillStyle = '#A1A1AA';
    ctx.font = '500 10.5px ui-monospace, monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('ANALOG NEGATIVE ARCHIVE • B&W 400', W / 2, 106);

    // Hairline divider
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(64, 134);
    ctx.lineTo(W - 64, 134);
    ctx.stroke();
  } else {
    // Minimalist serif text REKALA ARCHIVE in tracked uppercase (tracking-[0.2em] font-serif text-[#4A3525])
    ctx.fillStyle = '#8B5E3C';
    ctx.font = '13px serif';
    ctx.fillText('✦', W / 2, 58);

    ctx.fillStyle = '#4A3525';
    ctx.font = '600 23px "Playfair Display", "Cinzel", Georgia, serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('REKALA ARCHIVE', W / 2, 94);

    ctx.fillStyle = '#8B5E3C';
    ctx.font = 'italic 400 12.5px "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('~ reka waktu, hidupkan sejarah ~', W / 2, 120);

    // Hairline warm divider
    ctx.strokeStyle = '#D4C4B5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(140, 142);
    ctx.lineTo(W - 140, 142);
    ctx.stroke();
  }
  ctx.restore();

  /* ─────────────────────────────────────────────────────────────
     3. 3 PHOTO SLOTS (VERTICAL STRIP) WITH STRICT CLIPPING
     ───────────────────────────────────────────────────────────── */
  const startY = 175;
  const gap = 30;

  for (let i = 0; i < 3; i++) {
    if (isRollFilm) {
      // ── THEME 2: ROLL FILM ANALOG ──
      // Sharp, rectangular photo windows with a clean white inner border
      const slotX = 64;
      const slotY = startY + i * (385 + gap);
      const slotW = W - 128; // 472px width perfectly fits between sprocket rails
      const slotH = 385;

      // 1. Draw crisp white rectangular border
      ctx.save();
      ctx.fillStyle = '#09090B';
      ctx.fillRect(slotX, slotY, slotW, slotH);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.strokeRect(slotX, slotY, slotW, slotH);
      ctx.restore();

      // 2. Strict rectangular clipping (no leakage!)
      if (photos[i]) {
        try {
          const img = await loadImg(photos[i]);
          const imgRatio = img.width / img.height;
          const slotRatio = slotW / slotH;
          let sx = 0;
          let sy = 0;
          let sw = img.width;
          let sh = img.height;

          if (imgRatio > slotRatio) {
            sw = img.height * slotRatio;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / slotRatio;
            sy = (img.height - sh) / 2;
          }

          ctx.save();
          ctx.beginPath();
          // Clip strictly inside the 3px white border (1.5px inset)
          ctx.rect(slotX + 1.5, slotY + 1.5, slotW - 3, slotH - 3);
          ctx.clip();

          // Auto-apply monochrome/grayscale filter
          ctx.filter = photoFilterCss;
          ctx.drawImage(img, sx, sy, sw, sh, slotX, slotY, slotW, slotH);
          ctx.restore();
        } catch {
          ctx.save();
          ctx.beginPath();
          ctx.rect(slotX + 1.5, slotY + 1.5, slotW - 3, slotH - 3);
          ctx.clip();
          ctx.fillStyle = '#18181B';
          ctx.fillRect(slotX, slotY, slotW, slotH);
          ctx.restore();
        }
      } else {
        // Placeholder
        ctx.save();
        ctx.beginPath();
        ctx.rect(slotX + 1.5, slotY + 1.5, slotW - 3, slotH - 3);
        ctx.clip();
        ctx.fillStyle = '#18181B';
        ctx.fillRect(slotX, slotY, slotW, slotH);
        ctx.restore();
      }

      // Slot Index Tag (Analog Film Frame Stamp)
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 10px ui-monospace, monospace';
      ctx.letterSpacing = '1.5px';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`FRAME 0${i + 1}`, slotX + 10, slotY - 6);
      ctx.restore();
    } else {
      // ── THEME 1: KERTAS KUNO ──
      // Clean, minimal rounded boxes with a thin warm-brown border (#8B5E3C) and subtle inner padding
      const cardX = 46;
      const cardY = startY + i * (385 + gap);
      const cardW = W - 92; // 508px
      const cardH = 385;
      const cardRadius = 16;
      const innerPadding = 10;

      // 1. Clean minimal box with thin warm-brown border
      ctx.save();
      ctx.fillStyle = '#FAF6F0';
      ctx.strokeStyle = '#8B5E3C';
      ctx.lineWidth = 1.4;
      drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 2. Inner photo bounds with subtle padding
      const photoX = cardX + innerPadding;
      const photoY = cardY + innerPadding;
      const photoW = cardW - innerPadding * 2;
      const photoH = cardH - innerPadding * 2;
      const photoRadius = 11;

      // Strict rounded clipping (no leakage!)
      if (photos[i]) {
        try {
          const img = await loadImg(photos[i]);
          const imgRatio = img.width / img.height;
          const slotRatio = photoW / photoH;
          let sx = 0;
          let sy = 0;
          let sw = img.width;
          let sh = img.height;

          if (imgRatio > slotRatio) {
            sw = img.height * slotRatio;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / slotRatio;
            sy = (img.height - sh) / 2;
          }

          ctx.save();
          drawRoundRect(ctx, photoX, photoY, photoW, photoH, photoRadius);
          ctx.clip();

          if (photoFilterCss !== 'none') {
            ctx.filter = photoFilterCss;
          }
          ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
          ctx.restore();
        } catch {
          ctx.save();
          drawRoundRect(ctx, photoX, photoY, photoW, photoH, photoRadius);
          ctx.clip();
          ctx.fillStyle = '#E8DFD5';
          ctx.fillRect(photoX, photoY, photoW, photoH);
          ctx.restore();
        }
      } else {
        // Placeholder
        ctx.save();
        drawRoundRect(ctx, photoX, photoY, photoW, photoH, photoRadius);
        ctx.clip();
        ctx.fillStyle = '#E8DFD5';
        ctx.fillRect(photoX, photoY, photoW, photoH);
        ctx.restore();
      }

      // Minimalist discreet shot index in warm brown
      ctx.save();
      ctx.fillStyle = '#8B5E3C';
      ctx.font = '600 11px ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`0${i + 1} / 03`, photoX + 12, photoY + 12);
      ctx.restore();
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. FOOTER SECTION
     ───────────────────────────────────────────────────────────── */
  const footerStartY = startY + 3 * (385 + gap) - gap + 34; // ~1450px

  if (isRollFilm) {
    // ── ROLL FILM ANALOG FOOTER ──
    // Minimalist white monospace text: 35MM FILM • REKALA
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(64, footerStartY);
    ctx.lineTo(W - 64, footerStartY);
    ctx.stroke();

    // White Barcode
    const barcodeW = 210;
    const barcodeH = 40;
    const barcodeX = (W - barcodeW) / 2;
    drawCleanBarcode(
      ctx,
      barcodeX,
      footerStartY + 24,
      barcodeW,
      barcodeH,
      '#FFFFFF',
      `* DX-35MM-${serial} *`
    );

    // Monospace header/footer text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.font = '700 16px ui-monospace, "SF Mono", Menlo, monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.letterSpacing = '4px';
    ctx.fillText('35MM FILM • REKALA', W / 2, footerStartY + 126);

    // Timestamp & Film metadata
    ctx.font = '600 13px ui-monospace, monospace';
    ctx.fillStyle = '#D4D4D8';
    ctx.letterSpacing = '3px';
    ctx.fillText(`DATE : ${dateFormatted}`, W / 2, footerStartY + 154);

    ctx.font = '500 10px ui-monospace, monospace';
    ctx.fillStyle = '#71717A';
    ctx.letterSpacing = '2px';
    ctx.fillText('SAFETY FILM • ARCHIVE MEMORY STRIP', W / 2, footerStartY + 180);
    ctx.restore();
  } else {
    // ── KERTAS KUNO FOOTER ──
    // Small vintage seal stamp and clean date timestamp at the bottom
    ctx.strokeStyle = '#D4C4B5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(56, footerStartY);
    ctx.lineTo(W - 56, footerStartY);
    ctx.stroke();

    // Barcode in warm brown tone
    const barcodeW = 200;
    const barcodeH = 38;
    const barcodeX = (W - barcodeW) / 2;
    drawCleanBarcode(
      ctx,
      barcodeX,
      footerStartY + 24,
      barcodeW,
      barcodeH,
      '#4A3525',
      `* RKL-${serial} *`
    );

    // Small Vintage Seal Stamp (positioned gracefully)
    drawVintageSealStamp(ctx, W - 92, footerStartY + 124, 35, '#8B5E3C', yearStr);

    // Clean Date Timestamp at bottom
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.font = '700 16px "Courier New", Courier, monospace';
    ctx.fillStyle = '#4A3525';
    ctx.letterSpacing = '4px';
    ctx.fillText(dateFormatted, W / 2, footerStartY + 120);

    // Motto & Studio note
    ctx.font = 'italic 400 13px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#8B5E3C';
    ctx.letterSpacing = '1px';
    ctx.fillText('“Reka Waktu, Hidupkan Sejarah”', W / 2, footerStartY + 154);

    ctx.font = '500 10px ui-monospace, monospace';
    ctx.fillStyle = '#8B5E3C';
    ctx.letterSpacing = '1.8px';
    ctx.fillText('rekala.id • photoism archive strip', W / 2, footerStartY + 180);
    ctx.restore();
  }

  return canvas;
}
