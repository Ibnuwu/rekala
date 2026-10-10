import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panduan Pemindaian QR & Akses Arsip',
  description:
    'Petunjuk lengkap cara memindai kode QR arsip, etika akses kearsipan, dan pertanyaan umum seputar layanan digital REKALA.',
  alternates: {
    canonical: '/panduan',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Kunjungi Koleksi Fisik',
    desc: 'Datangi lokasi arsip di DPK Banten atau temukan bingkai foto arsip resmi yang terpasang.',
  },
  {
    step: '02',
    title: 'Temukan Label QR pada Bingkai',
    desc: 'Setiap bingkai foto arsip dilengkapi dengan label informasi yang memuat kode QR khusus serta nomor ID arsip.',
  },
  {
    step: '03',
    title: 'Pindai dengan Kamera',
    desc: 'Gunakan fitur "Pindai QR" pada REKALA atau kamera ponsel Anda untuk mengarahkan lensa ke kode QR.',
  },
  {
    step: '04',
    title: 'Pelajari Narasi & Data Sejarah',
    desc: 'Halaman digital akan langsung terbuka, menyajikan uraian sejarah, tahun, lokasi, dan konteks peristiwa secara autentik.',
  },
];

const FAQS = [
  {
    q: 'Apakah perlu mengunduh aplikasi khusus untuk memindai QR?',
    a: 'Tidak perlu. REKALA berbasis web modern yang dapat langsung diakses melalui peramban ponsel (Android/iOS) tanpa perlu instalasi aplikasi tambahan.',
  },
  {
    q: 'Bagaimana jika kamera ponsel tidak dapat memindai atau izin kamera ditolak?',
    a: 'Anda dapat memasukkan kode ID arsip (misal: arsip-001) secara manual pada menu Pindai QR, atau mencari judul foto langsung di Galeri Foto.',
  },
  {
    q: 'Apakah koleksi foto arsip di REKALA boleh digunakan untuk penelitian?',
    a: 'Koleksi digital REKALA terbuka untuk kepentingan edukasi dan riset. Penggunaan untuk publikasi komersial wajib berkoordinasi dengan DPK Banten.',
  },
  {
    q: 'Bagaimana cara memberikan masukan atau data tambahan mengenai foto sejarah?',
    a: 'Masyarakat dapat menyampaikan data kearsipan atau informasi tambahan kepada Seksi Kearsipan DPK Banten.',
  },
];

export default function PanduanPage() {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen py-12 lg:py-20 transition-colors duration-300">
      <div className="container-editorial">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <span className="badge-gold">Petunjuk Pengunjung</span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-title)] font-normal">
            Panduan Akses &amp; Pemindaian
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
            Panduan praktis bagi masyarakat dalam memanfaatkan integrasi fisik dan digital
            guna menggali wawasan sejarah Banten secara menyeluruh.
          </p>
        </div>

        {/* Steps Grid */}
        <section className="mb-16 lg:mb-20">
          <span className="text-[0.6875rem] font-mono uppercase tracking-[0.2em] text-[var(--accent-gold)] block mb-6">
            Alur Pemindaian Kode QR
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((item) => (
              <div key={item.step} className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-sm">
                <span className="font-mono text-2xl text-[var(--accent-gold)] font-bold">{item.step}</span>
                <h3 className="font-serif text-lg text-[var(--text-title)] font-medium">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 lg:mb-20 pt-12 border-t border-[var(--border-subtle)]">
          <div className="max-w-3xl space-y-6">
            <span className="badge-gold">Informasi Umum</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <div className="divide-y divide-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
              {FAQS.map((faq, i) => (
                <div key={i} className="p-6 space-y-2">
                  <h3 className="font-serif text-base text-[var(--text-title)] font-medium flex items-start gap-3">
                    <span className="text-[var(--accent-gold)] font-mono text-sm font-bold">T:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-6 font-sans font-light">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
