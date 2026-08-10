'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FlaskConical,
  ShoppingBag,
  TrendingUp,
  BookOpen,
} from '@/components/Icons';
import { LotusLogoHeader } from '@/components/LotusLogo';
import { useKamelo } from '@/context/KameloContext';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/laboratorio', label: 'Laboratorio', icon: FlaskConical },
  { href: '/compras', label: 'Compras', icon: ShoppingBag },
  { href: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { href: '/mercado', label: 'Inteligencia Mercado', icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();
  const { requirements, purchaseOrders } = useKamelo();

  // Active alerts count
  const pendingOrdersCount = purchaseOrders.filter((p) => p.status === 'Solicitada' || p.status === 'Pendiente').length;
  const pendingRequirementsCount = requirements.filter((r) => r.requirements.length > 0).length;

  return (
    <header className="sticky top-0 z-40 bg-[#2A1E17] text-[#F7F4EE] shadow-md border-b border-[#3D2C22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lotus Logo & Brand Name */}
          <Link href="/" className="group">
            <LotusLogoHeader />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const hasBadge =
                (item.href === '/compras' && (pendingOrdersCount > 0 || pendingRequirementsCount > 0));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C86D51] text-white shadow-sm font-semibold'
                      : 'text-[#E6DFC8] hover:bg-[#3D2C22] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D9822B]'}`} />
                  <span>{item.label}</span>
                  {hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-[#D9822B] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Prototype Tag */}
          <div className="hidden lg:flex items-center gap-2 bg-[#3D2C22] px-3 py-1.5 rounded-full border border-[#523B2E] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#6E8B74]" />
            <span className="text-[#E6DFC8] font-mono text-[11px]">MVP v2 Operativo</span>
            <span className="text-[10px] text-[#D9822B] bg-[#D9822B]/10 px-2 py-0.5 rounded font-mono border border-[#D9822B]/30">
              Mock Activo
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-[#3D2C22] border-t border-[#523B2E] px-2 py-1.5 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
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
