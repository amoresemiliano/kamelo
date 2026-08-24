'use client';

import React from 'react';

/**
 * Discrete neutral archive monogram for MEJUNJE Atelier
 */
export function MejunjeMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center font-typewriter font-bold text-mejunje-espresso ${className}`}>
      <span className="text-base tracking-tighter">[ M ]</span>
    </div>
  );
}

/**
 * Re-export LotusIcon as discrete neutral symbol to keep backward compatibility
 */
export function LotusIcon({ className = "w-5 h-5" }: { className?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; leafColor?: string }) {
  return (
    <span className={`font-typewriter text-xs font-bold tracking-widest text-mejunje-ambar ${className}`}>
      ✻
    </span>
  );
}

/**
 * Official MEJUNJE Antique Typewriter Wordmark & Header Component
 */
export function LotusLogoHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {/* Discrete Analog Monogram Stamp */}
      <div className="w-9 h-9 rounded-xl bg-mejunje-papel p-1 flex items-center justify-center border border-mejunje-arena text-mejunje-espresso shadow-atelier transition-transform group-hover:scale-105">
        <span className="font-typewriter text-xs font-bold tracking-tighter text-mejunje-espresso">
          [M]
        </span>
      </div>

      {/* Wordmark and Editorial Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-typewriter font-bold text-lg sm:text-xl tracking-[0.18em] text-mejunje-espresso group-hover:text-mejunje-ambar transition-colors">
            MEJUNJE
          </span>
          <span className="text-[9px] font-typewriter tracking-widest uppercase px-1.5 py-0.5 rounded bg-mejunje-arena/40 text-mejunje-tabaco border border-mejunje-arena">
            Atelier
          </span>
        </div>
        <p className="font-typewriter text-[9px] text-mejunje-griscalido tracking-widest uppercase">
          Palermo · Buenos Aires
        </p>
      </div>
    </div>
  );
}

export default LotusLogoHeader;
