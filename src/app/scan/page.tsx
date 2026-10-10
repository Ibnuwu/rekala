import type { Metadata } from 'next';
import { getAllArchives } from '@/lib/archives';
import { QRScanner } from '@/components/scanner/QRScanner';

export const metadata: Metadata = {
  title: 'Pemindai QR Code Arsip Digital',
  description:
    'Pindai kode QR yang tertera pada bingkai foto arsip DPK Banten untuk mengakses narasi dan data sejarah digital secara langsung.',
  alternates: {
    canonical: '/scan',
  },
};

export default async function ScanPage() {
  const archives = await getAllArchives();

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen py-12 lg:py-20 transition-colors duration-300">
      <div className="container-editorial">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-10 lg:mb-14 space-y-4">
          <span className="badge-gold">
            Akses Langsung
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-title)] font-normal">
            Pemindai QR Arsip
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
            Arahkan kamera ponsel Anda pada kode QR yang terpasang di samping fisik foto arsip
            untuk menelusuri kisah lengkap, konteks peristiwa, serta data historis autentik DPK Banten.
          </p>
        </div>

        {/* Scanner Component */}
        <QRScanner sampleArchives={archives} />
      </div>
    </div>
  );
}
