'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TeamMember } from '@/data/team';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [imgError, setImgError] = useState(false);

  // Initials for graceful fallback
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const cardContent = (
    <>
      {/* Portrait image with fixed aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--image-placeholder-bg)]">
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
          /* Graceful dark fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[var(--image-placeholder-bg)]">
            <div className="w-12 h-12 rounded-full border border-[var(--border-medium)] flex items-center justify-center text-[var(--accent-gold)] mb-2 font-mono font-bold text-sm bg-[var(--bg-surface-elevated)]">
              {initials}
            </div>
            <span className="text-[0.5625rem] font-mono uppercase text-[var(--text-muted)] tracking-wider">
              {member.role}
            </span>
          </div>
        )}

        {/* External Link Floating Badge if URL exists */}
        {member.url && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-zinc-200 group-hover:text-[var(--accent-gold)] group-hover:border-[var(--accent-gold)]/60 flex items-center justify-center text-xs transition-colors shadow-sm">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Name + Role — compact */}
      <div className="p-2.5 sm:p-3 flex flex-col gap-0.5 text-left">
        <h3 className="font-serif font-bold text-xs sm:text-sm text-[var(--text-title)] group-hover:text-[var(--accent-gold)] transition-colors leading-snug line-clamp-2">
          {member.name}
        </h3>
        <p className="text-[0.625rem] sm:text-[0.6875rem] font-mono text-[var(--accent-gold)] tracking-wide">
          {member.role}
        </p>
      </div>
    </>
  );

  const containerClasses =
    "group relative flex flex-col rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300";

  if (member.url) {
    return (
      <a
        href={member.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClasses} cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]`}
        title={`Buka portofolio ${member.name}`}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={containerClasses}>{cardContent}</div>;
}
