'use client';

import Link from 'next/link';
import {
  FlaskConical,
  ShoppingBag,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Factory
} from '@/components/Icons';
import { mockIngredients, mockSupplierGroups, mockFormulas, mockMarketBenchmarks } from '@/data/mockData';

export default function DashboardPage() {
  const lowStockCount = mockIngredients.filter((ing) => ing.stock <= ing.minStock).length;
  const totalPurchaseARS = mockSupplierGroups.reduce((acc, g) => acc + g.totalARS, 0);
  const metMinimums = mockSupplierGroups.filter((g) => g.meetsMinimum).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2A1E17] via-[#3D2C22] to-[#2A1E17] text-[#F7F4EE] rounded-2xl p-6 sm:p-8 shadow-lg border border-[#3D2C22] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C86D51]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C86D51]/20 text-[#E6DFC8] text-xs font-semibold border border-[#C86D51]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9822B]" /> Panel Operativo Kamelo
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Control de Laboratorio & Compras Agrupadas ARS
          </h1>
          <p className="text-sm text-[#E6DFC8] leading-relaxed">
            Monitoreo en tiempo real de fórmulas perfumistas, optimización de pedidos mínimos a proveedores en pesos argentinos y benchmarking de mercado.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] flex flex-col justify-between hover:border-[#C86D51] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Alertas de Stock</span>
            <div className={`p-2 rounded-lg ${lowStockCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#2A1E17]">{lowStockCount} Insumos</div>
            <p className="text-xs text-[#7A6B61] mt-1">Por debajo del stock mínimo</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] flex flex-col justify-between hover:border-[#C86D51] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Compras Consolidadas</span>
            <div className="p-2 rounded-lg bg-[#6E8B74]/20 text-[#6E8B74]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#2A1E17]">${totalPurchaseARS.toLocaleString('es-AR')} ARS</div>
            <p className="text-xs text-[#6E8B74] mt-1 font-medium">{metMinimums} de {mockSupplierGroups.length} cumplen mínimo proveedor</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] flex flex-col justify-between hover:border-[#C86D51] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Fórmulas de Laboratorio</span>
            <div className="p-2 rounded-lg bg-[#C86D51]/10 text-[#C86D51]">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#2A1E17]">{mockFormulas.length} Activas</div>
            <p className="text-xs text-[#7A6B61] mt-1">Margen promedio sugerido ~64%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] flex flex-col justify-between hover:border-[#C86D51] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6B61]">Mercado & Precios ARS</span>
            <div className="p-2 rounded-lg bg-[#D9822B]/10 text-[#D9822B]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#2A1E17]">{mockMarketBenchmarks.length} Benchmarks</div>
            <p className="text-xs text-[#D9822B] font-medium mt-1">1 Oportunidad de Aumento ARS</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div>
        <h2 className="text-lg font-serif font-bold text-[#2A1E17] mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#C86D51]" /> Módulos Principales de la Plataforma
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/laboratorio"
            className="group bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] hover:border-[#C86D51] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#C86D51]/10 text-[#C86D51] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2A1E17] group-hover:text-[#C86D51] transition-colors">
                Laboratorio de Fórmulas
              </h3>
              <p className="text-xs text-[#7A6B61] mt-1 leading-relaxed">
                Diseño de pirámides olfativas, notas de salida/corazón/fondo y cálculo automático de costos por batch en ARS.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#C86D51] font-semibold">
              <span>Abrir Laboratorio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/compras"
            className="group bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] hover:border-[#6E8B74] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#6E8B74]/20 text-[#6E8B74] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2A1E17] group-hover:text-[#6E8B74] transition-colors">
                Compras Agrupadas
              </h3>
              <p className="text-xs text-[#7A6B61] mt-1 leading-relaxed">
                Consolidación de requerimientos por proveedor para alcanzar montos mínimos de compra con mayor beneficio.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#6E8B74] font-semibold">
              <span>Gestionar Compras</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/mercado"
            className="group bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] hover:border-[#D9822B] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#D9822B]/10 text-[#D9822B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2A1E17] group-hover:text-[#D9822B] transition-colors">
                Inteligencia de Mercado
              </h3>
              <p className="text-xs text-[#7A6B61] mt-1 leading-relaxed">
                Comparativa de precios ARS contra la competencia, alertas de margen y estrategia de precios.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#D9822B] font-semibold">
              <span>Ver Mercado ARS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/catalogo"
            className="group bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8] hover:border-[#2A1E17] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#2A1E17]/10 text-[#2A1E17] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#2A1E17] group-hover:text-[#C86D51] transition-colors">
                Catálogo Interactivo
              </h3>
              <p className="text-xs text-[#7A6B61] mt-1 leading-relaxed">
                Catálogo de venta a clientes con botón directo para compartir fichas técnicas y precios vía WhatsApp.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#2A1E17] font-semibold">
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Supplier Groups Status Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E6DFC8]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2A1E17] flex items-center gap-2">
              <Factory className="w-5 h-5 text-[#C86D51]" /> Estado de Pedidos Mínimos por Proveedor
            </h3>
            <p className="text-xs text-[#7A6B61]">Resumen consolidado para optimizar costos de envío e insumos</p>
          </div>
          <Link href="/compras" className="text-xs text-[#C86D51] font-bold hover:underline flex items-center gap-1">
            Ver detalle completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {mockSupplierGroups.map((group) => {
            const percent = Math.min(100, Math.round((group.totalARS / group.minPurchaseARS) * 100));
            return (
              <div key={group.supplierId} className="p-4 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2A1E17]">{group.supplierName}</span>
                    {group.meetsMinimum ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Mínimo Alcanzado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#7A6B61]">
                    Acumulado: <strong className="text-[#2A1E17]">${group.totalARS.toLocaleString('es-AR')} ARS</strong> / Mín: ${group.minPurchaseARS.toLocaleString('es-AR')} ARS
                  </div>
                </div>

                {/* Progress bar */}
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
    </div>
  );
}
