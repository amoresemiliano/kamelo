import React from 'react';

export function LotusIcon({ className = "w-7 h-7", primaryColor = "#C98F7A", secondaryColor = "#DFA28F", accentColor = "#D6A36D", leafColor = "#7D9882" }: { className?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; leafColor?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer base leaf line */}
      <path
        d="M4 29.5C12 32.5 24 32.5 32 29.5"
        stroke={leafColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Central Petal Bud */}
      <path
        d="M18 4C16.2 9.5 15.2 14 18 21C20.8 14 19.8 9.5 18 4Z"
        fill={accentColor}
        stroke="#4B4038"
        strokeWidth="0.8"
      />
      {/* Inner Left Petal */}
      <path
        d="M18 21C13.5 15.5 8.5 14 6.5 17.5C5 20 7 23.5 12.5 24.2C14.8 24.5 16.8 22.8 18 21Z"
        fill={primaryColor}
        stroke="#4B4038"
        strokeWidth="0.8"
      />
      {/* Inner Right Petal */}
      <path
        d="M18 21C22.5 15.5 27.5 14 29.5 17.5C31 20 29 23.5 23.5 24.2C21.2 24.5 19.2 22.8 18 21Z"
        fill={primaryColor}
        stroke="#4B4038"
        strokeWidth="0.8"
      />
      {/* Lower Left Petal */}
      <path
        d="M18 22.5C11.5 20 5.5 21 3.5 24.2C2 26.5 3.8 28.5 9.5 28.5C14 28.5 16.8 25 18 22.5Z"
        fill={secondaryColor}
        stroke="#4B4038"
        strokeWidth="0.8"
      />
      {/* Lower Right Petal */}
      <path
        d="M18 22.5C24.5 20 30.5 21 32.5 24.2C34 26.5 32.2 28.5 26.5 28.5C22 28.5 19.2 25 18 22.5Z"
        fill={secondaryColor}
        stroke="#4B4038"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export function LotusLogoHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-2xl bg-[#4B4038] p-1.5 flex items-center justify-center border border-[#C98F7A]/40 shadow-sm transition-transform group-hover:scale-105">
        <LotusIcon className="w-7 h-7" primaryColor="#DFA28F" secondaryColor="#C98F7A" accentColor="#D6A36D" leafColor="#7D9882" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg tracking-wider text-[#FBF8F4]">
            KAMELO
          </span>
          <span className="text-[10px] bg-[#C98F7A]/30 text-[#DFA28F] px-2 py-0.5 rounded-full border border-[#C98F7A]/40 font-mono font-medium">
            Aromáticos
          </span>
        </div>
        <p className="text-[9px] text-[#D8C7B8] tracking-widest uppercase font-medium">
          Laboratorio & Perfumería
        </p>
      </div>
    </div>
  );
}
