import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center section-padding bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="container-editorial text-center max-w-lg space-y-6">
        <span className="font-serif text-6xl text-[var(--accent-gold)] font-light block">404</span>
        <h1 className="text-3xl font-serif text-[var(--text-title)]">Arsip Tidak Ditemukan</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Dokumen atau halaman arsip yang Anda cari tidak tersedia, telah dipindahkan, atau tautan QR yang dipindai tidak valid.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/galeri" className="btn btn-gold w-full sm:w-auto">
            Jelajahi Galeri
          </Link>
          <Link href="/scan" className="btn btn-ghost w-full sm:w-auto">
            Coba Pindai Ulang
          </Link>
        </div>
      </div>
    </div>
  );
}
