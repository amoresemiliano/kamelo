'use client';

import React from 'react';

interface SectionHeroProps {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeIcon?: React.ReactNode;
  bgImage: string;
  noticeText?: string;
  children?: React.ReactNode;
}

export default function SectionHero({
  title,
  subtitle,
  badgeText,
  badgeIcon,
  bgImage,
  noticeText,
  children,
}: SectionHeroProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-mejunje-arena/50 shadow-atelier-md bg-mejunje-espresso text-mejunje-marfil">
      {/* Background Image with Warm Analog Tone */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 filter saturate-90 brightness-75"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Multi-layered Warm Atelier Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-mejunje-espresso/95 via-mejunje-espresso/85 to-mejunje-espresso/65" />
      <div className="absolute inset-0 bg-mejunje-tabaco/30 backdrop-blur-[1.5px]" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3.5">
          {/* Typewriter Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mejunje-salmon/20 text-mejunje-marfil text-[11px] font-typewriter tracking-widest uppercase border border-mejunje-salmon/35 backdrop-blur-md">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-normal text-mejunje-marfil tracking-tight leading-tight drop-shadow-xs">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-mejunje-papel/90 leading-relaxed max-w-2xl font-sans drop-shadow-xs">
            {subtitle}
          </p>

          {noticeText && (
            <div className="inline-block mt-1 text-[11px] text-mejunje-arena bg-mejunje-espresso/80 px-3 py-1 rounded-lg border border-mejunje-arena/30 font-typewriter">
              {noticeText}
            </div>
          )}
        </div>

        {/* Action buttons / quick bar */}
        {children && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
