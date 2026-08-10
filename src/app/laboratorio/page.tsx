'use client';

import { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Calculator,
  Plus,
  Layers,
  ChevronRight,
} from '@/components/Icons';
import { mockFormulas, mockIngredients } from '@/data/mockData';
import { Formula } from '@/types';

export default function LaboratorioPage() {
  const [selectedFormula, setSelectedFormula] = useState<Formula>(mockFormulas[0]);
  const [batchGrams, setBatchGrams] = useState<number>(selectedFormula.batchSizeGrams);

  // Recalculate costs and quantities based on custom batch size
  const multiplier = batchGrams / selectedFormula.batchSizeGrams;

  const totalBatchCostARS = selectedFormula.items.reduce((sum, item) => {
    const qty = item.quantity * multiplier;
    return sum + qty * item.unitCostARS;
  }, 0);

  const suggestedSellingPriceARS = totalBatchCostARS * (1 + selectedFormula.suggestedMarginPercent / 100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#E6DFC8]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#C86D51]/10 text-[#C86D51] text-xs font-semibold mb-2">
            <FlaskConical className="w-3.5 h-3.5" /> Módulo de Investigación & Desarrollo
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1E17]">
            Laboratorio de Fórmulas Olfativas
          </h1>
          <p className="text-xs text-[#7A6B61] mt-1">
            Diseño de pirámide olfativa, balance de dosificación y calculadora dinámica de costos por batch en ARS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Simulación: Nueva Fórmula en desarrollo')}
            className="px-4 py-2 bg-[#C86D51] text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-[#b05a40] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Crear Nueva Fórmula
          </button>
        </div>
      </div>

      {/* Main Grid: Formula Selector & Detailed Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Formulas List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#7A6B61] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C86D51]" /> Fórmulas Registradas ({mockFormulas.length})
          </h2>

          <div className="space-y-3">
            {mockFormulas.map((formula) => {
              const isSelected = selectedFormula.id === formula.id;
              return (
                <div
                  key={formula.id}
                  onClick={() => {
                    setSelectedFormula(formula);
                    setBatchGrams(formula.batchSizeGrams);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#2A1E17] text-white border-[#2A1E17] shadow-md'
                      : 'bg-white text-[#2A1E17] border-[#E6DFC8] hover:border-[#C86D51]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#C86D51] text-white'
                          : 'bg-[#F7F4EE] text-[#C86D51]'
                      }`}
                    >
                      {formula.category}
                    </span>
                    <span className={`text-xs ${isSelected ? 'text-[#E6DFC8]' : 'text-[#7A6B61]'}`}>
                      Batch Base: {formula.batchSizeGrams}g
                    </span>
                  </div>

                  <h3 className="font-bold text-sm mt-2">{formula.productName}</h3>

                  <div className="mt-3 pt-3 border-t border-opacity-20 border-gray-400 flex items-center justify-between text-xs">
                    <span className={isSelected ? 'text-[#E6DFC8]' : 'text-[#7A6B61]'}>
                      Margen: {formula.suggestedMarginPercent}%
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      Seleccionar <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Formula Details & Interactive Calculator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Formula Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E6DFC8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DFC8]">
              <div>
                <span className="text-xs text-[#C86D51] font-bold uppercase tracking-wider">
                  {selectedFormula.category}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#2A1E17]">
                  {selectedFormula.productName}
                </h2>
              </div>

              {/* Batch Size Input */}
              <div className="bg-[#F7F4EE] p-3 rounded-xl border border-[#E6DFC8] flex items-center gap-3">
                <Calculator className="w-5 h-5 text-[#C86D51]" />
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7A6B61]">
                    Tamaño Lote (Gramos/ml)
                  </label>
                  <input
                    type="number"
                    value={batchGrams}
                    onChange={(e) => setBatchGrams(Math.max(1, Number(e.target.value)))}
                    className="w-24 bg-white border border-[#E6DFC8] rounded px-2 py-1 text-sm font-bold text-[#2A1E17] focus:outline-none focus:border-[#C86D51]"
                  />
                </div>
              </div>
            </div>

            {/* Olfactory Pyramid Display */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B61] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D9822B]" /> Pirámide Olfativa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8]">
                  <span className="text-[10px] font-bold uppercase text-[#D9822B]">Notas de Salida</span>
                  <div className="mt-1 text-xs font-semibold text-[#2A1E17]">
                    {selectedFormula.topNotes.join(', ')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8]">
                  <span className="text-[10px] font-bold uppercase text-[#C86D51]">Notas de Corazón</span>
                  <div className="mt-1 text-xs font-semibold text-[#2A1E17]">
                    {selectedFormula.heartNotes.join(', ')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8]">
                  <span className="text-[10px] font-bold uppercase text-[#2A1E17]">Notas de Fondo</span>
                  <div className="mt-1 text-xs font-semibold text-[#2A1E17]">
                    {selectedFormula.baseNotes.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Breakdown Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B61] mb-3">
                Desglose de Ingredientes & Costo para Lote ({batchGrams}g)
              </h3>
              <div className="overflow-x-auto border border-[#E6DFC8] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2A1E17] text-[#E6DFC8]">
                    <tr>
                      <th className="p-3 font-semibold">Ingrediente / Insumo</th>
                      <th className="p-3 font-semibold text-center">Dosificación</th>
                      <th className="p-3 font-semibold text-center">Cantidad Recalculada</th>
                      <th className="p-3 font-semibold text-right">Costo Unitario ARS</th>
                      <th className="p-3 font-semibold text-right">Subtotal Batch ARS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DFC8]">
                    {selectedFormula.items.map((item) => {
                      const calculatedQty = (item.quantity * multiplier).toFixed(1);
                      const subtotalARS = Math.round(Number(calculatedQty) * item.unitCostARS);
                      return (
                        <tr key={item.ingredientId} className="hover:bg-[#F7F4EE]/60 transition-colors">
                          <td className="p-3 font-medium text-[#2A1E17]">{item.ingredientName}</td>
                          <td className="p-3 text-center font-mono text-[#7A6B61]">
                            {item.percentage > 0 ? `${item.percentage}%` : 'Unidad'}
                          </td>
                          <td className="p-3 text-center font-bold text-[#C86D51]">
                            {calculatedQty} {item.percentage > 0 ? 'g/ml' : 'unid'}
                          </td>
                          <td className="p-3 text-right text-[#7A6B61]">${item.unitCostARS.toLocaleString('es-AR')}</td>
                          <td className="p-3 text-right font-bold text-[#2A1E17]">${subtotalARS.toLocaleString('es-AR')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary & Commercial Margin */}
            <div className="bg-[#2A1E17] text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#E6DFC8]">Costo Total del Lote ({batchGrams}g):</span>
                <div className="text-2xl font-bold text-[#E6DFC8]">
                  ${Math.round(totalBatchCostARS).toLocaleString('es-AR')} ARS
                </div>
                <p className="text-[11px] text-[#E6DFC8]/70 mt-0.5">
                  Costo aproximado por unidad producida
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-[#3D2C22] sm:pl-6">
                <span className="text-xs text-[#D9822B] font-semibold">
                  Precio de Venta Sugerido ({selectedFormula.suggestedMarginPercent}% Margen):
                </span>
                <div className="text-xl font-bold text-[#6E8B74]">
                  ${Math.round(suggestedSellingPriceARS).toLocaleString('es-AR')} ARS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
