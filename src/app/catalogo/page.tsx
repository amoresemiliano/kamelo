'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  MessageCircle,
  Flower2,
  Plus,
  Trash2,
  Copy,
  SlidersHorizontal,
  Package,
  ExternalLink,
  Sparkles,
  Share2
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { CatalogProduct, ProductVariant } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function CatalogoPage() {
  const {
    catalogProducts,
    deleteProduct,
    duplicateProduct,
    setActiveModal,
    showToast,
  } = useKamelo();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [productToDelete, setProductToDelete] = useState<CatalogProduct | null>(null);

  // WhatsApp Share Modal State
  const [sharingProduct, setSharingProduct] = useState<CatalogProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const categories = ['Todos', 'Velas Botánicas', 'Difusores de Ambiente', 'Perfumes Finos', 'Cosmética Natural'];

  const filteredProducts = catalogProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.fragranceFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Generate WhatsApp Message
  const buildWhatsAppText = () => {
    if (!sharingProduct) return '';
    const variantInfo = selectedVariant ? `\n📦 *Presentación:* ${selectedVariant.size} ($${selectedVariant.salePriceARS.toLocaleString('es-AR')} ARS)` : '';
    const greeting = clientName ? `Hola *${clientName}*! ` : 'Hola! ';
    const displayPrice = selectedVariant ? selectedVariant.salePriceARS : (sharingProduct.variants?.[0]?.salePriceARS || 18500);

    return (
      `${greeting}Te comparto la ficha comercial de *Kamelo Aromáticos* ✨\n\n` +
      `🌸 *${sharingProduct.name}*\n` +
      `📌 *Categoría:* ${sharingProduct.category}\n` +
      `🏺 *Familia Olfativa:* ${sharingProduct.fragranceFamily}${variantInfo}\n\n` +
      `🍃 *Pirámide Olfativa:*\n` +
      `- Salida: ${sharingProduct.topNotes}\n` +
      `- Corazón: ${sharingProduct.heartNotes}\n` +
      `- Fondo: ${sharingProduct.baseNotes}\n\n` +
      `✨ *Precio:* $${displayPrice.toLocaleString('es-AR')} ARS\n\n` +
      `¿Te gustaría encargar esta fragancia o recibir asesoramiento personalizado?`
    );
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppText());
    const phoneClean = clientPhone.replace(/[^0-9]/g, '');
    const url = phoneClean ? `https://wa.me/${phoneClean}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(buildWhatsAppText());
    showToast('Ficha comercial copiada al portapapeles.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#E6DFC8] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A1E17]/10 text-[#2A1E17] text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Módulo de Ventas & Catálogo Digital
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1E17]">
            Catálogo Interactivo de Productos
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6B61] mt-1">
            Gestión de catálogo comercial, variantes de presentación y fichas técnicas con compartición directa a clientes por WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('product')}
          className="px-4 py-2.5 bg-[#C86D51] hover:bg-[#a85239] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Crear Nuevo Producto
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#E6DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7A6B61] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por aroma, notas o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl text-xs text-[#2A1E17] focus:outline-none focus:border-[#C86D51]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#C86D51] text-white shadow-xs'
                  : 'bg-[#F7F4EE] text-[#7A6B61] hover:bg-[#E6DFC8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const basePrice = product.variants?.[0]?.salePriceARS || 18500;

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-xs border border-[#E6DFC8] overflow-hidden flex flex-col justify-between hover:border-[#C86D51] transition-all group"
            >
              <div>
                {/* Card Top Banner */}
                <div className="p-5 bg-gradient-to-br from-[#2A1E17] via-[#3D2C22] to-[#2A1E17] text-[#F7F4EE] relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C86D51] text-white">
                      {product.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateProduct(product.id)}
                        title="Duplicar Producto"
                        className="p-1 hover:text-[#D9822B] text-[#E6DFC8] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        title="Eliminar Producto"
                        className="p-1 hover:text-red-400 text-[#E6DFC8] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h2 className="font-serif font-bold text-lg text-white mt-3 group-hover:text-[#E6DFC8] transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-xs text-[#E6DFC8]/80 mt-1">{product.shortDescription || 'Perfumería Artesanal'}</p>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-[#7A6B61] leading-relaxed">
                    {product.description}
                  </p>

                  {/* Olfactory Pyramid */}
                  <div className="p-3 bg-[#F7F4EE] rounded-2xl border border-[#E6DFC8] space-y-1.5 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#C86D51] flex items-center gap-1">
                      <Flower2 className="w-3.5 h-3.5" /> Pirámide Olfativa
                    </span>
                    <div className="text-[11px] text-[#2A1E17]">
                      <strong>Salida:</strong> {product.topNotes}
                    </div>
                    <div className="text-[11px] text-[#2A1E17]">
                      <strong>Corazón:</strong> {product.heartNotes}
                    </div>
                    <div className="text-[11px] text-[#2A1E17]">
                      <strong>Fondo:</strong> {product.baseNotes}
                    </div>
                  </div>

                  {/* Variants List */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-[#7A6B61]">Presentaciones Disponibles:</span>
                      <div className="space-y-1">
                        {product.variants.map((v) => (
                          <div key={v.id} className="flex items-center justify-between text-[11px] bg-[#F7F4EE] px-3 py-1.5 rounded-xl border border-[#E6DFC8]">
                            <span className="font-medium text-[#2A1E17]">{v.size} ({v.aroma})</span>
                            <span className="font-bold text-[#C86D51]">${v.salePriceARS.toLocaleString('es-AR')} ARS</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 bg-[#F7F4EE]/50 border-t border-[#E6DFC8] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#7A6B61] block font-medium">Precio Base ARS</span>
                  <span className="text-lg font-serif font-bold text-[#2A1E17]">
                    ${basePrice.toLocaleString('es-AR')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSharingProduct(product);
                    setSelectedVariant(product.variants?.[0] || null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1eb855] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" /> Compartir WA
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Share Modal */}
      {sharingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-[#E6DFC8]">
            <div className="flex items-center justify-between border-b border-[#E6DFC8] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2A1E17] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#25D366]" /> Compartir por WhatsApp
              </h3>
              <button
                onClick={() => setSharingProduct(null)}
                className="text-[#7A6B61] hover:text-[#2A1E17] text-xs font-bold"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Nombre del Cliente (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: María Sofía"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Teléfono WhatsApp (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: 5491122334455"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17]"
                />
              </div>

              {sharingProduct.variants && sharingProduct.variants.length > 0 && (
                <div>
                  <label className="block font-semibold text-[#7A6B61] mb-1">Seleccionar Presentación</label>
                  <select
                    value={selectedVariant?.id || ''}
                    onChange={(e) => {
                      const v = sharingProduct.variants.find((v) => v.id === e.target.value);
                      setSelectedVariant(v || null);
                    }}
                    className="w-full bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl px-3 py-2 text-[#2A1E17]"
                  >
                    {sharingProduct.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.size} ({v.aroma}) — ${v.salePriceARS.toLocaleString('es-AR')} ARS
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message Preview */}
              <div>
                <label className="block font-semibold text-[#7A6B61] mb-1">Vista Previa del Mensaje</label>
                <div className="p-3 rounded-2xl bg-[#DCF8C6]/40 border border-[#25D366]/30 text-[11px] font-sans whitespace-pre-wrap text-[#2A1E17] max-h-48 overflow-y-auto">
                  {buildWhatsAppText()}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E6DFC8]">
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="px-4 py-2 bg-[#F7F4EE] border border-[#E6DFC8] text-[#2A1E17] font-semibold text-xs rounded-xl hover:bg-[#E6DFC8]"
              >
                Copiar Texto
              </button>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#1eb855] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-4 h-4" /> Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Eliminar Producto"
        message={`¿Está seguro de eliminar el producto "${productToDelete?.name}" del catálogo?`}
        onConfirm={() => productToDelete && deleteProduct(productToDelete.id)}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
