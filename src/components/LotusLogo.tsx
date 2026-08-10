import React from 'react';

export function LotusIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lotus Center Bud/Petal */}
      <path
        d="M16 4C14.5 9 13.8 12.5 16 18C18.2 12.5 17.5 9 16 4Z"
        fill="#D9822B"
      />
      {/* Left Inner Petal */}
      <path
        d="M16 18C12 13.5 8 12 6 15C4.5 17.2 6 20.5 11 21C13 21 15 19.5 16 18Z"
        fill="#C86D51"
      />
      {/* Right Inner Petal */}
      <path
        d="M16 18C20 13.5 24 12 26 15C27.5 17.2 26 20.5 21 21C19 21 17 19.5 16 18Z"
        fill="#C86D51"
      />
      {/* Left Outer Base Petal */}
      <path
        d="M16 19.5C10.5 17 5 18 3 21C1.5 23 3 25.5 8 25.5C12 25.5 14.8 22 16 19.5Z"
        fill="#2A1E17"
        opacity="0.85"
      />
      {/* Right Outer Base Petal */}
      <path
        d="M16 19.5C21.5 17 27 18 29 21C30.5 23 29 25.5 24 25.5C20 25.5 17.2 22 16 19.5Z"
        fill="#2A1E17"
        opacity="0.85"
      />
      {/* Water Lotus Leaf Base Curve */}
      <path
        d="M4 26.5C11 28.5 21 28.5 28 26.5"
        stroke="#6E8B74"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LotusLogoHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A1E17] via-[#3D2C22] to-[#2A1E17] p-2 flex items-center justify-center border border-[#C86D51]/30 shadow-sm">
        <LotusIcon className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-bold text-lg tracking-wider text-[#F7F4EE]">
            KAMELO
          </span>
          <span className="text-[10px] bg-[#C86D51]/30 text-[#E6DFC8] px-2 py-0.5 rounded-full border border-[#C86D51]/40 font-mono">
            Aromáticos
          </span>
        </div>
        <p className="text-[9px] text-[#E6DFC8]/70 tracking-widest uppercase font-medium">
          Laboratorio & Perfumería
        </p>
      </div>
    </div>
  );
}
