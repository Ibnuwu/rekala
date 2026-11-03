'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mentors as defaultMentors, type Mentor } from '@/data/team';

interface MentorCardProps {
  mentor: Mentor;
  className?: string;
}

export function MentorCard({ mentor, className = '' }: MentorCardProps) {
  const [imgError, setImgError] = useState(false);

  // Extract initials cleanly from formal name before academic titles
  const baseName = mentor.name.split(',')[0].trim();
  const initials = baseName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`group block ${className}`}>
      {/* Image Wrapper: Minimalist rounded box */}
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {!imgError ? (
          <Image
            src={mentor.image}
            alt={`Foto ${mentor.name}`}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 250px"
            className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Clean minimalist fallback avatar */
          <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 font-mono text-xs font-semibold uppercase">
            {initials}
          </div>
        )}
      </div>

      {/* Tight vertical text container without awkward min-height gap */}
      <div className="mt-2 flex flex-col items-center justify-start text-center">
        <h3 className="text-xs sm:text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {mentor.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-zinc-500 font-medium leading-tight mt-0.5">
          {mentor.role}
        </p>
      </div>
    </div>
  );
}

interface MentorsSectionProps {
  items?: Mentor[];
  className?: string;
}

export function Mentors({ items = defaultMentors, className = '' }: MentorsSectionProps) {
  return (
    <section className={className}>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-10 mb-1">
        Pembimbing &amp; Pendamping OJT
      </h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
        Dinas Perpustakaan dan Kearsipan Provinsi Banten
      </p>

      {/* Mentor Grid: 1 clean row of 3 compact cards with responsive gaps */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto text-center">
        {items.map((mentor) => (
          <MentorCard key={mentor.name} mentor={mentor} />
        ))}
      </div>
    </section>
  );
}

export default Mentors;
