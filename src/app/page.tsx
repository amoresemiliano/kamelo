'use client';

import React from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  ShoppingBag,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Plus,
  Clock,
  Package,
  Building2,
  Play
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { LotusIcon } from '@/components/LotusLogo';
import SectionHero from '@/components/SectionHero';

export default function DashboardPage() {
  const {
    formulas,
    ingredients,
    requirements,
    purchaseOrders,
    batchTests,
    catalogProducts,
    marketBenchmarks,
    activityLogs,
    setActiveModal,
    runMarketQueries,
  } = useKamelo();

  // Calculations
  const lowStockCount = ingredients.filter((ing) => ing.stock <= ing.minStock).length;
  const pendingOrders = purchaseOrders.filter((po) => po.status === 'Solicitada' || po.status === 'Pendiente');
  const inTestFormulas = batchTests.filter((bt) => bt.status === 'Curado' || bt.status === 'Evaluación' || bt.status === 'Preparación');
  const totalRequirementARS = requirements.reduce((acc, g) => acc + g.totalARS, 0);
  const metMinimumsCount = requirements.filter((g) => g.meetsMinimum).length;
  const opportunitiesCount = marketBenchmarks.filter((b) => b.status === 'Oportunidad Aumento').length;

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* Header Banner with Warm Analog Photography */}
      <SectionHero
        title="Atelier de Perfumería & Archivo Olfativo"
        subtitle="Gestión interna de formulación botánica, dosificación de materias primas, cálculo de batch, consolidación de pedidos mínimos a proveedores y observatorio de precios en Argentina."
        badgeText="MEJUNJE · PALERMO, BUENOS AIRES"
        badgeIcon={<LotusIcon className="w-3.5 h-3.5 text-mejunje-salvia" />}
        bgImage="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=80"
        noticeText="mezcla · intención · aroma"
      >
        {/* Quick Action Ledger Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-mejunje-border shrink-0 shadow-xs">
          <button
            onClick={() => setActiveModal('formula')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mejunje-salvia hover:bg-mejunje-salviaoscura text-white text-xs font-medium shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Fórmula
          </button>

          <button
            onClick={() => setActiveModal('product')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mejunje-papel hover:bg-mejunje-arena/50 text-mejunje-tinta text-xs font-medium border border-mejunje-border transition-all active:scale-95"
          >
            <Package className="w-3.5 h-3.5 text-mejunje-salviaoscura" /> Ficha Comercial
          </button>

          <button
            onClick={() => setActiveModal('purchaseOrder')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mejunje-papel hover:bg-mejunje-arena/50 text-mejunje-tinta text-xs font-medium border border-mejunje-border transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-mejunje-salviaoscura" /> Orden de Compra
          </button>

          <button
            onClick={() => setActiveModal('supplier')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-mejunje-papel text-mejunje-griscalido text-xs font-medium border border-mejunje-border transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-mejunje-salviaoscura" /> Proveedor
          </button>

          <button
            onClick={() => runMarketQueries()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mejunje-salvia/10 hover:bg-mejunje-salvia/20 text-mejunje-salviaoscura text-xs font-typewriter tracking-wider border border-mejunje-salvia/30 transition-all"
          >
            <Play className="w-3 h-3" /> Relevar Precios
          </button>
        </div>
      </SectionHero>

      {/* Editorial Index Cards (Key Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Alert Stock */}
        <Link
          href="/laboratorio"
          className="bg-white p-5 rounded-2xl shadow-xs border border-mejunje-border flex flex-col justify-between hover:border-mejunje-salvia hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-griscalido">Materias Primas</span>
            <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-mejunje-salvia/10 text-mejunje-salviaoscura border border-mejunje-salvia/20'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-serif italic text-mejunje-tinta">{lowStockCount} Insumos en Alerta</div>
            <p className="text-xs text-mejunje-griscalido mt-1 font-sans">Requieren reposición para producción</p>
          </div>
        </Link>

        {/* Card 2: Purchases */}
        <Link
          href="/compras"
          className="bg-white p-5 rounded-2xl shadow-xs border border-mejunje-border flex flex-col justify-between hover:border-mejunje-salvia hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-griscalido">Abastecimiento ARS</span>
            <div className="p-2 rounded-xl bg-mejunje-salvia/10 text-mejunje-salviaoscura border border-mejunje-salvia/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-serif italic text-mejunje-tinta">
              ${totalRequirementARS.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-mejunje-salviaoscura mt-1 font-sans font-medium">
              {metMinimumsCount} de {requirements.length} proveedores cumplen mínimo
            </p>
          </div>
        </Link>

        {/* Card 3: Formulas & Tests */}
        <Link
          href="/laboratorio"
          className="bg-white p-5 rounded-2xl shadow-xs border border-mejunje-border flex flex-col justify-between hover:border-mejunje-salvia hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-griscalido">Laboratorio</span>
            <div className="p-2 rounded-xl bg-mejunje-salvia/10 text-mejunje-salviaoscura border border-mejunje-salvia/20">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-serif italic text-mejunje-tinta">{inTestFormulas.length} Batches en Curso</div>
            <p className="text-xs text-mejunje-griscalido mt-1 font-sans">{formulas.length} fórmulas de autor registradas</p>
          </div>
        </Link>

        {/* Card 4: Market Benchmarks */}
        <Link
          href="/mercado"
          className="bg-white p-5 rounded-2xl shadow-xs border border-mejunje-border flex flex-col justify-between hover:border-mejunje-salvia hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-griscalido">Observatorio</span>
            <div className="p-2 rounded-xl bg-mejunje-salvia/10 text-mejunje-salviaoscura border border-mejunje-salvia/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-serif italic text-mejunje-tinta">{marketBenchmarks.length} Benchmarks</div>
            <p className="text-xs text-mejunje-salviaoscura font-sans font-medium mt-1">
              {opportunitiesCount} Oportunidad(es) de ajuste de precio
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Supplier Minimums Progress + Laboratory Activity Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Supplier Minimums Progress (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-mejunje-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-typewriter text-base font-bold text-mejunje-tinta flex items-center gap-2 uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-mejunje-salvia" /> Consolidación de Compras por Proveedor
                </h3>
                <p className="text-xs text-mejunje-griscalido mt-0.5">Control de órdenes agrupadas respecto a los mínimos de compra en ARS</p>
              </div>
              <Link href="/compras" className="text-xs text-mejunje-salviaoscura font-medium hover:underline flex items-center gap-1 font-sans">
                Ver Abastecimiento <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {requirements.map((group) => {
                const percent = Math.min(100, Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100));
                return (
                  <div key={group.supplierId} className="p-4 rounded-2xl bg-mejunje-papel/50 border border-mejunje-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-sm text-mejunje-tinta">{group.supplierName}</span>
                        {group.meetsMinimum ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium flex items-center gap-1 border border-emerald-200 font-sans">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mínimo Cumplido
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-medium flex items-center gap-1 border border-amber-200 font-sans">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-mejunje-griscalido font-sans">
                        Acumulado: <strong className="text-mejunje-tinta">${group.totalARS.toLocaleString('es-AR')} ARS</strong> / Mín: ${group.minPurchaseARS.toLocaleString('es-AR')} ARS
                      </div>
                    </div>

                    {/* Progress Bar with Mejunje Sage Tones */}
                    <div className="w-full bg-mejunje-arena/40 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-mejunje-salviaoscura' : 'bg-mejunje-salvia'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Module Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/laboratorio"
              className="bg-white text-mejunje-tinta p-5 rounded-2xl border border-mejunje-border hover:border-mejunje-salvia transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-mejunje-salvia/10 text-mejunje-salviaoscura flex items-center justify-center border border-mejunje-salvia/25">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif italic text-base text-mejunje-tinta">Laboratorio de Fórmulas</h4>
                  <p className="text-[11px] text-mejunje-griscalido font-sans">Pirámides olfativas y calculadora de batches</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-mejunje-salvia group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/catalogo"
              className="bg-white text-mejunje-tinta p-5 rounded-2xl border border-mejunje-border hover:border-mejunje-salvia transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-mejunje-salvia/10 text-mejunje-salviaoscura flex items-center justify-center border border-mejunje-salvia/25">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif italic text-base text-mejunje-tinta">Catálogo Editorial</h4>
                  <p className="text-[11px] text-mejunje-griscalido font-sans">Fichas botánicas y envío por WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-mejunje-salvia group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Activity Ledger (Bitácora) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-mejunje-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-mejunje-border">
              <h3 className="font-typewriter text-sm font-bold text-mejunje-tinta flex items-center gap-2 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-mejunje-salvia" /> Bitácora del Atelier
              </h3>
              <span className="font-typewriter text-[10px] bg-mejunje-papel text-mejunje-salviaoscura border border-mejunje-border font-semibold px-2 py-0.5 rounded-full">
                En vivo
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 8).map((log) => {
                return (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-mejunje-papel/40 border border-mejunje-border space-y-1 text-xs transition-colors hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-semibold text-mejunje-tinta">{log.title}</span>
                      <span className="text-[10px] text-mejunje-griscalido font-typewriter">{log.timestamp}</span>
                    </div>
                    <p className="text-mejunje-griscalido text-[11px] leading-relaxed font-sans">{log.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-mejunje-border text-center">
            <span className="font-typewriter text-[10px] text-mejunje-griscalido uppercase tracking-wider">
              MEJUNJE · Atelier Olfativo Palermo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
