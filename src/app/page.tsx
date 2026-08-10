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
  Sparkles,
  Plus,
  Clock,
  Package,
  Building2,
  Play
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { LotusIcon } from '@/components/LotusLogo';

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
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2A1E17] via-[#3D2C22] to-[#2A1E17] text-[#F7F4EE] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#3D2C22] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C86D51]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D51]/20 text-[#E6DFC8] text-xs font-semibold border border-[#C86D51]/30 mb-3">
              <LotusIcon className="w-4 h-4 text-[#D9822B]" /> Panel Operativo — Kamelo Aromáticos
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-tight">
              Control General de Laboratorio & Compras ARS
            </h1>
            <p className="text-xs sm:text-sm text-[#E6DFC8]/90 leading-relaxed">
              Plataforma interactiva para desarrollo de fragancias, cálculo de batches, agrupación de pedidos a proveedores por mínimos de compra y monitoreo competitivo de precios.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-[#1F1611]/80 p-3 rounded-2xl border border-[#3D2C22] shrink-0">
            <button
              onClick={() => setActiveModal('formula')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C86D51] hover:bg-[#a85239] text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Crear Fórmula
            </button>

            <button
              onClick={() => setActiveModal('product')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D9822B] hover:bg-[#b86a1d] text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Package className="w-3.5 h-3.5" /> Crear Producto
            </button>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#6E8B74] hover:bg-[#58725d] text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Crear Orden
            </button>

            <button
              onClick={() => setActiveModal('supplier')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#3D2C22] hover:bg-[#523B2E] text-[#E6DFC8] text-xs font-semibold border border-[#523B2E] transition-all"
            >
              <Building2 className="w-3.5 h-3.5" /> Proveedor
            </button>

            <button
              onClick={() => runMarketQueries()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D9822B]/20 hover:bg-[#D9822B]/30 text-[#D9822B] text-xs font-semibold border border-[#D9822B]/40 transition-all"
            >
              <Play className="w-3.5 h-3.5" /> Consultar Mercado
            </button>
          </div>
        </div>
      </div>

      {/* KPI & Operational Alerts Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Alert Stock */}
        <Link
          href="/laboratorio"
          className="bg-white p-5 rounded-2xl shadow-xs border border-[#E6DFC8] flex flex-col justify-between hover:border-[#C86D51] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Alertas de Stock & Insumos</span>
            <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#2A1E17] font-serif">{lowStockCount} Insumos Críticos</div>
            <p className="text-xs text-[#7A6B61] mt-1">Requieren reabastecimiento urgente</p>
          </div>
        </Link>

        {/* Card 2: Purchases */}
        <Link
          href="/compras"
          className="bg-white p-5 rounded-2xl shadow-xs border border-[#E6DFC8] flex flex-col justify-between hover:border-[#6E8B74] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Compras Requeridas ARS</span>
            <div className="p-2 rounded-xl bg-[#6E8B74]/20 text-[#6E8B74]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#2A1E17] font-serif">
              ${totalRequirementARS.toLocaleString('es-AR')} ARS
            </div>
            <p className="text-xs text-[#6E8B74] mt-1 font-semibold">
              {metMinimumsCount} de {requirements.length} proveed. cumplen mínimo
            </p>
          </div>
        </Link>

        {/* Card 3: Formulas & Tests */}
        <Link
          href="/laboratorio"
          className="bg-white p-5 rounded-2xl shadow-xs border border-[#E6DFC8] flex flex-col justify-between hover:border-[#C86D51] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Batches & Pruebas Activas</span>
            <div className="p-2 rounded-xl bg-[#C86D51]/10 text-[#C86D51]">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#2A1E17] font-serif">{inTestFormulas.length} Pruebas en Curso</div>
            <p className="text-xs text-[#7A6B61] mt-1">{formulas.length} fórmulas registradas</p>
          </div>
        </Link>

        {/* Card 4: Market Benchmarks */}
        <Link
          href="/mercado"
          className="bg-white p-5 rounded-2xl shadow-xs border border-[#E6DFC8] flex flex-col justify-between hover:border-[#D9822B] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Monitoreo de Mercado</span>
            <div className="p-2 rounded-xl bg-[#D9822B]/10 text-[#D9822B]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#2A1E17] font-serif">{marketBenchmarks.length} Benchmarks</div>
            <p className="text-xs text-[#D9822B] font-semibold mt-1">
              {opportunitiesCount} Oportunidad(es) de Aumento
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Activity Feed + Supplier Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Supplier Minimums Progress (2 cols on large) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2A1E17] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C86D51]" /> Compras Agrupadas por Proveedor
                </h3>
                <p className="text-xs text-[#7A6B61]">Estado de cumplimiento del pedido mínimo de compra ARS</p>
              </div>
              <Link href="/compras" className="text-xs text-[#C86D51] font-bold hover:underline flex items-center gap-1">
                Ver Módulo Compras <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {requirements.map((group) => {
                const percent = Math.min(100, Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100));
                return (
                  <div key={group.supplierId} className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#2A1E17]">{group.supplierName}</span>
                        {group.meetsMinimum ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Mínimo Cumplido
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#7A6B61]">
                        Acumulado: <strong className="text-[#2A1E17]">${group.totalARS.toLocaleString('es-AR')} ARS</strong> / Mín: ${group.minPurchaseARS.toLocaleString('es-AR')} ARS
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#E6DFC8] rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-[#6E8B74]' : 'bg-[#D9822B]'
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
              className="bg-[#2A1E17] text-[#F7F4EE] p-5 rounded-2xl border border-[#3D2C22] hover:border-[#C86D51] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C86D51]/20 text-[#C86D51] flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Laboratorio de Fórmulas</h4>
                  <p className="text-[11px] text-[#E6DFC8]/70">Pirámides olfativas y calculadora de batch</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C86D51] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/catalogo"
              className="bg-[#2A1E17] text-[#F7F4EE] p-5 rounded-2xl border border-[#3D2C22] hover:border-[#D9822B] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D9822B]/20 text-[#D9822B] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Catálogo Interactivo</h4>
                  <p className="text-[11px] text-[#E6DFC8]/70">Variantes y envío por WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D9822B] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Real-time Activity Feed */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6DFC8]">
              <h3 className="font-serif font-bold text-base text-[#2A1E17] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C86D51]" /> Actividad Reciente
              </h3>
              <span className="text-[10px] bg-[#6E8B74]/20 text-[#6E8B74] font-bold px-2 py-0.5 rounded-full">
                En vivo
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 8).map((log) => {
                const isFormula = log.type === 'formula';
                const isBatch = log.type === 'batch';
                const isPurchase = log.type === 'purchase';
                const isMarket = log.type === 'market';

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8]/80 space-y-1 text-xs transition-colors hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2A1E17]">{log.title}</span>
                      <span className="text-[10px] text-[#7A6B61] font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-[#7A6B61] text-[11px] leading-relaxed">{log.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6DFC8] text-center">
            <span className="text-[11px] text-[#7A6B61]">
              Todos los datos son operados en tiempo real localmente.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
