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
  LayoutGrid,
  List,
  Eye,
  Share2,
  X,
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { CatalogProduct, ProductVariant } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog';
import SectionHero from '@/components/SectionHero';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [productToDelete, setProductToDelete] = useState<CatalogProduct | null>(null);

  // Detail Modal State
  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

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
      `${greeting}Te comparto la ficha comercial de *MEJUNJE · Atelier de Perfumería Artesanal* ✨\n\n` +
      `🌿 *${sharingProduct.name}*\n` +
      `📌 *Categoría:* ${sharingProduct.category}\n` +
      `🏺 *Familia Olfativa:* ${sharingProduct.fragranceFamily}${variantInfo}\n\n` +
      `🍂 *Pirámide Olfativa:*\n` +
      `- Salida: ${sharingProduct.topNotes}\n` +
      `- Corazón: ${sharingProduct.heartNotes}\n` +
      `- Fondo: ${sharingProduct.baseNotes}\n\n` +
      `✨ *Precio:* $${displayPrice.toLocaleString('es-AR')} ARS\n\n` +
      `_MEJUNJE · mezcla. intención. aroma. · Palermo, Buenos Aires_\n` +
      `¿Te gustaría encargar esta pieza o recibir asesoramiento olfativo personalizado?`
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
    showToast('Ficha comercial de MEJUNJE copiada al portapapeles.', 'success');
  };

  const openProductDetail = (product: CatalogProduct) => {
    setDetailProduct(product);
    setSelectedImageIndex(0);
  };

  // Helper for image URL with fallback
  const getProductImage = (product: CatalogProduct) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.images && product.images.length > 0) return product.images[0];
    return 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80';
  };

  return (
    <div className="space-y-10 animate-in fade-in pb-12">
      {/* Header Banner */}
      <SectionHero
        title="Catálogo & Fichas Olfativas"
        subtitle="Colecciones artesanales, notas de cata botánica, variantes de presentación y envío directo de fichas editoriales a clientes por WhatsApp."
        badgeText="MEJUNJE · CATÁLOGO COMERCIAL"
        badgeIcon={<BookOpen className="w-3.5 h-3.5 text-mejunje-salmon" />}
        bgImage="https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=80"
        noticeText="producción en lotes pequeños · diseño botánico de autor"
      >
        <button
          onClick={() => setActiveModal('product')}
          className="px-4 py-2.5 bg-mejunje-salmon hover:bg-mejunje-terracota text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs shrink-0 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Crear Nuevo Producto
        </button>
      </SectionHero>

      {/* Filter, Search, and View Controls */}
      <div className="bg-mejunje-card p-4 rounded-2xl shadow-atelier border border-mejunje-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-mejunje-griscalido absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por aroma, notas o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-mejunje-papel/40 border border-mejunje-border rounded-xl text-xs text-mejunje-tinta focus:outline-none focus:border-mejunje-salmon"
          />
        </div>

        {/* Category Pills & View Mode Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-typewriter uppercase tracking-wider whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-mejunje-salmon text-white shadow-xs'
                    : 'bg-white text-mejunje-griscalido hover:bg-mejunje-papel border border-mejunje-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-mejunje-border shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-mejunje-espresso text-white' : 'text-mejunje-griscalido hover:text-mejunje-tinta'
              }`}
              title="Vista en Cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-mejunje-espresso text-white' : 'text-mejunje-griscalido hover:text-mejunje-tinta'
              }`}
              title="Vista en Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* GRID VIEW */}
      {/* =================================================================== */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const basePrice = product.variants?.[0]?.salePriceARS || 18500;
            const mainImg = getProductImage(product);

            return (
              <div
                key={product.id}
                className="bg-mejunje-card rounded-3xl shadow-atelier border border-mejunje-border overflow-hidden flex flex-col justify-between hover:border-mejunje-salmon transition-all group hover:shadow-atelier-md"
              >
                <div>
                  {/* Product Image Banner */}
                  <div className="relative h-56 w-full overflow-hidden bg-mejunje-espresso">
                    <img
                      src={mainImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter saturate-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mejunje-espresso/90 via-transparent to-black/30" />

                    {/* Badge Category & Actions Overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[9px] font-typewriter uppercase tracking-widest px-2.5 py-1 rounded-full bg-mejunje-salmon text-white shadow-xs">
                        {product.category}
                      </span>

                      <div className="flex items-center gap-1 bg-mejunje-espresso/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                        <button
                          onClick={() => openProductDetail(product)}
                          title="Ver Ficha Detallada"
                          className="p-1 text-mejunje-arena hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateProduct(product.id)}
                          title="Duplicar Producto"
                          className="p-1 text-mejunje-arena hover:text-mejunje-salmon transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          title="Eliminar Producto"
                          className="p-1 text-mejunje-arena hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Title inside Image */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 cursor-pointer" onClick={() => openProductDetail(product)}>
                      {product.badge && (
                        <span className="inline-block text-[9px] font-typewriter uppercase tracking-wider px-2 py-0.5 rounded bg-mejunje-ambar text-white mb-1 shadow-xs">
                          {product.badge}
                        </span>
                      )}
                      <h2 className="font-serif italic text-xl text-white group-hover:text-mejunje-arena transition-colors drop-shadow-xs">
                        {product.name}
                      </h2>
                      <p className="text-[11px] text-mejunje-arena/90 font-sans line-clamp-1">{product.shortDescription || 'Perfumería Artesanal'}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-mejunje-griscalido leading-relaxed font-sans line-clamp-2">
                      {product.description}
                    </p>

                    {/* Olfactory Pyramid */}
                    <div className="p-3 bg-white rounded-2xl border border-mejunje-border space-y-1 text-xs">
                      <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-salmon flex items-center gap-1">
                        <Flower2 className="w-3 h-3" /> Pirámide Olfativa
                      </span>
                      <div className="text-[11px] text-mejunje-tinta truncate font-sans">
                        <strong className="font-medium">Salida:</strong> {product.topNotes}
                      </div>
                      <div className="text-[11px] text-mejunje-tinta truncate font-sans">
                        <strong className="font-medium">Corazón:</strong> {product.heartNotes}
                      </div>
                      <div className="text-[11px] text-mejunje-tinta truncate font-sans">
                        <strong className="font-medium">Fondo:</strong> {product.baseNotes}
                      </div>
                    </div>

                    {/* Variants List */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-typewriter text-[9px] uppercase text-mejunje-griscalido tracking-wider">Presentaciones:</span>
                        <div className="space-y-1">
                          {product.variants.map((v) => (
                            <div key={v.id} className="flex items-center justify-between text-[11px] bg-white px-3 py-1.5 rounded-xl border border-mejunje-border">
                              <span className="font-medium text-mejunje-tinta font-sans">{v.size} ({v.aroma})</span>
                              <span className="font-semibold text-mejunje-salmon">${v.salePriceARS.toLocaleString('es-AR')} ARS</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white border-t border-mejunje-border flex items-center justify-between gap-2">
                  <div>
                    <span className="font-typewriter text-[9px] uppercase text-mejunje-griscalido block">Precio Base ARS</span>
                    <span className="text-base font-serif italic text-mejunje-tinta font-semibold">
                      ${basePrice.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openProductDetail(product)}
                      className="px-3 py-1.5 rounded-xl bg-mejunje-papel hover:bg-mejunje-arena/40 text-mejunje-tinta text-xs font-medium flex items-center gap-1 transition-colors border border-mejunje-border"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ficha
                    </button>
                    <button
                      onClick={() => {
                        setSharingProduct(product);
                        setSelectedVariant(product.variants?.[0] || null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" /> Compartir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =================================================================== */
        /* LIST VIEW */
        /* =================================================================== */
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const basePrice = product.variants?.[0]?.salePriceARS || 18500;
            const mainImg = getProductImage(product);

            return (
              <div
                key={product.id}
                className="bg-mejunje-card rounded-2xl border border-mejunje-border overflow-hidden flex flex-col sm:flex-row items-stretch justify-between hover:border-mejunje-salmon transition-all p-4 gap-4 shadow-atelier"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
                  {/* Thumbnail Image */}
                  <div
                    className="w-full sm:w-36 h-36 shrink-0 rounded-xl overflow-hidden relative bg-mejunje-espresso cursor-pointer"
                    onClick={() => openProductDetail(product)}
                  >
                    <img src={mainImg} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    {product.badge && (
                      <span className="absolute top-2 left-2 font-typewriter text-[9px] uppercase px-2 py-0.5 rounded bg-mejunje-ambar text-white">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="font-typewriter text-[9px] uppercase px-2 py-0.5 rounded-full bg-mejunje-salmon/15 text-mejunje-salmon border border-mejunje-salmon/30">
                        {product.category}
                      </span>
                      <span className="text-xs text-mejunje-griscalido font-sans">
                        Familia: <strong className="text-mejunje-tinta">{product.fragranceFamily}</strong>
                      </span>
                    </div>

                    <h3
                      className="font-serif italic text-lg text-mejunje-tinta hover:text-mejunje-salmon cursor-pointer"
                      onClick={() => openProductDetail(product)}
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-mejunje-griscalido line-clamp-2 max-w-2xl font-sans">{product.description}</p>

                    <div className="text-[11px] text-mejunje-griscalido flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 font-sans">
                      <span><strong>Salida:</strong> {product.topNotes}</span>
                      <span><strong>Corazón:</strong> {product.heartNotes}</span>
                      <span><strong>Fondo:</strong> {product.baseNotes}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Price & Actions */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-mejunje-border pt-3 sm:pt-0 sm:pl-6 gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="font-typewriter text-[9px] uppercase text-mejunje-griscalido block">Desde</span>
                    <span className="text-xl font-serif italic text-mejunje-tinta font-semibold">
                      ${basePrice.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openProductDetail(product)}
                      className="p-2 rounded-xl bg-white border border-mejunje-border text-mejunje-tinta hover:bg-mejunje-papel"
                      title="Ver Detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSharingProduct(product);
                        setSelectedVariant(product.variants?.[0] || null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* PRODUCT DETAIL & GALLERY MODAL */}
      {/* =================================================================== */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-mejunje-card text-mejunje-tinta border border-mejunje-border rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-atelier-lg relative my-8 animate-in fade-in space-y-6">
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-5 right-5 text-mejunje-griscalido hover:text-mejunje-tinta p-1.5 rounded-full bg-white border border-mejunje-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Gallery */}
              <div className="space-y-3">
                <div className="h-64 rounded-2xl overflow-hidden bg-mejunje-espresso border border-mejunje-border relative">
                  <img
                    src={
                      detailProduct.images?.[selectedImageIndex] ||
                      detailProduct.imageUrl ||
                      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80'
                    }
                    alt={detailProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {detailProduct.badge && (
                    <span className="absolute top-3 left-3 font-typewriter text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-mejunje-salmon text-white shadow-xs">
                      {detailProduct.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnails list */}
                {detailProduct.images && detailProduct.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {detailProduct.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          selectedImageIndex === idx ? 'border-mejunje-salmon scale-105 shadow-xs' : 'border-mejunje-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Specs */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-typewriter text-[9px] uppercase px-2.5 py-0.5 rounded-full bg-mejunje-salmon/15 text-mejunje-salmon border border-mejunje-salmon/30">
                      {detailProduct.category}
                    </span>
                    <span className="text-xs text-mejunje-griscalido font-sans">{detailProduct.collection}</span>
                  </div>

                  <h2 className="text-2xl font-serif italic text-mejunje-tinta">
                    {detailProduct.name}
                  </h2>

                  <p className="text-xs text-mejunje-griscalido leading-relaxed font-sans">
                    {detailProduct.description}
                  </p>

                  <div className="p-3.5 bg-white rounded-2xl border border-mejunje-border space-y-1.5 text-xs">
                    <span className="font-typewriter text-[9px] uppercase text-mejunje-salmon flex items-center gap-1">
                      <Flower2 className="w-3.5 h-3.5" /> Pirámide Olfativa
                    </span>
                    <p className="text-[11px] text-mejunje-tinta font-sans"><strong>Salida:</strong> {detailProduct.topNotes}</p>
                    <p className="text-[11px] text-mejunje-tinta font-sans"><strong>Corazón:</strong> {detailProduct.heartNotes}</p>
                    <p className="text-[11px] text-mejunje-tinta font-sans"><strong>Fondo:</strong> {detailProduct.baseNotes}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-mejunje-border flex items-center justify-between gap-3">
                  <div>
                    <span className="font-typewriter text-[9px] uppercase text-mejunje-griscalido block">Precio Base ARS</span>
                    <span className="text-xl font-serif italic text-mejunje-tinta font-semibold">
                      ${(detailProduct.variants?.[0]?.salePriceARS || 18500).toLocaleString('es-AR')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSharingProduct(detailProduct);
                      setSelectedVariant(detailProduct.variants?.[0] || null);
                      setDetailProduct(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" /> Compartir por WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* WHATSAPP SHARE MODAL WITH PRODUCT IMAGE PREVIEW */}
      {/* =================================================================== */}
      {sharingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-mejunje-card rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-atelier-lg border border-mejunje-border">
            <div className="flex items-center justify-between border-b border-mejunje-border pb-3">
              <h3 className="font-serif italic text-lg text-mejunje-tinta flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" /> Compartir Ficha por WhatsApp
              </h3>
              <button
                onClick={() => setSharingProduct(null)}
                className="text-mejunje-griscalido hover:text-mejunje-tinta text-xs font-medium p-1"
              >
                Cerrar
              </button>
            </div>

            {/* Compact Product Header Card */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-mejunje-border">
              <img
                src={getProductImage(sharingProduct)}
                alt={sharingProduct.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-mejunje-border"
              />
              <div className="overflow-hidden">
                <span className="font-typewriter text-[9px] text-mejunje-salmon uppercase tracking-wider">{sharingProduct.category}</span>
                <h4 className="font-serif italic text-base text-mejunje-tinta truncate">{sharingProduct.name}</h4>
                <p className="text-[11px] text-mejunje-griscalido truncate font-sans">{sharingProduct.fragranceFamily}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-typewriter text-[10px] uppercase text-mejunje-griscalido mb-1">Nombre del Cliente (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Sofía"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta"
                />
              </div>

              <div>
                <label className="block font-typewriter text-[10px] uppercase text-mejunje-griscalido mb-1">Teléfono WhatsApp (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: 5491122334455"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-white border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta"
                />
              </div>

              {sharingProduct.variants && sharingProduct.variants.length > 0 && (
                <div>
                  <label className="block font-typewriter text-[10px] uppercase text-mejunje-griscalido mb-1">Presentación a Cotizar</label>
                  <select
                    value={selectedVariant?.id || ''}
                    onChange={(e) => {
                      const v = sharingProduct.variants.find((v) => v.id === e.target.value);
                      setSelectedVariant(v || null);
                    }}
                    className="w-full bg-white border border-mejunje-border rounded-xl px-3 py-2 text-mejunje-tinta"
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
                <label className="block font-typewriter text-[10px] uppercase text-mejunje-griscalido mb-1">Vista Previa del Mensaje</label>
                <div className="p-3.5 rounded-2xl bg-mejunje-papel/50 border border-mejunje-border text-[11px] font-sans whitespace-pre-wrap text-mejunje-tinta max-h-40 overflow-y-auto">
                  {buildWhatsAppText()}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-mejunje-border">
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="px-4 py-2 bg-white border border-mejunje-border text-mejunje-tinta font-medium text-xs rounded-xl hover:bg-mejunje-papel"
              >
                Copiar Ficha
              </button>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
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
