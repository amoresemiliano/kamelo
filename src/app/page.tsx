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
      <div className="bg-gradient-to-r from-[#3E342F] via-[#4B4038] to-[#3E342F] text-[#FBF8F4] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#4B4038] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C98F7A]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C98F7A]/20 text-[#D8C7B8] text-xs font-semibold border border-[#C98F7A]/30 mb-3">
              <LotusIcon className="w-4 h-4 text-[#D6A36D]" /> Panel Operativo — Kamelo Aromáticos
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-tight">
              Control General de Laboratorio & Compras ARS
            </h1>
            <p className="text-xs sm:text-sm text-[#D8C7B8]/90 leading-relaxed">
              Plataforma interactiva para desarrollo de fragancias, cálculo de batches, agrupación de pedidos a proveedores por mínimos de compra y monitoreo competitivo de precios.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-[#2D2521]/80 p-3 rounded-2xl border border-[#4B4038] shrink-0">
            <button
              onClick={() => setActiveModal('formula')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C98F7A] hover:bg-[#b87e6a] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Crear Fórmula
            </button>

            <button
              onClick={() => setActiveModal('product')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D6A36D] hover:bg-[#c5935d] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Package className="w-3.5 h-3.5" /> Crear Producto
            </button>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#7D9882] hover:bg-[#6b8570] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Crear Orden
            </button>

            <button
              onClick={() => setActiveModal('supplier')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#4B4038] hover:bg-[#5a4e45] text-[#D8C7B8] text-xs font-semibold border border-[#D8C7B8]/20 transition-all"
            >
              <Building2 className="w-3.5 h-3.5" /> Proveedor
            </button>

            <button
              onClick={() => runMarketQueries()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D6A36D]/20 hover:bg-[#D6A36D]/30 text-[#D6A36D] text-xs font-semibold border border-[#D6A36D]/40 transition-all"
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
          className="bg-[#FBF8F4] p-5 rounded-2xl shadow-xs border border-[#E7DDD4] flex flex-col justify-between hover:border-[#C98F7A] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6E65]">Alertas de Stock & Insumos</span>
            <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-[#FAF3E8] text-[#7A5222]' : 'bg-[#EAF0EB] text-[#3D5442]'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#4B4038] font-serif">{lowStockCount} Insumos Críticos</div>
            <p className="text-xs text-[#7A6E65] mt-1">Requieren reabastecimiento urgente</p>
          </div>
        </Link>

        {/* Card 2: Purchases */}
        <Link
          href="/compras"
          className="bg-[#FBF8F4] p-5 rounded-2xl shadow-xs border border-[#E7DDD4] flex flex-col justify-between hover:border-[#7D9882] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6E65]">Compras Requeridas ARS</span>
            <div className="p-2 rounded-xl bg-[#7D9882]/20 text-[#7D9882]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#4B4038] font-serif">
              ${totalRequirementARS.toLocaleString('es-AR')} ARS
            </div>
            <p className="text-xs text-[#7D9882] mt-1 font-semibold">
              {metMinimumsCount} de {requirements.length} proveed. cumplen mínimo
            </p>
          </div>
        </Link>

        {/* Card 3: Formulas & Tests */}
        <Link
          href="/laboratorio"
          className="bg-[#FBF8F4] p-5 rounded-2xl shadow-xs border border-[#E7DDD4] flex flex-col justify-between hover:border-[#C98F7A] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6E65]">Batches & Pruebas Activas</span>
            <div className="p-2 rounded-xl bg-[#C98F7A]/15 text-[#C98F7A]">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#4B4038] font-serif">{inTestFormulas.length} Pruebas en Curso</div>
            <p className="text-xs text-[#7A6E65] mt-1">{formulas.length} fórmulas registradas</p>
          </div>
        </Link>

        {/* Card 4: Market Benchmarks */}
        <Link
          href="/mercado"
          className="bg-[#FBF8F4] p-5 rounded-2xl shadow-xs border border-[#E7DDD4] flex flex-col justify-between hover:border-[#D6A36D] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6E65]">Monitoreo de Mercado</span>
            <div className="p-2 rounded-xl bg-[#D6A36D]/15 text-[#D6A36D]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-[#4B4038] font-serif">{marketBenchmarks.length} Benchmarks</div>
            <p className="text-xs text-[#D6A36D] font-semibold mt-1">
              {opportunitiesCount} Oportunidad(es) de Aumento
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Activity Feed + Supplier Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Supplier Minimums Progress (2 cols on large) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FBF8F4] rounded-3xl p-6 shadow-xs border border-[#E7DDD4]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4B4038] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C98F7A]" /> Compras Agrupadas por Proveedor
                </h3>
                <p className="text-xs text-[#7A6E65]">Estado de cumplimiento del pedido mínimo de compra ARS</p>
              </div>
              <Link href="/compras" className="text-xs text-[#C98F7A] font-bold hover:underline flex items-center gap-1">
                Ver Módulo Compras <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {requirements.map((group) => {
                const percent = Math.min(100, Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100));
                return (
                  <div key={group.supplierId} className="p-4 rounded-2xl bg-[#F7F3EE] border border-[#E7DDD4]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#4B4038]">{group.supplierName}</span>
                        {group.meetsMinimum ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EAF0EB] text-[#3D5442] text-[10px] font-bold flex items-center gap-1 border border-[#7D9882]/30">
                            <CheckCircle2 className="w-3 h-3 text-[#7D9882]" /> Mínimo Cumplido
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF3E8] text-[#7A5222] text-[10px] font-bold flex items-center gap-1 border border-[#D6A36D]/30">
                            <AlertTriangle className="w-3 h-3 text-[#D6A36D]" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#7A6E65]">
                        Acumulado: <strong className="text-[#4B4038]">${group.totalARS.toLocaleString('es-AR')} ARS</strong> / Mín: ${group.minPurchaseARS.toLocaleString('es-AR')} ARS
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#E7DDD4] rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-[#7D9882]' : 'bg-[#D6A36D]'
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
              className="bg-[#3E342F] text-[#FBF8F4] p-5 rounded-2xl border border-[#4B4038] hover:border-[#C98F7A] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C98F7A]/20 text-[#DFA28F] flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Laboratorio de Fórmulas</h4>
                  <p className="text-[11px] text-[#D8C7B8]">Pirámides olfativas y calculadora de batch</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C98F7A] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/catalogo"
              className="bg-[#3E342F] text-[#FBF8F4] p-5 rounded-2xl border border-[#4B4038] hover:border-[#D6A36D] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D6A36D]/20 text-[#D6A36D] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Catálogo Interactivo</h4>
                  <p className="text-[11px] text-[#D8C7B8]">Variantes y envío por WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D6A36D] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="bg-[#FBF8F4] rounded-3xl p-6 shadow-xs border border-[#E7DDD4] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7DDD4]">
              <h3 className="font-serif font-bold text-base text-[#4B4038] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C98F7A]" /> Actividad Reciente
              </h3>
              <span className="text-[10px] bg-[#EAF0EB] text-[#3D5442] border border-[#7D9882]/30 font-bold px-2 py-0.5 rounded-full">
                En vivo
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 8).map((log) => {
                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#F7F3EE] border border-[#E7DDD4] space-y-1 text-xs transition-colors hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#4B4038]">{log.title}</span>
                      <span className="text-[10px] text-[#7A6E65] font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-[#7A6E65] text-[11px] leading-relaxed">{log.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E7DDD4] text-center">
            <span className="text-[11px] text-[#7A6E65]">
              Todos los datos son operados en tiempo real localmente.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
