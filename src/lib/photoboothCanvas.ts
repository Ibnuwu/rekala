/**
 * REKALA — Archive Memory Photobooth Canvas Renderer
 * 
 * Programmatically renders a trendy, minimalist Retro Y2K / Indie Photo Strip (600x1800)
 * using pure HTML5 Canvas 2D without requiring any external frame images.
 */

export type FrameThemeId = 'parchment' | 'noir' | 'amber';
export type PhotoboothFilterId = 'normal' | 'bw' | 'sepia' | 'vintage';

export interface ThemeConfig {
  id: FrameThemeId;
  name: string;
  tagline: string;
  bgTop: string;
  bgMid: string;
  bgBottom: string;
  borderColor: string;
  innerBorderColor: string;
  accentColor: string;
  titleColor: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  stampColor: string;
  barcodeColor: string;
  grainDark: string;
  grainLight: string;
}

export const FRAME_THEMES: Record<FrameThemeId, ThemeConfig> = {
  parchment: {
    id: 'parchment',
    name: 'Kertas Kuno',
    tagline: 'Korea-style Vintage Paper • Soft Minimalist Beige',
    // Soft Muted Beige / Milk Tea Cream (#f5f0eb to #ebd9c8)
    bgTop: '#f7f3ee',
    bgMid: '#f2ebe0',
    bgBottom: '#ebd9c8',
    borderColor: '#cfc3b3',
    innerBorderColor: '#dfd3c3',
    accentColor: '#8c6b4f',
    titleColor: '#3d2616',
    textColor: '#7a583e',
    badgeBg: '#f2eae0',
    badgeBorder: '#d9cdbe',
    badgeText: '#4a382a',
    cardBg: '#ffffff',
    cardBorder: '#e8dfd5',
    cardShadow: 'rgba(60, 40, 20, 0.08)',
    stampColor: '#8c6b4f',
    barcodeColor: '#4a382a',
    grainDark: 'rgba(60, 40, 20, 0.03)',
    grainLight: 'rgba(255, 255, 255, 0.4)',
  },
  amber: {
    id: 'amber',
    name: 'Banten Emas',
    tagline: 'Retro Y2K Pop • Indie Magazine Cutout',
    // Rich Warm Terracotta / Dark Amber Mustard (#c86a28 to #a13d2d)
    bgTop: '#c86a28',
    bgMid: '#b44e28',
    bgBottom: '#98321e',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    innerBorderColor: 'rgba(255, 255, 255, 0.2)',
    accentColor: '#fbbf24',
    titleColor: '#ffffff',
    textColor: '#fed7aa',
    badgeBg: '#ffffff',
    badgeBorder: '#ffffff',
    badgeText: '#98321e',
    cardBg: '#ffffff',
    cardBorder: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.28)',
    stampColor: '#ffffff',
    barcodeColor: '#ffffff',
    grainDark: 'rgba(0, 0, 0, 0.06)',
    grainLight: 'rgba(255, 255, 255, 0.12)',
  },
  noir: {
    id: 'noir',
    name: 'Arsip Malam',
    tagline: 'Cyber Noir • Midnight Minimalist',
    bgTop: '#171615',
    bgMid: '#121110',
    bgBottom: '#0a0908',
    borderColor: '#453a2f',
    innerBorderColor: '#2b241e',
    accentColor: '#fbbf24',
    titleColor: '#f5f5f4',
    textColor: '#a8a29e',
    badgeBg: '#26221d',
    badgeBorder: '#78350f',
    badgeText: '#fde68a',
    cardBg: '#1f1d1a',
    cardBorder: 'rgba(251, 191, 36, 0.25)',
    cardShadow: 'rgba(0, 0, 0, 0.55)',
    stampColor: '#f59e0b',
    barcodeColor: '#f5f5f4',
    grainDark: 'rgba(0, 0, 0, 0.2)',
    grainLight: 'rgba(251, 191, 36, 0.03)',
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
 * Safe cross-browser rounded rectangle path helper for canvas clipping and drawing
 */
function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
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
  ctx.font = '700 8.5px ui-monospace, monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(caption, x + width / 2, y + height + 4);

  ctx.restore();
}

/**
 * Draws minimal circular stamp / seal
 */
function drawMinimalStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  title: string,
  sub: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-10 * Math.PI) / 180);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // Outer clean circle
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dashed circle
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 2.5]);
  ctx.beginPath();
  ctx.arc(0, 0, radius - 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Central text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11px serif';
  ctx.fillText('✦', 0, -12);

  ctx.font = '800 8px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(title, 0, 1);

  ctx.font = '600 6.5px ui-monospace, monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText(sub, 0, 12);

  ctx.restore();
}

/**
 * Draws a Y2K circular badge with "LIMITED ARCHIVE EDITION"
 */
function drawY2KLimitedBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((8 * Math.PI) / 180);

  // Outer badge ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
  ctx.stroke();

  // Badge text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '900 8px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '1.2px';
  ctx.fillText('LIMITED', 0, -10);
  ctx.fillText('ARCHIVE', 0, 0);
  ctx.fillText('EDITION', 0, 10);

  ctx.restore();
}

/**
 * Draws cute Y2K star sticker overlay
 */
function drawCuteStarSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((15 * Math.PI) / 180);

  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  // White circle backing
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  // Amber star inside
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, 0, size - 3, 0, Math.PI * 2);
  ctx.fill();

  // Crisp star icon
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.round(size * 1.1)}px serif`;
  ctx.fillText('★', 0, 1);

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

  // Load fonts if available
  try {
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }
  } catch {
    // Continue with system fallbacks
  }

  const theme = FRAME_THEMES[themeId] || FRAME_THEMES.parchment;
  const serial = serialNumber || Math.floor(100000 + Math.random() * 900000).toString();
  const dateFormatted = getPhotoboothDateStamp(dateStr);

  /* ──────────────── 1. BASE BACKGROUND & PAPER TEXTURE ──────────────── */
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, theme.bgTop);
  bgGrad.addColorStop(0.5, theme.bgMid);
  bgGrad.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle grain simulation
  for (let i = 0; i < 3000; i++) {
    const gx = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) * 0.5 * W;
    const gy = (Math.cos(i * 78.233) * 43758.5453 % 1 + 1) * 0.5 * H;
    const gr = ((i % 3) + 1) * 0.5;
    ctx.fillStyle = i % 2 === 0 ? theme.grainDark : theme.grainLight;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ──────────────── 2. THEME-SPECIFIC FRAME BORDERS & ACCENTS ──────────────── */
  if (themeId === 'parchment') {
    // Soft Minimalist Korean-style clean border (no heavy lines)
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(20, 20, W - 40, H - 40, 18);
    ctx.stroke();
  } else if (themeId === 'amber') {
    // Retro Y2K Pop — subtle outer dashed cut-guide & vector sparkles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(18, 18, W - 36, H - 36, 16);
    ctx.stroke();

    // Corner retro sparkles ✧
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✧', 34, 34);
    ctx.fillText('✧', W - 34, 34);
    ctx.fillText('✧', 34, H - 34);
    ctx.fillText('✧', W - 34, H - 34);
  } else {
    // Noir: sleek obsidian frame
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(18, 18, W - 36, H - 36, 16);
    ctx.stroke();
  }

  /* ──────────────── 3. HEADER SECTION ──────────────── */
  ctx.save();
  ctx.textAlign = 'center';

  if (themeId === 'parchment') {
    // Theme 1: Kertas Kuno — Aesthetic Korea-Style Minimalist Beige
    ctx.fillStyle = theme.accentColor;
    ctx.font = '13px serif';
    ctx.fillText('✦', W / 2, 60);

    // Header Title: REKALA MEMORIES in tracked spacing
    ctx.fillStyle = theme.titleColor;
    ctx.font = '600 21px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '5.5px';
    ctx.fillText('REKALA MEMORIES', W / 2, 94);

    // Subtext: Tiny handwritten/script subtitle
    ctx.fillStyle = theme.textColor;
    ctx.font = 'italic 400 13px "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '1.8px';
    ctx.fillText('~ reka waktu, hidupkan sejarah ~', W / 2, 122);

    // Minimal hairline divider
    ctx.strokeStyle = '#dfd3c3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(180, 150);
    ctx.lineTo(W - 180, 150);
    ctx.stroke();
  } else if (themeId === 'amber') {
    // Theme 2: Banten Emas — Bold Y2K Pop / Retro Magazine Cut-out
    // Minimalist retro vector sparkles
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px serif';
    ctx.fillText('✦   ✧   ✦', W / 2, 58);

    // Header: Bold, funky retro serif/display text reading R E K A L A in white with drop-shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px "Playfair Display", "Cinzel", Georgia, serif';
    ctx.letterSpacing = '8.5px';
    ctx.fillText('R E K A L A', W / 2, 102);
    ctx.restore();

    // Retro subtitle
    ctx.fillStyle = '#fed7aa'; // warm amber-200
    ctx.font = '800 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('INDIE ARCHIVE PHOTO STRIP', W / 2, 130);

    // Star separator
    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px serif';
    ctx.fillText('★', W / 2, 152);
  } else {
    // Theme 3: Noir
    ctx.fillStyle = theme.accentColor;
    ctx.font = '13px serif';
    ctx.fillText('✦   ★   ✦', W / 2, 60);

    ctx.fillStyle = theme.titleColor;
    ctx.font = '800 22px "Playfair Display", "Cinzel", Georgia, serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('REKALA ARCHIVE MEMORY', W / 2, 94);

    ctx.fillStyle = theme.textColor;
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('LEMBAR KENANGAN ARSIP • BANTEN', W / 2, 122);
  }
  ctx.restore();

  /* ──────────────── 4. THREE PHOTO WINDOWS (VERTICAL STRIP) ──────────────── */
  const photoW = 508;
  const photoH = 390;
  const photoX = (W - photoW) / 2; // 46px margin
  const startY = 195;
  const gap = 30;
  const filterCss = FILTER_CSS_MAP[filterId] || 'none';
  const slotRadius = 16; // Exact slot radius requested

  for (let i = 0; i < 3; i++) {
    const y = startY + i * (photoH + gap);

    if (themeId === 'amber') {
      // Theme 2: Solid white frames (border-4 border-white rounded-xl shadow-md)
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      drawRoundedRectPath(ctx, photoX - 8, y - 8, photoW + 16, photoH + 16, 22);
      ctx.fill();
      ctx.restore();
    } else if (themeId === 'parchment') {
      // Theme 1: Clean rounded rectangles, no heavy borders, subtle inner drop-shadow / paper-emboss
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(60, 40, 20, 0.08)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      drawRoundedRectPath(ctx, photoX, y, photoW, photoH, slotRadius);
      ctx.fill();

      // Subtle paper-emboss border
      ctx.strokeStyle = '#e8dfd5';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    } else {
      // Noir
      ctx.save();
      ctx.fillStyle = '#1f1d1a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      drawRoundedRectPath(ctx, photoX - 3, y - 3, photoW + 6, photoH + 6, slotRadius);
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // Clip & Draw Photo inside
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

        // Before drawing each photo, apply strict clipping:
        ctx.save();
        drawRoundedRectPath(ctx, photoX, y, photoW, photoH, slotRadius); // exact slot radius (16)
        ctx.clip(); // Locks drawing strictly inside the slot bounds

        if (filterCss !== 'none') {
          ctx.filter = filterCss;
        }

        // Draw the cropped photo with object-fit cover
        ctx.drawImage(img, sx, sy, sw, sh, photoX, y, photoW, photoH);
        ctx.restore(); // Restores context state cleanly
      } catch {
        ctx.save();
        drawRoundedRectPath(ctx, photoX, y, photoW, photoH, slotRadius);
        ctx.clip();
        ctx.fillStyle = '#27272a';
        ctx.fillRect(photoX, y, photoW, photoH);
        ctx.restore();
      }
    } else {
      // Empty slot placeholder
      ctx.save();
      drawRoundedRectPath(ctx, photoX, y, photoW, photoH, slotRadius);
      ctx.clip();
      ctx.fillStyle = themeId === 'parchment' ? '#f5eee6' : '#27272a';
      ctx.fillRect(photoX, y, photoW, photoH);
      ctx.restore();
    }

    // Discreet Slot Watermark / Tag
    if (themeId === 'parchment') {
      // Korea-style minimalist discreet shot number
      ctx.save();
      ctx.fillStyle = '#8c735d';
      ctx.font = '600 11px ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`0${i + 1} / 03`, photoX + 14, y + 14);
      ctx.restore();
    } else if (themeId === 'amber') {
      // Retro indie magazine badge
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.roundRect(photoX + 12, y + 12, 74, 18, 9);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 8.5px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`SHOT 0${i + 1}`, photoX + 49, y + 21);
      ctx.restore();
    }
  }

  // Cute mini star sticker on slot 3 for Theme 2 (Amber)
  if (themeId === 'amber') {
    const slot3Y = startY + 2 * (photoH + gap);
    drawCuteStarSticker(ctx, photoX + photoW - 6, slot3Y + photoH - 6, 20);
  }

  /* ──────────────── 5. FOOTER SECTION ──────────────── */
  const footerStartY = startY + 3 * (photoH + gap) - gap + 36; // ~1460px

  if (themeId === 'parchment') {
    // Theme 1: Clean barcode + Minimal date stamp 2026.10.26 in typewriter font
    // Hairline divider
    ctx.strokeStyle = '#dfd3c3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, footerStartY);
    ctx.lineTo(W - 60, footerStartY);
    ctx.stroke();

    // Barcode (Clean & Centered)
    const barcodeW = 220;
    const barcodeH = 44;
    const barcodeX = (W - barcodeW) / 2;
    drawCleanBarcode(
      ctx,
      barcodeX,
      footerStartY + 28,
      barcodeW,
      barcodeH,
      theme.barcodeColor,
      `* RKL-${serial} *`
    );

    // Minimal Date Stamp in typewriter/monospace font
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 15px "Courier New", Courier, monospace';
    ctx.fillStyle = '#4a382a';
    ctx.letterSpacing = '4px';
    ctx.fillText(dateFormatted, W / 2, footerStartY + 118);

    // Minimal Studio Note
    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#8c7258';
    ctx.letterSpacing = '2.5px';
    ctx.fillText('LEMBAR KENANGAN ARSIP • BANTEN', W / 2, footerStartY + 144);

    // Minimal circular stamp (Right side)
    drawMinimalStamp(ctx, W - 90, footerStartY + 120, 36, theme.stampColor, 'REKALA', dateFormatted.slice(0, 4));

    // Motto quote
    ctx.font = 'italic 400 13px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#5a402d';
    ctx.letterSpacing = '1px';
    ctx.fillText('“Reka Waktu, Hidupkan Sejarah”', W / 2, footerStartY + 200);

    // Clean footer link
    ctx.font = '500 9.5px ui-monospace, monospace';
    ctx.fillStyle = '#9c846f';
    ctx.letterSpacing = '1px';
    ctx.fillText('rekala.id • photoism memory strip', W / 2, footerStartY + 228);
    ctx.restore();
  } else if (themeId === 'amber') {
    // Theme 2: Retro Y2K Pop — Sleek circular badge "LIMITED ARCHIVE EDITION" + Bold details
    // Clean white dashed divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(50, footerStartY);
    ctx.lineTo(W - 50, footerStartY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sleek Circular Badge: "LIMITED ARCHIVE EDITION"
    drawY2KLimitedBadge(ctx, 110, footerStartY + 74, 46);

    // Barcode block (White)
    const barcodeW = 200;
    const barcodeH = 42;
    drawCleanBarcode(
      ctx,
      W - barcodeW - 50,
      footerStartY + 38,
      barcodeW,
      barcodeH,
      '#ffffff',
      `* Y2K-RKL-${serial} *`
    );

    // Date & Accents
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.font = '800 14px ui-monospace, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '3.5px';
    ctx.fillText(`DATE : ${dateFormatted}`, W / 2, footerStartY + 160);

    // Vector sparkles
    ctx.fillStyle = '#fbbf24';
    ctx.font = '12px serif';
    ctx.fillText('✦   ✧   ✦', W / 2, footerStartY + 185);

    // Motto quote with drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.font = 'italic 900 15px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '1px';
    ctx.fillText('“Reka Waktu, Hidupkan Sejarah”', W / 2, footerStartY + 215);

    // Y2K footer note
    ctx.shadowColor = 'transparent';
    ctx.font = '800 9.5px -apple-system, sans-serif';
    ctx.fillStyle = '#fed7aa';
    ctx.letterSpacing = '2px';
    ctx.fillText('REKALA INDIE ZINE • BANTEN ARCHIVES', W / 2, footerStartY + 242);
    ctx.restore();
  } else {
    // Theme 3: Noir
    drawCleanBarcode(ctx, 48, footerStartY + 20, 200, 42, theme.barcodeColor, `* RKL-${serial} *`);
    drawMinimalStamp(ctx, W - 90, footerStartY + 70, 44, theme.stampColor, 'REKALA', 'NOIR');

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 14px ui-monospace, monospace';
    ctx.fillStyle = '#f5f5f4';
    ctx.letterSpacing = '3px';
    ctx.fillText(dateFormatted, W / 2, footerStartY + 140);

    ctx.font = 'italic 600 13px "Playfair Display", serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('“Reka Waktu, Hidupkan Sejarah”', W / 2, footerStartY + 180);
    ctx.restore();
  }

  return canvas;
}
