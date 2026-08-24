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
  { href: '/', label: 'Atelier', icon: LayoutDashboard },
  { href: '/laboratorio', label: 'Laboratorio', icon: FlaskConical },
  { href: '/compras', label: 'Abastecimiento', icon: ShoppingBag },
  { href: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { href: '/mercado', label: 'Observatorio', icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();
  const { requirements, purchaseOrders } = useKamelo();

  // Active alerts count
  const pendingOrdersCount = purchaseOrders.filter((p) => p.status === 'Solicitada' || p.status === 'Pendiente').length;
  const pendingRequirementsCount = requirements.filter((r) => r.requirements.length > 0).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-mejunje-tinta shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] border-b border-mejunje-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mejunje Typewriter Wordmark & Subtitle */}
          <Link href="/" className="group focus:outline-none">
            <LotusLogoHeader />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const hasBadge =
                (item.href === '/compras' && (pendingOrdersCount > 0 || pendingRequirementsCount > 0));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs transition-all font-sans ${
                    isActive
                      ? 'bg-mejunje-salvia/12 text-mejunje-salviaoscura border border-mejunje-salvia/30 font-semibold shadow-xs'
                      : 'text-mejunje-griscalido hover:bg-mejunje-papel hover:text-mejunje-tinta'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-mejunje-salviaoscura' : 'text-mejunje-griscalido'}`} />
                  <span className="tracking-wide">{item.label}</span>
                  {hasBadge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-mejunje-salvia animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Discrete Palermo Tag */}
          <div className="hidden lg:flex items-center gap-2.5 bg-mejunje-papel px-3 py-1 rounded-full border border-mejunje-border text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-mejunje-salvia" />
            <span className="text-mejunje-salviaoscura font-typewriter text-[10px] tracking-widest uppercase font-medium">
              Palermo Soho · BS AS
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-white/95 border-t border-mejunje-border px-2 py-1.5 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-mejunje-salviaoscura font-semibold'
                  : 'text-mejunje-griscalido hover:text-mejunje-tinta'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
