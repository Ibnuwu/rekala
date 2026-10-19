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
    desc: 'Datangi lokasi pameran arsip resmi atau temukan bingkai foto arsip resmi yang terpasang.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700 dark:text-amber-400" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Temukan Label QR pada Bingkai',
    desc: 'Setiap bingkai foto arsip dilengkapi dengan label informasi yang memuat kode QR khusus serta nomor ID arsip.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700 dark:text-amber-400" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="3" height="3" />
        <path d="M21 14h-4v4h0" />
        <path d="M14 21h7" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Pindai dengan Kamera',
    desc: 'Gunakan fitur "Pindai QR" pada REKALA atau kamera ponsel Anda untuk mengarahkan lensa ke kode QR.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700 dark:text-amber-400" aria-hidden="true">
        <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Pelajari Narasi & Data Sejarah',
    desc: 'Halaman digital akan langsung terbuka, menyajikan uraian sejarah, tahun, lokasi, dan konteks peristiwa secara autentik.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700 dark:text-amber-400" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <path d="M8 7h8M8 11h6" />
      </svg>
    ),
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
    a: 'Koleksi digital REKALA terbuka untuk kepentingan edukasi dan riset. Penggunaan untuk publikasi komersial dapat berkoordinasi melalui pengelola kearsipan.',
  },
  {
    q: 'Bagaimana cara memberikan masukan atau data tambahan mengenai foto sejarah?',
    a: 'Masyarakat dapat menyampaikan data kearsipan atau informasi tambahan kepada pengelola layanan kearsipan.',
  },
];

export default function PanduanPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-16 sm:pt-20 pb-12 lg:pb-20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* ── Hero Section ── */}
        <header className="mb-12 sm:mb-16">
          <span className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 bg-amber-500/10 text-amber-800 dark:text-amber-400 rounded-full border border-amber-500/10 mb-4 inline-block">
            Petunjuk Pengunjung
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-zinc-900 dark:text-zinc-50 tracking-tight mb-4 leading-[1.1]">
            Panduan Akses &amp; Pemindaian
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            Panduan praktis bagi masyarakat dalam memanfaatkan integrasi fisik dan digital
            guna menggali wawasan sejarah Banten secara menyeluruh.
          </p>
        </header>

        {/* ── Fluid Visual Timeline ── */}
        <section className="mb-16 sm:mb-20">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-800 dark:text-amber-400 block mb-8">
            Alur Pemindaian Kode QR
          </span>

          <div className="relative border-l border-zinc-200/80 dark:border-zinc-800 ml-4 pl-8 space-y-12 py-2">
            {STEPS.map((item, idx) => (
              <div key={item.step} className="relative">
                {/* Floating Step Number Pill — positioned on the timeline line */}
                <span className="absolute -left-[45px] flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 font-serif font-bold border border-amber-200/60 dark:border-amber-800/50 text-xs sm:text-sm shadow-sm">
                  {item.step}
                </span>

                {/* Step Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/40 dark:border-amber-800/30">
                      {item.icon}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Subtle connector dot at the end of last item */}
                {idx === STEPS.length - 1 && (
                  <span className="absolute -left-[37.5px] -bottom-6 w-3 h-3 rounded-full bg-amber-500/30 dark:bg-amber-400/20 border border-amber-300/50 dark:border-amber-700/40" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="pt-10 sm:pt-12 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <span className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 bg-amber-500/10 text-amber-800 dark:text-amber-400 rounded-full border border-amber-500/10 mb-4 inline-block">
            Informasi Umum
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-zinc-50 tracking-tight mb-8 leading-tight">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="space-y-0 divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-5 sm:py-6">
                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 leading-snug">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
