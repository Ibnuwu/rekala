'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Archive } from '@/data/archives';
import { Photobooth } from './Photobooth';
import type { FrameThemeId, PhotoboothFilterId } from '@/lib/photoboothCanvas';

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
interface FilterPreset {
  id: PhotoboothFilterId;
  label: string;
  css: string;
}

const FILTERS: FilterPreset[] = [
  { id: 'normal', label: 'Normal', css: 'none' },
  { id: 'bw', label: '1880 (Hitam-Putih)', css: 'grayscale(100%) contrast(125%) brightness(95%)' },
  { id: 'sepia', label: '1900 (Sepia)', css: 'sepia(80%) contrast(110%) brightness(90%)' },
  { id: 'vintage', label: '1920 (Vintage)', css: 'sepia(40%) contrast(115%) brightness(105%) saturate(120%)' },
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
  const [snapToast, setSnapToast] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<PhotoboothFilterId>('normal');
  const [selectedTheme, setSelectedTheme] = useState<FrameThemeId>('parchment');

  /* ──────────────── Audio Helpers (Procedural Web Audio API) ──────────────── */
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback(
    (freq = 880, duration = 0.12) => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* silent fallback */
      }
    },
    [getAudioContext]
  );

  const playShutter = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Dual mechanical click (curtain opening & mirror slap)
      [0, 0.05].forEach((delay, idx) => {
        const bufferSize = Math.floor(ctx.sampleRate * 0.05);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(idx === 0 ? 1800 : 2600, now + delay);
        filter.Q.setValueAtTime(3, now + delay);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now + delay);
      });

      // 2. Low-frequency body pop (mechanical thud)
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(140, now);
      popOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      popGain.gain.setValueAtTime(0.35, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.08);
    } catch {
      /* silent fallback */
    }
  }, [getAudioContext]);

  /* ──────────────── Camera Management (Single Stream Reused) ──────────────── */
  const startCamera = useCallback(async (mode?: 'environment' | 'user') => {
    const targetMode = mode || facingMode;
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
          facingMode: { ideal: targetMode },
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
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      startCamera(nextMode);
    }
  }, [facingMode, cameraActive, startCamera]);

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

    // In selfie mode (front camera), horizontally mirror snapshot to match preview
    if (facingMode === 'user') {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }

    // Draw video snapshot without hardcoding filter so live filter switching remains fluid
    ctx.drawImage(video, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  }, [facingMode]);

  const startPhotoSequence = useCallback(async () => {
    // Unlock Web Audio context on user gesture
    getAudioContext();
    if (!cameraActive) {
      await startCamera();
    }
    setPhotos([]);
    setCurrentShot(0);
    setIsCapturing(true);
  }, [cameraActive, startCamera, getAudioContext]);

  // Countdown & auto 3-shot sequence
  useEffect(() => {
    if (!isCapturing || currentShot >= 3) {
      return;
    }

    playBeep(880, 0.12);
    let count = 3;

    // Asynchronously initialize countdown timer to prevent cascading render
    const startTimer = setTimeout(() => {
      setCountdown(3);
    }, 0);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        playBeep(count === 1 ? 1200 : 880, 0.12);
      } else {
        clearInterval(interval);
        setCountdown(null);

        // Shutter flash & procedural audio
        setShowFlash(true);
        playShutter();
        const nextShotNumber = currentShot + 1;
        setSnapToast(`FOTO [${nextShotNumber}/3] TERAMBIL!`);
        setTimeout(() => setShowFlash(false), 120);
        setTimeout(() => setSnapToast(null), 1200);

        // Take snapshot
        const dataUrl = capturePhoto();
        if (dataUrl) {
          setPhotos((prev) => [...prev, dataUrl]);
        }

        if (nextShotNumber >= 3) {
          setIsCapturing(false);
          setCurrentShot(3);
        } else {
          setCurrentShot(nextShotNumber);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [isCapturing, currentShot, capturePhoto, playShutter, playBeep]);

  const resetPhotobooth = () => {
    setPhotos([]);
    setCurrentShot(0);
    setIsCapturing(false);
    setCountdown(null);
    setSnapToast(null);
  };

  // Re-attach active camera stream on tab switch
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeTab, cameraActive]);

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

  /* ──────────────── Viewfinder Helper ──────────────── */
  const renderViewfinder = () => (
    <div className="w-full relative">
      <div className="relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-900 shadow-xl overflow-hidden">
        {/* Shutter Flash Effect (100ms) */}
        {showFlash && (
          <div className="bg-white inset-0 absolute z-50 transition-opacity duration-100 opacity-100 pointer-events-none" />
        )}

        {/* Shutter Snap Toast Indicator */}
        {snapToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-amber-500 text-zinc-950 font-mono text-xs font-black tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.6)] border border-amber-300 flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
            <span>{snapToast}</span>
          </div>
        )}

        {/* Video Feed */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-zinc-950 flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover transition-transform duration-200 ${
              facingMode === 'user' ? '-scale-x-100' : ''
            } ${cameraActive ? 'block' : 'hidden'}`}
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

          {/* Photobooth Composition Safe-Area Reticle */}
          {activeTab === 'photobooth' && cameraActive && countdown === null && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 select-none">
              <div className="relative w-full h-full max-w-sm max-h-72 border border-white/10 rounded-xl">
                <div className="border-t-2 border-l-2 border-amber-400/70 w-3.5 h-3.5 absolute -top-0.5 -left-0.5 rounded-tl" />
                <div className="border-t-2 border-r-2 border-amber-400/70 w-3.5 h-3.5 absolute -top-0.5 -right-0.5 rounded-tr" />
                <div className="border-b-2 border-l-2 border-amber-400/70 w-3.5 h-3.5 absolute -bottom-0.5 -left-0.5 rounded-bl" />
                <div className="border-b-2 border-r-2 border-amber-400/70 w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5 rounded-br" />
                {/* Subtle center tick */}
                <div className="absolute inset-0 flex items-center justify-center opacity-25">
                  <div className="w-4 h-px bg-amber-400" />
                  <div className="h-4 w-px bg-amber-400 absolute" />
                </div>
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

          {/* Modern Glassmorphism HUD Countdown Timer */}
          {activeTab === 'photobooth' && countdown !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/45 backdrop-blur-sm z-30 pointer-events-none animate-fadeIn">
              {/* Upper Slot Indicator Badge */}
              <div className="mb-3 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 backdrop-blur-md shadow-lg shadow-amber-950/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                  FOTO [{currentShot + 1}/3]
                </span>
              </div>

              {/* Modern Circular Ring Gauge */}
              <div className="w-32 h-32 relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-amber-400/20 fill-none"
                    strokeWidth="6"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-amber-400 fill-none transition-all duration-1000 ease-linear"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - (countdown ?? 3) / 3)}
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))',
                    }}
                  />
                </svg>

                {/* Centered Typography with Animated Pop per Tick */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    key={countdown}
                    className="text-6xl font-black tracking-tighter text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.85)] select-none animate-[ping_0.35s_cubic-bezier(0,0,0.2,1)_1]"
                  >
                    {countdown}
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-mono tracking-widest text-zinc-200 mt-3 uppercase font-semibold drop-shadow-sm">
                SENYUM &bull; BERGAYA
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
                onClick={() => startCamera()}
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

        {/* Modern Status Badge */}
        {cameraActive && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase bg-zinc-950/70 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {activeTab === 'qr' ? 'Pemindaian Aktif' : `Foto ${Math.min(currentShot + 1, 3)} / 3`}
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
  );

  /* ──────────────── RENDER ──────────────── */
  return (
    <div
      className={`w-full ${
        activeTab === 'photobooth' ? 'max-w-5xl' : 'max-w-xl'
      } mx-auto flex flex-col items-center transition-all duration-300`}
    >
      {/* ── Clean Tab Switcher (No Emojis & Light/Dark Themed) ── */}
      <div className="inline-flex p-1 bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 rounded-full shadow-sm mb-4 z-20">
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
          : 'Abadikan 3 foto memori arsip dengan bingkai retro khas REKALA!'}
      </p>

      {/* ── Mode 1: QR Code Mode (Single Column) ── */}
      {activeTab === 'qr' && (
        <div className="w-full space-y-6">
          {renderViewfinder()}

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
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-semibold mr-1">
              Coba:
            </span>
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

      {/* ── Mode 2: Two-Column / Balanced Flex Layout (Photobooth) ── */}
      {activeTab === 'photobooth' && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column: Camera Feed & Capture Actions */}
          <div className="w-full flex flex-col items-center space-y-4">
            {renderViewfinder()}

            {/* Action Button: MULAI BERFOTO (3 KALI) */}
            {photos.length < 3 && !isCapturing && (
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={startPhotoSequence}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-8 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2.5 mx-auto cursor-pointer active:scale-95 hover:shadow-amber-500/25 hover:scale-105"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Mulai Berfoto (3 Kali)</span>
                </button>
                {photos.length > 0 && (
                  <button
                    type="button"
                    onClick={resetPhotobooth}
                    className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline underline-offset-4 cursor-pointer"
                  >
                    Reset & foto dari awal
                  </button>
                )}
              </div>
            )}

            {/* Capturing status indicator & Cancel button */}
            {isCapturing && (
              <div className="flex flex-col items-center gap-2.5 py-1">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-semibold tracking-wide">
                    Sesi Berfoto Sedang Berlangsung ({Math.min(currentShot + 1, 3)} / 3)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={resetPhotobooth}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
                >
                  Batalkan Sesi
                </button>
              </div>
            )}

            {/* Completed state hint */}
            {photos.length >= 3 && !isCapturing && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs text-center flex items-center gap-2">
                <span className="text-base leading-none">✓</span>
                <span className="font-medium">3 Foto Selesai! Pilih tema bingkai dan unduh photo strip di sebelah kanan.</span>
              </div>
            )}
          </div>

          {/* Right Column: Clamped Photo Strip Preview & Controls */}
          <div className="w-full flex flex-col items-center justify-center">
            <Photobooth
              photos={photos}
              isCapturing={isCapturing}
              currentShot={currentShot}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              onStartSequence={startPhotoSequence}
              onReset={resetPhotobooth}
              filters={FILTERS}
            />
          </div>
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
