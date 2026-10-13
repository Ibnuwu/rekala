'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TeamMember } from '@/data/team';

interface TeamMemberCardProps {
  member: TeamMember;
  isMentor?: boolean;
}

export function TeamMemberCard({ member, isMentor = false }: TeamMemberCardProps) {
  const [imgError, setImgError] = useState(false);

  // Initials for graceful fallback
  const initials = member.name
    .replace(/,\s*[^,]+$/, '') // Remove titles like S.STP, S.Sos
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const cardContent = (
    <>
      {/* Portrait image with fixed aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-zinc-950">
        {!imgError ? (
          <>
            <Image
              src={member.photo.src}
              alt={`Foto ${member.name} — ${member.role}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover object-center w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-15 transition-opacity pointer-events-none" />
          </>
        ) : (
          /* Graceful dual-theme fallback avatar */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-stone-50 to-stone-100 dark:from-zinc-900 dark:to-zinc-950 transition-colors">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-amber-500/30 dark:border-amber-400/30 bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 opacity-85"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="mt-2 text-[0.625rem] font-mono font-bold tracking-wider text-amber-700/80 dark:text-amber-400/80 uppercase">
              {initials}
            </span>
          </div>
        )}

        {/* External Link Floating Badge if URL exists */}
        {member.url && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 dark:bg-black/75 backdrop-blur-sm border border-white/20 text-zinc-200 group-hover:text-amber-400 group-hover:border-amber-400/60 flex items-center justify-center transition-colors shadow-sm">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        )}
      </div>

      {/* Name + Role + Optional Badge */}
      <div className="p-3 sm:p-3.5 flex flex-col gap-1 text-left flex-1 justify-between">
        <div className="space-y-1">
          {member.badge && (
            <div className="mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.5625rem] sm:text-[0.625rem] font-mono font-semibold tracking-wide bg-amber-500/10 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/30">
                <span className="w-1 h-1 rounded-full bg-amber-500 dark:bg-amber-400" />
                {member.badge}
              </span>
            </div>
          )}

          <h3 className="font-serif font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
            {member.name}
          </h3>
        </div>

        <p className={`text-[0.625rem] sm:text-[0.6875rem] font-sans text-zinc-600 dark:text-zinc-400 leading-snug ${isMentor ? 'mt-1' : ''}`}>
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
        className="group relative flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-400/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        title={`Kunjungi profil ${member.name}`}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-400/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {cardContent}
    </div>
  );
}
