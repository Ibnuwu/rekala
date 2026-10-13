import type { Metadata } from 'next';
import Image from 'next/image';
import { TEAM_MEMBERS, MENTORS } from '@/data/team';
import { TeamMemberCard } from '@/components/ui/TeamMemberCard';

export const metadata: Metadata = {
  title: 'Tentang REKALA — Layanan Arsip Digital | OJT BBPVP Serang',
  description:
    'REKALA — Reka Waktu, Hidupkan Sejarah. Inisiatif platform digitalisasi arsip foto sejarah Provinsi Banten melalui program OJT BBPVP Serang.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen py-12 lg:py-20 transition-colors duration-300">
      <div className="container-editorial">
        {/* Header: Apa itu REKALA? */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-6">
          <div className="flex items-center gap-3.5">
            <Image
              src="/logo/logo-warna.png"
              alt="Logo REKALA"
              width={52}
              height={52}
              className="h-11 sm:h-12 w-auto object-contain"
              priority
            />
            <span className="badge-gold">
              Tentang Inisiatif
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-title)] font-normal leading-tight">
              Menghidupkan Kembali Memori Visual Banten
            </h1>
            {/* Tagline */}
            <p className="font-serif italic text-base sm:text-lg text-[var(--accent-gold)]">
              REKALA — Reka Waktu, Hidupkan Sejarah.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light font-sans">
            REKALA adalah layanan arsip digital yang merangkai kembali dokumentasi foto bersejarah Provinsi Banten ke dalam pengalaman kuratorial modern. Melalui integrasi pemindaian kode QR pada setiap koleksi fisik, REKALA membuka akses bagi publik untuk mempelajari narasi, peristiwa, dan figur penting dalam perjalanan sejarah Banten.
          </p>
        </div>

        {/* Filosofi Nama: REKALA (Reka Kala) */}
        <section className="my-14 lg:my-20 p-6 sm:p-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
          <div className="mb-8">
            <span className="badge-gold mb-2">Makna &amp; Konsep</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">
              Filosofi Nama: Reka Kala
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-2 font-mono">
              Secara etimologis dan konseptual, REKALA berakar dari perpaduan dua kata:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reka */}
            <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-gold)] font-bold block">
                01 &bull; Reka
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-title)] font-medium">
                Reka
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                Menyusun, merangkai, atau merekam kembali.
              </p>
            </div>

            {/* Kala */}
            <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-gold)] font-bold block">
                02 &bull; Kala
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-title)] font-medium">
                Kala
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                Waktu atau masa lalu.
              </p>
            </div>
          </div>

          {/* Makna Ringkas Box */}
          <div className="mt-6 p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-elevated)] border-l-4 border-[var(--accent-gold)] border border-[var(--border-subtle)] space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold block">
              Makna Ringkas
            </span>
            <p className="font-serif text-base sm:text-lg text-[var(--text-primary)] leading-relaxed">
              &ldquo;REKALA (Reka Kala) &mdash; Merangkai jejak waktu, menghidupkan kembali memori dan kisah sejarah Provinsi Banten dalam bentuk arsip digital yang mudah diakses.&rdquo;
            </p>
          </div>
        </section>

        {/* Struktur Tim REKALA — Dedicated Sub-Sections */}
        <div className="my-16 lg:my-24 space-y-14 sm:space-y-16">
          {/* Section 1: Tim Inti Pelaksana (7 Anggota) */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="badge-gold mb-2">Kolaborator</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">
                  Tim Inti Pelaksana
                </h2>
              </div>
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                7 Anggota &bull; Proyek OJT BBPVP Serang
              </span>
            </div>

            {/* Compact grid: 2 cols mobile, 3 cols sm, 4 cols md+ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>

          {/* Section 2: Pembimbing & Pendamping OJT (2 Pembimbing) */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="badge-gold mb-2">Bimbingan Teknis</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">
                  Pembimbing &amp; Pendamping OJT
                </h2>
              </div>
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                Dinas Perpustakaan dan Kearsipan Provinsi Banten
              </span>
            </div>

            {/* Centered 2-card grid */}
            <div className="grid grid-cols-2 max-w-lg mx-auto gap-4 mt-6">
              {MENTORS.map((mentor) => (
                <TeamMemberCard key={mentor.id} member={mentor} isMentor />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
