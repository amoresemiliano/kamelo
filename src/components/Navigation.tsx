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
    <header className="sticky top-0 z-40 bg-[#3E342F] text-[#FBF8F4] shadow-sm border-b border-[#4B4038]">
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
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C98F7A] text-white shadow-xs font-semibold'
                      : 'text-[#D8C7B8] hover:bg-[#4B4038] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D6A36D]'}`} />
                  <span>{item.label}</span>
                  {hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-[#D6A36D] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Prototype Tag */}
          <div className="hidden lg:flex items-center gap-2 bg-[#4B4038] px-3 py-1.5 rounded-full border border-[#D8C7B8]/20 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#7D9882]" />
            <span className="text-[#D8C7B8] font-mono text-[11px]">MVP v2 Operativo</span>
            <span className="text-[10px] text-[#D6A36D] bg-[#D6A36D]/15 px-2 py-0.5 rounded font-mono border border-[#D6A36D]/30">
              Mock Activo
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-[#4B4038] border-t border-[#D8C7B8]/20 px-2 py-1.5 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-[#C98F7A] font-bold border-b-2 border-[#C98F7A]'
                  : 'text-[#D8C7B8] hover:text-white'
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
