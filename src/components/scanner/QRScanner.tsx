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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Interactive Viewfinder */}
      <div className="lg:col-span-7 space-y-4">
        <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
          {/* Viewfinder Header Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${cameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="font-mono text-xs text-[var(--text-secondary)] font-medium">
                {cameraActive ? 'Kamera Aktif' : 'Kamera Siaga'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasTorch && cameraActive && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`px-2.5 py-1 rounded text-[0.6875rem] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    torchActive
                      ? 'bg-[var(--accent-gold)] text-[var(--accent-gold-text-on)] font-bold'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                  aria-label="Nyalakan senter kamera"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>{torchActive ? 'Senter Aktif' : 'Senter'}</span>
                </button>
              )}

              {cameraActive && (
                <button
                  type="button"
                  onClick={flipCamera}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors text-[0.6875rem] font-mono cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  Ganti Arah
                </button>
              )}
            </div>
          </div>

          {/* Viewfinder Video Area */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden archive-placeholder-frame">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Reticle */}
            {cameraActive && !scannedResult && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-[var(--accent-gold)]/70 rounded-lg">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-[var(--accent-gold)]" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-[var(--accent-gold)]" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-[var(--accent-gold)]" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-[var(--accent-gold)]" />
                  <div className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent animate-bounce opacity-90" style={{ animationDuration: '2.5s' }} />
                </div>
              </div>
            )}

            {/* Scanned Result Card */}
            {scannedResult && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-gold)]">
                  QR Berhasil Terpindai
                </span>
                <p className="font-serif text-lg text-white font-medium mt-1">
                  Membuka Dokumen {scannedResult}...
                </p>
              </div>
            )}

            {/* Standby State with Archival Monogram */}
            {!cameraActive && (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-gold)] shadow-inner">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                  </svg>
                </div>
                <div className="space-y-1 max-w-xs">
                  <p className="font-serif text-lg text-[var(--text-title)] font-medium">
                    Kamera Belum Aktif
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-sans">
                    Tekan tombol di bawah untuk mengizinkan kamera ponsel memindai label QR arsip.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="btn btn-gold cursor-pointer"
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

          {/* Viewfinder Footer Action Strip */}
          <div className="px-4 py-3 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="text-[0.6875rem] font-mono">
              Mode: {facingMode === 'environment' ? 'Belakang (Utama)' : 'Depan'}
            </span>
            {cameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors font-mono text-[0.6875rem] cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                Hentikan Kamera
              </button>
            ) : (
              <span className="font-mono text-[0.6875rem]">Klik &ldquo;Aktifkan Kamera&rdquo; untuk memulai</span>
            )}
          </div>
        </div>

        {cameraError && (
          <div className="p-4 bg-rose-950/30 border border-rose-800/50 text-rose-200 text-xs rounded-xl space-y-1">
            <p className="font-semibold">Kendala Kamera:</p>
            <p>{cameraError}</p>
          </div>
        )}
      </div>

      {/* Right Column: Manual Input & Demo */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
          <span className="badge-gold">Alternatif Manual</span>
          <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-title)] font-medium">
            Masukkan Kode ID Arsip
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans font-light">
            Jika perangkat Anda tidak memiliki kamera atau izin ditolak, Anda dapat mengetik kode ID arsip yang tercetak di bawah QR fisik:
          </p>

          <form onSubmit={handleManualSubmit} className="space-y-3 pt-2">
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
                placeholder="Contoh: arsip-001"
                className="w-full px-4 py-3 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                aria-invalid={manualError ? 'true' : 'false'}
                aria-describedby={manualError ? 'manual-error-desc' : undefined}
              />
            </div>

            {manualError && (
              <p id="manual-error-desc" className="text-xs text-rose-400 font-mono">
                {manualError}
              </p>
            )}

            <button
              type="submit"
              className="w-full btn btn-gold cursor-pointer"
            >
              Buka Arsip Sekarang
            </button>
          </form>
        </div>

        {/* Quick Demo Shortcuts */}
        <div className="p-5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3 text-xs">
          <span className="text-[0.625rem] font-mono uppercase tracking-wider text-[var(--accent-gold)] block">
            Coba Cepat (Sampel ID Koleksi)
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleArchives.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => processAndNavigate(item.id, true)}
                className="px-2.5 py-1 rounded bg-[var(--bg-surface)] hover:bg-[var(--accent-gold-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] font-mono text-xs transition-colors cursor-pointer"
              >
                {item.id}
              </button>
            ))}
          </div>
          <p className="text-[0.6875rem] text-[var(--text-muted)] pt-1">
            Klik salah satu ID sampel di atas untuk menguji navigasi otomatis seolah kode QR baru saja dipindai.
          </p>
        </div>

        {/* Panduan Link */}
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
          <span>Butuh panduan pemindaian?</span>
          <Link href="/panduan" className="text-[var(--accent-gold)] hover:underline font-mono uppercase text-[0.6875rem]">
            Baca Panduan &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
