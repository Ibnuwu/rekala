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

export default async function ArchiveDetailPage({ params }: Props) {
  const { id } = await params;
  const archive = await getArchiveById(id);

  if (!archive) {
    notFound();
  }

  const related = await getRelatedArchives(id, 3);
  const periodTag = archive.year ? `SEJARAH | ${archive.year.toUpperCase()}` : 'SEJARAH | ABAD 19';

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen py-8 lg:py-16 transition-colors duration-300">
      <article className="container-editorial">
        {/* Top: Back arrow link */}
        <div className="mb-8">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
          >
            <span>&larr;</span>
            <span>Kembali ke Galeri</span>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Photo Container (Archival frame placeholder with zoom icon) */}
          <div className="lg:col-span-7 space-y-6">
            <ArchiveViewer archive={archive} />

            {/* Mobile Header (Under Image) */}
            <div className="block lg:hidden pt-4 space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent-gold)] font-semibold block">
                {periodTag}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[var(--text-title)] leading-tight break-words">
                {archive.title}
              </h1>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Metadata */}
          <div className="lg:col-span-5 space-y-8">
            {/* Desktop Header */}
            <div className="hidden lg:block space-y-3 pb-6 border-b border-[var(--border-subtle)]">
              {/* Tag: Gold text */}
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent-gold)] font-semibold block">
                {periodTag}
              </span>
              {/* Heading: Large Serif font */}
              <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-title)] leading-tight break-words">
                {archive.title}
              </h1>
              {archive.location && (
                <p className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                  Wilayah: {archive.location}
                </p>
              )}
            </div>

            {/* Narrative Section / Body */}
            <div className="space-y-4">
              <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-[var(--accent-gold)] block">
                Uraian &amp; Narasi Historis
              </span>
              <div className="font-sans text-sm sm:text-base leading-relaxed text-[var(--text-primary)] space-y-4 font-light">
                <p>{archive.description}</p>
                {archive.context && (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2 border-l-2 border-[var(--accent-gold)] pl-4 bg-[var(--bg-surface-elevated)] rounded-r py-2.5">
                    {archive.context}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata Summary Card */}
            <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 text-xs shadow-sm">
              <span className="text-[0.625rem] font-mono uppercase tracking-[0.16em] text-[var(--text-secondary)] block">
                Metadata Dokumen
              </span>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <div>
                  <span className="text-[var(--text-muted)] block text-[0.6875rem]">ID Dokumen:</span>
                  <span className="font-mono text-[var(--text-title)] font-semibold">{archive.id}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block text-[0.6875rem]">Kategori:</span>
                  <span className="text-[var(--accent-gold)] font-medium">{archive.category}</span>
                </div>
                {archive.year && (
                  <div>
                    <span className="text-[var(--text-muted)] block text-[0.6875rem]">Tahun / Periode:</span>
                    <span className="text-[var(--text-title)]">{archive.year}</span>
                  </div>
                )}
                {archive.location && (
                  <div>
                    <span className="text-[var(--text-muted)] block text-[0.6875rem]">Lokasi:</span>
                    <span className="text-[var(--text-title)]">{archive.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* References */}
            <div className="space-y-3 pt-2">
              <span className="text-[0.6875rem] font-mono uppercase tracking-[0.18em] text-[var(--text-secondary)] block">
                Sumber &amp; Referensi
              </span>
              <div className="flex flex-wrap gap-2">
                {archive.sources.map((source) => (
                  <div
                    key={source}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] transition-colors"
                  >
                    <span className="text-[var(--accent-gold)]">↗</span>
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Archives Section */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="badge-gold mb-2">Eksplorasi Sejenis</span>
                <h2 className="font-serif text-2xl text-[var(--text-title)] font-normal">
                  Arsip Terkait ({archive.category})
                </h2>
              </div>
              <Link
                href="/galeri"
                className="text-xs font-mono uppercase text-[var(--accent-gold)] hover:underline"
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
