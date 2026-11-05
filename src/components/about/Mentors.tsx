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
    <div
      className={`flex flex-col items-center text-center bg-white dark:bg-zinc-900 rounded-xl p-2 ${className}`}
    >
      {/* Photo Container */}
      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
        {!imgError ? (
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 250px"
            className="object-cover object-top"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 font-mono text-xs font-semibold uppercase">
            {initials}
          </div>
        )}
      </div>

      {/* Single Clean Text Group */}
      <div className="mt-2 flex flex-col items-center">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          {mentor.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-zinc-500 font-medium mt-0.5 leading-tight">
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
      <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-0.5 text-center">
        Pembimbing &amp; Pendamping OJT
      </h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 text-center">
        Dinas Perpustakaan dan Kearsipan Provinsi Banten &amp; BBPVP Serang
      </p>

      {/* Mentor Grid: 2-col mobile, 3-col desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
        {items.map((mentor, index) => (
          <div
            key={mentor.name}
            className={index === items.length - 1 && items.length % 2 !== 0
              ? 'col-span-2 sm:col-span-1 flex justify-center sm:block'
              : 'col-span-1'}
          >
            <MentorCard mentor={mentor} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Mentors;
