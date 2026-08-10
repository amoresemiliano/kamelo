'use client';

import { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  BarChart3,
  RefreshCw
} from '@/components/Icons';
import { mockMarketBenchmarks } from '@/data/mockData';
import { MarketBenchmark } from '@/types';

export default function MercadoPage() {
  const [benchmarks, setBenchmarks] = useState<MarketBenchmark[]>(mockMarketBenchmarks);

  const handleAdjustPrice = (id: string, newPriceARS: number) => {
    setBenchmarks(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          kameloPriceARS: newPriceARS,
          status: newPriceARS < item.competitorAverageARS ? 'Competitivo' : 'Precio Alto'
        };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6DFC8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#D9822B]/10 text-[#D9822B] text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Módulo de Inteligencia Comercial & ARS
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1E17]">
            Inteligencia de Mercado & Benchmarking ARS
          </h1>
          <p className="text-xs text-[#7A6B61] mt-1">
            Análisis comparativo de precios de mercado argentino, márgenes de contribución y detección de oportunidades.
          </p>
        </div>

        <button
          onClick={() => alert('Simulación: Actualizando precios de competidores')}
          className="px-4 py-2 bg-[#2A1E17] text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-[#3D2C22] transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-[#D9822B]" /> Actualizar Mercado
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8]">
          <span className="text-xs font-medium text-[#7A6B61]">Competitividad General</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2 flex items-center gap-2">
            92% <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs text-[#7A6B61] mt-1">Precios alineados con el rango medio-alto</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8]">
          <span className="text-xs font-medium text-[#7A6B61]">Oportunidad de Captura ARS</span>
          <div className="text-2xl font-bold text-[#D9822B] mt-2 flex items-center gap-2">
            +$7.500 ARS <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#7A6B61] mt-1">Margen aprovechable en categoría EDP 100ml</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-[#E6DFC8]">
          <span className="text-xs font-medium text-[#7A6B61]">Promedio de Margen Comercial</span>
          <div className="text-2xl font-bold text-[#C86D51] mt-2">
            63.3%
          </div>
          <p className="text-xs text-[#7A6B61] mt-1">Sostenido en pesos argentinos</p>
        </div>
      </div>

      {/* Benchmarks Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E6DFC8] space-y-4">
        <h2 className="font-serif font-bold text-lg text-[#2A1E17] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#C86D51]" /> Comparativa Directa por Categoría de Producto
        </h2>

        <div className="space-y-4">
          {benchmarks.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 lg:w-1/3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#2A1E17]">{item.productName}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                  Último relevamiento: {item.lastUpdated} | Margen actual: <strong className="text-[#2A1E17]">{item.kameloMarginPercent}%</strong>
                </p>
              </div>

              {/* Price comparison metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs lg:w-1/2">
                <div className="bg-white p-3 rounded-lg border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Precio Kamelo</span>
                  <span className="text-sm font-bold text-[#C86D51]">
                    ${item.kameloPriceARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Prom. Mercado</span>
                  <span className="text-sm font-bold text-[#2A1E17]">
                    ${item.competitorAverageARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Mín. Mercado</span>
                  <span className="text-sm font-semibold text-gray-600">
                    ${item.competitorMinARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E6DFC8]">
                  <span className="text-[#7A6B61] text-[10px] uppercase font-bold block">Máx. Mercado</span>
                  <span className="text-sm font-semibold text-gray-600">
                    ${item.competitorMaxARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>
              </div>

              {/* Quick Price Action */}
              <div className="flex items-center gap-2 lg:w-1/6 justify-end">
                {item.status === 'Oportunidad Aumento' && (
                  <button
                    onClick={() => handleAdjustPrice(item.id, item.competitorAverageARS - 1500)}
                    className="w-full px-3 py-2 bg-[#D9822B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#c07122] transition-colors shadow-sm"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Ajustar a Mercado
                  </button>
                )}
                {item.status !== 'Oportunidad Aumento' && (
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Precio Optimizado
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
