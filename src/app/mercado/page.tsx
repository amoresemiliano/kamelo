'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  BarChart3,
  Play,
  Search,
  Sparkles,
  SlidersHorizontal,
  Save,
  CheckSquare,
  Square,
  Package,
  FlaskConical,
  MapPin,
  Globe,
  Tag,
  Info,
  Copy,
  Trash2,
  Edit3,
  RotateCcw,
  Plus
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { MarketBenchmark, MarketQuery } from '@/types';

export default function MercadoPage() {
  const {
    catalogProducts,
    ingredients,
    marketQueries,
    marketBenchmarks,
    addMarketQuery,
    updateMarketQuery,
    deleteMarketQuery,
    duplicateMarketQuery,
    toggleMarketQueryStatus,
    runMarketQueries,
    updateBenchmarkPrice,
    showToast,
  } = useKamelo();

  // ---------------------------------------------------------------------------
  // NEW MARKET QUERY STATE
  // ---------------------------------------------------------------------------
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedSupplyIds, setSelectedSupplyIds] = useState<string[]>([]);
  const [supplySearchTerm, setSupplySearchTerm] = useState('');
  const [freeText, setFreeText] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('Zona Norte GBA');
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'Mercado Libre',
    'Ecommerce',
  ]);

  // Saving / Editing Query state
  const [queryName, setQueryName] = useState('');
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [lastSimulationSummary, setLastSimulationSummary] = useState<string | null>(null);

  // Category filter for benchmarks below
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  // ---------------------------------------------------------------------------
  // HANDLERS FOR SELECTION
  // ---------------------------------------------------------------------------
  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = () => {
    setSelectedProductIds(catalogProducts.map((p) => p.id));
  };

  const handleClearProducts = () => {
    setSelectedProductIds([]);
  };

  const handleToggleSupply = (id: string) => {
    setSelectedSupplyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  // Filtered supplies for search
  const filteredSupplies = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(supplySearchTerm.toLowerCase()) ||
    ing.category.toLowerCase().includes(supplySearchTerm.toLowerCase())
  );

  // Selected names helper
  const selectedProducts = catalogProducts.filter((p) => selectedProductIds.includes(p.id));
  const selectedSupplies = ingredients.filter((ing) => selectedSupplyIds.includes(ing.id));

  // ---------------------------------------------------------------------------
  // RUN QUERY SIMULATION
  // ---------------------------------------------------------------------------
  const handleExecuteCurrentQuery = () => {
    if (
      selectedProductIds.length === 0 &&
      selectedSupplyIds.length === 0 &&
      !freeText.trim()
    ) {
      showToast('Por favor seleccioná al menos un producto, insumo o escribí texto libre.', 'warning');
      return;
    }

    setIsRunningSimulation(true);
    setTimeout(() => {
      runMarketQueries();
      setIsRunningSimulation(false);

      const itemsCount =
        selectedProducts.length + selectedSupplies.length + (freeText.trim() ? 1 : 0);
      setLastSimulationSummary(
        `Consulta procesada exitosamente para ${itemsCount} elemento(s) en ${selectedZone}.`
      );
    }, 900);
  };

  // ---------------------------------------------------------------------------
  // SAVE / UPDATE QUERY
  // ---------------------------------------------------------------------------
  const handleSaveQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = queryName.trim() || `Consulta ${new Date().toLocaleDateString('es-AR')}`;

    if (editingQueryId) {
      updateMarketQuery(editingQueryId, {
        name: finalName,
        selectedProducts: selectedProducts.map((p) => p.name),
        selectedSupplies: selectedSupplies.map((s) => s.name),
        freeText,
        zone: selectedZone,
        sources: selectedSources,
      });
      setEditingQueryId(null);
    } else {
      addMarketQuery({
        name: finalName,
        selectedProducts: selectedProducts.map((p) => p.name),
        selectedSupplies: selectedSupplies.map((s) => s.name),
        freeText,
        zone: selectedZone,
        sources: selectedSources,
        status: 'Activo',
      });
    }

    setQueryName('');
  };

  // Populate form for editing
  const handleEditQuery = (query: MarketQuery) => {
    setEditingQueryId(query.id);
    setQueryName(query.name);
    setFreeText(query.freeText || '');
    if (query.zone) setSelectedZone(query.zone);
    if (query.sources) setSelectedSources(query.sources);

    // Map names back to IDs if match exists
    if (query.selectedProducts) {
      const pIds = catalogProducts
        .filter((p) => query.selectedProducts?.includes(p.name))
        .map((p) => p.id);
      setSelectedProductIds(pIds);
    }
    if (query.selectedSupplies) {
      const sIds = ingredients
        .filter((ing) => query.selectedSupplies?.includes(ing.name))
        .map((ing) => ing.id);
      setSelectedSupplyIds(sIds);
    }

    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load / run saved query immediately
  const handleRunSavedQuery = (query: MarketQuery) => {
    handleEditQuery(query);
    setTimeout(() => {
      handleExecuteCurrentQuery();
    }, 200);
  };

  // Reset form
  const handleResetForm = () => {
    setSelectedProductIds([]);
    setSelectedSupplyIds([]);
    setFreeText('');
    setQueryName('');
    setEditingQueryId(null);
  };

  // Benchmark filters
  const filteredBenchmarks = marketBenchmarks.filter((b) => {
    return categoryFilter === 'Todas' || b.category === categoryFilter;
  });

  const opportunitiesCount = marketBenchmarks.filter((b) => b.status === 'Oportunidad Aumento').length;
  const competitiveCount = marketBenchmarks.filter((b) => b.status === 'Competitivo').length;

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-[#FBF8F4] p-6 sm:p-8 rounded-3xl border border-[#E7DDD4] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFA28F]/20 text-[#C98F7A] text-xs font-semibold mb-2 border border-[#DFA28F]/30">
            <TrendingUp className="w-3.5 h-3.5" /> Módulo de Inteligencia Comercial ARS
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4B4038]">
            Inteligencia de Mercado & Precios
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6E65] mt-1 leading-relaxed max-w-3xl">
            Herramienta interactiva para investigar precios de referencia, insumos y marcas competidoras en Argentina. Configurá tus consultas a medida.
          </p>
        </div>

        {/* Notice Badge */}
        <div className="flex items-center gap-2 bg-[#FAF3E8] px-3.5 py-2 rounded-2xl border border-[#D6A36D]/30 text-xs shrink-0">
          <Info className="w-4 h-4 text-[#D6A36D] shrink-0" />
          <span className="text-[#7A6E65] font-medium text-[11px]">
            Datos simulados para validación del MVP
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 1. BLOQUE NUEVA CONSULTA DE MERCADO */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-[#FBF8F4] rounded-3xl p-6 sm:p-8 border border-[#E7DDD4] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7DDD4]">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#4B4038] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C98F7A]" />
              {editingQueryId ? 'Editar Consulta de Mercado' : 'Nueva Consulta de Mercado'}
            </h2>
            <p className="text-xs text-[#7A6E65] mt-0.5">
              Elegí qué productos o insumos querés investigar, o ingresá una búsqueda libre.
            </p>
          </div>

          {editingQueryId && (
            <button
              onClick={handleResetForm}
              className="text-xs text-[#C98F7A] hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT & CENTER COLS: Selection Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3.1 SELECCIÓN DESDE PRODUCTOS */}
            <div className="space-y-3 bg-[#F7F3EE] p-5 rounded-2xl border border-[#E7DDD4]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#4B4038] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C98F7A]" /> Productos Kamelo
                </h3>

                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSelectAllProducts}
                    className="text-[#C98F7A] font-semibold hover:underline"
                  >
                    Seleccionar todos
                  </button>
                  <span className="text-[#CBB8A6]">•</span>
                  <button
                    type="button"
                    onClick={handleClearProducts}
                    className="text-[#7A6E65] hover:underline"
                  >
                    Limpiar selección
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {catalogProducts.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const firstVariant = product.variants?.[0];

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleToggleProduct(product.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#FBF8F4] border-[#C98F7A] shadow-2xs'
                          : 'bg-white border-[#E7DDD4] hover:border-[#D8C7B8]'
                      }`}
                    >
                      <div className="mt-0.5 text-[#C98F7A]">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-[#C98F7A]/20" />
                        ) : (
                          <Square className="w-4 h-4 text-[#CBB8A6]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#4B4038] truncate">
                          {product.name}
                        </div>

                        {/* Optional Tags: Category, Size, Aroma */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#D8C7B8]/20 text-[#7A6E65] text-[10px]">
                            {product.category}
                          </span>
                          {firstVariant?.size && (
                            <span className="px-2 py-0.5 rounded-md bg-[#DFA28F]/20 text-[#C98F7A] text-[10px] font-medium">
                              {firstVariant.size}
                            </span>
                          )}
                          {firstVariant?.aroma && (
                            <span className="px-2 py-0.5 rounded-md bg-[#D6A36D]/20 text-[#7A6E65] text-[10px]">
                              {firstVariant.aroma}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3.2 SELECCIÓN DESDE INSUMOS */}
            <div className="space-y-3 bg-[#F7F3EE] p-5 rounded-2xl border border-[#E7DDD4]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-serif font-bold text-sm text-[#4B4038] flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#D6A36D]" /> Insumos & Materias Primas
                </h3>

                {/* Quick Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#7A6E65] absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={supplySearchTerm}
                    onChange={(e) => setSupplySearchTerm(e.target.value)}
                    placeholder="Buscar insumo..."
                    className="pl-8 pr-3 py-1 bg-white border border-[#E7DDD4] rounded-lg text-xs text-[#4B4038] focus:outline-none focus:border-[#C98F7A] w-full sm:w-44"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {filteredSupplies.map((ing) => {
                  const isSelected = selectedSupplyIds.includes(ing.id);

                  return (
                    <div
                      key={ing.id}
                      onClick={() => handleToggleSupply(ing.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#FBF8F4] border-[#D6A36D] shadow-2xs'
                          : 'bg-white border-[#E7DDD4] hover:border-[#D8C7B8]'
                      }`}
                    >
                      <div className="text-[#D6A36D]">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-[#D6A36D]/20" />
                        ) : (
                          <Square className="w-4 h-4 text-[#CBB8A6]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#4B4038] truncate">{ing.name}</div>
                        <div className="text-[10px] text-[#7A6E65]">
                          Cat: {ing.category} • Costo: ${ing.purchasePriceARS.toLocaleString('es-AR')} ARS
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3.3 TEXTO LIBRE */}
            <div className="space-y-2 bg-[#F7F3EE] p-5 rounded-2xl border border-[#E7DDD4]">
              <label className="font-serif font-bold text-sm text-[#4B4038] block">
                También quiero investigar...
              </label>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={3}
                placeholder={`Ejemplos:
- velas premium 3 mechas
- velas de soja con frasco ámbar
- precio cera de soja por kilo
- difusores premium zona norte
- packaging para velas artesanales`}
                className="w-full bg-white border border-[#E7DDD4] rounded-xl p-3 text-xs text-[#4B4038] focus:outline-none focus:border-[#C98F7A] leading-relaxed"
              />
              <p className="text-[11px] text-[#7A6E65]">
                Podés ingresar búsquedas libres aunque no selecciones productos ni insumos.
              </p>
            </div>

            {/* 3.4 UBICACIÓN Y 3.5 FUENTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ubicación */}
              <div className="bg-[#F7F3EE] p-4 rounded-2xl border border-[#E7DDD4] space-y-2">
                <label className="text-xs font-bold text-[#4B4038] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C98F7A]" /> Zona a investigar
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD4] rounded-xl px-3 py-2 text-xs text-[#4B4038] focus:outline-none"
                >
                  <option value="CABA">CABA</option>
                  <option value="Zona Norte GBA">Zona Norte GBA</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Argentina">Argentina</option>
                </select>
              </div>

              {/* Fuentes */}
              <div className="bg-[#F7F3EE] p-4 rounded-2xl border border-[#E7DDD4] space-y-2">
                <label className="text-xs font-bold text-[#4B4038] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#7D9882]" /> Fuentes de relevamiento
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Mercado Libre', 'Ecommerce', 'Marcas independientes', 'Tiendas online'].map((source) => {
                    const isChecked = selectedSources.includes(source);
                    return (
                      <button
                        type="button"
                        key={source}
                        onClick={() => handleToggleSource(source)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] border text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-[#FBF8F4] border-[#7D9882] text-[#4B4038] font-semibold'
                            : 'bg-white border-[#E7DDD4] text-[#7A6E65]'
                        }`}
                      >
                        <span className="truncate">{source}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-[#7D9882] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: 3.6 RESUMEN DE CONSULTA & ACCIONES */}
          <div className="bg-[#F7F3EE] p-6 rounded-2xl border border-[#E7DDD4] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-[#4B4038] border-b border-[#E7DDD4] pb-2">
                Vas a investigar:
              </h3>

              <div className="space-y-3 text-xs">
                {/* Selected Products */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">
                    Productos Seleccionados ({selectedProducts.length})
                  </span>
                  {selectedProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProducts.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded-md bg-[#C98F7A]/20 text-[#C98F7A] font-medium text-[11px]"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#7A6E65] italic text-[11px]">Ningún producto</span>
                  )}
                </div>

                {/* Selected Supplies */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">
                    Insumos Seleccionados ({selectedSupplies.length})
                  </span>
                  {selectedSupplies.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSupplies.map((ing) => (
                        <span
                          key={ing.id}
                          className="px-2 py-0.5 rounded-md bg-[#D6A36D]/20 text-[#7A5222] font-medium text-[11px]"
                        >
                          {ing.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#7A6E65] italic text-[11px]">Ningún insumo</span>
                  )}
                </div>

                {/* Free Text */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">
                    Texto libre
                  </span>
                  {freeText.trim() ? (
                    <p className="bg-white p-2 rounded-lg border border-[#E7DDD4] text-[#4B4038] text-[11px] italic mt-1">
                      "{freeText.trim()}"
                    </p>
                  ) : (
                    <span className="text-[#7A6E65] italic text-[11px]">Sin texto libre</span>
                  )}
                </div>

                {/* Location */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">
                    Ubicación
                  </span>
                  <span className="font-semibold text-[#4B4038]">{selectedZone}</span>
                </div>

                {/* Sources */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">
                    Fuentes
                  </span>
                  <span className="text-[#4B4038]">
                    {selectedSources.length > 0 ? selectedSources.join(', ') : 'Todas'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-[#E7DDD4]">
              <button
                type="button"
                onClick={handleExecuteCurrentQuery}
                disabled={isRunningSimulation}
                className="w-full py-3 bg-[#C98F7A] hover:bg-[#b87e6a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-60"
              >
                <Play className="w-4 h-4 fill-white" />
                {isRunningSimulation ? 'Consultando...' : 'Consultar mercado'}
              </button>

              {/* SAVE QUERY BLOCK */}
              <form onSubmit={handleSaveQuery} className="space-y-2 pt-2 border-t border-[#E7DDD4]">
                <label className="text-[11px] font-bold text-[#4B4038] block">
                  Guardar esta consulta
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="Ej: Benchmark velas 200 g Zona Norte"
                    className="flex-1 bg-white border border-[#E7DDD4] rounded-xl px-2.5 py-1.5 text-xs text-[#4B4038] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#7D9882] hover:bg-[#6b8570] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                </div>
              </form>

              {lastSimulationSummary && (
                <div className="p-2.5 rounded-xl bg-[#EAF0EB] text-[#3D5442] text-[11px] font-medium border border-[#7D9882]/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7D9882] shrink-0" />
                  <span>{lastSimulationSummary}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. SECCIÓN CONSULTAS GUARDADAS */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-[#FBF8F4] rounded-3xl p-6 sm:p-8 border border-[#E7DDD4] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7DDD4]">
          <h2 className="font-serif font-bold text-lg text-[#4B4038] flex items-center gap-2">
            <Save className="w-5 h-5 text-[#7D9882]" /> Consultas Guardadas
          </h2>
          <span className="text-xs text-[#7A6E65]">
            {marketQueries.length} consulta(s) configurada(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketQueries.map((query) => {
            const hasProducts = query.selectedProducts && query.selectedProducts.length > 0;
            const hasSupplies = query.selectedSupplies && query.selectedSupplies.length > 0;

            return (
              <div
                key={query.id}
                className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E7DDD4] space-y-3 hover:border-[#D8C7B8] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-sm text-[#4B4038]">
                      {query.name}
                    </h3>

                    <button
                      onClick={() => toggleMarketQueryStatus(query.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        query.status === 'Activo'
                          ? 'bg-[#EAF0EB] text-[#3D5442] border border-[#7D9882]/40'
                          : 'bg-[#E7DDD4] text-[#7A6E65]'
                      }`}
                    >
                      {query.status}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-[#7A6E65]">
                    {hasProducts && (
                      <div>
                        <strong className="text-[#4B4038]">Productos:</strong>{' '}
                        {query.selectedProducts?.join(', ')}
                      </div>
                    )}

                    {hasSupplies && (
                      <div>
                        <strong className="text-[#4B4038]">Insumos:</strong>{' '}
                        {query.selectedSupplies?.join(', ')}
                      </div>
                    )}

                    {query.freeText && (
                      <div>
                        <strong className="text-[#4B4038]">Texto libre:</strong> "{query.freeText}"
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 text-[#7A6E65]">
                      <span>Zona: <strong className="text-[#4B4038]">{query.zone || 'N/A'}</strong></span>
                      <span>Fuentes: <strong className="text-[#4B4038]">{query.sources?.join(', ') || query.source || 'Varias'}</strong></span>
                    </div>

                    <div className="text-[10px] text-[#7A6E65]/80 font-mono pt-1">
                      Última ejecución: {query.lastRun || 'Pendiente'}
                    </div>
                  </div>
                </div>

                {/* Actions: Ejecutar, Editar, Duplicar, Eliminar */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E7DDD4]/80 text-xs gap-2">
                  <button
                    onClick={() => handleRunSavedQuery(query)}
                    className="px-3 py-1.5 bg-[#C98F7A] hover:bg-[#b87e6a] text-white rounded-xl font-semibold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" /> Ejecutar
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditQuery(query)}
                      className="p-1.5 rounded-lg bg-white border border-[#E7DDD4] text-[#7A6E65] hover:text-[#4B4038] hover:border-[#D8C7B8] transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => duplicateMarketQuery(query.id)}
                      className="p-1.5 rounded-lg bg-white border border-[#E7DDD4] text-[#7A6E65] hover:text-[#4B4038] hover:border-[#D8C7B8] transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteMarketQuery(query.id)}
                      className="p-1.5 rounded-lg bg-white border border-[#E7DDD4] text-[#8B3A30] hover:bg-[#F9ECEB] transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 5. METRIC CARDS & COMPARATIVA DIRECTA BENCHMARKS */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FBF8F4] p-5 rounded-3xl border border-[#E7DDD4] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#7A6E65]">Competitividad General</span>
          <div className="text-2xl font-serif font-bold text-[#3D5442] mt-2 flex items-center gap-2">
            {competitiveCount} Alineados <CheckCircle2 className="w-5 h-5 text-[#7D9882]" />
          </div>
          <p className="text-xs text-[#7A6E65] mt-1">Precios situados en el rango medio-alto de perfumería</p>
        </div>

        <div className="bg-[#FBF8F4] p-5 rounded-3xl border border-[#E7DDD4] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#7A6E65]">Oportunidad de Captura ARS</span>
          <div className="text-2xl font-serif font-bold text-[#D6A36D] mt-2 flex items-center gap-2">
            {opportunitiesCount} Oportunidad(es) <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#7A6E65] mt-1">Brecha positiva contra el promedio de competidores</p>
        </div>

        <div className="bg-[#FBF8F4] p-5 rounded-3xl border border-[#E7DDD4] flex flex-col justify-between">
          <span className="text-xs font-medium text-[#7A6E65]">Margen Comercial Promedio</span>
          <div className="text-2xl font-serif font-bold text-[#C98F7A] mt-2">
            ~64.5% ARS
          </div>
          <p className="text-xs text-[#7A6E65] mt-1">Calculado sobre costo de materias primas e insumos</p>
        </div>
      </div>

      {/* Filter and Benchmark List */}
      <div className="bg-[#FBF8F4] rounded-3xl p-6 border border-[#E7DDD4] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7DDD4]">
          <h2 className="font-serif font-bold text-lg text-[#4B4038] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#C98F7A]" /> Comparativa Directa de Precios ARS
          </h2>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-[#7A6E65]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-[#E7DDD4] rounded-xl px-3 py-1.5 text-xs text-[#4B4038] focus:outline-none"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Velas Botánicas">Velas Botánicas</option>
              <option value="Difusores de Ambiente">Difusores de Ambiente</option>
              <option value="Perfumes Finos">Perfumes Finos</option>
              <option value="Cosmética Natural">Cosmética Natural</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBenchmarks.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E7DDD4] flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#D8C7B8] transition-all"
            >
              <div className="space-y-1.5 lg:w-1/3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-[#4B4038]">{item.productName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Oportunidad Aumento'
                        ? 'bg-[#FAF3E8] text-[#7A5222] border border-[#D6A36D]/30'
                        : item.status === 'Competitivo'
                        ? 'bg-[#EAF0EB] text-[#3D5442] border border-[#7D9882]/30'
                        : 'bg-[#F9ECEB] text-[#8B3A30] border border-[#C98F7A]/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[#7A6E65]">
                  Categoría: <strong className="text-[#4B4038]">{item.category}</strong> • Actualizado: {item.lastUpdated}
                </p>
                <div className="text-[11px] text-[#7A6E65]">
                  Margen Estimado Kamelo: <strong className="text-[#C98F7A]">{item.kameloMarginPercent}%</strong>
                </div>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs lg:w-1/2">
                <div className="bg-white p-3 rounded-xl border border-[#E7DDD4]">
                  <span className="text-[#7A6E65] text-[10px] uppercase font-bold block">Precio Kamelo</span>
                  <span className="text-sm font-serif font-bold text-[#C98F7A]">
                    ${item.kameloPriceARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E7DDD4]">
                  <span className="text-[#7A6E65] text-[10px] uppercase font-bold block">Prom. Mercado</span>
                  <span className="text-sm font-serif font-bold text-[#4B4038]">
                    ${item.competitorAverageARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E7DDD4]">
                  <span className="text-[#7A6E65] text-[10px] uppercase font-bold block">Mín. Mercado</span>
                  <span className="text-sm font-semibold text-[#7A6E65]">
                    ${item.competitorMinARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E7DDD4]">
                  <span className="text-[#7A6E65] text-[10px] uppercase font-bold block">Máx. Mercado</span>
                  <span className="text-sm font-semibold text-[#7A6E65]">
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
                    className="w-full px-3.5 py-2.5 bg-[#D6A36D] hover:bg-[#c5935d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Ajustar a Mercado
                  </button>
                ) : (
                  <span className="text-xs text-[#3D5442] font-bold bg-[#EAF0EB] px-3 py-1.5 rounded-xl border border-[#7D9882]/30">
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
