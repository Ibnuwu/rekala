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
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen pt-16 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-x-hidden">
      <article className="container-editorial w-full max-w-5xl mx-auto mt-0 pt-0">
        {/* Desktop Top: Breadcrumb bar & Category Pill */}
        <div className="hidden lg:flex items-center justify-between mt-0 pt-0 pb-3 mb-6 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <Link
            href="/galeri"
            className="text-xs font-semibold tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Kembali ke Galeri</span>
          </Link>

          <span className="text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
            {archive.category}
          </span>
        </div>

        {/* Mobile Header: Compact Inline Breadcrumb & Category Bar directly above title + Metadata Flow */}
        <div className="block lg:hidden mt-0 pt-0 mb-3 space-y-1.5">
          {/* Compact inline breadcrumb and category without horizontal border line */}
          <div className="flex items-center justify-between gap-2 mt-0 pt-0 mb-1.5">
            <Link
              href="/galeri"
              className="text-xs font-semibold tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>&larr;</span>
              <span>Kembali</span>
            </Link>

            <span className="text-[11px] font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50">
              {archive.category}
            </span>
          </div>

          {/* Compact Title (text-xl, leading-snug) */}
          <h1 className="font-serif text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100 leading-snug break-words font-medium">
            {archive.title}
          </h1>

          {/* Natural Flow Metadata Badges (Year & Region only) */}
          <div className="flex items-center flex-wrap gap-2 pt-0.5">
            {archive.year && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mono font-medium text-xs">
                {archive.year}
              </span>
            )}
            {archive.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-sans font-medium text-xs border border-zinc-200/60 dark:border-zinc-700/60">
                {archive.location}
              </span>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
          {/* Left Column: Photo Container & Desktop Fact Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <ArchiveViewer archive={archive} />

            {/* Desktop Quick Historical Highlights Strip (Fakta Kunci) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 transition-colors duration-200 shadow-xs">
              <div className="min-w-0 space-y-1">
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider block truncate">
                  Periode
                </span>
                <span className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-400 block truncate">
                  {archive.year ? `Tahun ${archive.year}` : 'Abad ke-19'}
                </span>
              </div>
              <div className="min-w-0 space-y-1 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider block truncate">
                  Wilayah
                </span>
                <span className="font-sans text-sm font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                  {archive.location || 'Banten'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Metadata */}
          <div className="lg:col-span-5 space-y-6 mt-6 sm:mt-8 lg:mt-0 mb-8">
            {/* Desktop Header */}
            <div className="hidden lg:block space-y-3 pb-6 border-b border-[var(--border-subtle)]">
              <span
                className="text-xs font-mono uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 font-semibold block"
                dangerouslySetInnerHTML={{ __html: periodTag }}
              />
              <h1 className="font-serif text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-100 leading-tight break-words font-medium">
                {archive.title}
              </h1>
              {archive.location && (
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider pt-1 font-medium">
                  Wilayah: {archive.location}
                </p>
              )}
            </div>

            {/* ── Editorial Narrative Section ── */}
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-wider text-amber-700 dark:text-amber-400 uppercase mb-3 block">
                Telaah &amp; Narasi Historis
              </span>

              {/* First Paragraph with Classic Editorial Drop Cap */}
              <div className="font-sans space-y-4">
                <p className="first-letter:float-left first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:mr-2.5 first-letter:text-amber-700 dark:first-letter:text-amber-400 first-letter:leading-none text-[15px] sm:text-base leading-relaxed sm:leading-7 text-zinc-900 dark:text-zinc-100 font-normal">
                  {p1}
                </p>

                {/* Stylized Historical Pull Quote */}
                {highlight && (
                  <blockquote className="my-6 p-4 border-l-4 border-r-0 border-t-0 border-b-0 border-amber-600 dark:border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-xl italic transition-colors duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-amber-600 dark:text-amber-500 font-serif text-3xl leading-none select-none shrink-0" aria-hidden="true">
                        &ldquo;
                      </span>
                      <p className="font-serif italic text-sm sm:text-base leading-relaxed text-zinc-900 dark:text-zinc-200 font-medium">
                        {highlight}
                      </p>
                    </div>
                  </blockquote>
                )}

                {/* Second Paragraph (Continuing Narrative) */}
                {p2 && (
                  <p className="text-[15px] sm:text-base leading-relaxed sm:leading-7 text-zinc-900 dark:text-zinc-100 font-normal">
                    {p2}
                  </p>
                )}
              </div>
            </div>

            {/* ── Museum Registry Metadata Sheet ── */}
            <div className="p-5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3.5 text-xs shadow-sm transition-colors duration-200">
              <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold block">
                  Registri Arsip Banten
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400 block text-xs font-mono font-semibold tracking-wider">ID Registrasi</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">{archive.id}</span>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400 block text-xs font-mono font-semibold tracking-wider">Kategori</span>
                  <span className="text-amber-700 dark:text-amber-400 font-medium">{archive.category}</span>
                </div>
                {archive.year && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400 block text-xs font-mono font-semibold tracking-wider">Tahun Dokumen</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{archive.year}</span>
                  </div>
                )}
                {archive.location && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400 block text-xs font-mono font-semibold tracking-wider">Wilayah</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{archive.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Sources & Authentic References ── */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block font-semibold">
                Sumber &amp; Referensi Autentik
              </span>
              <div className="flex flex-wrap gap-2">
                {archive.sources.map((source, index) => {
                  const title = typeof source === 'string' ? source : source.title;
                  const url = typeof source === 'string' ? '#' : source.url;

                  return (
                    <a
                      key={`${title}-${index}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Buka rujukan autentik: ${title}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-100 hover:border-amber-500/50 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/90 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-200 shadow-2xs group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    >
                      <span className="leading-snug">{title}</span>
                      <span
                        className="text-amber-700 dark:text-amber-400 font-semibold transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 select-none"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Archives Section ── */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-12 border-t border-[var(--border-subtle)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="badge-gold mb-2">Eksplorasi Sejenis</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 font-normal">
                  Arsip Terkait ({archive.category})
                </h2>
              </div>
              <Link
                href="/galeri"
                className="text-xs font-mono uppercase text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Galeri Lengkap</span>
                <span>&rarr;</span>
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
