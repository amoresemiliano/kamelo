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
  Share2,
  LayoutGrid,
  List,
  Eye,
  Image as ImageIcon,
  X,
  CheckCircle2
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
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Header Banner */}
      <SectionHero
        title="Catálogo Interactivo de Productos"
        subtitle="Gestión de catálogo comercial, variantes de presentación y fichas técnicas con compartición directa a clientes por WhatsApp."
        badgeText="Módulo de Ventas & Catálogo Digital"
        badgeIcon={<BookOpen className="w-3.5 h-3.5 text-[#C98F7A]" />}
        bgImage="https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=80"
      >
        <button
          onClick={() => setActiveModal('product')}
          className="px-4 py-2.5 bg-[#C98F7A] hover:bg-[#b87e6a] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Crear Nuevo Producto
        </button>
      </SectionHero>

      {/* Filter, Search, and View Controls */}
      <div className="bg-[#FBF8F4] p-4 rounded-2xl shadow-xs border border-[#E7DDD4] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7A6E65] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por aroma, notas o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#E7DDD4] rounded-xl text-xs text-[#3E342F] focus:outline-none focus:border-[#C98F7A]"
          />
        </div>

        {/* Category Pills & View Mode Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#C98F7A] text-white shadow-xs'
                    : 'bg-white text-[#7A6E65] hover:bg-[#E7DDD4]/50 border border-[#E7DDD4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E7DDD4] shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#3E342F] text-white' : 'text-[#7A6E65] hover:text-[#3E342F]'
              }`}
              title="Vista en Cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#3E342F] text-white' : 'text-[#7A6E65] hover:text-[#3E342F]'
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
                className="bg-[#FBF8F4] rounded-3xl shadow-xs border border-[#E7DDD4] overflow-hidden flex flex-col justify-between hover:border-[#C98F7A] transition-all group hover:shadow-md"
              >
                <div>
                  {/* Product Image Banner */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#3E342F]">
                    <img
                      src={mainImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B231F]/90 via-transparent to-black/30" />

                    {/* Badge Category & Actions Overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C98F7A] text-white shadow-xs">
                        {product.category}
                      </span>

                      <div className="flex items-center gap-1 bg-[#2B231F]/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                        <button
                          onClick={() => openProductDetail(product)}
                          title="Ver Ficha Detallada"
                          className="p-1 text-[#D8C7B8] hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateProduct(product.id)}
                          title="Duplicar Producto"
                          className="p-1 text-[#D8C7B8] hover:text-[#D6A36D] transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          title="Eliminar Producto"
                          className="p-1 text-[#D8C7B8] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Title inside Image */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 cursor-pointer" onClick={() => openProductDetail(product)}>
                      {product.badge && (
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D6A36D] text-white mb-1 shadow-xs">
                          {product.badge}
                        </span>
                      )}
                      <h2 className="font-serif font-bold text-lg text-white group-hover:text-[#D8C7B8] transition-colors drop-shadow-xs">
                        {product.name}
                      </h2>
                      <p className="text-[11px] text-[#D8C7B8]/90 line-clamp-1">{product.shortDescription || 'Perfumería Artesanal'}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-[#7A6E65] leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Olfactory Pyramid */}
                    <div className="p-3 bg-white rounded-2xl border border-[#E7DDD4] space-y-1 text-xs">
                      <span className="text-[10px] uppercase font-bold text-[#C98F7A] flex items-center gap-1">
                        <Flower2 className="w-3.5 h-3.5" /> Pirámide Olfativa
                      </span>
                      <div className="text-[11px] text-[#3E342F] truncate">
                        <strong>Salida:</strong> {product.topNotes}
                      </div>
                      <div className="text-[11px] text-[#3E342F] truncate">
                        <strong>Corazón:</strong> {product.heartNotes}
                      </div>
                      <div className="text-[11px] text-[#3E342F] truncate">
                        <strong>Fondo:</strong> {product.baseNotes}
                      </div>
                    </div>

                    {/* Variants List */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-[#7A6E65]">Presentaciones:</span>
                        <div className="space-y-1">
                          {product.variants.map((v) => (
                            <div key={v.id} className="flex items-center justify-between text-[11px] bg-white px-3 py-1.5 rounded-xl border border-[#E7DDD4]">
                              <span className="font-medium text-[#3E342F]">{v.size} ({v.aroma})</span>
                              <span className="font-bold text-[#C98F7A]">${v.salePriceARS.toLocaleString('es-AR')} ARS</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white/80 border-t border-[#E7DDD4] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#7A6E65] block font-medium">Precio Base ARS</span>
                    <span className="text-base font-serif font-bold text-[#3E342F]">
                      ${basePrice.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openProductDetail(product)}
                      className="px-3 py-1.5 rounded-xl bg-[#E7DDD4]/60 hover:bg-[#E7DDD4] text-[#3E342F] text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver
                    </button>
                    <button
                      onClick={() => {
                        setSharingProduct(product);
                        setSelectedVariant(product.variants?.[0] || null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1eb855] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
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
                className="bg-[#FBF8F4] rounded-2xl border border-[#E7DDD4] overflow-hidden flex flex-col sm:flex-row items-stretch justify-between hover:border-[#C98F7A] transition-all p-4 gap-4"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
                  {/* Thumbnail Image */}
                  <div
                    className="w-full sm:w-36 h-36 shrink-0 rounded-xl overflow-hidden relative bg-[#3E342F] cursor-pointer"
                    onClick={() => openProductDetail(product)}
                  >
                    <img src={mainImg} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    {product.badge && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#D6A36D] text-white">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#C98F7A]/20 text-[#C98F7A]">
                        {product.category}
                      </span>
                      <span className="text-xs text-[#7A6E65] font-medium">
                        Familia: <strong className="text-[#3E342F]">{product.fragranceFamily}</strong>
                      </span>
                    </div>

                    <h3
                      className="font-serif font-bold text-lg text-[#3E342F] hover:text-[#C98F7A] cursor-pointer"
                      onClick={() => openProductDetail(product)}
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#7A6E65] line-clamp-2 max-w-2xl">{product.description}</p>

                    <div className="text-[11px] text-[#7A6E65] flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
                      <span><strong>Salida:</strong> {product.topNotes}</span>
                      <span><strong>Corazón:</strong> {product.heartNotes}</span>
                      <span><strong>Fondo:</strong> {product.baseNotes}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Price & Actions */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-[#E7DDD4] pt-3 sm:pt-0 sm:pl-6 gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#7A6E65] block">Desde</span>
                    <span className="text-xl font-serif font-bold text-[#3E342F]">
                      ${basePrice.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openProductDetail(product)}
                      className="p-2 rounded-xl bg-white border border-[#E7DDD4] text-[#3E342F] hover:bg-[#E7DDD4]/50"
                      title="Ver Detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSharingProduct(product);
                        setSelectedVariant(product.variants?.[0] || null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1eb855] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
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
          <div className="bg-[#FBF8F4] text-[#3E342F] border border-[#E7DDD4] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in space-y-6">
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-5 right-5 text-[#7A6E65] hover:text-[#3E342F] p-1.5 rounded-full bg-white border border-[#E7DDD4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Gallery */}
              <div className="space-y-3">
                <div className="h-64 rounded-2xl overflow-hidden bg-[#3E342F] border border-[#E7DDD4] relative">
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
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C98F7A] text-white shadow-xs">
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
                          selectedImageIndex === idx ? 'border-[#C98F7A] scale-105 shadow-xs' : 'border-[#E7DDD4] opacity-70 hover:opacity-100'
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
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#C98F7A]/20 text-[#C98F7A]">
                      {detailProduct.category}
                    </span>
                    <span className="text-xs text-[#7A6E65]">{detailProduct.collection}</span>
                  </div>

                  <h2 className="text-2xl font-serif font-bold text-[#3E342F]">
                    {detailProduct.name}
                  </h2>

                  <p className="text-xs text-[#7A6E65] leading-relaxed">
                    {detailProduct.description}
                  </p>

                  <div className="p-3 bg-white rounded-2xl border border-[#E7DDD4] space-y-1.5 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#C98F7A] flex items-center gap-1">
                      <Flower2 className="w-3.5 h-3.5" /> Pirámide Olfativa
                    </span>
                    <p className="text-[11px] text-[#3E342F]"><strong>Salida:</strong> {detailProduct.topNotes}</p>
                    <p className="text-[11px] text-[#3E342F]"><strong>Corazón:</strong> {detailProduct.heartNotes}</p>
                    <p className="text-[11px] text-[#3E342F]"><strong>Fondo:</strong> {detailProduct.baseNotes}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E7DDD4] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#7A6E65] block font-medium">Precio Base ARS</span>
                    <span className="text-xl font-serif font-bold text-[#3E342F]">
                      ${(detailProduct.variants?.[0]?.salePriceARS || 18500).toLocaleString('es-AR')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSharingProduct(detailProduct);
                      setSelectedVariant(detailProduct.variants?.[0] || null);
                      setDetailProduct(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1eb855] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
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
          <div className="bg-[#FBF8F4] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-[#E7DDD4]">
            <div className="flex items-center justify-between border-b border-[#E7DDD4] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#3E342F] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#25D366]" /> Compartir por WhatsApp
              </h3>
              <button
                onClick={() => setSharingProduct(null)}
                className="text-[#7A6E65] hover:text-[#3E342F] text-xs font-bold p-1"
              >
                Cerrar
              </button>
            </div>

            {/* Compact Product Header Card */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7DDD4]">
              <img
                src={getProductImage(sharingProduct)}
                alt={sharingProduct.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E7DDD4]"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-[#C98F7A] uppercase">{sharingProduct.category}</span>
                <h4 className="font-serif font-bold text-sm text-[#3E342F] truncate">{sharingProduct.name}</h4>
                <p className="text-[11px] text-[#7A6E65] truncate">{sharingProduct.fragranceFamily}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#7A6E65] mb-1">Nombre del Cliente (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: María Sofía"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD4] rounded-xl px-3 py-2 text-[#3E342F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#7A6E65] mb-1">Teléfono WhatsApp (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: 5491122334455"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD4] rounded-xl px-3 py-2 text-[#3E342F]"
                />
              </div>

              {sharingProduct.variants && sharingProduct.variants.length > 0 && (
                <div>
                  <label className="block font-semibold text-[#7A6E65] mb-1">Seleccionar Presentación</label>
                  <select
                    value={selectedVariant?.id || ''}
                    onChange={(e) => {
                      const v = sharingProduct.variants.find((v) => v.id === e.target.value);
                      setSelectedVariant(v || null);
                    }}
                    className="w-full bg-white border border-[#E7DDD4] rounded-xl px-3 py-2 text-[#3E342F]"
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
                <label className="block font-semibold text-[#7A6E65] mb-1">Vista Previa del Mensaje</label>
                <div className="p-3 rounded-2xl bg-[#DCF8C6]/40 border border-[#25D366]/30 text-[11px] font-sans whitespace-pre-wrap text-[#3E342F] max-h-40 overflow-y-auto">
                  {buildWhatsAppText()}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E7DDD4]">
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="px-4 py-2 bg-white border border-[#E7DDD4] text-[#3E342F] font-semibold text-xs rounded-xl hover:bg-[#E7DDD4]/50"
              >
                Copiar Texto
              </button>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#1eb855] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
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
