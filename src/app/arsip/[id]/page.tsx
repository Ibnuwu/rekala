import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllArchives, getArchiveById, getRelatedArchives } from '@/lib/archives';
import { ArchiveViewer } from '@/components/archive/ArchiveViewer';
import { ArchiveCard } from '@/components/archive/ArchiveCard';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const archives = await getAllArchives();
  return archives.map((archive) => ({
    id: archive.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const archive = await getArchiveById(id);

  if (!archive) {
    return {
      title: 'Arsip Tidak Ditemukan',
    };
  }

  return {
    title: `${archive.title} (${archive.year || 'Arsip Sejarah Banten'})`,
    description: archive.shortDescription,
    openGraph: {
      title: `${archive.title} | REKALA`,
      description: archive.shortDescription,
      images: [
        {
          url: archive.image.src,
          width: archive.image.width,
          height: archive.image.height,
          alt: archive.image.alt,
        },
      ],
    },
  };
}

function parseNarrative(description: string, fallbackContext?: string) {
  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  let p1 = description;
  let p2 = '';
  let highlight = fallbackContext || '';

  if (sentences.length >= 4) {
    const mid = Math.ceil(sentences.length / 2);
    p1 = sentences.slice(0, mid).join(' ');
    p2 = sentences.slice(mid).join(' ');
    if (!highlight) {
      highlight = sentences[Math.min(2, sentences.length - 2)];
    }
  } else if (sentences.length >= 2) {
    p1 = sentences[0];
    p2 = sentences.slice(1).join(' ');
    if (!highlight) {
      highlight = sentences[1];
    }
  }

  return { p1, p2, highlight };
}

export default async function ArchiveDetailPage({ params }: Props) {
  const { id } = await params;
  const archive = await getArchiveById(id);

  if (!archive) {
    notFound();
  }

  const related = await getRelatedArchives(id, 3);
  const periodTag = archive.year ? `SEJARAH &bull; ${archive.year}` : 'SEJARAH &bull; ABAD 19';
  const { p1, p2, highlight } = parseNarrative(archive.description, archive.context);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen py-6 sm:py-10 lg:py-16 transition-colors duration-300">
      <article className="container-editorial">
        {/* Top: Breadcrumb bar & Quick Meta */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            <span>&larr;</span>
            <span>Kembali ke Galeri</span>
          </Link>

          <div className="flex items-center gap-2 text-[0.6875rem] font-mono text-[var(--text-muted)]">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-amber-600 dark:text-amber-400 font-semibold uppercase">
              {archive.category}
            </span>
          </div>
        </div>

        {/* Mobile Title (Above image on mobile for immediate context) */}
        <div className="block lg:hidden mb-6 space-y-2">
          <span
            className="text-xs font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 font-semibold block"
            dangerouslySetInnerHTML={{ __html: periodTag }}
          />
          <h1 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] leading-tight break-words font-medium">
            {archive.title}
          </h1>
          {archive.location && (
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-1">
              Wilayah: {archive.location}
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Photo Container & Fact Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <ArchiveViewer archive={archive} />

            {/* Quick Historical Highlights Strip (Fakta Kunci) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-xl bg-stone-100/90 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 transition-colors duration-200">
              <div className="space-y-0.5">
                <span className="text-[0.625rem] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Periode
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 block truncate">
                  {archive.year ? `Tahun ${archive.year}` : 'Abad ke-19'}
                </span>
              </div>
              <div className="space-y-0.5 border-l border-zinc-200 dark:border-zinc-800 pl-2.5 sm:pl-4">
                <span className="text-[0.625rem] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Wilayah
                </span>
                <span className="font-sans text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                  {archive.location || 'Banten'}
                </span>
              </div>
              <div className="space-y-0.5 border-l border-zinc-200 dark:border-zinc-800 pl-2.5 sm:pl-4">
                <span className="text-[0.625rem] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Status
                </span>
                <span className="font-mono text-[0.6875rem] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 block truncate">
                  Terverifikasi
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Metadata */}
          <div className="lg:col-span-5 space-y-7">
            {/* Desktop Header */}
            <div className="hidden lg:block space-y-3 pb-6 border-b border-[var(--border-subtle)]">
              <span
                className="text-xs font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 font-semibold block"
                dangerouslySetInnerHTML={{ __html: periodTag }}
              />
              <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-title)] leading-tight break-words font-medium">
                {archive.title}
              </h1>
              {archive.location && (
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-1">
                  Wilayah: {archive.location}
                </p>
              )}
            </div>

            {/* ── Editorial Narrative Section ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400 font-semibold block">
                  Telaah &amp; Narasi Historis
                </span>
              </div>

              {/* First Paragraph with Classic Editorial Drop Cap */}
              <div className="font-sans space-y-4">
                <p className="first-letter:float-left first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:text-amber-600 dark:first-letter:text-amber-400 first-letter:leading-none text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-normal">
                  {p1}
                </p>

                {/* Stylized Historical Pull Quote */}
                {highlight && (
                  <blockquote className="my-5 p-4 sm:p-5 rounded-2xl bg-amber-500/[0.06] dark:bg-amber-400/[0.06] border-l-4 border-amber-500 dark:border-amber-400 border-y border-r border-amber-500/15 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="text-amber-500 dark:text-amber-400 font-serif text-3xl leading-none select-none shrink-0" aria-hidden="true">
                        &ldquo;
                      </span>
                      <p className="font-serif italic text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-relaxed font-normal">
                        {highlight}
                      </p>
                    </div>
                  </blockquote>
                )}

                {/* Second Paragraph (Continuing Narrative) */}
                {p2 && (
                  <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 font-light">
                    {p2}
                  </p>
                )}
              </div>
            </div>

            {/* ── Museum Registry Metadata Sheet ── */}
            <div className="p-5 rounded-2xl bg-stone-100/90 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 space-y-3.5 text-xs shadow-sm transition-colors duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[0.625rem] font-mono uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 font-semibold block">
                  Registri Arsip Banten
                </span>
                <span className="inline-flex items-center gap-1 text-[0.625rem] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Koleksi Resmi
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[0.6875rem] font-mono">ID Registrasi</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">{archive.id}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[0.6875rem] font-mono">Kategori</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{archive.category}</span>
                </div>
                {archive.year && (
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[0.6875rem] font-mono">Tahun Dokumen</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{archive.year}</span>
                  </div>
                )}
                {archive.location && (
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[0.6875rem] font-mono">Wilayah</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{archive.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Sources & Official References ── */}
            <div className="space-y-3 pt-1">
              <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 block font-semibold">
                Sumber &amp; Rujukan Resmi
              </span>
              <div className="flex flex-wrap gap-2">
                {archive.sources.map((source) => (
                  <div
                    key={source}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-xs font-mono text-zinc-800 dark:text-zinc-200 transition-colors shadow-2xs"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-600 dark:text-amber-400 shrink-0"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Archives Section ── */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-12 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="badge-gold mb-2">Eksplorasi Sejenis</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] font-normal">
                  Arsip Terkait ({archive.category})
                </h2>
              </div>
              <Link
                href="/galeri"
                className="text-xs font-mono uppercase text-amber-600 dark:text-amber-400 hover:underline"
              >
                Galeri Lengkap &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {related.map((item) => (
                <ArchiveCard key={item.id} archive={item} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
