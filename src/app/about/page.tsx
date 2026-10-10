import type { Metadata } from 'next';
import { TEAM_MEMBERS } from '@/data/team';
import { TeamMemberCard } from '@/components/ui/TeamMemberCard';

export const metadata: Metadata = {
  title: 'Tentang REKALA — Layanan Arsip Digital | OJT BBPVP Serang × DPK Banten',
  description:
    'REKALA - Reka Waktu, Hidupkan Sejarah. Inisiatif platform digitalisasi arsip foto sejarah Provinsi Banten melalui program OJT BBPVP Serang × DPK Banten.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const ketua = TEAM_MEMBERS.find((m) => m.roleCategory === 'Ketua');
  const developer = TEAM_MEMBERS.find((m) => m.roleCategory === 'Developer');
  const script = TEAM_MEMBERS.find((m) => m.roleCategory === 'Penulis Script');
  const observasiList = TEAM_MEMBERS.filter((m) => m.roleCategory === 'Observasi / Sources');
  const dokumentasiList = TEAM_MEMBERS.filter((m) => m.roleCategory === 'Dokumentasi');

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen py-12 lg:py-20 transition-colors duration-300">
      <div className="container-editorial">
        {/* Header: Apa itu REKALA? */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <span className="badge-gold">
            Tentang Inisiatif
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-title)] font-normal leading-tight">
            Menghidupkan Kembali Memori Visual Banten
          </h1>
          {/* Tagline is explicitly allowed in About Page & Home Hero */}
          <p className="font-serif italic text-base sm:text-lg text-[var(--accent-gold)]">
            REKALA - Reka Waktu, Hidupkan Sejarah.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light font-sans">
            REKALA adalah layanan arsip digital yang merangkai kembali dokumentasi foto bersejarah Provinsi Banten ke dalam pengalaman kuratorial modern. Melalui integrasi pemindaian kode QR pada setiap koleksi fisik, REKALA membuka akses bagi publik untuk mempelajari narasi, peristiwa, dan figur penting dalam perjalanan sejarah Banten.
          </p>
        </div>

        {/* Filosofi Nama: REKALA */}
        <section className="my-14 lg:my-20 p-6 sm:p-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
          <div className="mb-8">
            <span className="badge-gold mb-2">Makna &amp; Konsep</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">
              Filosofi Nama: REKALA
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-2 font-mono">
              Secara etimologis dan kontekstual, REKALA lahir dari perpaduan makna:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:divide-x lg:divide-[var(--border-subtle)]">
            {/* Block 1: Reka + Kala */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[var(--text-title)] font-medium flex items-center gap-2">
                <span>Reka</span>
                <span className="text-[var(--accent-gold)] font-light">+</span>
                <span>Kala</span>
                <span className="text-xs font-mono text-[var(--text-secondary)] font-normal">
                  (Menyusun Waktu)
                </span>
              </h3>

              <div className="divide-y divide-[var(--border-subtle)] text-xs">
                <div className="py-3">
                  <span className="font-mono uppercase tracking-wider text-[var(--accent-gold)] block mb-1">Reka</span>
                  <p className="text-[var(--text-secondary)]">Menyusun, merancang, dan memberi bentuk narasi.</p>
                </div>
                <div className="py-3">
                  <span className="font-mono uppercase tracking-wider text-[var(--accent-gold)] block mb-1">Kala</span>
                  <p className="text-[var(--text-secondary)]">Waktu, zaman, atau peradaban masa lalu.</p>
                </div>
                <div className="py-3.5 bg-[var(--bg-surface-elevated)] p-4 border-l-2 border-[var(--accent-gold)] rounded-r">
                  <span className="font-mono uppercase tracking-wider text-[var(--accent-gold)] block mb-1">Makna</span>
                  <p className="text-[var(--text-primary)] leading-relaxed font-serif">
                    Langkah nyata untuk merangkai kembali potret sejarah Banten yang tadinya belum memiliki deskripsi, menjadi sebuah narasi utuh yang mudah dipahami publik.
                  </p>
                </div>
              </div>
            </div>

            {/* Block 2: Re- + Kala */}
            <div className="space-y-4 lg:pl-12">
              <h3 className="font-serif text-2xl text-[var(--text-title)] font-medium flex items-center gap-2">
                <span>Re-</span>
                <span className="text-[var(--accent-gold)] font-light">+</span>
                <span>Kala</span>
                <span className="text-xs font-mono text-[var(--text-secondary)] font-normal">
                  (Mengingat &amp; Meninjau Masa)
                </span>
              </h3>

              <div className="divide-y divide-[var(--border-subtle)] text-xs">
                <div className="py-3">
                  <span className="font-mono uppercase tracking-wider text-[var(--accent-gold)] block mb-1">Re-</span>
                  <p className="text-[var(--text-secondary)]">Mengulang, memanggil kembali, atau menghidupkan ulang.</p>
                </div>
                <div className="py-3">
                  <span className="font-mono uppercase tracking-wider text-[var(--accent-gold)] block mb-1">Kala</span>
                  <p className="text-[var(--text-secondary)]">Dimensi waktu dan jejak peristiwa sejarah.</p>
                </div>
                <div className="py-3.5 bg-[var(--bg-surface-elevated)] p-4 border-l-2 border-[var(--accent-gold)] rounded-r">
                  <span className="font-mono uppercase tracking-wider text-[var(--accent-gold)] block mb-1">Makna</span>
                  <p className="text-[var(--text-primary)] leading-relaxed font-serif">
                    Semangat untuk mengajak masyarakat meninjau kembali jejak sejarah Banten melalui sentuhan teknologi modern, sehingga nilai sejarah tak hilang ditelan zaman.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border-subtle)] text-center">
            <blockquote className="font-serif text-xl sm:text-2xl text-[var(--text-title)] font-normal italic">
              &ldquo;REKALA - Reka Waktu, Hidupkan Sejarah.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Struktur Tim REKALA — Modern Minimalist Profile Cards (2-Column Grid) */}
        <section className="my-16 lg:my-24 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <span className="badge-gold mb-2">Kolaborator</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">Struktur Tim</h2>
            </div>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              7 Anggota &bull; OJT BBPVP Serang × DPK Banten
            </span>
          </div>

          <div className="space-y-8">
            {/* Group 1: Ketua & Developer */}
            <div className="space-y-3">
              <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-[var(--accent-gold)] font-medium block">
                Ketua &amp; Pengembang
              </span>
              <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
                {ketua && <TeamMemberCard member={ketua} />}
                {developer && <TeamMemberCard member={developer} />}
              </div>
            </div>

            {/* Group 2: Penulis Script */}
            <div className="space-y-3">
              <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-[var(--accent-gold)] font-medium block">
                Penulis Script
              </span>
              <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
                {script && <TeamMemberCard member={script} />}
              </div>
            </div>

            {/* Group 3: Observasi / Pencari Sumber (2-column grid) */}
            <div className="space-y-3">
              <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-[var(--accent-gold)] font-medium block">
                Observasi / Pencari Sumber
              </span>
              <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
                {observasiList.map((m) => (
                  <TeamMemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>

            {/* Group 4: Dokumentasi (2-column grid) */}
            <div className="space-y-3">
              <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-[var(--accent-gold)] font-medium block">
                Dokumentasi
              </span>
              <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
                {dokumentasiList.map((m) => (
                  <TeamMemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
