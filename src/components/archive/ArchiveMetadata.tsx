import type { Archive } from '@/data/archives';

interface ArchiveMetadataProps {
  archive: Archive;
}

export function ArchiveMetadata({ archive }: ArchiveMetadataProps) {
  const fields = [
    { label: 'Judul', value: archive.title },
    { label: 'Tahun', value: archive.year },
    { label: 'Lokasi', value: archive.location },
    { label: 'Kategori', value: archive.category },
    { label: 'Sumber', value: archive.sources.join(', ') },
  ].filter((f) => f.value);

  return (
    <dl className="divide-y divide-[var(--border-subtle)]">
      {fields.map((field) => (
        <div key={field.label} className="py-3 first:pt-0 last:pb-0">
          <dt className="text-[0.6875rem] font-mono uppercase tracking-wider text-[var(--accent-gold)] mb-1">
            {field.label}
          </dt>
          <dd className="text-sm sm:text-base font-serif text-[var(--text-title)]">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
