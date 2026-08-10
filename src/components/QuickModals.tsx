'use client';

import React, { useState } from 'react';
import { useKamelo } from '@/context/KameloContext';
import { X, Plus, Trash2, Sparkles, Building2, ShoppingBag, FlaskConical, TrendingUp, Package } from 'lucide-react';

export default function QuickModals() {
  const {
    activeModal,
    setActiveModal,
    addFormula,
    addProduct,
    addPurchaseOrder,
    addSupplier,
    addMarketQuery,
    ingredients,
    suppliers,
    catalogProducts,
    showToast,
  } = useKamelo();

  // ---------------------------------------------------------------------------
  // 1. CREAR FÓRMULA STATE
  // ---------------------------------------------------------------------------
  const [formulaForm, setFormulaForm] = useState({
    name: '',
    category: 'Vela' as 'Vela' | 'Difusor' | 'Perfume textil' | 'Otro',
    associatedProductId: '',
    yieldSize: '200 g',
    batchSizeGrams: 2000,
    status: 'Borrador' as 'Borrador' | 'En prueba' | 'Aprobada' | 'Archivada',
    version: 'v1',
    notes: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    ingredients: [
      { ingredientId: '', quantity: 180, percentage: 90, unit: 'g' },
      { ingredientId: '', quantity: 20, percentage: 10, unit: 'ml' },
    ],
  });

  // ---------------------------------------------------------------------------
  // 2. CREAR PRODUCTO STATE
  // ---------------------------------------------------------------------------
  const [productForm, setProductForm] = useState({
    name: '',
    sku: `KAM-PROD-${Math.floor(100 + Math.random() * 900)}`,
    category: 'Velas Botánicas' as 'Velas Botánicas' | 'Difusores de Ambiente' | 'Perfumes Finos' | 'Cosmética Natural',
    shortDescription: '',
    description: '',
    collection: 'Colección Botánica Tierra',
    fragranceFamily: 'Amaderada Cálida',
    status: 'Activo' as 'Borrador' | 'Activo' | 'Inactivo',
    variantSize: '200 g',
    variantPrice: 18500,
    variantCost: 5800,
    imageUrl: '',
  });

  // ---------------------------------------------------------------------------
  // 3. CREAR ORDEN DE COMPRA STATE
  // ---------------------------------------------------------------------------
  const [poForm, setPoForm] = useState({
    supplierId: suppliers[0]?.id || '',
    date: new Date().toLocaleDateString('es-AR'),
    items: [{ ingredientName: '', requiredQty: 1, unit: 'kg', unitPriceARS: 10000, subtotalARS: 10000 }],
    observations: '',
  });

  // ---------------------------------------------------------------------------
  // 4. CREAR PROVEEDOR STATE
  // ---------------------------------------------------------------------------
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phoneWhatsApp: '',
    email: '',
    web: '',
    location: '',
    minPurchaseARS: 150000,
    deliveryTimeDays: 3,
    categoriesSupplied: ['Fragancias'],
    notes: '',
  });

  // ---------------------------------------------------------------------------
  // 5. CONSULTAR MERCADO STATE
  // ---------------------------------------------------------------------------
  const [marketQueryForm, setMarketQueryForm] = useState({
    name: '',
    category: 'Vela',
    keywords: '',
    zone: 'CABA' as 'CABA' | 'Zona Norte' | 'Buenos Aires' | 'Argentina',
    source: 'Mercado Libre' as 'Mercado Libre' | 'Ecommerce' | 'Marca concreta' | 'Otra',
  });

  if (!activeModal) return null;

  // Handlers for Formula
  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaForm.name.trim()) {
      showToast('Por favor ingrese el nombre de la fórmula.', 'warning');
      return;
    }

    const compiledIngs = formulaForm.ingredients.map((item) => {
      const ingObj = ingredients.find((i) => i.id === item.ingredientId);
      const name = ingObj ? ingObj.name : 'Insumo Base';
      const unitCost = ingObj ? ingObj.unitCostARS : 10;
      const cat = ingObj ? ingObj.category : 'Otros';
      const calcCost = item.quantity * unitCost;

      return {
        ingredientId: item.ingredientId,
        ingredientName: name,
        category: cat,
        quantity: Number(item.quantity),
        unit: item.unit,
        percentage: Number(item.percentage),
        unitCostARS: unitCost,
        supplierId: ingObj?.supplierId,
        supplierName: ingObj?.supplierName,
        calculatedCostARS: calcCost,
      };
    });

    const assocProd = catalogProducts.find((p) => p.id === formulaForm.associatedProductId);

    addFormula({
      name: formulaForm.name,
      category: formulaForm.category,
      associatedProductId: formulaForm.associatedProductId || undefined,
      associatedProductName: assocProd ? assocProd.name : undefined,
      yieldSize: formulaForm.yieldSize,
      batchSizeGrams: Number(formulaForm.batchSizeGrams),
      status: formulaForm.status,
      version: formulaForm.version,
      notes: formulaForm.notes,
      topNotes: formulaForm.topNotes ? formulaForm.topNotes.split(',').map((s) => s.trim()) : [],
      heartNotes: formulaForm.heartNotes ? formulaForm.heartNotes.split(',').map((s) => s.trim()) : [],
      baseNotes: formulaForm.baseNotes ? formulaForm.baseNotes.split(',').map((s) => s.trim()) : [],
      suggestedMarginPercent: 65,
      ingredients: compiledIngs,
    });

    setActiveModal(null);
  };

  // Handlers for Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Por favor ingrese el nombre del producto.', 'warning');
      return;
    }

    const defaultCategoryImages: Record<string, string> = {
      'Velas Botánicas': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
      'Difusores de Ambiente': 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=80',
      'Perfumes Finos': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80',
      'Cosmética Natural': 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1000&q=80',
    };

    const finalImg = productForm.imageUrl.trim() || defaultCategoryImages[productForm.category] || defaultCategoryImages['Velas Botánicas'];

    addProduct({
      sku: productForm.sku,
      name: productForm.name,
      category: productForm.category,
      shortDescription: productForm.shortDescription || 'Producto artesanal Kamelo Aromáticos.',
      description: productForm.description || 'Elaborado con insumos puros de alta persistencia olfativa.',
      collection: productForm.collection,
      fragranceFamily: productForm.fragranceFamily,
      status: productForm.status,
      imageUrl: finalImg,
      images: [finalImg],
      variants: [
        {
          id: `var-${Date.now()}`,
          sku: `${productForm.sku}-VAR1`,
          size: productForm.variantSize,
          unit: 'unid',
          aroma: productForm.name,
          salePriceARS: Number(productForm.variantPrice),
          estimatedCostARS: Number(productForm.variantCost),
          status: 'Activo',
        },
      ],
    });

    setActiveModal(null);
  };

  // Handlers for PO
  const handleSavePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === poForm.supplierId) || suppliers[0];
    if (!sup) {
      showToast('Seleccione un proveedor válido.', 'warning');
      return;
    }

    const itemsCalculated = poForm.items.map((item, idx) => ({
      id: `poi-${idx}-${Date.now()}`,
      ingredientName: item.ingredientName || 'Insumo Variado',
      requiredQty: Number(item.requiredQty),
      unit: item.unit,
      unitPriceARS: Number(item.unitPriceARS),
      subtotalARS: Number(item.requiredQty) * Number(item.unitPriceARS),
    }));

    const subtotal = itemsCalculated.reduce((acc, i) => acc + i.subtotalARS, 0);

    addPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      date: poForm.date,
      items: itemsCalculated,
      subtotalARS: subtotal,
      totalARS: subtotal,
      status: 'Solicitada',
      observations: poForm.observations,
    });

    setActiveModal(null);
  };

  // Handlers for Supplier
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) {
      showToast('Por favor ingrese el nombre del proveedor.', 'warning');
      return;
    }

    addSupplier({
      name: supplierForm.name,
      contactPerson: supplierForm.contactPerson || 'Contacto Ventas',
      phoneWhatsApp: supplierForm.phoneWhatsApp || '+5491100000000',
      email: supplierForm.email,
      web: supplierForm.web,
      location: supplierForm.location,
      categoriesSupplied: supplierForm.categoriesSupplied,
      minPurchaseARS: Number(supplierForm.minPurchaseARS),
      deliveryTimeDays: Number(supplierForm.deliveryTimeDays),
      notes: supplierForm.notes,
    });

    setActiveModal(null);
  };

  // Handlers for Market Query
  const handleSaveMarketQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketQueryForm.name.trim()) {
      showToast('Ingrese el título de la consulta.', 'warning');
      return;
    }

    addMarketQuery({
      name: marketQueryForm.name,
      category: marketQueryForm.category,
      keywords: marketQueryForm.keywords || marketQueryForm.name,
      zone: marketQueryForm.zone,
      source: marketQueryForm.source,
      status: 'Activo',
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#3E342F] text-[#FBF8F4] border border-[#C98F7A]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative my-8">
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 text-[#D8C7B8]/70 hover:text-white p-1.5 rounded-full bg-[#4B4038] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ------------------------------------------------------------------- */}
        {/* MODAL 1: CREAR FÓRMULA */}
        {/* ------------------------------------------------------------------- */}
        {activeModal === 'formula' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3D2C22]">
              <div className="w-10 h-10 rounded-2xl bg-[#C86D51]/20 border border-[#C86D51]/40 flex items-center justify-center text-[#C86D51]">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-[#F7F4EE]">Crear Nueva Fórmula</h2>
                <p className="text-xs text-[#E6DFC8]/70">Laboratorio & Especificación Perfumística</p>
              </div>
            </div>

            <form onSubmit={handleSaveFormula} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Nombre de la Fórmula *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Vela Botánica Ámbar & Canela 200g"
                    value={formulaForm.name}
                    onChange={(e) => setFormulaForm({ ...formulaForm, name: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Categoría</label>
                  <select
                    value={formulaForm.category}
                    onChange={(e) => setFormulaForm({ ...formulaForm, category: e.target.value as any })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  >
                    <option value="Vela">Vela de Soja</option>
                    <option value="Difusor">Difusor de Ambiente</option>
                    <option value="Perfume textil">Perfume Textil</option>
                    <option value="Otro">Otro / Cosmética</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Rendimiento / Tamaño Unitario</label>
                  <input
                    type="text"
                    placeholder="Ej. 200 g o 250 ml"
                    value={formulaForm.yieldSize}
                    onChange={(e) => setFormulaForm({ ...formulaForm, yieldSize: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Tamaño de Batch Base (gramos/ml)</label>
                  <input
                    type="number"
                    value={formulaForm.batchSizeGrams}
                    onChange={(e) => setFormulaForm({ ...formulaForm, batchSizeGrams: Number(e.target.value) })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Vincular a Producto de Catálogo (Opcional)</label>
                <select
                  value={formulaForm.associatedProductId}
                  onChange={(e) => setFormulaForm({ ...formulaForm, associatedProductId: e.target.value })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                >
                  <option value="">-- Sin producto vinculado por el momento --</option>
                  {catalogProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              {/* Dynamic Ingredients */}
              <div className="bg-[#3D2C22]/50 p-4 rounded-2xl border border-[#523B2E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F4EE]">Composición & Insumos</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormulaForm({
                        ...formulaForm,
                        ingredients: [...formulaForm.ingredients, { ingredientId: '', quantity: 100, percentage: 5, unit: 'g' }],
                      })
                    }
                    className="text-[11px] text-[#D9822B] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Insumo
                  </button>
                </div>

                {formulaForm.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={ing.ingredientId}
                      onChange={(e) => {
                        const next = [...formulaForm.ingredients];
                        next[idx].ingredientId = e.target.value;
                        setFormulaForm({ ...formulaForm, ingredients: next });
                      }}
                      className="flex-1 bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="">-- Seleccionar Insumo --</option>
                      {ingredients.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.category}) - ${i.unitCostARS}/u
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Cant"
                      value={ing.quantity}
                      onChange={(e) => {
                        const next = [...formulaForm.ingredients];
                        next[idx].quantity = Number(e.target.value);
                        setFormulaForm({ ...formulaForm, ingredients: next });
                      }}
                      className="w-20 bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />

                    <input
                      type="text"
                      placeholder="Unid"
                      value={ing.unit}
                      onChange={(e) => {
                        const next = [...formulaForm.ingredients];
                        next[idx].unit = e.target.value;
                        setFormulaForm({ ...formulaForm, ingredients: next });
                      }}
                      className="w-16 bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const next = formulaForm.ingredients.filter((_, i) => i !== idx);
                        setFormulaForm({ ...formulaForm, ingredients: next });
                      }}
                      className="text-[#C86D51] hover:text-white p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Notas Aromáticas (Salida, Corazón, Fondo)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Salida (ej. Bergamota)"
                    value={formulaForm.topNotes}
                    onChange={(e) => setFormulaForm({ ...formulaForm, topNotes: e.target.value })}
                    className="bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Corazón (ej. Rosa)"
                    value={formulaForm.heartNotes}
                    onChange={(e) => setFormulaForm({ ...formulaForm, heartNotes: e.target.value })}
                    className="bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Fondo (ej. Ámbar)"
                    value={formulaForm.baseNotes}
                    onChange={(e) => setFormulaForm({ ...formulaForm, baseNotes: e.target.value })}
                    className="bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3D2C22]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#E6DFC8] bg-[#3D2C22] hover:bg-[#523B2E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#C86D51] hover:bg-[#a85239] shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Guardar Fórmula
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODAL 2: CREAR PRODUCTO */}
        {/* ------------------------------------------------------------------- */}
        {activeModal === 'product' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3D2C22]">
              <div className="w-10 h-10 rounded-2xl bg-[#D9822B]/20 border border-[#D9822B]/40 flex items-center justify-center text-[#D9822B]">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-[#F7F4EE]">Crear Nuevo Producto</h2>
                <p className="text-xs text-[#E6DFC8]/70">Alta de Catálogo & Variantes Comerciales</p>
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Vela Soja Canela & Naranja"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">SKU Base</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Categoría</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                  >
                    <option value="Velas Botánicas">Velas Botánicas</option>
                    <option value="Difusores de Ambiente">Difusores de Ambiente</option>
                    <option value="Perfumes Finos">Perfumes Finos</option>
                    <option value="Cosmética Natural">Cosmética Natural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Colección</label>
                  <input
                    type="text"
                    value={productForm.collection}
                    onChange={(e) => setProductForm({ ...productForm, collection: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="Ej. Cera de soja 100% pura en vaso de cristal."
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">URL de Imagen del Producto (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (Dejar vacío para usar imagen automática)"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                />
              </div>

              <div className="bg-[#3D2C22]/50 p-4 rounded-2xl border border-[#523B2E] space-y-3">
                <span className="text-xs font-bold text-[#F7F4EE]">Variante Inicial</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#E6DFC8] mb-1">Tamaño / Presentación</label>
                    <input
                      type="text"
                      value={productForm.variantSize}
                      onChange={(e) => setProductForm({ ...productForm, variantSize: e.target.value })}
                      className="w-full bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#E6DFC8] mb-1">Precio Venta (ARS)</label>
                    <input
                      type="number"
                      value={productForm.variantPrice}
                      onChange={(e) => setProductForm({ ...productForm, variantPrice: Number(e.target.value) })}
                      className="w-full bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#E6DFC8] mb-1">Costo Estimado (ARS)</label>
                    <input
                      type="number"
                      value={productForm.variantCost}
                      onChange={(e) => setProductForm({ ...productForm, variantCost: Number(e.target.value) })}
                      className="w-full bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3D2C22]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#E6DFC8] bg-[#3D2C22] hover:bg-[#523B2E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#D9822B] hover:bg-[#b86a1d] shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Crear Producto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODAL 3: CREAR ORDEN DE COMPRA */}
        {/* ------------------------------------------------------------------- */}
        {activeModal === 'purchaseOrder' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3D2C22]">
              <div className="w-10 h-10 rounded-2xl bg-[#6E8B74]/20 border border-[#6E8B74]/40 flex items-center justify-center text-[#6E8B74]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-[#F7F4EE]">Nueva Orden de Compra</h2>
                <p className="text-xs text-[#E6DFC8]/70">Emisión de Pedido a Proveedor Registrado</p>
              </div>
            </div>

            <form onSubmit={handleSavePO} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Proveedor *</label>
                  <select
                    value={poForm.supplierId}
                    onChange={(e) => setPoForm({ ...poForm, supplierId: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6E8B74]"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Mínimo: ${s.minPurchaseARS.toLocaleString('es-AR')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Fecha Emisión</label>
                  <input
                    type="text"
                    value={poForm.date}
                    onChange={(e) => setPoForm({ ...poForm, date: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6E8B74]"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-[#3D2C22]/50 p-4 rounded-2xl border border-[#523B2E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F7F4EE]">Items de la Orden</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPoForm({
                        ...poForm,
                        items: [...poForm.items, { ingredientName: '', requiredQty: 1, unit: 'kg', unitPriceARS: 5000, subtotalARS: 5000 }],
                      })
                    }
                    className="text-[11px] text-[#6E8B74] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Item
                  </button>
                </div>

                {poForm.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Insumo o Item"
                      value={item.ingredientName}
                      onChange={(e) => {
                        const next = [...poForm.items];
                        next[idx].ingredientName = e.target.value;
                        setPoForm({ ...poForm, items: next });
                      }}
                      className="flex-1 bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />

                    <input
                      type="number"
                      placeholder="Cant"
                      value={item.requiredQty}
                      onChange={(e) => {
                        const next = [...poForm.items];
                        next[idx].requiredQty = Number(e.target.value);
                        setPoForm({ ...poForm, items: next });
                      }}
                      className="w-20 bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />

                    <input
                      type="number"
                      placeholder="Precio ARS"
                      value={item.unitPriceARS}
                      onChange={(e) => {
                        const next = [...poForm.items];
                        next[idx].unitPriceARS = Number(e.target.value);
                        setPoForm({ ...poForm, items: next });
                      }}
                      className="w-28 bg-[#2A1E17] border border-[#523B2E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const next = poForm.items.filter((_, i) => i !== idx);
                        setPoForm({ ...poForm, items: next });
                      }}
                      className="text-[#C86D51] hover:text-white p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Observaciones o Dirección de Entrega</label>
                <textarea
                  rows={2}
                  value={poForm.observations}
                  onChange={(e) => setPoForm({ ...poForm, observations: e.target.value })}
                  placeholder="Ej. Entregar en taller Villa Crespo. Pago con transferencia."
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6E8B74]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3D2C22]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#E6DFC8] bg-[#3D2C22] hover:bg-[#523B2E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#6E8B74] hover:bg-[#58725d] shadow-md flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" /> Emitir Orden
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODAL 4: CREAR PROVEEDOR */}
        {/* ------------------------------------------------------------------- */}
        {activeModal === 'supplier' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3D2C22]">
              <div className="w-10 h-10 rounded-2xl bg-[#E6DFC8]/20 border border-[#E6DFC8]/40 flex items-center justify-center text-[#E6DFC8]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-[#F7F4EE]">Nuevo Proveedor</h2>
                <p className="text-xs text-[#E6DFC8]/70">Alta de Aliado Comercial & Insumos</p>
              </div>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ceras & Botánica S.A."
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Contacto Principal</label>
                  <input
                    type="text"
                    placeholder="Ej. Esteban Lucero"
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">WhatsApp de Contacto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. +5491167772233"
                    value={supplierForm.phoneWhatsApp}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phoneWhatsApp: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="ventas@proveedor.com"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Compra Mínima (ARS)</label>
                  <input
                    type="number"
                    value={supplierForm.minPurchaseARS}
                    onChange={(e) => setSupplierForm({ ...supplierForm, minPurchaseARS: Number(e.target.value) })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Tiempo Entrega (Días)</label>
                  <input
                    type="number"
                    value={supplierForm.deliveryTimeDays}
                    onChange={(e) => setSupplierForm({ ...supplierForm, deliveryTimeDays: Number(e.target.value) })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Ubicación / Taller</label>
                <input
                  type="text"
                  placeholder="Ej. Villa Crespo, CABA"
                  value={supplierForm.location}
                  onChange={(e) => setSupplierForm({ ...supplierForm, location: e.target.value })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C86D51]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3D2C22]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#E6DFC8] bg-[#3D2C22] hover:bg-[#523B2E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#C86D51] hover:bg-[#a85239] shadow-md flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" /> Registrar Proveedor
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODAL 5: CONSULTAR MERCADO */}
        {/* ------------------------------------------------------------------- */}
        {activeModal === 'marketQuery' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3D2C22]">
              <div className="w-10 h-10 rounded-2xl bg-[#D9822B]/20 border border-[#D9822B]/40 flex items-center justify-center text-[#D9822B]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-[#F7F4EE]">Configurar Consulta de Mercado</h2>
                <p className="text-xs text-[#E6DFC8]/70">Rastreo de Precios & Competidores ARS</p>
              </div>
            </div>

            <form onSubmit={handleSaveMarketQuery} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Título de la Consulta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Vela Soja 200g - Benchmark CABA"
                  value={marketQueryForm.name}
                  onChange={(e) => setMarketQueryForm({ ...marketQueryForm, name: e.target.value })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Categoría</label>
                  <select
                    value={marketQueryForm.category}
                    onChange={(e) => setMarketQueryForm({ ...marketQueryForm, category: e.target.value })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                  >
                    <option value="Vela">Vela de Soja</option>
                    <option value="Difusor">Difusor de Ambiente</option>
                    <option value="Perfume textil">Perfume Textil</option>
                    <option value="Perfume">Perfumería Fina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Zona Geográfica</label>
                  <select
                    value={marketQueryForm.zone}
                    onChange={(e) => setMarketQueryForm({ ...marketQueryForm, zone: e.target.value as any })}
                    className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                  >
                    <option value="CABA">CABA</option>
                    <option value="Zona Norte">Zona Norte</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Argentina">Argentina Nacional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Palabras Clave de Búsqueda</label>
                <input
                  type="text"
                  placeholder="Ej. vela soja 200g artesanal premium"
                  value={marketQueryForm.keywords}
                  onChange={(e) => setMarketQueryForm({ ...marketQueryForm, keywords: e.target.value })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6DFC8] mb-1">Fuente de Relevamiento</label>
                <select
                  value={marketQueryForm.source}
                  onChange={(e) => setMarketQueryForm({ ...marketQueryForm, source: e.target.value as any })}
                  className="w-full bg-[#3D2C22] border border-[#523B2E] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D9822B]"
                >
                  <option value="Mercado Libre">Mercado Libre</option>
                  <option value="Ecommerce">Ecommerce Directos</option>
                  <option value="Marca concreta">Marca Concreta</option>
                  <option value="Otra">Otra Fuente</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#3D2C22]">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#E6DFC8] bg-[#3D2C22] hover:bg-[#523B2E]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#D9822B] hover:bg-[#b86a1d] shadow-md flex items-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" /> Guardar Consulta
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
