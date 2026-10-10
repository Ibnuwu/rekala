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
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Top: Large vertical portrait image container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--image-placeholder-bg)] border-b border-[var(--border-subtle)]">
        {!imgError ? (
          <>
            <Image
              src={member.photo.src}
              alt={`Foto ${member.name} — ${member.role}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center w-full h-full archive-image group-hover:scale-[1.04] transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            {/* Subtle aesthetic vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
          </>
        ) : (
          /* Graceful dark fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[var(--image-placeholder-bg)]">
            <div className="w-14 h-14 rounded-full border border-[var(--border-medium)] flex items-center justify-center text-[var(--accent-gold)] mb-2 font-mono font-bold text-base bg-[var(--bg-surface-elevated)]">
              {initials}
            </div>
            <span className="text-[0.625rem] font-mono uppercase text-[var(--text-muted)] tracking-wider">
              {member.role}
            </span>
          </div>
        )}
      </div>

      {/* Bottom: Bold Name + Small Jobdesk/Role text ONLY */}
      <div className="p-3 sm:p-4 flex flex-col gap-0.5 sm:gap-1 text-left flex-1 justify-between">
        <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--text-title)] group-hover:text-[var(--accent-gold)] transition-colors leading-snug line-clamp-2">
          {member.name}
        </h3>
        <p className="text-[0.6875rem] sm:text-xs font-mono text-[var(--accent-gold)] tracking-wide">
          {member.role}
        </p>
      </div>
    </div>
  );
}
