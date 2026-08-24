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
    <div className="relative rounded-3xl overflow-hidden border border-mejunje-border bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] text-mejunje-tinta">
      {/* Background Image with Light Botanical Soft Focus */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 filter saturate-80 opacity-[0.14]"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Multi-layered Luminous Atelier Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-mejunje-marfil/70" />
      <div className="absolute inset-0 bg-mejunje-papel/20 backdrop-blur-[0.5px]" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3.5">
          {/* Typewriter Badge in Sage Green */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mejunje-salvia/10 text-mejunje-salviaoscura text-[11px] font-typewriter tracking-widest uppercase border border-mejunje-salvia/25">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-normal text-mejunje-tinta tracking-tight leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-mejunje-griscalido leading-relaxed max-w-2xl font-sans">
            {subtitle}
          </p>

          {noticeText && (
            <div className="inline-block mt-1 text-[11px] text-mejunje-salviaoscura bg-mejunje-papel/80 px-3 py-1 rounded-full border border-mejunje-border font-typewriter tracking-wide">
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
