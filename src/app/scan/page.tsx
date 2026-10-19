import type { Metadata } from 'next';
import { getAllArchives } from '@/lib/archives';
import { CameraHub } from '@/components/scanner/CameraHub';

export const metadata: Metadata = {
  title: 'Pemindai QR & Photobooth — REKALA',
  description:
    'Pindai kode QR arsip atau abadikan momen Anda dengan bingkai retro khas REKALA — Reka Waktu, Hidupkan Sejarah.',
  alternates: {
    canonical: '/scan',
  },
};

export default async function ScanPage() {
  const archives = await getAllArchives();

  return (
    <div className="bg-stone-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen pt-14 pb-12 px-4 flex flex-col items-center justify-start relative overflow-x-hidden transition-colors duration-300">
      <CameraHub sampleArchives={archives} />
    </div>
  );
}
