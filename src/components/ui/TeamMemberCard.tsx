'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TeamMember } from '@/data/team';

interface TeamMemberCardProps {
  member: TeamMember;
  isMentor?: boolean;
  className?: string;
}

export function TeamMemberCard({ member, className = '' }: TeamMemberCardProps) {
  const [imgError, setImgError] = useState(false);

  // Initials for graceful fallback
  const initials = member.name
    .replace(/,\s*[^,]+$/, '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const cardStyles =
    'group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-2.5 sm:p-3.5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300';

  const cardInner = (
    <>
      {/* Photo Box with Subtle Framing */}
      <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative ring-1 ring-zinc-900/5 dark:ring-white/10">
        {!imgError ? (
          <Image
            src={member.photo.src}
            alt={member.name}
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
          {member.name}
        </h3>
        <span className="mt-1 inline-block text-[8.5px] sm:text-[10px] md:text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200/60 dark:border-zinc-700/50">
          {member.role}
        </span>
      </div>
    </>
  );

  if (member.url) {
    return (
      <a
        href={member.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardStyles} focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
        title={`Kunjungi profil ${member.name}`}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <div className={`${cardStyles} ${className}`}>
      {cardInner}
    </div>
  );
}
