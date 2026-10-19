'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Archive } from '@/data/archives';

/* ── Barcode Detector Types ── */
interface BarcodeResult {
  rawValue: string;
}

interface BarcodeDetectorInstance {
  detect: (source: HTMLVideoElement) => Promise<BarcodeResult[]>;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    BarcodeDetector?: {
      new (options?: { formats: string[] }): BarcodeDetectorInstance;
    };
  }
}

/* ── Historical Filter Presets ── */
type FilterId = 'normal' | 'bw' | 'sepia';

interface FilterPreset {
  id: FilterId;
  label: string;
  css: string;
}

const FILTERS: FilterPreset[] = [
  { id: 'normal', label: 'Normal', css: 'none' },
  { id: 'bw', label: '1880 (Hitam-Putih)', css: 'grayscale(100%) contrast(120%) brightness(95%)' },
  { id: 'sepia', label: '1900 (Sepia)', css: 'sepia(80%) contrast(110%) brightness(90%)' },
];

/* ── Props ── */
interface CameraHubProps {
  sampleArchives: Archive[];
}

export function CameraHub({ sampleArchives }: CameraHubProps) {
  const router = useRouter();

  /* ── Shared State & Refs ── */
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [activeTab, setActiveTab] = useState<'qr' | 'photobooth'>('qr');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  /* ── QR State ── */
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  /* ── Photobooth State ── */
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShot, setCurrentShot] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterId>('normal');

  /* ──────────────── Audio Helpers (Web Audio API) ──────────────── */
  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      /* silent fallback */
    }
  }, []);

  const playShutter = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.09);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {
      /* silent fallback */
    }
  }, []);

  /* ──────────────── Camera Management (Single Stream Reused) ──────────────── */
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Kamera tidak didukung oleh browser ini.');
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      setCameraActive(false);
      const e = err as { name?: string; message?: string };
      setCameraError(
        e?.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Silakan berikan izin kamera pada browser Anda.'
          : e?.message || 'Tidak dapat mengakses perangkat kamera.'
      );
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const flipCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, [stopCamera]);

  // Restart camera when facing mode toggled and was previously active
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /* ──────────────── QR Code Detection Loop ──────────────── */
  const processAndNavigate = useCallback(
    (rawValue: string, isFromManual = false) => {
      if (!rawValue) return;
      setManualError(null);

      let targetId = rawValue.trim();
      if (targetId.includes('/arsip/')) {
        targetId = targetId.split('/arsip/').pop()!.split('?')[0].split('#')[0];
      } else if (targetId.startsWith('http')) {
        try {
          const u = new URL(targetId);
          const s = u.pathname.split('/').filter(Boolean);
          if (s.length) targetId = s.pop()!;
        } catch {
          /* ignore */
        }
      }

      const matched = sampleArchives.find(
        (a) =>
          a.id.toLowerCase() === targetId.toLowerCase() ||
          a.id.toLowerCase().replace(/-0+/, '-') === targetId.toLowerCase().replace(/-0+/, '-')
      );

      if (!matched && isFromManual) {
        setManualError(`ID arsip "${targetId}" tidak ditemukan.`);
        return;
      }

      const finalId = matched ? matched.id : targetId;
      setScannedResult(finalId);
      playBeep();
      setTimeout(() => {
        router.push(`/arsip/${finalId}`);
      }, 500);
    },
    [router, sampleArchives, playBeep]
  );

  useEffect(() => {
    if (activeTab !== 'qr' || !cameraActive || !videoRef.current) return;

    let detector: BarcodeDetectorInstance | null = null;
    if (typeof window !== 'undefined' && window.BarcodeDetector) {
      try {
        detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch {
        detector = null;
      }
    }

    let alive = true;
    const detect = async () => {
      if (!alive) return;
      if (detector && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            processAndNavigate(barcodes[0].rawValue, false);
            return;
          }
        } catch {
          /* frame dropped or invalid */
        }
      }
      if (alive && cameraActive) {
        animationFrameRef.current = requestAnimationFrame(detect);
      }
    };

    animationFrameRef.current = requestAnimationFrame(detect);
    return () => {
      alive = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeTab, cameraActive, processAndNavigate]);

  /* ──────────────── Photobooth Capture ──────────────── */
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const c = document.createElement('canvas');
    c.width = video.videoWidth || 640;
    c.height = video.videoHeight || 480;
    const ctx = c.getContext('2d');
    if (!ctx) return null;

    // Draw video snapshot without hardcoding filter so live filter switching remains fluid
    ctx.drawImage(video, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  }, []);

  const startPhotoSequence = useCallback(async () => {
    if (!cameraActive) {
      await startCamera();
    }
    setPhotos([]);
    setCurrentShot(0);
    setIsCapturing(true);
  }, [cameraActive, startCamera]);

  // Countdown & auto 4-shot sequence
  useEffect(() => {
    if (!isCapturing || currentShot >= 4) {
      if (currentShot >= 4) setIsCapturing(false);
      return;
    }

    setCountdown(3);
    let count = 3;

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);

        // Shutter flash & sound
        setShowFlash(true);
        playShutter();
        setTimeout(() => setShowFlash(false), 100);

        // Take shot
        const dataUrl = capturePhoto();
        if (dataUrl) {
          setPhotos((prev) => [...prev, dataUrl]);
        }
        setCurrentShot((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCapturing, currentShot, capturePhoto, playShutter]);

  const resetPhotobooth = () => {
    setPhotos([]);
    setCurrentShot(0);
    setIsCapturing(false);
    setCountdown(null);
  };

  /* ──────────────── Canvas Compositing & Export (600x1200) ──────────────── */
  const downloadStrip = useCallback(async () => {
    if (photos.length < 4) return;

    const W = 600;
    const H = 1200;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // 1. Amber background (#f59e0b)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, W, H);

    // 2. Vintage inner border outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(14, 14, W - 28, H - 28, 20);
    ctx.stroke();

    // 3. Header badge
    ctx.fillStyle = '#18181b';
    ctx.font = '900 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('REKALA MEMORIES ✦ SEJARAH BANTEN', W / 2, 54);

    // 4. 4 Vertical Photo Windows
    const padX = 42;
    const photoW = W - padX * 2; // 516px
    const photoH = 208; // 208px each
    const startY = 76;
    const gap = 16;

    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const activeFilterObj = FILTERS.find((f) => f.id === activeFilter);
    const filterCss = activeFilterObj && activeFilterObj.css !== 'none' ? activeFilterObj.css : 'none';

    for (let i = 0; i < 4; i++) {
      const x = padX;
      const y = startY + i * (photoH + gap);

      // White frame polaroid card
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 6, y - 6, photoW + 12, photoH + 12, 10);
      ctx.fill();

      try {
        const img = await loadImg(photos[i]);

        // Object-fit: cover calculation
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
        ctx.roundRect(x, y, photoW, photoH, 6);
        ctx.clip();

        // Apply active historical filter
        if (filterCss !== 'none') {
          ctx.filter = filterCss;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, photoW, photoH);
        ctx.restore();
      } catch {
        /* skip corrupted image */
      }
    }

    // 5. Decorative Stickers Area
    const stickerY = startY + 4 * (photoH + gap) + 14;
    ctx.fillStyle = '#18181b';
    ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("✦ I'M A STAR ✦", padX, stickerY);

    ctx.textAlign = 'right';
    ctx.fillText('BELIEVE IN YOURSELF', W - padX, stickerY);

    // 6. Footer
    ctx.textAlign = 'center';
    ctx.font = '600 11px monospace';
    ctx.fillStyle = 'rgba(24, 24, 27, 0.7)';
    ctx.fillText(
      `rekala.id  •  ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      W / 2,
      H - 34
    );

    // 7. Overlay /frames/photobooth-frame.png if available
    try {
      const frameImg = await loadImg('/frames/photobooth-frame.png');
      ctx.drawImage(frameImg, 0, 0, W, H);
    } catch {
      /* frame overlay file optional */
    }

    // 8. Download PNG
    const link = document.createElement('a');
    link.download = `rekala-photobooth-${Date.now()}.png`;
    link.href = c.toDataURL('image/png');
    link.click();
  }, [photos, activeFilter]);

  /* ──────────────── Tab Switching ──────────────── */
  const switchTab = (tab: 'qr' | 'photobooth') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setScannedResult(null);
    setManualError(null);
    resetPhotobooth();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      processAndNavigate(manualInput.trim(), true);
    }
  };

  /* ──────────────── RENDER ──────────────── */
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* ── Clean Tab Switcher (No Emojis & Light/Dark Themed) ── */}
      <div className="inline-flex p-1 bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 rounded-full shadow-sm mb-6 z-20">
        <button
          type="button"
          onClick={() => switchTab('qr')}
          className={`px-5 py-2 rounded-full text-xs transition-all cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 font-semibold shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-5 py-2 text-xs font-medium'
          }`}
        >
          Pindai QR
        </button>
        <button
          type="button"
          onClick={() => switchTab('photobooth')}
          className={`px-5 py-2 rounded-full text-xs transition-all cursor-pointer ${
            activeTab === 'photobooth'
              ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 font-semibold shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-5 py-2 text-xs font-medium'
          }`}
        >
          Photobooth
        </button>
      </div>

      {/* ── Subtitle (Dual-Theme Adaptive) ── */}
      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-6 leading-relaxed">
        {activeTab === 'qr'
          ? 'Arahkan kamera ke kode QR pada bingkai arsip fisik untuk menelusuri kisah lengkapnya.'
          : 'Abadikan 4 foto seru dengan bingkai scrapbook khas REKALA!'}
      </p>

      {/* ── Camera Viewfinder Container ── */}
      <div className="w-full relative">
        <div className="relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-900 shadow-xl overflow-hidden">
          {/* Shutter Flash Effect (100ms) */}
          {showFlash && <div className="absolute inset-0 bg-white z-50 pointer-events-none" />}

          {/* Video Feed */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-zinc-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              style={
                activeTab === 'photobooth' && cameraActive
                  ? { filter: FILTERS.find((f) => f.id === activeFilter)?.css || 'none' }
                  : undefined
              }
            />

            {/* QR Viewfinder: Overlay Corner Brackets & Scan Line */}
            {activeTab === 'qr' && cameraActive && !scannedResult && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-52 h-52 sm:w-60 sm:h-60">
                  <div className="border-t-2 border-l-2 border-amber-400 w-4 h-4 absolute top-4 left-4" />
                  <div className="border-t-2 border-r-2 border-amber-400 w-4 h-4 absolute top-4 right-4" />
                  <div className="border-b-2 border-l-2 border-amber-400 w-4 h-4 absolute bottom-4 left-4" />
                  <div className="border-b-2 border-r-2 border-amber-400 w-4 h-4 absolute bottom-4 right-4" />
                  <div
                    className="bg-gradient-to-r from-transparent via-amber-400 to-transparent h-[2px] w-full animate-scan absolute left-0"
                    style={{ animation: 'scanLine 2.5s ease-in-out infinite' }}
                  />
                </div>
              </div>
            )}

            {/* QR Scanned Success Feedback */}
            {activeTab === 'qr' && scannedResult && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 animate-pulse">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">
                  QR Berhasil Terpindai
                </span>
                <p className="font-serif text-lg text-white font-medium">Membuka {scannedResult}&hellip;</p>
              </div>
            )}

            {/* Photobooth Countdown Overlay */}
            {activeTab === 'photobooth' && countdown !== null && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 pointer-events-none">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 mb-2">
                  Foto {currentShot + 1} / 4
                </span>
                <span className="text-8xl sm:text-9xl font-serif font-bold text-white animate-pulse drop-shadow-2xl">
                  {countdown}
                </span>
              </div>
            )}

            {/* Standby State (When camera is off) */}
            {!cameraActive && (
              <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-amber-400/80 animate-pulse">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                  </svg>
                </div>
                <div className="space-y-1.5 max-w-[280px]">
                  <p className="font-serif text-base sm:text-lg text-zinc-100 font-medium">Kamera Belum Aktif</p>
                  <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                    Aktifkan kamera untuk {activeTab === 'qr' ? 'memindai label QR arsip.' : 'mulai berfoto.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide bg-amber-500 hover:bg-amber-400 text-zinc-950 hover:shadow-lg hover:shadow-amber-500/20 transition-all rounded-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Aktifkan Kamera</span>
                </button>
              </div>
            )}
          </div>

          {/* Modern Status Badge (Clean text pill with live indicator) */}
          {cameraActive && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase bg-zinc-950/70 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {activeTab === 'qr' ? 'Pemindaian Aktif' : `Foto ${Math.min(currentShot + 1, 4)} / 4`}
              </span>
            </div>
          )}

          {/* Floating Camera Controls */}
          {cameraActive && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={flipCamera}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-950/70 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Ganti arah kamera"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-950/70 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-rose-400 transition-colors cursor-pointer"
                aria-label="Hentikan kamera"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Camera Error Alert */}
        {cameraError && (
          <div className="mt-3 p-3 bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs rounded-xl">
            <p className="font-semibold mb-0.5">Kendala Kamera:</p>
            <p>{cameraError}</p>
          </div>
        )}
      </div>

      {/* ──────────── MODE 1: QR CODE ADDITIONAL TOOLS ──────────── */}
      {activeTab === 'qr' && (
        <div className="w-full mt-6 space-y-4">
          {/* Manual Input Form */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-400 block">
              Alternatif Manual
            </span>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <label htmlFor="manual-id" className="sr-only">
                Kode ID Arsip
              </label>
              <input
                id="manual-id"
                type="text"
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  setManualError(null);
                }}
                placeholder="Contoh: Arsip-01"
                className="flex-1 px-4 py-2.5 bg-stone-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-semibold text-xs rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                Buka
              </button>
            </form>
            {manualError && <p className="text-xs text-rose-500 dark:text-rose-400">{manualError}</p>}
          </div>

          {/* Quick Demo IDs */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-semibold mr-1">Coba:</span>
            {sampleArchives.slice(0, 5).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => processAndNavigate(a.id, true)}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-400/50 dark:hover:border-amber-700/50 font-mono text-[11px] transition-all cursor-pointer"
              >
                {a.id}
              </button>
            ))}
          </div>

          {/* Panduan Link */}
          <Link
            href="/panduan"
            className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-xs hover:border-amber-500/50 transition-colors group shadow-sm"
          >
            <span className="text-zinc-600 dark:text-zinc-400">Butuh panduan pemindaian?</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase text-[10px] group-hover:translate-x-0.5 transition-transform">
              Panduan &rarr;
            </span>
          </Link>
        </div>
      )}

      {/* ──────────── MODE 2: RETRO PHOTOBOOTH ──────────── */}
      {activeTab === 'photobooth' && (
        <div className="w-full mt-6 space-y-6">
          {/* 3D Action Button: MULAI BERFOTO (4 KALI) */}
          {photos.length < 4 && !isCapturing && (
            <button
              type="button"
              onClick={startPhotoSequence}
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all shadow-[0_4px_0_#b45309] active:translate-y-[4px] active:shadow-none flex items-center gap-2 mx-auto mt-4 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>MULAI BERFOTO (4 KALI)</span>
            </button>
          )}

          {/* Capturing status indicator */}
          {isCapturing && (
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Sesi Berfoto Sedang Berlangsung ({Math.min(currentShot + 1, 4)} / 4)</span>
            </div>
          )}

          {/* Photo Strip Scrapbook Preview */}
          {(photos.length > 0 || isCapturing) && (
            <div className="w-[260px] bg-amber-400 text-zinc-950 p-3.5 rounded-2xl border-4 border-zinc-100 shadow-2xl flex flex-col gap-2.5 relative mx-auto overflow-hidden">
              {/* Optional overlay frame if loaded in DOM */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/frames/photobooth-frame.png"
                alt="Photobooth Frame"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Header Badge */}
              <div className="text-center pt-1 pb-0.5">
                <span className="text-[9.5px] font-black tracking-widest uppercase block">
                  REKALA MEMORIES ✦ SEJARAH BANTEN
                </span>
              </div>

              {/* 4 Photo Windows (Vertical Strip) */}
              <div className="flex flex-col gap-2 relative z-10">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-white border-2 border-zinc-100 relative shadow-sm"
                  >
                    {photos[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photos[i]}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover transition-all duration-200"
                        style={{
                          filter: FILTERS.find((f) => f.id === activeFilter)?.css || 'none',
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-300">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                        <span className="text-[8px] font-mono mt-1 text-zinc-400">Slot #{i + 1}</span>
                      </div>
                    )}
                    {/* Shot number tag */}
                    <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-zinc-950/70 text-white text-[8px] font-bold flex items-center justify-center backdrop-blur-sm">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Overlay Stickers */}
              <div className="flex items-center justify-between px-1 pt-1 text-[8px] font-black tracking-wider uppercase opacity-85 z-10">
                <span>✦ I&apos;M A STAR ✦</span>
                <span>BELIEVE IN YOURSELF</span>
              </div>

              {/* Strip Footer */}
              <div className="text-center pb-0.5 z-10">
                <span className="text-[8px] font-mono opacity-70">
                  rekala.id • {new Date().toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* Historical Filter Selector (Live under photo strip preview) */}
          <div className="flex flex-col items-center justify-center gap-2 pt-2">
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-semibold">
              PILIH FILTER HISTORIS:
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    activeFilter === f.id
                      ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 border-amber-600 dark:border-amber-500 shadow-sm font-semibold'
                      : 'bg-white dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Foto Ulang & Unduh Photo Strip (No Emojis) */}
          {photos.length >= 4 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetPhotobooth}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                <span>Foto Ulang</span>
              </button>
              <button
                type="button"
                onClick={downloadStrip}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition-all cursor-pointer flex items-center gap-2 shadow-md"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Unduh Photo Strip</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Global CSS for scan line keyframes */}
      <style jsx>{`
        @keyframes scanLine {
          0%,
          100% {
            top: 16px;
          }
          50% {
            top: calc(100% - 16px);
          }
        }
      `}</style>
    </div>
  );
}
