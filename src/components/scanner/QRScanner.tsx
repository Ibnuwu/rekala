'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Archive } from '@/data/archives';

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

interface QRScannerProps {
  sampleArchives: Archive[];
}

export function QRScanner({ sampleArchives }: QRScannerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchActive, setTorchActive] = useState<boolean>(false);

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
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
      }
    } catch {
      // Audio context fallback
    }
  };

  const processAndNavigate = useCallback(
    (rawValue: string, isFromManual = false) => {
      if (!rawValue) return;
      setManualError(null);

      let targetId = rawValue.trim();
      if (targetId.includes('/arsip/')) {
        const parts = targetId.split('/arsip/');
        targetId = parts[parts.length - 1].split('?')[0].split('#')[0];
      } else if (targetId.startsWith('http')) {
        try {
          const parsed = new URL(targetId);
          const segments = parsed.pathname.split('/').filter(Boolean);
          if (segments.length > 0) {
            targetId = segments[segments.length - 1];
          }
        } catch {
          // ignore
        }
      }

      const matched = sampleArchives.find(
        (a) =>
          a.id.toLowerCase() === targetId.toLowerCase() ||
          a.id.toLowerCase().replace(/-0+/, '-') === targetId.toLowerCase().replace(/-0+/, '-')
      );

      if (!matched && isFromManual) {
        setManualError(
          `ID arsip "${targetId}" tidak ditemukan. Silakan periksa kembali kode ID atau cari di galeri.`
        );
        return;
      }

      const finalId = matched ? matched.id : targetId;
      setScannedResult(finalId);
      playBeep();

      setTimeout(() => {
        router.push(`/arsip/${finalId}`);
      }, 500);
    },
    [router, sampleArchives]
  );

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const newStatus = !torchActive;
        const trackWithConstraints = track as unknown as {
          applyConstraints: (constraints: { advanced: [{ torch: boolean }] }) => Promise<void>;
        };
        if (typeof trackWithConstraints.applyConstraints === 'function') {
          await trackWithConstraints.applyConstraints({
            advanced: [{ torch: newStatus }],
          });
        }
        setTorchActive(newStatus);
      } catch (err) {
        console.warn('Torch constraint error', err);
      }
    }
  };

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung oleh browser Anda.');
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
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

      const track = stream.getVideoTracks()[0];
      const trackWithCapabilities = track as unknown as {
        getCapabilities?: () => { torch?: boolean };
      };
      if (track && typeof trackWithCapabilities?.getCapabilities === 'function') {
        const capabilities = trackWithCapabilities.getCapabilities();
        setHasTorch(Boolean(capabilities?.torch));
      }

      setCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera start error:', err);
      setCameraActive(false);
      const errorObj = err as { name?: string; message?: string };
      if (errorObj?.name === 'NotAllowedError' || errorObj?.name === 'PermissionDeniedError') {
        setCameraError('Izin kamera ditolak. Silakan aktifkan izin kamera pada browser.');
      } else {
        setCameraError(errorObj?.message || 'Tidak dapat mengakses kamera.');
      }
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
    setTorchActive(false);
  }, []);

  useEffect(() => {
    if (!cameraActive || !videoRef.current) return;

    let detector: BarcodeDetectorInstance | null = null;
    if (typeof window !== 'undefined' && window.BarcodeDetector) {
      try {
        detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch {
        detector = null;
      }
    }

    let isScanning = true;

    const detectFrame = async () => {
      if (!isScanning) return;

      if (detector && videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            processAndNavigate(barcodes[0].rawValue, false);
            return;
          }
        } catch {
          // ignore
        }
      }

      if (isScanning && cameraActive) {
        animationFrameRef.current = requestAnimationFrame(detectFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(detectFrame);

    return () => {
      isScanning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive, processAndNavigate]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    processAndNavigate(manualInput.trim(), true);
  };

  const flipCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      {/* ── Left Column: Immersive Viewfinder ── */}
      <div className="lg:col-span-7 space-y-4">
        {/* Viewfinder Container — Borderless, Rounded, Glowing */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl shadow-zinc-950/30 dark:shadow-black/40">
          {/* Floating Status Badge — top-left overlay */}
          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  cameraActive
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span className="text-zinc-300">
                {cameraActive ? 'Kamera Aktif' : 'Siaga'}
              </span>
            </div>
          </div>

          {/* Floating Controls — top-right overlay */}
          {cameraActive && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              {hasTorch && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                    torchActive
                      ? 'bg-amber-500/90 border-amber-400/60 text-zinc-950'
                      : 'bg-zinc-900/70 border-zinc-700/60 text-zinc-300 hover:text-white'
                  }`}
                  aria-label="Nyalakan senter kamera"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={flipCamera}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-900/70 backdrop-blur-md border border-zinc-700/60 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Ganti arah kamera"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-900/70 backdrop-blur-md border border-zinc-700/60 text-zinc-300 hover:text-rose-400 transition-colors cursor-pointer"
                aria-label="Hentikan kamera"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            </div>
          )}

          {/* ── Viewfinder Video Area ── */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-zinc-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Scanner Target Overlay — L-shaped Corner Brackets + Scan Line */}
            {cameraActive && !scannedResult && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-52 h-52 sm:w-64 sm:h-64">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-amber-400/80 rounded-tl-sm" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-amber-400/80 rounded-tr-sm" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-amber-400/80 rounded-bl-sm" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-amber-400/80 rounded-br-sm" />

                  {/* Animated horizontal scanning line */}
                  <div
                    className="absolute left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80"
                    style={{
                      animation: 'scanLine 2.5s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Scanned Result Overlay */}
            {scannedResult && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 animate-pulse">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">
                  QR Berhasil Terpindai
                </span>
                <p className="font-serif text-lg text-white font-medium">
                  Membuka {scannedResult}&hellip;
                </p>
              </div>
            )}

            {/* ── Standby Empty State ── */}
            {!cameraActive && (
              <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 space-y-5">
                {/* Pulsing scan icon */}
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-amber-400/80 animate-pulse">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                  </svg>
                </div>

                <div className="space-y-1.5 max-w-[280px]">
                  <p className="font-serif text-base sm:text-lg text-zinc-100 font-medium">
                    Kamera Belum Aktif
                  </p>
                  <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                    Aktifkan kamera untuk memindai label QR yang terpasang pada bingkai foto arsip.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startCamera}
                  className="px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide bg-amber-500 hover:bg-amber-400 text-zinc-950 hover:shadow-lg hover:shadow-amber-500/20 transition-all rounded-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Mulai Pemindaian</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Camera Error Alert */}
        {cameraError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-200 text-xs rounded-xl space-y-1 transition-colors duration-200">
            <p className="font-semibold">Kendala Kamera:</p>
            <p>{cameraError}</p>
          </div>
        )}
      </div>

      {/* ── Right Column: Manual Input & Demo ── */}
      <div className="lg:col-span-5 space-y-5">
        {/* Manual ID Input Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-4 transition-colors duration-200">
          <div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-400 mb-1 block">
              Alternatif Manual
            </span>
            <h2 className="font-serif text-lg sm:text-xl text-zinc-900 dark:text-zinc-100 font-medium">
              Masukkan Kode ID Arsip
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Jika perangkat Anda tidak memiliki kamera atau izin ditolak, ketik kode ID arsip yang tercetak di bawah QR fisik.
          </p>

          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
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
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                aria-invalid={manualError ? 'true' : 'false'}
                aria-describedby={manualError ? 'manual-error-desc' : undefined}
              />
            </div>

            {manualError && (
              <p id="manual-error-desc" className="text-xs text-rose-500 dark:text-rose-400">
                {manualError}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 rounded-xl transition-all cursor-pointer"
            >
              Buka Arsip Sekarang
            </button>
          </form>
        </div>

        {/* Quick Demo Shortcuts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3 transition-colors duration-200">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-400 block">
            Coba Cepat — Sampel ID
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleArchives.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => processAndNavigate(item.id, true)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800/70 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-zinc-200 dark:border-zinc-700 hover:border-amber-400/50 dark:hover:border-amber-700/50 text-zinc-700 dark:text-zinc-300 hover:text-amber-700 dark:hover:text-amber-400 font-mono text-xs transition-all cursor-pointer"
              >
                {item.id}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
            Klik salah satu ID di atas untuk menguji navigasi otomatis.
          </p>
        </div>

        {/* Panduan Link */}
        <Link
          href="/panduan"
          className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-xs hover:border-amber-400/50 dark:hover:border-amber-700/50 transition-colors group"
        >
          <span className="text-zinc-600 dark:text-zinc-400">Butuh panduan pemindaian?</span>
          <span className="text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase text-[10px] group-hover:translate-x-0.5 transition-transform">
            Baca Panduan &rarr;
          </span>
        </Link>
      </div>

      {/* Inline Keyframe for Scan Line Animation */}
      <style jsx>{`
        @keyframes scanLine {
          0%, 100% { top: 12px; }
          50% { top: calc(100% - 12px); }
        }
      `}</style>
    </div>
  );
}
