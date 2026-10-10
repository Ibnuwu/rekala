'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration safe placeholder with identical layout footprint
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--accent-gold)] ${className}`}
        aria-hidden="true"
      >
        <span className="w-4 h-4 rounded-full bg-[var(--accent-gold)]/20 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleTheme();
      }}
      className={`
        relative inline-flex items-center justify-center w-9 h-9 rounded-lg
        border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]
        text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)]
        hover:border-[var(--accent-gold-border)] hover:bg-[var(--bg-surface)]
        active:scale-95 transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-[var(--accent-gold)]
        cursor-pointer touch-manipulation select-none
        ${className}
      `}
      aria-label={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
      title={isDark ? 'Mode Terang' : 'Mode Gelap'}
    >
      <span className="sr-only">
        {isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      </span>

      {/* Sun Icon (shown when dark mode is active, clicking switches to light mode) */}
      {isDark ? (
        <svg
          className="w-4 h-4 text-[var(--accent-gold)] transition-transform duration-300 transform rotate-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.2" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        /* Moon Icon (shown when light mode is active, clicking switches to dark mode) */
        <svg
          className="w-4 h-4 text-[var(--accent-gold)] transition-transform duration-300 transform rotate-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      )}
    </button>
  );
}

