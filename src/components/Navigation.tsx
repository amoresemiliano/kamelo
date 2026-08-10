'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FlaskConical,
  ShoppingBag,
  TrendingUp,
  BookOpen,
  Sparkles,
  Layers
} from '@/components/Icons';

const navItems = [
  { href: '/', label: 'Inicio / Dashboard', icon: LayoutDashboard },
  { href: '/laboratorio', label: 'Laboratorio', icon: FlaskConical },
  { href: '/compras', label: 'Compras', icon: ShoppingBag },
  { href: '/mercado', label: 'Inteligencia Mercado', icon: TrendingUp },
  { href: '/catalogo', label: 'Catálogo Interactivo', icon: BookOpen },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#2A1E17] text-[#F7F4EE] shadow-md border-b border-[#3D2C22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9822B] to-[#C86D51] flex items-center justify-center text-white font-bold shadow-inner group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-wide text-[#F7F4EE]">
                  Kamelo
                </span>
                <span className="text-xs bg-[#C86D51]/30 text-[#E6DFC8] px-2 py-0.5 rounded-full border border-[#C86D51]/40 font-mono">
                  Plataforma Interna
                </span>
              </div>
              <p className="text-[10px] text-[#E6DFC8]/70 tracking-wider uppercase">
                Laboratorio & Aromáticos ARS
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C86D51] text-white shadow-sm font-semibold'
                      : 'text-[#E6DFC8] hover:bg-[#3D2C22] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D9822B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-[#3D2C22] px-3 py-1.5 rounded-full border border-[#523B2E] text-xs">
            <Layers className="w-3.5 h-3.5 text-[#D9822B]" />
            <span className="text-[#E6DFC8]">ARS / Cotización Dólar Oportunidad</span>
            <span className="font-bold text-[#6E8B74] bg-[#6E8B74]/20 px-2 py-0.5 rounded text-[10px]">
              Al día
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden bg-[#3D2C22] border-t border-[#523B2E] px-2 py-1 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded text-[11px] whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-[#C86D51] font-bold border-b-2 border-[#C86D51]'
                  : 'text-[#E6DFC8] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
