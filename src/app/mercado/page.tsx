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
  Info,
  Copy,
  Trash2,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { MarketBenchmark, MarketQuery } from '@/types';
import SectionHero from '@/components/SectionHero';

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
  const [selectedZone, setSelectedZone] = useState<string>('Palermo / CABA');
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'Mercado Libre',
    'Tiendas Online',
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
      showToast('Por favor seleccioná al menos una pieza, materia prima o ingresá un término.', 'warning');
      return;
    }

    setIsRunningSimulation(true);
    setTimeout(() => {
      runMarketQueries();
      setIsRunningSimulation(false);

      const itemsCount =
        selectedProducts.length + selectedSupplies.length + (freeText.trim() ? 1 : 0);
      setLastSimulationSummary(
        `Relevamiento procesado con éxito para ${itemsCount} elemento(s) en ${selectedZone}.`
      );
    }, 800);
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
    <div className="space-y-10 animate-in fade-in pb-12">
      {/* Header Banner */}
      <SectionHero
        title="Observatorio de Mercado & Benchmarking ARS"
        subtitle="Monitoreo de precios de referencia, materias primas botánicas y posicionamiento competitivo en perfumería de autor en Argentina."
        badgeText="MEJUNJE · OBSERVATORIO"
        badgeIcon={<TrendingUp className="w-3.5 h-3.5 text-mejunje-salvia" />}
        bgImage="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1600&q=80"
        noticeText="posicionamiento de atelier · márgenes saludables"
      >
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-mejunje-border text-xs shrink-0 shadow-xs">
          <Info className="w-4 h-4 text-mejunje-salvia shrink-0" />
          <span className="text-mejunje-tinta font-typewriter text-[10px] tracking-wider uppercase">
            Relevamiento activo · ARS
          </span>
        </div>
      </SectionHero>

      {/* --------------------------------------------------------------------- */}
      {/* 1. BLOQUE NUEVA CONSULTA DE MERCADO */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-mejunje-border shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-mejunje-border">
          <div>
            <h2 className="font-serif italic text-2xl text-mejunje-tinta flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-mejunje-salvia" />
              {editingQueryId ? 'Editar Consulta de Observatorio' : 'Nueva Consulta de Observatorio'}
            </h2>
            <p className="text-xs text-mejunje-griscalido mt-0.5 font-sans">
              Seleccioná las piezas del atelier o materias primas que deseás relevar, o ingresá una búsqueda libre.
            </p>
          </div>

          {editingQueryId && (
            <button
              onClick={handleResetForm}
              className="text-xs text-mejunje-salviaoscura hover:underline flex items-center gap-1 font-medium font-sans"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT & CENTER COLS: Selection Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3.1 SELECCIÓN DESDE PRODUCTOS */}
            <div className="space-y-3 bg-mejunje-papel/30 p-5 rounded-2xl border border-mejunje-border">
              <div className="flex items-center justify-between">
                <h3 className="font-typewriter text-xs font-bold uppercase tracking-wider text-mejunje-tinta flex items-center gap-2">
                  <Package className="w-4 h-4 text-mejunje-salvia" /> Piezas Mejunje
                </h3>

                <div className="flex items-center gap-2 text-[11px] font-sans">
                  <button
                    type="button"
                    onClick={handleSelectAllProducts}
                    className="text-mejunje-salviaoscura font-medium hover:underline"
                  >
                    Seleccionar todas
                  </button>
                  <span className="text-mejunje-arena">·</span>
                  <button
                    type="button"
                    onClick={handleClearProducts}
                    className="text-mejunje-griscalido hover:underline"
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
                          ? 'bg-white border-mejunje-salvia shadow-xs'
                          : 'bg-white/60 border-mejunje-border hover:border-mejunje-arena'
                      }`}
                    >
                      <div className="mt-0.5 text-mejunje-salvia">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-mejunje-salvia/20" />
                        ) : (
                          <Square className="w-4 h-4 text-mejunje-arena" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 font-sans">
                        <div className="font-semibold text-mejunje-tinta truncate">
                          {product.name}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-mejunje-papel text-mejunje-tinta font-typewriter text-[9px] uppercase">
                            {product.category}
                          </span>
                          {firstVariant?.size && (
                            <span className="px-2 py-0.5 rounded-md bg-mejunje-salvia/15 text-mejunje-salviaoscura text-[10px] font-medium font-sans">
                              {firstVariant.size}
                            </span>
                          )}
                          {firstVariant?.aroma && (
                            <span className="px-2 py-0.5 rounded-md bg-mejunje-arena/30 text-mejunje-tinta text-[10px]">
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
            <div className="space-y-3 bg-mejunje-papel/30 p-5 rounded-2xl border border-mejunje-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-typewriter text-xs font-bold uppercase tracking-wider text-mejunje-tinta flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-mejunje-salvia" /> Materias Primas & Insumos
                </h3>

                {/* Quick Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-mejunje-griscalido absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={supplySearchTerm}
                    onChange={(e) => setSupplySearchTerm(e.target.value)}
                    placeholder="Buscar insumo..."
                    className="pl-8 pr-3 py-1 bg-white border border-mejunje-border rounded-lg text-xs text-mejunje-tinta focus:outline-none focus:border-mejunje-salvia w-full sm:w-44"
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
                          ? 'bg-white border-mejunje-salvia shadow-xs'
                          : 'bg-white/60 border-mejunje-border hover:border-mejunje-arena'
                      }`}
                    >
                      <div className="text-mejunje-salvia">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 fill-mejunje-salvia/20" />
                        ) : (
                          <Square className="w-4 h-4 text-mejunje-arena" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 font-sans">
                        <div className="font-medium text-mejunje-tinta truncate">{ing.name}</div>
                        <div className="text-[10px] text-mejunje-griscalido">
                          Cat: {ing.category} · Costo: ${ing.purchasePriceARS.toLocaleString('es-AR')} ARS
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3.3 TEXTO LIBRE */}
            <div className="space-y-2 bg-mejunje-papel/30 p-5 rounded-2xl border border-mejunje-border">
              <label className="font-typewriter text-xs font-bold uppercase tracking-wider text-mejunje-tinta block">
                Búsqueda Abierta de Mercado
              </label>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={3}
                placeholder={`Ejemplos:
- velas de cera de soja aromáticas frasco ámbar
- difusores de varillas ratán palermo
- esencias aromáticas para perfumería por mayor
- packaging botánico y cajas kraft`}
                className="w-full bg-white border border-mejunje-border rounded-xl p-3 text-xs text-mejunje-tinta focus:outline-none focus:border-mejunje-salvia leading-relaxed"
              />
              <p className="text-[11px] text-mejunje-griscalido font-sans">
                Podés ingresar consultas libres adicionales para monitorear tendencias y nuevos competidores.
              </p>
            </div>

            {/* 3.4 UBICACIÓN Y FUENTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ubicación */}
              <div className="bg-mejunje-papel/30 p-4 rounded-2xl border border-mejunje-border space-y-2">
                <label className="font-typewriter text-xs font-bold uppercase tracking-wider text-mejunje-tinta flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-mejunje-salvia" /> Zona de Estudio
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-white border border-mejunje-border rounded-xl px-3 py-2 text-xs text-mejunje-tinta focus:outline-none"
                >
                  <option value="Palermo / CABA">Palermo / CABA</option>
                  <option value="Zona Norte GBA">Zona Norte GBA</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Argentina">Argentina Nacional</option>
                </select>
              </div>

              {/* Fuentes */}
              <div className="bg-mejunje-papel/30 p-4 rounded-2xl border border-mejunje-border space-y-2">
                <label className="font-typewriter text-xs font-bold uppercase tracking-wider text-mejunje-tinta flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" /> Canales de Relevamiento
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Mercado Libre', 'Tiendas Online', 'Ateliers de Autor', 'Ferias de Diseño'].map((source) => {
                    const isChecked = selectedSources.includes(source);
                    return (
                      <button
                        type="button"
                        key={source}
                        onClick={() => handleToggleSource(source)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] border text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-white border-emerald-600 text-mejunje-tinta font-semibold shadow-xs'
                            : 'bg-white/60 border-mejunje-border text-mejunje-griscalido'
                        }`}
                      >
                        <span className="truncate">{source}</span>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: RESUMEN DE CONSULTA & ACCIONES */}
          <div className="bg-mejunje-papel/40 p-6 rounded-3xl border border-mejunje-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif italic text-lg text-mejunje-tinta border-b border-mejunje-border pb-2">
                Alcance del Relevamiento:
              </h3>

              <div className="space-y-3 text-xs">
                {/* Selected Products */}
                <div>
                  <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-griscalido block">
                    Piezas Seleccionadas ({selectedProducts.length})
                  </span>
                  {selectedProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProducts.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded-md bg-mejunje-salvia/15 text-mejunje-salviaoscura font-medium text-[11px]"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-mejunje-griscalido italic text-[11px]">Ningún producto seleccionado</span>
                  )}
                </div>

                {/* Selected Supplies */}
                <div>
                  <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-griscalido block">
                    Materias Primas ({selectedSupplies.length})
                  </span>
                  {selectedSupplies.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSupplies.map((ing) => (
                        <span
                          key={ing.id}
                          className="px-2 py-0.5 rounded-md bg-mejunje-salvia/10 text-mejunje-tinta font-medium text-[11px]"
                        >
                          {ing.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-mejunje-griscalido italic text-[11px]">Ningún insumo</span>
                  )}
                </div>

                {/* Free Text */}
                <div>
                  <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-griscalido block">
                    Búsqueda Abierta
                  </span>
                  {freeText.trim() ? (
                    <p className="bg-white p-2 rounded-lg border border-mejunje-border text-mejunje-tinta text-[11px] italic mt-1 font-sans">
                      "{freeText.trim()}"
                    </p>
                  ) : (
                    <span className="text-mejunje-griscalido italic text-[11px]">Sin texto libre</span>
                  )}
                </div>

                {/* Location */}
                <div>
                  <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-griscalido block">
                    Zona
                  </span>
                  <span className="font-semibold text-mejunje-tinta">{selectedZone}</span>
                </div>

                {/* Sources */}
                <div>
                  <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-griscalido block">
                    Canales
                  </span>
                  <span className="text-mejunje-tinta">
                    {selectedSources.length > 0 ? selectedSources.join(', ') : 'Todos'}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-mejunje-border">
              <button
                type="button"
                onClick={handleExecuteCurrentQuery}
                disabled={isRunningSimulation}
                className="w-full py-3 bg-mejunje-salvia hover:bg-mejunje-salviaoscura text-white text-xs font-medium rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-60"
              >
                <Play className="w-4 h-4 fill-white" />
                {isRunningSimulation ? 'Consultando...' : 'Relevar Precios de Mercado'}
              </button>

              {/* SAVE QUERY BLOCK */}
              <form onSubmit={handleSaveQuery} className="space-y-2 pt-2 border-t border-mejunje-border">
                <label className="font-typewriter text-[10px] uppercase text-mejunje-tinta block">
                  Guardar en Archivo de Observatorio
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="Ej: Benchmark velas Palermo Soho"
                    className="flex-1 bg-white border border-mejunje-border rounded-xl px-2.5 py-1.5 text-xs text-mejunje-tinta focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-mejunje-salviaoscura hover:bg-mejunje-tinta text-white text-xs font-medium rounded-xl flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                </div>
              </form>

              {lastSimulationSummary && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200 flex items-center gap-1.5 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-mejunje-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-mejunje-border">
          <h2 className="font-serif italic text-xl text-mejunje-tinta flex items-center gap-2">
            <Save className="w-5 h-5 text-mejunje-salvia" /> Consultas Guardadas
          </h2>
          <span className="text-xs text-mejunje-griscalido font-typewriter">
            {marketQueries.length} consultas en archivo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketQueries.map((query) => {
            const hasProducts = query.selectedProducts && query.selectedProducts.length > 0;
            const hasSupplies = query.selectedSupplies && query.selectedSupplies.length > 0;

            return (
              <div
                key={query.id}
                className="p-5 rounded-2xl bg-mejunje-papel/30 border border-mejunje-border space-y-3 hover:border-mejunje-salvia transition-all flex flex-col justify-between"
              >
                <div className="space-y-2 font-sans">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif italic text-base text-mejunje-tinta">
                      {query.name}
                    </h3>

                    <button
                      onClick={() => toggleMarketQueryStatus(query.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                        query.status === 'Activo'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-mejunje-papel text-mejunje-griscalido border border-mejunje-border'
                      }`}
                    >
                      {query.status}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-mejunje-griscalido">
                    {hasProducts && (
                      <div>
                        <strong className="text-mejunje-tinta">Piezas:</strong>{' '}
                        {query.selectedProducts?.join(', ')}
                      </div>
                    )}

                    {hasSupplies && (
                      <div>
                        <strong className="text-mejunje-tinta">Materias Primas:</strong>{' '}
                        {query.selectedSupplies?.join(', ')}
                      </div>
                    )}

                    {query.freeText && (
                      <div>
                        <strong className="text-mejunje-tinta">Búsqueda libre:</strong> "{query.freeText}"
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 text-mejunje-griscalido">
                      <span>Zona: <strong className="text-mejunje-tinta">{query.zone || 'N/A'}</strong></span>
                      <span>Canales: <strong className="text-mejunje-tinta">{query.sources?.join(', ') || query.source || 'Varios'}</strong></span>
                    </div>

                    <div className="text-[10px] text-mejunje-griscalido/80 font-typewriter pt-1">
                      Último relevamiento: {query.lastRun || 'Pendiente'}
                    </div>
                  </div>
                </div>

                {/* Actions: Ejecutar, Editar, Duplicar, Eliminar */}
                <div className="flex items-center justify-between pt-3 border-t border-mejunje-border text-xs gap-2">
                  <button
                    onClick={() => handleRunSavedQuery(query)}
                    className="px-3 py-1.5 bg-mejunje-salvia hover:bg-mejunje-salviaoscura text-white rounded-xl font-medium text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-white" /> Ejecutar
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditQuery(query)}
                      className="p-1.5 rounded-lg bg-white border border-mejunje-border text-mejunje-griscalido hover:text-mejunje-tinta transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => duplicateMarketQuery(query.id)}
                      className="p-1.5 rounded-lg bg-white border border-mejunje-border text-mejunje-griscalido hover:text-mejunje-tinta transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteMarketQuery(query.id)}
                      className="p-1.5 rounded-lg bg-white border border-mejunje-border text-rose-700 hover:bg-rose-50 transition-colors"
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
        <div className="bg-white p-5 rounded-3xl border border-mejunje-border shadow-xs flex flex-col justify-between">
          <span className="font-typewriter text-[10px] uppercase text-mejunje-griscalido">Competitividad General</span>
          <div className="text-2xl font-serif italic text-emerald-800 mt-2 flex items-center gap-2 font-semibold">
            {competitiveCount} Alineados <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs text-mejunje-griscalido mt-1 font-sans">Precios situados en el rango medio-alto de perfumería artesanal</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-mejunje-border shadow-xs flex flex-col justify-between">
          <span className="font-typewriter text-[10px] uppercase text-mejunje-griscalido">Oportunidad de Captura ARS</span>
          <div className="text-2xl font-serif italic text-mejunje-salviaoscura mt-2 flex items-center gap-2 font-semibold">
            {opportunitiesCount} Oportunidad(es) <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-xs text-mejunje-griscalido mt-1 font-sans">Brecha positiva contra el promedio de marcas similares</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-mejunje-border shadow-xs flex flex-col justify-between">
          <span className="font-typewriter text-[10px] uppercase text-mejunje-griscalido">Margen Comercial Promedio</span>
          <div className="text-2xl font-serif italic text-mejunje-salviaoscura mt-2 font-semibold">
            ~64.5% ARS
          </div>
          <p className="text-xs text-mejunje-griscalido mt-1 font-sans">Calculado sobre materias primas e insumos directos</p>
        </div>
      </div>

      {/* Filter and Benchmark List */}
      <div className="bg-white rounded-3xl p-6 border border-mejunje-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-mejunje-border">
          <h2 className="font-serif italic text-xl text-mejunje-tinta flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-mejunje-salvia" /> Comparativa Directa de Precios ARS
          </h2>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-mejunje-griscalido" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-mejunje-border rounded-xl px-3 py-1.5 text-xs text-mejunje-tinta focus:outline-none"
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
              className="p-5 rounded-2xl bg-mejunje-papel/30 border border-mejunje-border flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-mejunje-salvia transition-all"
            >
              <div className="space-y-1.5 lg:w-1/3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif italic text-base text-mejunje-tinta">{item.productName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                      item.status === 'Oportunidad Aumento'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : item.status === 'Competitivo'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-mejunje-griscalido font-sans">
                  Categoría: <strong className="text-mejunje-tinta">{item.category}</strong> · Actualizado: {item.lastUpdated}
                </p>
                <div className="text-[11px] text-mejunje-griscalido font-sans">
                  Margen Estimado Mejunje: <strong className="text-mejunje-salviaoscura font-semibold">{item.kameloMarginPercent}%</strong>
                </div>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs lg:w-1/2">
                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-griscalido text-[9px] uppercase font-typewriter block">Precio Mejunje</span>
                  <span className="text-sm font-serif italic font-semibold text-mejunje-salviaoscura">
                    ${item.kameloPriceARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-griscalido text-[9px] uppercase font-typewriter block">Prom. Mercado</span>
                  <span className="text-sm font-serif italic font-semibold text-mejunje-tinta">
                    ${item.competitorAverageARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-griscalido text-[9px] uppercase font-typewriter block">Mín. Mercado</span>
                  <span className="text-sm font-sans font-medium text-mejunje-griscalido">
                    ${item.competitorMinARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-mejunje-border">
                  <span className="text-mejunje-griscalido text-[9px] uppercase font-typewriter block">Máx. Mercado</span>
                  <span className="text-sm font-sans font-medium text-mejunje-griscalido">
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
                    className="w-full px-3.5 py-2.5 bg-mejunje-salviaoscura hover:bg-mejunje-tinta text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Ajustar a Mercado
                  </button>
                ) : (
                  <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
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
