/**
 * REKALA — Archive Memory Photobooth Canvas Renderer
 * 
 * Programmatically renders a museum-grade 600x1800 archival photo strip
 * using pure HTML5 Canvas 2D without requiring any external frame images.
 */

export type FrameThemeId = 'parchment' | 'noir' | 'amber';
export type PhotoboothFilterId = 'normal' | 'bw' | 'sepia' | 'vintage';

export interface ThemeConfig {
  id: FrameThemeId;
  name: string;
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
    bgTop: '#faf6ee',
    bgMid: '#f5efe1',
    bgBottom: '#ede3cd',
    borderColor: '#382e25',
    innerBorderColor: '#8a7968',
    accentColor: '#b45309',
    titleColor: '#26211a',
    textColor: '#574c3e',
    badgeBg: '#f0e6d2',
    badgeBorder: '#c4b59f',
    badgeText: '#443729',
    cardBg: '#ffffff',
    cardBorder: 'rgba(56, 46, 37, 0.15)',
    cardShadow: 'rgba(56, 46, 37, 0.12)',
    stampColor: '#991b1b', // Vintage crimson archival ink
    barcodeColor: '#26211a',
    grainDark: 'rgba(56, 46, 37, 0.04)',
    grainLight: 'rgba(255, 255, 255, 0.35)',
  },
  noir: {
    id: 'noir',
    name: 'Arsip Malam',
    bgTop: '#171615',
    bgMid: '#121110',
    bgBottom: '#0d0c0b',
    borderColor: '#d97706',
    innerBorderColor: '#78350f',
    accentColor: '#fbbf24',
    titleColor: '#f5f5f4',
    textColor: '#a8a29e',
    badgeBg: '#26221d',
    badgeBorder: '#78350f',
    badgeText: '#fde68a',
    cardBg: '#22201d',
    cardBorder: 'rgba(245, 158, 11, 0.25)',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
    stampColor: '#f59e0b', // Radiant gold seal
    barcodeColor: '#f5f5f4',
    grainDark: 'rgba(0, 0, 0, 0.18)',
    grainLight: 'rgba(251, 191, 36, 0.03)',
  },
  amber: {
    id: 'amber',
    name: 'Banten Emas',
    bgTop: '#fef3c7',
    bgMid: '#fde68a',
    bgBottom: '#f59e0b',
    borderColor: '#451a03',
    innerBorderColor: '#92400e',
    accentColor: '#b45309',
    titleColor: '#29180c',
    textColor: '#5a3517',
    badgeBg: '#fef08a',
    badgeBorder: '#b45309',
    badgeText: '#451a03',
    cardBg: '#ffffff',
    cardBorder: 'rgba(69, 26, 3, 0.18)',
    cardShadow: 'rgba(69, 26, 3, 0.15)',
    stampColor: '#7c2d12', // Dark rust wax
    barcodeColor: '#29180c',
    grainDark: 'rgba(69, 26, 3, 0.05)',
    grainLight: 'rgba(255, 255, 255, 0.4)',
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
 * Draws an authentic circular archival rubber stamp with rotated text and dashed ring
 */
function drawArchivalStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  serial: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-12 * Math.PI) / 180); // Organic hand-stamped tilt

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // Outer primary ring
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dashed ring
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 2.5]);
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]); // reset dash

  // Central emblem & text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Center star
  ctx.font = '13px serif';
  ctx.fillText('★', 0, -18);

  ctx.font = '900 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('REKALA', 0, -4);

  ctx.font = '700 7.5px monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText('TERVERIFIKASI', 0, 8);

  ctx.font = '600 6.5px monospace';
  ctx.fillText(`ID: ${serial.slice(-4)}`, 0, 18);

  // Circular text / arc flourishes along rim
  ctx.font = '700 7px monospace';
  ctx.letterSpacing = '1.2px';
  ctx.fillText('• ARSIP RESMI BANTEN •', 0, -radius + 12);
  ctx.fillText('★ EST. 2026 ★', 0, radius - 12);

  ctx.restore();
}

/**
 * Draws a procedural vintage archival barcode
 */
function drawArchivalBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  serial: string
) {
  ctx.save();
  ctx.fillStyle = color;

  // Procedural barcode bar widths
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
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '700 8.5px monospace';
  ctx.letterSpacing = '1.5px';
  ctx.fillText(`* RKL-ARC-${serial} *`, x, y + height + 5);

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

  const theme = FRAME_THEMES[themeId] || FRAME_THEMES.parchment;
  const serial = serialNumber || Math.floor(100000 + Math.random() * 900000).toString();
  const dateFormatted =
    dateStr ||
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  /* ──────────────── 1. BASE BACKGROUND & PAPER TEXTURE ──────────────── */
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, theme.bgTop);
  bgGrad.addColorStop(0.5, theme.bgMid);
  bgGrad.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Archival grain simulation (subtle cotton fiber texture)
  for (let i = 0; i < 4000; i++) {
    const gx = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) * 0.5 * W;
    const gy = (Math.cos(i * 78.233) * 43758.5453 % 1 + 1) * 0.5 * H;
    const gr = ((i % 3) + 1) * 0.6;
    ctx.fillStyle = i % 2 === 0 ? theme.grainDark : theme.grainLight;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ──────────────── 2. ORNATE ARCHIVAL BORDERS ──────────────── */
  // Outer border
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 16);
  ctx.stroke();

  // Inner hairline border
  ctx.strokeStyle = theme.innerBorderColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(24, 24, W - 48, H - 48, 10);
  ctx.stroke();

  // 4 Corner Filigree L-brackets & diamond stars
  const cornerInset = 28;
  const cornerLength = 22;
  const corners = [
    { x: cornerInset, y: cornerInset, dx: 1, dy: 1 },
    { x: W - cornerInset, y: cornerInset, dx: -1, dy: 1 },
    { x: cornerInset, y: H - cornerInset, dx: 1, dy: -1 },
    { x: W - cornerInset, y: H - cornerInset, dx: -1, dy: -1 },
  ];
  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 2;
  corners.forEach(({ x, y, dx, dy }) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * cornerLength);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * cornerLength, y);
    ctx.stroke();

    // Corner dot
    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.arc(x + dx * 5, y + dy * 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Side Film Frame Notches (Vintage ruler ticks)
  ctx.strokeStyle = theme.innerBorderColor;
  ctx.lineWidth = 1;
  for (let y = 140; y < H - 140; y += 42) {
    ctx.beginPath();
    ctx.moveTo(17, y);
    ctx.lineTo(23, y);
    ctx.moveTo(W - 23, y);
    ctx.lineTo(W - 17, y);
    ctx.stroke();
  }

  /* ──────────────── 3. ARCHIVAL HEADER (Y: 36 - 180) ──────────────── */
  // Emblem Starburst
  ctx.fillStyle = theme.accentColor;
  ctx.font = '14px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦   ★   ✦', W / 2, 54);

  // Main Title
  ctx.fillStyle = theme.titleColor;
  ctx.font = '900 23px "Playfair Display", "Cinzel", Georgia, serif';
  ctx.letterSpacing = '3.5px';
  ctx.fillText('REKALA ARCHIVE MEMORY', W / 2, 86);

  // Subtitle
  ctx.fillStyle = theme.textColor;
  ctx.font = '700 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('LEMBAR KENANGAN SEJARAH • KESULTANAN BANTEN', W / 2, 110);

  // Archival Series Pill Badge
  const badgeW = 280;
  const badgeH = 22;
  const badgeX = (W - badgeW) / 2;
  const badgeY = 126;
  ctx.fillStyle = theme.badgeBg;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 11);
  ctx.fill();
  ctx.strokeStyle = theme.badgeBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = theme.badgeText;
  ctx.font = '700 9px monospace';
  ctx.letterSpacing = '1.2px';
  ctx.fillText(`SERI ARSIP: RKL-${serial} • EDISI RESMI`, W / 2, badgeY + 15);

  // Header Divider with Diamond
  ctx.strokeStyle = theme.innerBorderColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 168);
  ctx.lineTo(W / 2 - 20, 168);
  ctx.moveTo(W / 2 + 20, 168);
  ctx.lineTo(W - 60, 168);
  ctx.stroke();

  ctx.fillStyle = theme.accentColor;
  ctx.beginPath();
  ctx.moveTo(W / 2, 164);
  ctx.lineTo(W / 2 + 5, 168);
  ctx.lineTo(W / 2, 172);
  ctx.lineTo(W / 2 - 5, 168);
  ctx.closePath();
  ctx.fill();

  /* ──────────────── 4. THREE PHOTO WINDOWS (VERTICAL STRIP) ──────────────── */
  const photoW = 512;
  const photoH = 396;
  const photoX = (W - photoW) / 2; // 44px margins
  const startY = 192;
  const gap = 26;
  const filterCss = FILTER_CSS_MAP[filterId] || 'none';

  for (let i = 0; i < 3; i++) {
    const y = startY + i * (photoH + gap);

    // Polaroid / Photo Card Backing with Shadow
    const cardPad = 6;
    ctx.save();
    ctx.fillStyle = theme.cardBg;
    ctx.shadowColor = theme.cardShadow;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(photoX - cardPad, y - cardPad, photoW + cardPad * 2, photoH + cardPad * 2, 10);
    ctx.fill();
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // Clip & Draw Photo
    if (photos[i]) {
      try {
        const img = await loadImg(photos[i]);

        // Object-fit: cover aspect math
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
        ctx.beginPath();
        ctx.roundRect(photoX, y, photoW, photoH, 6);
        ctx.clip();

        if (filterCss !== 'none') {
          ctx.filter = filterCss;
        }
        ctx.drawImage(img, sx, sy, sw, sh, photoX, y, photoW, photoH);
        ctx.restore();
      } catch {
        // Fallback placeholder if image load fails
        ctx.fillStyle = '#27272a';
        ctx.fillRect(photoX, y, photoW, photoH);
      }
    } else {
      // Empty slot placeholder
      ctx.fillStyle = '#f4f4f5';
      ctx.fillRect(photoX, y, photoW, photoH);
    }

    // Archival Frame Slot Tag
    ctx.save();
    ctx.fillStyle = 'rgba(15, 15, 17, 0.72)';
    ctx.beginPath();
    ctx.roundRect(photoX + 10, y + 10, 94, 20, 10);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '700 8.5px monospace';
    ctx.letterSpacing = '1.2px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`FRAME 0${i + 1} / 03`, photoX + 57, y + 20);
    ctx.restore();
  }

  /* ──────────────── 5. ARCHIVAL FOOTER (Y: 1460 - 1775) ──────────────── */
  const footerDividerY = startY + 3 * (photoH + gap) - gap + 22; // ~1458px

  // Top footer divider line
  ctx.strokeStyle = theme.innerBorderColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, footerDividerY);
  ctx.lineTo(W / 2 - 40, footerDividerY);
  ctx.moveTo(W / 2 + 40, footerDividerY);
  ctx.lineTo(W - 50, footerDividerY);
  ctx.stroke();

  ctx.fillStyle = theme.accentColor;
  ctx.font = '700 9px monospace';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦ ARSIP SEJARAH ✦', W / 2, footerDividerY);

  // Draw Procedural Archival Barcode (Left)
  drawArchivalBarcode(ctx, 48, 1495, 210, 48, theme.barcodeColor, serial);

  // Metadata block (Under barcode)
  ctx.fillStyle = theme.textColor;
  ctx.font = '600 10px monospace';
  ctx.letterSpacing = '0.8px';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`TANGGAL  : ${dateFormatted}`, 48, 1572);
  ctx.fillText('LOKASI   : BANTEN LAMA, INDONESIA', 48, 1588);
  ctx.fillText('PRODUKSI : REKALA ARCHIVE STUDIO', 48, 1604);

  // Draw Circular Archival Rubber Stamp (Right)
  drawArchivalStamp(ctx, 470, 1560, 56, theme.stampColor, serial);

  // Historical Motto Quote
  ctx.fillStyle = theme.titleColor;
  ctx.font = 'italic 700 14px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '1px';
  ctx.fillText('“Reka Waktu, Hidupkan Sejarah”', W / 2, 1680);

  // Bottom brand note
  ctx.fillStyle = theme.textColor;
  ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '1.8px';
  ctx.fillText('rekala.id • Preserving Cultural Heritage Mementos', W / 2, 1720);

  // Bottom micro star
  ctx.fillStyle = theme.accentColor;
  ctx.font = '10px serif';
  ctx.fillText('✦   ✦   ✦', W / 2, 1744);

  return canvas;
}
