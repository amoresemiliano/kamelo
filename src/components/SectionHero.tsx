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
    <div className="relative rounded-3xl overflow-hidden border border-[#E7DDD4] shadow-sm bg-[#3E342F] text-[#FBF8F4]">
      {/* Background Image with Warm Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      
      {/* Multi-layered Warm Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2B231F]/95 via-[#3E342F]/85 to-[#2B231F]/70" />
      <div className="absolute inset-0 bg-[#3E342F]/40 backdrop-blur-[1px]" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C98F7A]/25 text-[#D8C7B8] text-xs font-semibold border border-[#C98F7A]/35 backdrop-blur-md">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-xs">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#D8C7B8] leading-relaxed max-w-2xl font-normal drop-shadow-xs">
            {subtitle}
          </p>

          {noticeText && (
            <div className="inline-block mt-1 text-[11px] text-[#D6A36D] bg-[#2B231F]/70 px-3 py-1 rounded-lg border border-[#D6A36D]/30 font-mono">
              {noticeText}
            </div>
          )}
        </div>

        {/* Children Actions / Stats */}
        {children && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
