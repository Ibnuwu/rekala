import type { Archive } from '@/data/archives';

interface ArchiveMetadataProps {
  archive: Archive;
}

export function ArchiveMetadata({ archive }: ArchiveMetadataProps) {
  const fields = [
    { label: 'Judul', value: archive.title },
    { label: 'Periode / Tahun', value: archive.year ? `Tahun ${archive.year}` : undefined },
    { label: 'Wilayah', value: archive.location },
    { label: 'Kategori', value: archive.category },
  ].filter((f) => f.value);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3.5 text-xs shadow-sm transition-colors duration-200">
        <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold block">
            Registri Metadata Arsip
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-3.5">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-zinc-600 dark:text-zinc-400 block text-xs font-mono font-semibold tracking-wider mb-0.5">
                {field.label}
              </dt>
              <dd className="font-sans text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {archive.sources && archive.sources.length > 0 && (
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
      )}
    </div>
  );
}
