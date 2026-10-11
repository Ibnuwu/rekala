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

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
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
    </div>
  );
}
