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
      className={`group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-2.5 sm:p-3.5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 ${className}`}
    >
      {/* Photo Box with Subtle Framing */}
      <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative ring-1 ring-zinc-900/5 dark:ring-white/10">
        {!imgError ? (
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 250px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 font-mono text-xs font-semibold uppercase">
            {initials}
          </div>
        )}
      </div>

      {/* Clean Typography + Soft Badge Role */}
      <div className="mt-2.5 flex flex-col items-center text-center w-full px-0.5">
        <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {mentor.name}
        </h3>
        <span className="mt-1 inline-block text-[8.5px] sm:text-[10px] md:text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200/60 dark:border-zinc-700/50">
          {mentor.role}
        </span>
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
      <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4 text-center">
        Mentor
      </h2>

      {/* Mentor Grid: 2-col mobile, 3-col desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto items-stretch">
        {items.map((mentor, index) => {
          const isLastOdd = index === items.length - 1 && items.length % 2 !== 0;
          return (
            <div
              key={mentor.name}
              className={isLastOdd ? 'col-span-2 sm:col-span-1 flex justify-center' : 'col-span-1'}
            >
              <div className={isLastOdd ? 'w-[calc(50%-0.375rem)] sm:w-full' : 'w-full'}>
                <MentorCard mentor={mentor} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Mentors;
