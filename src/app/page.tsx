'use client';

import React from 'react';
import Link from 'next/link';
import { useKamelo } from '@/context/KameloContext';
import { LotusIcon } from '@/components/LotusLogo';
import SectionHero from '@/components/SectionHero';
import {
  FlaskConical,
  ShoppingBag,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Plus,
  CandleIcon,
  DropperIcon,
  ApothecaryBottleIcon,
  TagStringIcon,
  BotanicalBranchMini,
  DropletMini,
} from '@/components/Icons';

export default function DashboardPage() {
  const {
    formulas,
    ingredients,
    requirements,
    purchaseOrders,
    batchTests,
    marketBenchmarks,
    activityLogs,
    setActiveModal,
    runMarketQueries,
  } = useKamelo();

  // Calculations
  const lowStockCount = ingredients.filter((ing) => ing.stock <= ing.minStock).length;
  const inTestFormulas = batchTests.filter((bt) => bt.status === 'Curado' || bt.status === 'Evaluación' || bt.status === 'Preparación');
  const totalRequirementARS = requirements.reduce((acc, g) => acc + g.totalARS, 0);
  const metMinimumsCount = requirements.filter((g) => g.meetsMinimum).length;
  const opportunitiesCount = marketBenchmarks.filter((b) => b.status === 'Oportunidad Aumento').length;

  return (
    <div className="space-y-10 animate-in fade-in pb-12">
      {/* Header Banner with Warm Analog Photography */}
      <SectionHero
        title="Atelier de Perfumería & Archivo Olfativo"
        subtitle="Formulación botánica de autor, pesaje y balance de batches, consolidación inteligente de compras por proveedor y observatorio de precios en CABA y Argentina."
        badgeText="MEJUNJE · PALERMO SOHO · BUENOS AIRES"
        badgeIcon={<LotusIcon className="w-3.5 h-3.5 text-mejunje-verdeseco" />}
        bgImage="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=80"
        noticeText="mezcla · intención · aroma"
      >
        {/* Quick Action Ledger Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-mejunje-border shrink-0 shadow-xs font-typewriter">
          <button
            onClick={() => setActiveModal('formula')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-mejunje-primary text-xs shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Fórmula
          </button>

          <button
            onClick={() => setActiveModal('product')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-mejunje-secondary text-xs active:scale-95"
          >
            <TagStringIcon className="w-3.5 h-3.5 text-mejunje-terracota" /> Ficha Comercial
          </button>

          <button
            onClick={() => setActiveModal('purchaseOrder')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl btn-mejunje-secondary text-xs active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-mejunje-verdeprofundo" /> Orden de Compra
          </button>

          <button
            onClick={() => runMarketQueries()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mejunje-papel hover:bg-mejunje-arena/40 text-mejunje-carbon text-xs border border-mejunje-border transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 text-mejunje-ambar" /> Relevar Precios
          </button>
        </div>
      </SectionHero>

      {/* Editorial Index Cards (Asymmetrical & Typographic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-typewriter">
        {/* Card 1: Alert Stock */}
        <Link
          href="/laboratorio"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario">Materias Primas</span>
            <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-amber-50 text-mejunje-ambar border border-amber-200' : 'bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border'}`}>
              <ApothecaryBottleIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">{lowStockCount} En Alerta</div>
            <p className="text-[11px] text-mejunje-secundario mt-1">Insumos bajo stock de seguridad</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-verdeprofundo font-bold">
            <span>Revisar inventario</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Purchases */}
        <Link
          href="/compras"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario">Abastecimiento</span>
            <div className="p-2 rounded-xl bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">
              ${totalRequirementARS.toLocaleString('es-AR')}
            </div>
            <p className="text-[11px] text-mejunje-verdeprofundo mt-1 font-bold">
              {metMinimumsCount} de {requirements.length} proveedores en mínimo
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-verdeprofundo font-bold">
            <span>Generar órdenes</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Formulas & Tests */}
        <Link
          href="/laboratorio"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario">Laboratorio</span>
            <div className="p-2 rounded-xl bg-mejunje-papel text-mejunje-terracota border border-mejunje-border">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">{inTestFormulas.length} Batches en Curso</div>
            <p className="text-[11px] text-mejunje-secundario mt-1">{formulas.length} fórmulas registradas</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-terracota font-bold">
            <span>Mesa de pesaje</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Market Benchmarks */}
        <Link
          href="/mercado"
          className="atelier-sheet p-5 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-mejunje-secundario">Observatorio</span>
            <div className="p-2 rounded-xl bg-amber-50 text-mejunje-ambar border border-amber-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold text-mejunje-carbon">{marketBenchmarks.length} Benchmarks</div>
            <p className="text-[11px] text-mejunje-ambar mt-1 font-bold">
              {opportunitiesCount} oportunidad(es) detectadas
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-mejunje-border flex items-center justify-between text-[10px] text-mejunje-ambar font-bold">
            <span>Monitorear precios</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Main Grid: Supplier Minimums Progress + Laboratory Activity Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Supplier Minimums Progress (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="atelier-sheet p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-typewriter text-sm sm:text-base font-bold text-mejunje-carbon flex items-center gap-2 uppercase tracking-wider">
                  <DropperIcon className="w-4 h-4 text-mejunje-verdeseco" /> Consolidación de Compras por Proveedor
                </h3>
                <p className="text-xs text-mejunje-secundario mt-0.5 font-typewriter">
                  Control de mínimos de compra para desbloquear precios mayoristas en ARS
                </p>
              </div>
              <Link href="/compras" className="text-xs text-mejunje-verdeprofundo font-bold hover:underline flex items-center gap-1 font-typewriter">
                Ver Abastecimiento <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4 font-typewriter">
              {requirements.map((group) => {
                const percent = Math.min(100, Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100));
                return (
                  <div key={group.supplierId} className="p-4 rounded-2xl bg-mejunje-papel border border-mejunje-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-mejunje-carbon">{group.supplierName}</span>
                        {group.meetsMinimum ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Mínimo Cumplido
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-mejunje-ambar text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-mejunje-ambar" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-mejunje-secundario">
                        Acumulado: <strong className="text-mejunje-carbon">${group.totalARS.toLocaleString('es-AR')} ARS</strong> / Mín: ${group.minPurchaseARS.toLocaleString('es-AR')} ARS
                      </div>
                    </div>

                    {/* Progress Bar in Botanical / Earth Colors */}
                    <div className="w-full bg-mejunje-arena/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-mejunje-verdeprofundo' : 'bg-mejunje-verdeseco'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Editorial Module Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-typewriter">
            <Link
              href="/laboratorio"
              className="atelier-sheet p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-mejunje-papel text-mejunje-verdeprofundo flex items-center justify-center border border-mejunje-border">
                  <CandleIcon className="w-5 h-5 text-mejunje-verdeprofundo" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-mejunje-carbon">Laboratorio de Fórmulas</h4>
                  <p className="text-[10px] text-mejunje-secundario">Pirámides olfativas y calculadora de batch</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-mejunje-verdeseco group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/catalogo"
              className="atelier-sheet p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-mejunje-papel text-mejunje-terracota flex items-center justify-center border border-mejunje-border">
                  <BookOpen className="w-5 h-5 text-mejunje-terracota" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-mejunje-carbon">Catálogo Editorial</h4>
                  <p className="text-[10px] text-mejunje-secundario">Fichas botánicas y envío por WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-mejunje-terracota group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Activity Ledger (Bitácora) */}
        <div className="atelier-sheet p-6 sm:p-7 flex flex-col justify-between font-typewriter">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-mejunje-border">
              <h3 className="text-xs sm:text-sm font-bold text-mejunje-carbon flex items-center gap-2 uppercase tracking-wider">
                <LotusIcon className="w-3.5 h-3.5 text-mejunje-verdeseco" /> Bitácora del Atelier
              </h3>
              <span className="text-[9px] bg-mejunje-papel text-mejunje-verdeprofundo border border-mejunje-border font-bold px-2 py-0.5 rounded-full">
                Archivo
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 8).map((log) => {
                return (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-mejunje-papel/60 border border-mejunje-border space-y-1 text-xs transition-colors hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-mejunje-carbon text-xs">{log.title}</span>
                      <span className="text-[9px] text-mejunje-secundario">{log.timestamp}</span>
                    </div>
                    <p className="text-mejunje-secundario text-[11px] leading-relaxed">{log.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-mejunje-border flex items-center justify-between">
            <span className="text-[9px] text-mejunje-secundario uppercase tracking-wider">
              MEJUNJE · Palermo, Bs As
            </span>
            <BotanicalBranchMini className="w-10 h-5 text-mejunje-salvia" />
          </div>
        </div>
      </div>
    </div>
  );
}

