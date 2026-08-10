'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Calculator,
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  Thermometer,
  Flame,
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
    addFormula,
    updateFormula,
    deleteFormula,
    duplicateFormula,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addBatchTest,
    updateBatchTest,
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
  const [batchProductionUnits, setBatchProductionUnits] = useState<number>(10); // e.g. 10 units

  // Confirm dialog state for formulas
  const [formulaToDelete, setFormulaToDelete] = useState<Formula | null>(null);

  // Edit formula modal state
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);

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
  const suggestedSellingPriceARS = unitCostARS * (1 + (activeFormula?.suggestedMarginPercent || 60) / 100);

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
    observations: 'Prueba de quemado realizada en vaso de cristal esmerilado.',
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
    <div className="space-y-8 animate-in fade-in">
      {/* Page Header */}
      <SectionHero
        title="Laboratorio Olfativo & Insumos"
        subtitle="Diseño de pirámides olfativas, guía de formulación por categoría, inventario de insumos y evaluación de lotes de prueba."
        badgeText="Módulo de Laboratorio & Desarrollo"
        badgeIcon={<FlaskConical className="w-3.5 h-3.5 text-[#C98F7A]" />}
        bgImage="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=80"
      >
        {/* Tab Selector Controls */}
        <div className="flex items-center gap-1.5 bg-[#2D2521]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#D8C7B8]/20 shadow-lg">
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'formulas'
                ? 'bg-[#C98F7A] text-white shadow-xs'
                : 'text-[#D8C7B8] hover:text-white'
            }`}
          >
            Fórmulas ({formulas.length})
          </button>

          <button
            onClick={() => setActiveTab('insumos')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'insumos'
                ? 'bg-[#C98F7A] text-white shadow-xs'
                : 'text-[#D8C7B8] hover:text-white'
            }`}
          >
            Insumos ({ingredients.length})
          </button>

          <button
            onClick={() => setActiveTab('batches')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'batches'
                ? 'bg-[#C98F7A] text-white shadow-xs'
                : 'text-[#D8C7B8] hover:text-white'
            }`}
          >
            Pruebas / Batches ({batchTests.length})
          </button>
        </div>
      </SectionHero>

      {/* =================================================================== */}
      {/* TAB 1: FORMULAS & PRODUCTION CALCULATOR */}
      {/* =================================================================== */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          {/* Top Actions & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E6DFC8]">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-[#7A6B61] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar fórmula..."
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C86D51]"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#7A6B61]" />
                <select
                  value={formulaCategoryFilter}
                  onChange={(e) => setFormulaCategoryFilter(e.target.value)}
                  className="bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-1.5 text-xs text-[#2A1E17] focus:outline-none"
                >
                  <option value="Todas">Todas las categorías</option>
                  <option value="Vela">Velas</option>
                  <option value="Difusor">Difusores</option>
                  <option value="Perfume textil">Perfumes Textil</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('formula')}
              className="px-4 py-2 bg-[#C86D51] hover:bg-[#a85239] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Crear Nueva Fórmula
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Formulas List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#7A6B61] uppercase tracking-wider block">
                Fórmulas ({filteredFormulas.length})
              </span>

              {filteredFormulas.map((f) => {
                const isSelected = f.id === selectedFormulaId;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFormulaId(f.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#2A1E17] text-white border-[#2A1E17] shadow-lg'
                        : 'bg-white text-[#2A1E17] border-[#E6DFC8] hover:border-[#C86D51]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#C86D51] text-white' : 'bg-[#F7F4EE] text-[#C86D51]'
                        }`}
                      >
                        {f.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isSelected ? 'bg-[#3D2C22] text-[#E6DFC8]' : 'bg-gray-100 text-gray-600'}`}>
                        {f.version} • {f.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm mt-2.5">{f.name}</h3>

                    <div className="mt-3 pt-3 border-t border-opacity-20 border-gray-400 flex items-center justify-between text-xs">
                      <span className={isSelected ? 'text-[#E6DFC8]' : 'text-[#7A6B61]'}>
                        Rendimiento: {f.yieldSize}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateFormula(f.id);
                          }}
                          title="Duplicar"
                          className="p-1 hover:text-[#D9822B] transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormulaToDelete(f);
                          }}
                          title="Eliminar"
                          className="p-1 hover:text-[#C86D51] transition-colors"
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
                <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8] space-y-6">
                  {/* Active Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DFC8]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#C86D51] font-bold uppercase">{activeFormula.category}</span>
                        <span className="text-xs bg-[#6E8B74]/20 text-[#6E8B74] px-2 py-0.5 rounded-full font-bold">
                          {activeFormula.status}
                        </span>
                      </div>
                      <h2 className="text-xl font-serif font-bold text-[#2A1E17]">{activeFormula.name}</h2>
                      {activeFormula.associatedProductName && (
                        <p className="text-xs text-[#7A6B61] mt-0.5">
                          Vinculado a: <strong className="text-[#2A1E17]">{activeFormula.associatedProductName}</strong>
                        </p>
                      )}
                    </div>

                    {/* Batch Production Unit Input */}
                    <div className="bg-[#F7F4EE] p-3 rounded-2xl border border-[#E6DFC8] flex items-center gap-3 shrink-0">
                      <Calculator className="w-5 h-5 text-[#C86D51]" />
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#7A6B61]">Unidades a Producir</label>
                        <input
                          type="number"
                          min="1"
                          value={batchProductionUnits}
                          onChange={(e) => setBatchProductionUnits(Math.max(1, Number(e.target.value)))}
                          className="w-20 bg-white border border-[#E6DFC8] rounded-lg px-2 py-1 text-sm font-bold text-[#2A1E17] focus:outline-none focus:border-[#C86D51]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formulation Help & Warnings according to Category */}
                  {activeFormula.category === 'Vela' && (
                    <div className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2A1E17] flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#C86D51]" /> Guía Taller: Vela de Soja
                        </span>
                        <span className="text-[10px] text-[#7A6B61]">Ref: Esencia 1-10% (curso 5-7%) | Mejorador 1-10% (curso 2-4%)</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-[11px] text-[#7A6B61]">
                        <span>Esencia actual: <strong className="text-[#2A1E17]">{essencePercent}%</strong></span>
                        <span>Aditivo actual: <strong className="text-[#2A1E17]">{additivePercent}%</strong></span>
                      </div>
                      {formulationWarning && (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" /> {formulationWarning}
                        </div>
                      )}
                    </div>
                  )}

                  {activeFormula.category === 'Difusor' && (
                    <div className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8] space-y-1 text-xs text-[#7A6B61]">
                      <span className="font-bold text-[#2A1E17] flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#D9822B]" /> Guía Taller: Difusores de Ambiente
                      </span>
                      <p className="text-[11px]">Ref: Fragancia 10-20% | Solvente Dowanol ~10% | Alcohol Cereal 96° ~70% | Maceración reposo: 30 días.</p>
                    </div>
                  )}

                  {activeFormula.category === 'Perfume textil' && (
                    <div className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8] space-y-1 text-xs text-[#7A6B61]">
                      <span className="font-bold text-[#2A1E17] flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#6E8B74]" /> Guía Taller: Perfumes Textil
                      </span>
                      <p className="text-[11px]">Ref: Alcohol Cereal | Agua Destilada 10-20% | Aceites Esenciales 3-6% | Reposo 30 días.</p>
                      <p className="text-[10px] italic text-[#C86D51]">Las formulaciones deben validarse con proveedores o laboratorios adecuados antes de comercializar.</p>
                    </div>
                  )}

                  {/* Olfactory Pyramid Display */}
                  {(activeFormula.topNotes?.length || activeFormula.heartNotes?.length || activeFormula.baseNotes?.length) && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B61] mb-2.5 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#D9822B]" /> Pirámide Olfativa
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8]">
                          <span className="text-[10px] font-bold uppercase text-[#D9822B]">Salida (Primer Impacto)</span>
                          <div className="mt-1 text-xs font-semibold text-[#2A1E17]">
                            {activeFormula.topNotes?.join(', ') || 'Bergamota'}
                          </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8]">
                          <span className="text-[10px] font-bold uppercase text-[#C86D51]">Corazón (Carácter)</span>
                          <div className="mt-1 text-xs font-semibold text-[#2A1E17]">
                            {activeFormula.heartNotes?.join(', ') || 'Flor de Azahar'}
                          </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#F7F4EE] border border-[#E6DFC8]">
                          <span className="text-[10px] font-bold uppercase text-[#2A1E17]">Fondo (Fijación)</span>
                          <div className="mt-1 text-xs font-semibold text-[#2A1E17]">
                            {activeFormula.baseNotes?.join(', ') || 'Ámbar, Cedro'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ingredients Table */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B61] mb-3">
                      Composición & Desglose Recalculado para {batchProductionUnits} unidades ({Math.round(currentBatchGrams)}g/ml total)
                    </h3>
                    <div className="overflow-x-auto border border-[#E6DFC8] rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#2A1E17] text-[#E6DFC8]">
                          <tr>
                            <th className="p-3 font-semibold">Insumo / Ingrediente</th>
                            <th className="p-3 font-semibold">Proveedor</th>
                            <th className="p-3 font-semibold text-center">Proporción</th>
                            <th className="p-3 font-semibold text-center">Cantidad Recalculada</th>
                            <th className="p-3 font-semibold text-right">Costo Subtotal ARS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6DFC8]">
                          {activeFormula.ingredients.map((item, idx) => {
                            const calculatedQty = Math.round(item.quantity * multiplier);
                            const subtotal = Math.round(calculatedQty * item.unitCostARS);
                            return (
                              <tr key={idx} className="hover:bg-[#F7F4EE]/60 transition-colors">
                                <td className="p-3 font-bold text-[#2A1E17]">{item.ingredientName}</td>
                                <td className="p-3 text-[#7A6B61] text-[11px]">{item.supplierName || 'General'}</td>
                                <td className="p-3 text-center font-mono text-[#7A6B61]">
                                  {item.percentage > 0 ? `${item.percentage}%` : 'Unidad'}
                                </td>
                                <td className="p-3 text-center font-bold text-[#C86D51]">
                                  {calculatedQty} {item.unit}
                                </td>
                                <td className="p-3 text-right font-bold text-[#2A1E17]">${subtotal.toLocaleString('es-AR')}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary & Send to Purchases Bar */}
                  <div className="bg-[#2A1E17] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-[#E6DFC8]">Costo Total del Batch ({batchProductionUnits} unidades):</span>
                      <div className="text-2xl font-bold text-white font-serif">
                        ${Math.round(totalBatchCostARS).toLocaleString('es-AR')} ARS
                      </div>
                      <p className="text-[11px] text-[#E6DFC8]/70 mt-0.5">
                        Costo unitario aproximado: <strong>${Math.round(unitCostARS).toLocaleString('es-AR')} ARS</strong>
                      </p>
                    </div>

                    <button
                      onClick={handleSendBatchToPurchases}
                      className="px-5 py-2.5 bg-[#6E8B74] hover:bg-[#58725d] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0 active:scale-95"
                    >
                      <Send className="w-4 h-4" /> Enviar requerimientos a Compras
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E6DFC8]">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-[#7A6B61] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar insumo o proveedor..."
                  value={insumoSearch}
                  onChange={(e) => setInsumoSearch(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C86D51]"
                />
              </div>

              <select
                value={insumoCategoryFilter}
                onChange={(e) => setInsumoCategoryFilter(e.target.value)}
                className="bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-1.5 text-xs text-[#2A1E17] focus:outline-none"
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
                })
              }
              className="px-4 py-2 bg-[#C86D51] hover:bg-[#a85239] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Registrar Nuevo Insumo
            </button>
          </div>

          {/* Insumos Table */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2A1E17] text-[#E6DFC8]">
                  <tr>
                    <th className="p-3.5 font-semibold">Insumo</th>
                    <th className="p-3.5 font-semibold">Categoría</th>
                    <th className="p-3.5 font-semibold">Proveedor</th>
                    <th className="p-3.5 font-semibold text-right">Precio Compra ARS</th>
                    <th className="p-3.5 font-semibold text-right">Costo Unitario Calculado</th>
                    <th className="p-3.5 font-semibold text-center">Stock Actual</th>
                    <th className="p-3.5 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFC8]">
                  {filteredInsumos.map((ing) => (
                    <tr key={ing.id} className="hover:bg-[#F7F4EE]/60 transition-colors">
                      <td className="p-3.5 font-bold text-[#2A1E17]">{ing.name}</td>
                      <td className="p-3.5">
                        <span className="bg-[#F7F4EE] text-[#C86D51] border border-[#C86D51]/30 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {ing.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#7A6B61]">{ing.supplierName}</td>
                      <td className="p-3.5 text-right font-medium text-[#2A1E17]">
                        ${ing.purchasePriceARS.toLocaleString('es-AR')} x {ing.referenceQty} {ing.unit}
                      </td>
                      <td className="p-3.5 text-right font-bold text-[#C86D51]">
                        ${ing.unitCostARS.toLocaleString('es-AR')} / {ing.unit === 'kg' ? 'g' : ing.unit === 'l' ? 'ml' : ing.unit}
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ing.stock <= ing.minStock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {ing.stock} {ing.unit}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setInsumoToDelete(ing)}
                          className="p-1 text-[#C86D51] hover:text-red-700 transition-colors"
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
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DFC8]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2A1E17]">Registrar Nuevo Batch de Prueba</h3>
                <p className="text-xs text-[#7A6B61]">Control de temperaturas de vertido y evaluación sensorial de quemado</p>
              </div>
            </div>

            <form onSubmit={handleSaveNewBatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Fórmula en Prueba</label>
                <select
                  value={newBatchForm.formulaId}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, formulaId: e.target.value })}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17] focus:outline-none"
                >
                  {formulas.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.version})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Cantidad Producida</label>
                <input
                  type="text"
                  value={newBatchForm.qtyProduced}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, qtyProduced: e.target.value })}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Temp. Vertido (°C)</label>
                <input
                  type="number"
                  value={newBatchForm.pouringTemp}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, pouringTemp: Number(e.target.value) })}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Evaluación Apariencia (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newBatchForm.ratingAppearance}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, ratingAppearance: Number(e.target.value) })}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Evaluación Quemado Parejo (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newBatchForm.ratingBurn}
                  onChange={(e) => setNewBatchForm({ ...newBatchForm, ratingBurn: Number(e.target.value) })}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#2A1E17] hover:bg-[#3D2C22] text-white font-semibold rounded-xl transition-all"
                >
                  Registrar Batch de Prueba
                </button>
              </div>
            </form>
          </div>

          {/* Batches History Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batchTests.map((bt) => (
              <div key={bt.id} className="bg-white rounded-3xl p-5 border border-[#E6DFC8] shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#E6DFC8] pb-2">
                  <span className="font-mono font-bold text-[#C86D51]">{bt.code}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6E8B74]/20 text-[#6E8B74] font-bold text-[10px]">
                    {bt.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2A1E17]">{bt.formulaName}</h4>
                  <p className="text-[#7A6B61]">Versión: {bt.version} • Creado el {bt.date}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#F7F4EE] p-3 rounded-2xl border border-[#E6DFC8] text-[11px]">
                  <div>Temp. Vertido: <strong>{bt.pouringTemp || 37}°C</strong></div>
                  <div>Temp. Esencia: <strong>{bt.fragranceTemp || 42}°C</strong></div>
                  <div>Apariencia: <strong>{bt.ratingAppearance || 5}/5</strong></div>
                  <div>Quemado: <strong>{bt.ratingBurn || 5}/5</strong></div>
                </div>

                {bt.observations && (
                  <p className="text-[#7A6B61] italic text-[11px]">{bt.observations}</p>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => approveBatchFormula(bt.id, bt.formulaId)}
                    className="px-3 py-1.5 bg-[#6E8B74] hover:bg-[#58725d] text-white text-[11px] font-semibold rounded-xl flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" /> Aprobar Fórmula Oficialmente
                  </button>

                  <button
                    onClick={() => setBatchToDelete(bt)}
                    className="p-1 text-[#C86D51] hover:text-red-700"
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
        title="Eliminar Insumo"
        message={`¿Está seguro de eliminar el insumo "${insumoToDelete?.name}"?`}
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
          <div className="bg-[#2A1E17] text-white p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-serif font-bold text-lg">Registrar / Editar Insumo</h3>
            <form onSubmit={handleSaveNewInsumo} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#E6DFC8] mb-1">Nombre Insumo</label>
                <input
                  type="text"
                  required
                  value={newInsumoForm.name}
                  onChange={(e) => setNewInsumoForm({ ...newInsumoForm, name: e.target.value })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#E6DFC8] mb-1">Categoría</label>
                  <select
                    value={newInsumoForm.category}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, category: e.target.value as any })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-2 text-white"
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
                  <label className="block text-[#E6DFC8] mb-1">Unidad Medida</label>
                  <select
                    value={newInsumoForm.unit}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, unit: e.target.value as any })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-2 text-white"
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
                  <label className="block text-[#E6DFC8] mb-1">Precio Compra ARS</label>
                  <input
                    type="number"
                    value={newInsumoForm.purchasePriceARS}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, purchasePriceARS: Number(e.target.value) })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#E6DFC8] mb-1">Cantidad Referencia</label>
                  <input
                    type="number"
                    value={newInsumoForm.referenceQty}
                    onChange={(e) => setNewInsumoForm({ ...newInsumoForm, referenceQty: Number(e.target.value) })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingInsumo(null)}
                  className="px-4 py-2 bg-[#3D2C22] text-[#E6DFC8] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C86D51] text-white font-semibold rounded-xl"
                >
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
