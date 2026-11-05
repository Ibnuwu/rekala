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

  const cardInner = (
    <>
      {/* Photo Container */}
      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
        {!imgError ? (
          <Image
            src={member.photo.src}
            alt={member.name}
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
      <div className="mt-2 flex flex-col items-center justify-start text-center px-1 h-[3.2rem] sm:h-auto">
        <h3 className="text-[11px] sm:text-xs md:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight line-clamp-2">
          {member.name}
        </h3>
        <p className="text-[9px] sm:text-[10px] md:text-xs text-zinc-500 font-medium leading-tight mt-0.5">
          {member.role}
        </p>
      </div>
    </>
  );

  if (member.url) {
    return (
      <a
        href={member.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-col items-center text-center bg-white dark:bg-zinc-900 rounded-xl p-2 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
        title={`Kunjungi profil ${member.name}`}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <div
      className={`flex flex-col items-center text-center bg-white dark:bg-zinc-900 rounded-xl p-2 ${className}`}
    >
      {cardInner}
    </div>
  );
}
