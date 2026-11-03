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

  const cardContent = (
    <>
      {/* Image Wrapper: Minimalist rounded box */}
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {!imgError ? (
          <Image
            src={member.photo.src}
            alt={`Foto ${member.name}`}
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
          {member.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-zinc-500 font-medium leading-tight mt-0.5">
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
        className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg ${className}`}
        title={`Kunjungi profil ${member.name}`}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={`group block ${className}`}>{cardContent}</div>;
}
