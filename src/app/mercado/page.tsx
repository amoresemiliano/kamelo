'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  BarChart3,
  RefreshCw,
  Play,
  Search,
  Sparkles,
  SlidersHorizontal,
  DollarSign,
  AlertTriangle,
  Zap,
  Tag
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { MarketBenchmark } from '@/types';

export default function MercadoPage() {
  const {
    marketBenchmarks,
    runMarketQueries,
    updateBenchmarkPrice,
    setActiveModal,
    showToast,
  } = useKamelo();

  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  const filteredBenchmarks = marketBenchmarks.filter((b) => {
    return categoryFilter === 'Todas' || b.category === categoryFilter;
  });

  const opportunitiesCount = marketBenchmarks.filter((b) => b.status === 'Oportunidad Aumento').length;
  const competitiveCount = marketBenchmarks.filter((b) => b.status === 'Competitivo').length;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#E6DFC8] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9822B]/10 text-[#D9822B] text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Módulo de Inteligencia Comercial ARS
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1E17]">
            Inteligencia de Mercado & Precios ARS
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6B61] mt-1">
            Relevamiento simulado de precios de competidores en Argentina, análisis de márgenes de contribución y captura de oportunidades comerciales.
          </p>
        </div>

        <button
          onClick={() => runMarketQueries()}
          className="px-5 py-2.5 bg-[#D9822B] hover:bg-[#b86a1d] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" /> Ejecutar Consulta de Mercado
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#E6DFC8] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#7A6B61]">Competitividad General</span>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-2 flex items-center gap-2">
            {competitiveCount} Productos Alineados <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs text-[#7A6B61] mt-1">Precios situados en el rango medio-alto de perfumería</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#E6DFC8] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#7A6B61]">Oportunidad de Captura ARS</span>
          <div className="text-2xl font-serif font-bold text-[#D9822B] mt-2 flex items-center gap-2">
            {opportunitiesCount} Oportunidad(es) <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#7A6B61] mt-1">Brecha positiva contra el promedio de competidores</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#E6DFC8] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#7A6B61]">Margen Comercial Promedio</span>
          <div className="text-2xl font-serif font-bold text-[#C86D51] mt-2">
            ~64.5% ARS
          </div>
          <p className="text-xs text-[#7A6B61] mt-1">Calculado sobre costo de materias primas e insumos</p>
        </div>
      </div>

      {/* Filter and Query Section */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E6DFC8]">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-[#7A6B61]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-1.5 text-xs text-[#2A1E17] focus:outline-none"
          >
            <option value="Todas">Todas las categorías</option>
            <option value="Velas Botánicas">Velas Botánicas</option>
            <option value="Difusores de Ambiente">Difusores de Ambiente</option>
            <option value="Perfumes Finos">Perfumes Finos</option>
            <option value="Cosmética Natural">Cosmética Natural</option>
          </select>
        </div>

        <span className="text-xs text-[#7A6B61]">
          {filteredBenchmarks.length} benchmarking(s) disponible(s)
        </span>
      </div>

      {/* Benchmarks List */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8] space-y-4">
        <h2 className="font-serif font-bold text-lg text-[#2A1E17] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#C86D51]" /> Comparativa Directa de Precios ARS
        </h2>

        <div className="space-y-4">
          {filteredBenchmarks.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8] flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#C86D51] transition-all"
            >
              <div className="space-y-1.5 lg:w-1/3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-[#2A1E17]">{item.productName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Oportunidad Aumento'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'Competitivo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[#7A6B61]">
                  Categoría: <strong className="text-[#2A1E17]">{item.category}</strong> • Actualizado: {item.lastUpdated}
                </p>
                <div className="text-[11px] text-[#7A6B61]">
                  Margen Estimado Kamelo: <strong className="text-[#C86D51]">{item.kameloMarginPercent}%</strong>
                </div>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs lg:w-1/2">
                <div className="bg-white p-3 rounded-xl border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Precio Kamelo</span>
                  <span className="text-sm font-serif font-bold text-[#C86D51]">
                    ${item.kameloPriceARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Prom. Mercado</span>
                  <span className="text-sm font-serif font-bold text-[#2A1E17]">
                    ${item.competitorAverageARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Mín. Mercado</span>
                  <span className="text-sm font-semibold text-gray-600">
                    ${item.competitorMinARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Máx. Mercado</span>
                  <span className="text-sm font-semibold text-gray-600">
                    ${item.competitorMaxARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 lg:w-1/6 justify-end">
                {item.status === 'Oportunidad Aumento' ? (
                  <button
                    onClick={() => {
                      const suggestedPrice = item.competitorAverageARS - 1500;
                      updateBenchmarkPrice(item.id, suggestedPrice);
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#D9822B] hover:bg-[#b86a1d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Ajustar a Mercado
                  </button>
                ) : (
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Alineado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
