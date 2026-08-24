'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Calculator,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Copy,
  AlertTriangle,
  Send,
  Award,
  BookOpen
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { Formula, Ingredient, BatchTest, InsumoCategory } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog';
import SectionHero from '@/components/SectionHero';

export default function LaboratorioPage() {
  const {
    formulas,
    ingredients,
    batchTests,
    suppliers,
    duplicateFormula,
    deleteFormula,
    addIngredient,
    deleteIngredient,
    addBatchTest,
    deleteBatchTest,
    approveBatchFormula,
    sendBatchToRequirements,
    setActiveModal,
    showToast,
  } = useKamelo();

  // Primary Sub-navigation Tabs: 'formulas' | 'insumos' | 'batches'
  const [activeTab, setActiveTab] = useState<'formulas' | 'insumos' | 'batches'>('formulas');

  // ---------------------------------------------------------------------------
  // TAB 1: FORMULAS STATE & CALCULATOR
  // ---------------------------------------------------------------------------
  const [formulaSearch, setFormulaSearch] = useState('');
  const [formulaCategoryFilter, setFormulaCategoryFilter] = useState<string>('Todas');
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(formulas[0]?.id || '');
  const [batchProductionUnits, setBatchProductionUnits] = useState<number>(10); // 10 units default

  // Confirm dialog state for formulas
  const [formulaToDelete, setFormulaToDelete] = useState<Formula | null>(null);

  // Active formula details
  const activeFormula = formulas.find((f) => f.id === selectedFormulaId) || formulas[0];

  // Batch multiplier based on batch size or units
  const currentBatchGrams = (activeFormula?.batchSizeGrams || 2000) * (batchProductionUnits / 10);
  const baseBatchGrams = activeFormula?.batchSizeGrams || 2000;
  const multiplier = baseBatchGrams > 0 ? currentBatchGrams / baseBatchGrams : 1;

  const totalBatchCostARS = activeFormula?.ingredients.reduce((acc, item) => {
    const qty = item.quantity * multiplier;
    return acc + qty * item.unitCostARS;
  }, 0) || 0;

  const unitCostARS = batchProductionUnits > 0 ? totalBatchCostARS / batchProductionUnits : 0;

  // Formulation helper warnings / guidance
  const essenceIngredient = activeFormula?.ingredients.find((i) => i.category === 'Fragancias');
  const essencePercent = essenceIngredient ? essenceIngredient.percentage : 0;

  const additiveIngredient = activeFormula?.ingredients.find((i) => i.category === 'Aditivos');
  const additivePercent = additiveIngredient ? additiveIngredient.percentage : 0;

  let formulationWarning = '';
  if (activeFormula?.category === 'Vela') {
    if (essencePercent > 10) {
      formulationWarning = 'La proporción de esencia supera el 10% máximo recomendado. Podría afectar el quemado.';
    } else if (essencePercent < 5 && essencePercent > 0) {
      formulationWarning = 'La proporción de esencia es menor al 5% de referencia para velas aromáticas intensas.';
    }
  }

  // Filtered Formulas
  const filteredFormulas = formulas.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(formulaSearch.toLowerCase());
    const matchesCat = formulaCategoryFilter === 'Todas' || f.category === formulaCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Handler: Send Batch to Purchases
  const handleSendBatchToPurchases = () => {
    if (!activeFormula) return;

    const itemsToSend = activeFormula.ingredients.map((ing) => ({
      ingredientName: ing.ingredientName,
      requiredQty: Math.round(ing.quantity * multiplier),
      unit: ing.unit,
      estimatedCostARS: Math.round(ing.quantity * multiplier * ing.unitCostARS),
      supplierName: ing.supplierName,
    }));

    sendBatchToRequirements(itemsToSend, `${activeFormula.name} (${batchProductionUnits} unidades)`);
  };

  // ---------------------------------------------------------------------------
  // TAB 2: INSUMOS STATE
  // ---------------------------------------------------------------------------
  const [insumoSearch, setInsumoSearch] = useState('');
  const [insumoCategoryFilter, setInsumoCategoryFilter] = useState<string>('Todas');
  const [insumoToDelete, setInsumoToDelete] = useState<Ingredient | null>(null);
  const [editingInsumo, setEditingInsumo] = useState<Ingredient | null>(null);

  const [newInsumoForm, setNewInsumoForm] = useState({
    name: '',
    category: 'Fragancias' as InsumoCategory,
    unit: 'ml' as 'g' | 'kg' | 'ml' | 'l' | 'unid',
    purchasePriceARS: 120000,
    referenceQty: 1000,
    stock: 500,
    minStock: 200,
    supplierId: suppliers[0]?.id || '',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  });

  const filteredInsumos = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(insumoSearch.toLowerCase()) || ing.supplierName.toLowerCase().includes(insumoSearch.toLowerCase());
    const matchesCat = insumoCategoryFilter === 'Todas' || ing.category === insumoCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSaveNewInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsumoForm.name.trim()) {
      showToast('Por favor ingrese el nombre del insumo.', 'warning');
      return;
    }

    const sup = suppliers.find((s) => s.id === newInsumoForm.supplierId) || suppliers[0];
    const unitCost = newInsumoForm.referenceQty > 0 ? newInsumoForm.purchasePriceARS / newInsumoForm.referenceQty : 0;

    addIngredient({
      name: newInsumoForm.name,
      category: newInsumoForm.category,
      unit: newInsumoForm.unit,
      purchasePriceARS: Number(newInsumoForm.purchasePriceARS),
      referenceQty: Number(newInsumoForm.referenceQty),
      unitCostARS: unitCost,
      stock: Number(newInsumoForm.stock),
      minStock: Number(newInsumoForm.minStock),
      supplierId: sup ? sup.id : 'sup-1',
      supplierName: sup ? sup.name : 'Proveedor General',
      imageUrl: newInsumoForm.imageUrl,
    });

    setEditingInsumo(null);
  };

  // ---------------------------------------------------------------------------
  // TAB 3: BATCHES / PRUEBAS STATE
  // ---------------------------------------------------------------------------
  const [batchToDelete, setBatchToDelete] = useState<BatchTest | null>(null);
  const [newBatchForm, setNewBatchForm] = useState({
    formulaId: formulas[0]?.id || '',
    qtyProduced: '10 unidades',
    ambientTemp: 21,
    meltingTemp: 64,
    fragranceTemp: 42,
    pouringTemp: 37,
    fragrancePercent: 7,
    ratingAppearance: 5,
    ratingColdAroma: 4,
    ratingHotAroma: 4,
    ratingBurn: 5,
    observations: 'Prueba sensorial en vaso de cristal esmerilado con pabilo de algodón puro.',
  });

  const handleSaveNewBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const f = formulas.find((form) => form.id === newBatchForm.formulaId) || formulas[0];

    addBatchTest({
      formulaId: f.id,
      formulaName: f.name,
      version: f.version,
      date: new Date().toLocaleDateString('es-AR'),
      qtyProduced: newBatchForm.qtyProduced,
      status: 'Curado',
      ambientTemp: Number(newBatchForm.ambientTemp),
      meltingTemp: Number(newBatchForm.meltingTemp),
      fragranceTemp: Number(newBatchForm.fragranceTemp),
      pouringTemp: Number(newBatchForm.pouringTemp),
      fragrancePercent: Number(newBatchForm.fragrancePercent),
      ratingAppearance: Number(newBatchForm.ratingAppearance),
      ratingColdAroma: Number(newBatchForm.ratingColdAroma),
      ratingHotAroma: Number(newBatchForm.ratingHotAroma),
      ratingBurn: Number(newBatchForm.ratingBurn),
      observations: newBatchForm.observations,
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* Page Header */}
      <SectionHero
        title="Laboratorio Olfativo & Insumos Botánicos"
        subtitle="Archivo de formulación de autor, calibración de notas olfativas, calculadora de lotes y control sensorial de curado y quemado en taller."
        badgeText="MEJUNJE · LABORATORIO"
        badgeIcon={<FlaskConical className="w-3.5 h-3.5 text-mejunje-salmon" />}
        bgImage="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=80"
        noticeText="pesaje artesanal · proporciones exactas"
      >
        {/* Tab Selector Controls */}
        <div className="flex items-center gap-1.5 bg-mejunje-espresso/90 backdrop-blur-md p-1.5 rounded-2xl border border-mejunje-arena/20 shadow-atelier-md">
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-4 py-2 rounded-xl text-xs font-typewriter uppercase tracking-wider transition-all ${
              activeTab === 'formulas'
                ? 'bg-mejunje-salmon text-white shadow-xs'
                : 'text-mejunje-arena/80 hover:text-white'
            }`}
          >
            Fórmulas ({formulas.length})
          </button>

          <button
            onClick={() => setActiveTab('insumos')}
            className={`px-4 py-2 rounded-xl text-xs font-typewriter uppercase tracking-wider transition-all ${
              activeTab === 'insumos'
                ? 'bg-mejunje-salmon text-white shadow-xs'
                : 'text-mejunje-arena/80 hover:text-white'
            }`}
          >
            Insumos ({ingredients.length})
          </button>

          <button
            onClick={() => setActiveTab('batches')}
            className={`px-4 py-2 rounded-xl text-xs font-typewriter uppercase tracking-wider transition-all ${
              activeTab === 'batches'
                ? 'bg-mejunje-salmon text-white shadow-xs'
                : 'text-mejunje-arena/80 hover:text-white'
            }`}
          >
            Batches ({batchTests.length})
          </button>
        </div>
      </SectionHero>

      {/* =================================================================== */}
      {/* TAB 1: FORMULAS & PRODUCTION CALCULATOR */}
      {/* =================================================================== */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          {/* Top Actions & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-mejunje-card p-4 rounded-2xl border border-mejunje-border shadow-atelier">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-mejunje-griscalido absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar fórmula de autor..."
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  className="w-full bg-mejunje-papel/40 border border-mejunje-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-mejunje-tinta focus:outline-none focus:border-mejunje-salmon"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-mejunje-griscalido" />
                <select
                  value={formulaCategoryFilter}
                  onChange={(e) => setFormulaCategoryFilter(e.target.value)}
                  className="bg-mejunje-papel/40 border border-mejunje-border rounded-xl px-3 py-1.5 text-xs text-mejunje-tinta focus:outline-none"
                >
                  <option value="Todas">Todas las categorías</option>
                  <option value="Vela">Velas Botánicas</option>
                  <option value="Difusor">Difusores</option>
                  <option value="Perfume textil">Perfumes Finos / Textil</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('formula')}
              className="px-4 py-2 bg-mejunje-salmon hover:bg-mejunje-terracota text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" /> Crear Nueva Fórmula
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Formulas List */}
            <div className="space-y-3">
              <span className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-griscalido block">
                Archivo de Fórmulas ({filteredFormulas.length})
              </span>

              {filteredFormulas.map((f) => {
                const isSelected = f.id === selectedFormulaId;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFormulaId(f.id)}
                    className={`p-4.5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-mejunje-espresso text-white border-mejunje-espresso shadow-atelier-md'
                        : 'bg-mejunje-card text-mejunje-tinta border-mejunje-border hover:border-mejunje-salmon'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-typewriter uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-mejunje-salmon text-white' : 'bg-mejunje-papel text-mejunje-tabaco border border-mejunje-arena/50'
                        }`}
                      >
                        {f.category}
                      </span>
                      <span className={`text-[10px] font-typewriter px-2 py-0.5 rounded ${isSelected ? 'bg-mejunje-tabaco text-mejunje-arena' : 'bg-mejunje-papel/60 text-mejunje-griscalido'}`}>
                        {f.version} · {f.status}
                      </span>
                    </div>

                    <h3 className="font-serif italic text-base mt-2.5">{f.name}</h3>

                    <div className="mt-3 pt-3 border-t border-mejunje-arena/20 flex items-center justify-between text-xs">
                      <span className={`text-[11px] ${isSelected ? 'text-mejunje-arena' : 'text-mejunje-griscalido'}`}>
                        Rendimiento: {f.yieldSize}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateFormula(f.id);
                          }}
                          title="Duplicar fórmula"
                          className="p-1 hover:text-mejunje-salmon transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormulaToDelete(f);
                          }}
                          title="Eliminar fórmula"
                          className="p-1 hover:text-mejunje-salmon transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Active Formula Workstation */}
            {activeFormula && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-mejunje-card rounded-3xl p-6 sm:p-7 shadow-atelier border border-mejunje-border space-y-6">
                  {/* Active Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mejunje-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-salmon">{activeFormula.category}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                          {activeFormula.status}
                        </span>
                      </div>
                      <h2 className="text-2xl font-serif italic text-mejunje-tinta">{activeFormula.name}</h2>
                      {activeFormula.associatedProductName && (
                        <p className="text-xs text-mejunje-griscalido mt-0.5 font-sans">
                          Ficha comercial: <strong className="text-mejunje-tinta font-medium">{activeFormula.associatedProductName}</strong>
                        </p>
                      )}
                    </div>

                    {/* Batch Production Unit Input */}
                    <div className="bg-mejunje-papel/40 p-3 rounded-2xl border border-mejunje-border flex items-center gap-3 shrink-0">
                      <Calculator className="w-5 h-5 text-mejunje-salmon" />
                      <div>
                        <label className="block font-typewriter text-[9px] uppercase tracking-wider text-mejunje-griscalido">Unidades a Producir</label>
                        <input
                          type="number"
                          min="1"
                          value={batchProductionUnits}
                          onChange={(e) => setBatchProductionUnits(Math.max(1, Number(e.target.value)))}
                          className="w-20 bg-white border border-mejunje-border rounded-lg px-2 py-1 text-sm font-bold text-mejunje-tinta focus:outline-none focus:border-mejunje-salmon"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formulation Help & Warnings */}
                  {activeFormula.category === 'Vela' && (
                    <div className="p-4 rounded-2xl bg-mejunje-papel/30 border border-mejunje-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-typewriter text-xs font-bold text-mejunje-tinta flex items-center gap-1.5 uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5 text-mejunje-salmon" /> Dosificación de Taller: Vela de Soja
                        </span>
                        <span className="text-[10px] text-mejunje-griscalido font-typewriter">Ref: Esencia 5-8% | Mejorador 2-3%</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-[11px] text-mejunje-griscalido font-sans">
                        <span>Esencia actual: <strong className="text-mejunje-tinta">{essencePercent}%</strong></span>
                        <span>Aditivo actual: <strong className="text-mejunje-tinta">{additivePercent}%</strong></span>
                      </div>
                      {formulationWarning && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" /> {formulationWarning}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Olfactory Pyramid Display */}
                  {(activeFormula.topNotes?.length || activeFormula.heartNotes?.length || activeFormula.baseNotes?.length) && (
                    <div>
                      <h3 className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-griscalido mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-mejunje-salmon" /> Pirámide Olfativa
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-mejunje-papel/30 border border-mejunje-border">
                          <span className="font-typewriter text-[9px] uppercase tracking-widest text-mejunje-salmon">Salida (Primer Impacto)</span>
                          <div className="mt-1 text-xs font-serif italic text-mejunje-tinta font-semibold">
                            {activeFormula.topNotes?.join(', ') || 'Bergamota'}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-mejunje-papel/30 border border-mejunje-border">
                          <span className="font-typewriter text-[9px] uppercase tracking-widest text-mejunje-tabaco">Corazón (Carácter)</span>
                          <div className="mt-1 text-xs font-serif italic text-mejunje-tinta font-semibold">
                            {activeFormula.heartNotes?.join(', ') || 'Flor de Azahar'}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-mejunje-papel/30 border border-mejunje-border">
                          <span className="font-typewriter text-[9px] uppercase tracking-widest text-mejunje-espresso">Fondo (Fijación)</span>
                          <div className="mt-1 text-xs font-serif italic text-mejunje-tinta font-semibold">
                            {activeFormula.baseNotes?.join(', ') || 'Ámbar, Cedro'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ingredients Table */}
                  <div>
                    <h3 className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-griscalido mb-3">
                      Composición & Desglose para {batchProductionUnits} unidades ({Math.round(currentBatchGrams)}g/ml totales)
                    </h3>
                    <div className="overflow-x-auto border border-mejunje-border rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-mejunje-espresso text-mejunje-marfil font-typewriter text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="p-3 font-normal">Materia Prima</th>
                            <th className="p-3 font-normal">Proveedor</th>
                            <th className="p-3 font-normal text-center">Proporción</th>
                            <th className="p-3 font-normal text-center">Cantidad Recalculada</th>
                            <th className="p-3 font-normal text-right">Subtotal ARS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-mejunje-border bg-white">
                          {activeFormula.ingredients.map((item, idx) => {
                            const calculatedQty = Math.round(item.quantity * multiplier);
                            const subtotal = Math.round(calculatedQty * item.unitCostARS);
                            return (
                              <tr key={idx} className="hover:bg-mejunje-papel/20 transition-colors">
                                <td className="p-3 font-medium text-mejunje-tinta">{item.ingredientName}</td>
                                <td className="p-3 text-mejunje-griscalido text-[11px]">{item.supplierName || 'General'}</td>
                                <td className="p-3 text-center font-typewriter text-mejunje-griscalido">
                                  {item.percentage > 0 ? `${item.percentage}%` : 'Unid.'}
                                </td>
                                <td className="p-3 text-center font-bold text-mejunje-salmon">
                                  {calculatedQty} {item.unit}
                                </td>
                                <td className="p-3 text-right font-semibold text-mejunje-tinta">${subtotal.toLocaleString('es-AR')}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary & Send to Purchases Bar */}
                  <div className="bg-mejunje-espresso text-mejunje-marfil p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-atelier">
                    <div>
                      <span className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-arena/80">Costo Total del Batch ({batchProductionUnits} unidades):</span>
                      <div className="text-2xl font-serif italic text-white">
                        ${Math.round(totalBatchCostARS).toLocaleString('es-AR')} ARS
                      </div>
                      <p className="text-[11px] text-mejunje-arena/70 mt-0.5 font-sans">
                        Costo unitario aproximado: <strong>${Math.round(unitCostARS).toLocaleString('es-AR')} ARS</strong>
                      </p>
                    </div>

                    <button
                      onClick={handleSendBatchToPurchases}
                      className="px-5 py-2.5 bg-mejunje-salmon hover:bg-mejunje-terracota text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-xs transition-all shrink-0 active:scale-95"
                    >
                      <Send className="w-4 h-4" /> Consolidar en Compras
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: INSUMOS CATALOG */}
      {/* =================================================================== */}
      {activeTab === 'insumos' && (
        <div className="space-y-6">
          {/* Top Actions & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-mejunje-card p-4 rounded-2xl border border-mejunje-border shadow-atelier">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-mejunje-griscalido absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar insumo o proveedor..."
                  value={insumoSearch}
                  onChange={(e) => setInsumoSearch(e.target.value)}
                  className="w-full bg-mejunje-papel/40 border border-mejunje-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-mejunje-tinta focus:outline-none focus:border-mejunje-salmon"
                />
              </div>

              <select
                value={insumoCategoryFilter}
                onChange={(e) => setInsumoCategoryFilter(e.target.value)}
                className="bg-mejunje-papel/40 border border-mejunje-border rounded-xl px-3 py-1.5 text-xs text-mejunje-tinta focus:outline-none"
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Ceras">Ceras</option>
                <option value="Fragancias">Fragancias</option>
                <option value="Aditivos">Aditivos</option>
                <option value="Pabilos">Pabilos</option>
                <option value="Envases">Envases</option>
                <option value="Tapas">Tapas</option>
                <option value="Packaging">Packaging</option>
                <option value="Etiquetas">Etiquetas</option>
                <option value="Alcoholes">Alcoholes</option>
                <option value="Bases">Bases</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <button
              onClick={() =>
                setEditingInsumo({
                  id: '',
                  name: '',
                  category: 'Fragancias',
                  unit: 'ml',
                  purchasePriceARS: 120000,
                  referenceQty: 1000,
                  unitCostARS: 120,
                  stock: 500,
                  minStock: 200,
                  supplierId: suppliers[0]?.id || '',
                  supplierName: suppliers[0]?.name || '',
                  lastUpdated: new Date().toLocaleDateString('es-AR'),
                  imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
                })
              }
              className="px-4 py-2 bg-mejunje-salmon hover:bg-mejunje-terracota text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Registrar Materia Prima
            </button>
          </div>

          {/* Insumos Table with Editorial Images */}
          <div className="bg-mejunje-card rounded-3xl p-6 shadow-atelier border border-mejunje-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-mejunje-espresso text-mejunje-marfil font-typewriter text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 font-normal">Materia Prima</th>
                    <th className="p-3.5 font-normal">Categoría</th>
                    <th className="p-3.5 font-normal">Proveedor</th>
                    <th className="p-3.5 font-normal text-right">Precio Compra ARS</th>
                    <th className="p-3.5 font-normal text-right">Costo Unitario Calculado</th>
                    <th className="p-3.5 font-normal text-center">Stock Actual</th>
                    <th className="p-3.5 font-normal text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mejunje-border bg-white">
                  {filteredInsumos.map((ing) => (
                    <tr key={ing.id} className="hover:bg-mejunje-papel/20 transition-colors">
                      <td className="p-3.5 font-semibold text-mejunje-tinta flex items-center gap-3">
                        {ing.imageUrl && (
                          <img
                            src={ing.imageUrl}
                            alt={ing.name}
                            className="w-10 h-10 rounded-lg object-cover border border-mejunje-border shrink-0 shadow-xs"
                          />
                        )}
                        <span>{ing.name}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-mejunje-papel text-mejunje-tabaco border border-mejunje-arena/50 font-typewriter text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {ing.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-mejunje-griscalido">{ing.supplierName}</td>
                      <td className="p-3.5 text-right font-medium text-mejunje-tinta">
                        ${ing.purchasePriceARS.toLocaleString('es-AR')} x {ing.referenceQty} {ing.unit}
                      </td>
                      <td className="p-3.5 text-right font-bold text-mejunje-salmon">
                        ${ing.unitCostARS.toLocaleString('es-AR')} / {ing.unit === 'kg' ? 'g' : ing.unit === 'l' ? 'ml' : ing.unit}
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium font-sans ${ing.stock <= ing.minStock ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                          {ing.stock} {ing.unit}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setInsumoToDelete(ing)}
                          className="p-1 text-mejunje-griscalido hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: BATCHES & LAB TESTS */}
      {/* =================================================================== */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="bg-mejunje-card rounded-3xl p-6 shadow-atelier border border-mejunje-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mejunje-border">
              <div>
                <h3 className="font-serif italic text-lg text-mejunje-tinta">Registrar Nuevo Batch de Prueba</h3>
                <p className="text-xs text-mejunje-griscalido">Control de temperaturas de vertido y evaluación sensorial de quemado</p>
              </div>
            </div>

            <form onSubmit={handleSaveNewBatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-typewriter text-[10px] uppercase tracking-wider text-mejunje-griscalido mb-1">Fórmula en Prueba</label>
                <select
                  value={newBatchForm.formulaId}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, formulaId: e.target.value })}
                  className="w-full bg-mejunje-papel/40 border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta focus:outline-none"
                >
                  {formulas.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.version})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-typewriter text-[10px] uppercase tracking-wider text-mejunje-griscalido mb-1">Cantidad Producida</label>
                <input
                  type="text"
                  value={newBatchForm.qtyProduced}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, qtyProduced: e.target.value })}
                  className="w-full bg-mejunje-papel/40 border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta"
                />
              </div>

              <div>
                <label className="block font-typewriter text-[10px] uppercase tracking-wider text-mejunje-griscalido mb-1">Temp. Vertido (°C)</label>
                <input
                  type="number"
                  value={newBatchForm.pouringTemp}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, pouringTemp: Number(e.target.value) })}
                  className="w-full bg-mejunje-papel/40 border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta"
                />
              </div>

              <div>
                <label className="block font-typewriter text-[10px] uppercase tracking-wider text-mejunje-griscalido mb-1">Evaluación Apariencia (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newBatchForm.ratingAppearance}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, ratingAppearance: Number(e.target.value) })}
                  className="w-full bg-mejunje-papel/40 border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta"
                />
              </div>

              <div>
                <label className="block font-typewriter text-[10px] uppercase tracking-wider text-mejunje-griscalido mb-1">Evaluación Quemado Parejo (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newBatchForm.ratingBurn}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, ratingBurn: Number(e.target.value) })}
                  className="w-full bg-mejunje-papel/40 border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-mejunje-espresso hover:bg-mejunje-tabaco text-white font-medium rounded-xl transition-all"
                >
                  Registrar Batch en Bitácora
                </button>
              </div>
            </form>
          </div>

          {/* Batches History Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batchTests.map((bt) => (
              <div key={bt.id} className="bg-mejunje-card rounded-3xl p-5 border border-mejunje-border shadow-atelier space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-mejunje-border pb-2">
                  <span className="font-typewriter font-bold text-mejunje-salmon">{bt.code}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[10px] border border-emerald-200">
                    {bt.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif italic text-base text-mejunje-tinta">{bt.formulaName}</h4>
                  <p className="text-mejunje-griscalido font-sans">Versión: {bt.version} · Fecha: {bt.date}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-mejunje-papel/30 p-3 rounded-2xl border border-mejunje-border text-[11px] font-sans">
                  <div>Temp. Vertido: <strong>{bt.pouringTemp || 37}°C</strong></div>
                  <div>Temp. Esencia: <strong>{bt.fragranceTemp || 42}°C</strong></div>
                  <div>Apariencia: <strong>{bt.ratingAppearance || 5}/5</strong></div>
                  <div>Quemado: <strong>{bt.ratingBurn || 5}/5</strong></div>
                </div>

                {bt.observations && (
                  <p className="text-mejunje-griscalido italic text-[11px]">{bt.observations}</p>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => approveBatchFormula(bt.id, bt.formulaId)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-medium rounded-xl flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" /> Aprobar Fórmula Oficialmente
                  </button>

                  <button
                    onClick={() => setBatchToDelete(bt)}
                    className="p-1 text-mejunje-griscalido hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={!!formulaToDelete}
        title="Eliminar Fórmula"
        message={`¿Está seguro de eliminar la fórmula "${formulaToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={() => formulaToDelete && deleteFormula(formulaToDelete.id)}
        onCancel={() => setFormulaToDelete(null)}
      />

      <ConfirmDialog
        isOpen={!!insumoToDelete}
        title="Eliminar Materia Prima"
        message={`¿Está seguro de eliminar la materia prima "${insumoToDelete?.name}"?`}
        onConfirm={() => insumoToDelete && deleteIngredient(insumoToDelete.id)}
        onCancel={() => setInsumoToDelete(null)}
      />

      <ConfirmDialog
        isOpen={!!batchToDelete}
        title="Eliminar Batch"
        message={`¿Está seguro de eliminar la prueba "${batchToDelete?.code}"?`}
        onConfirm={() => batchToDelete && deleteBatchTest(batchToDelete.id)}
        onCancel={() => setBatchToDelete(null)}
      />

      {/* Edit Insumo Modal */}
      {editingInsumo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-mejunje-espresso text-white p-6 rounded-3xl max-w-md w-full space-y-4 shadow-atelier-lg border border-mejunje-tabaco">
            <h3 className="font-serif italic text-lg text-white">Registrar Materia Prima</h3>
            <form onSubmit={handleSaveNewInsumo} className="space-y-3 text-xs">
              <div>
                <label className="block text-mejunje-arena mb-1 font-typewriter text-[10px] uppercase">Nombre Insumo</label>
                <input
                  type="text"
                  required
                  value={newInsumoForm.name}
                  onChange={(e) => setNewInsumoForm({ ...newInsumoForm, name: e.target.value })}
                  className="w-full bg-mejunje-tabaco/60 border border-mejunje-arena/30 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-mejunje-arena mb-1 font-typewriter text-[10px] uppercase">Categoría</label>
                  <select
                    value={newInsumoForm.category}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, category: e.target.value as any })}
                    className="w-full bg-mejunje-tabaco/60 border border-mejunje-arena/30 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Ceras">Ceras</option>
                    <option value="Fragancias">Fragancias</option>
                    <option value="Aditivos">Aditivos</option>
                    <option value="Pabilos">Pabilos</option>
                    <option value="Envases">Envases</option>
                    <option value="Tapas">Tapas</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Etiquetas">Etiquetas</option>
                    <option value="Alcoholes">Alcoholes</option>
                    <option value="Bases">Bases</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mejunje-arena mb-1 font-typewriter text-[10px] uppercase">Unidad Medida</label>
                  <select
                    value={newInsumoForm.unit}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, unit: e.target.value as any })}
                    className="w-full bg-mejunje-tabaco/60 border border-mejunje-arena/30 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="l">Litros (l)</option>
                    <option value="unid">Unidad (unid)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-mejunje-arena mb-1 font-typewriter text-[10px] uppercase">Precio Compra ARS</label>
                  <input
                    type="number"
                    value={newInsumoForm.purchasePriceARS}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, purchasePriceARS: Number(e.target.value) })}
                    className="w-full bg-mejunje-tabaco/60 border border-mejunje-arena/30 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-mejunje-arena mb-1 font-typewriter text-[10px] uppercase">Cantidad Referencia</label>
                  <input
                    type="number"
                    value={newInsumoForm.referenceQty}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, referenceQty: Number(e.target.value) })}
                    className="w-full bg-mejunje-tabaco/60 border border-mejunje-arena/30 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingInsumo(null)}
                  className="px-4 py-2 bg-mejunje-tabaco text-mejunje-arena rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-mejunje-salmon text-white font-semibold rounded-xl"
                >
                  Guardar Materia Prima
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
