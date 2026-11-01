import JSZip from 'jszip';
import type { Archive } from '@/data/archives';

/**
 * Standardize Archive ID to 'ARSIP-XX' format (e.g. 'Arsip-01' -> 'ARSIP-01')
 */
export function formatArchiveId(id: string): string {
  const clean = id.replace(/^arsip[-_]?/i, '').trim();
  if (!clean) return id.toUpperCase();
  const num = parseInt(clean, 10);
  if (!isNaN(num)) {
    return `ARSIP-${String(num).padStart(2, '0')}`;
  }
  return `ARSIP-${clean.toUpperCase()}`;
}

/**
 * Helper to draw a rounded rectangle with cross-browser fallback support
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

/**
 * Load an image as an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Generates a compact 1:1 square aspect ratio (600x600) print-ready sticker canvas
 * with maximized QR code, compact header, and tight footer badge.
 */
export async function generateStickerCanvas(
  archive: Archive | { id: string; title: string },
  qrCanvasElement?: HTMLCanvasElement | null
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  // Strict 1:1 compact square sticker
  const width = 600;
  const height = 600;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get 2D context from canvas');

  // Ensure custom web fonts are loaded
  try {
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }
  } catch {
    // Continue with system fallbacks
  }

  // 1. Clean White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Outer Border (Cut Guide)
  ctx.save();
  ctx.strokeStyle = '#E4E4E7';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 10, 10, width - 20, height - 20, 16);
  ctx.stroke();
  ctx.restore();

  // 3. Compact Header Section — proportionally scaled to match web preview
  // Web card is ~190px, canvas is 600px → scale factor ~3.15×
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Title: "REKALA" — web: 13px bold serif → canvas: ~38px
  ctx.font = 'bold 38px "Playfair Display", "Cinzel", Georgia, serif';
  ctx.fillStyle = '#18181B'; // text-zinc-900
  ctx.letterSpacing = '3px';
  ctx.fillText('REKALA', width / 2, 52);
  ctx.letterSpacing = '0px';

  // Subtitle: "ARSIP DIGITAL BANTEN" — web: 7px → canvas: ~14px
  ctx.font = '500 14px "Plus Jakarta Sans", Inter, -apple-system, sans-serif';
  ctx.fillStyle = '#71717A'; // text-zinc-500
  ctx.fillText('A R S I P   D I G I T A L   B A N T E N', width / 2, 72);
  ctx.restore();

  // 4. Center Focus (Maximized QR Code — fills most of the square)
  // Tight spacing: header ends ~72px, badge needs ~56px at bottom
  const qrAreaTop = 82;
  const qrAreaBottom = height - 64; // leave room for footer badge
  const qrAreaHeight = qrAreaBottom - qrAreaTop;
  const qrAreaSize = Math.min(width - 40, qrAreaHeight);
  const qrAreaX = (width - qrAreaSize) / 2;
  const qrAreaY = qrAreaTop;

  // QR code drawn directly — no extra quiet-zone border box
  const qrPadding = 10;
  const qrSize = qrAreaSize - qrPadding * 2;
  const qrX = qrAreaX + qrPadding;
  const qrY = qrAreaY + qrPadding;

  if (qrCanvasElement) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrCanvasElement, qrX, qrY, qrSize, qrSize);
  }

  // Center Emblem Badge Overlay inside QR (19% width)
  const emblemBadgeSize = Math.round(qrSize * 0.19);
  const emblemBadgeX = qrX + (qrSize - emblemBadgeSize) / 2;
  const emblemBadgeY = qrY + (qrSize - emblemBadgeSize) / 2;

  // Mask with solid white rounded background
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E4E4E7';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, emblemBadgeX, emblemBadgeY, emblemBadgeSize, emblemBadgeSize, 10);
  ctx.fill();
  ctx.stroke();

  // Draw REKALA emblem logo
  try {
    const emblemImg = await loadImage('/logo/logo-warna.png');
    const innerPadding = 6;
    const innerSize = emblemBadgeSize - innerPadding * 2;
    ctx.drawImage(
      emblemImg,
      emblemBadgeX + innerPadding,
      emblemBadgeY + innerPadding,
      innerSize,
      innerSize
    );
  } catch {
    ctx.fillStyle = '#D97706';
    ctx.font = 'bold 32px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('R', emblemBadgeX + emblemBadgeSize / 2, emblemBadgeY + emblemBadgeSize / 2);
  }

  // 5. Compact Footer ID Badge — tucked neatly under QR code
  ctx.save();
  const formattedId = formatArchiveId(archive.id);
  const badgeWidth = 200;
  const badgeHeight = 40;
  const badgeX = (width - badgeWidth) / 2;
  const badgeY = height - 56;

  // Monospace Amber Badge — web: px-2 py-px → canvas: px-16 py-6
  ctx.fillStyle = '#FEF3C7'; // amber-50
  ctx.strokeStyle = '#FDE68A'; // amber-200
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 8);
  ctx.fill();
  ctx.stroke();

  // Badge Text — web: 10px bold mono → canvas: ~20px
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  ctx.fillStyle = '#92400E'; // amber-800
  ctx.fillText(formattedId, width / 2, badgeY + badgeHeight / 2 + 1);
  ctx.restore();

  return canvas;
}

/**
 * Downloads single sticker card as a high-DPI PNG
 */
export async function downloadStickerPNG(
  archive: Archive | { id: string; title: string },
  qrCanvasElement?: HTMLCanvasElement | null
): Promise<void> {
  const canvas = await generateStickerCanvas(archive, qrCanvasElement);
  const formattedId = formatArchiveId(archive.id);
  const url = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = `Stiker-QR-${formattedId}.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Bulk exports all stickers as a .ZIP file containing compact PNGs
 */
export async function downloadAllStickersZip(
  archives: Archive[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('REKALA-Stiker-QR');

  for (let i = 0; i < archives.length; i++) {
    const archive = archives[i];
    const qrCanvas = document.getElementById(
      `sticker-qr-${archive.id}`
    ) as HTMLCanvasElement | null;

    try {
      const canvas = await generateStickerCanvas(archive, qrCanvas);
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const filename = `Stiker-QR-${formatArchiveId(archive.id)}.png`;
      folder?.file(filename, base64Data, { base64: true });
    } catch (err) {
      console.error(`Failed to export sticker for ${archive.id}`, err);
    }

    if (onProgress) {
      onProgress(i + 1, archives.length);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.download = 'REKALA-Stiker-QR-Semua-Arsip.zip';
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
