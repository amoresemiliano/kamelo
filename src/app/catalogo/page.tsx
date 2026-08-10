'use client';

import { useState } from 'react';
import {
  BookOpen,
  Search,
  MessageCircle,
  Flower2
} from '@/components/Icons';
import { mockCatalogProducts } from '@/data/mockData';
import { CatalogProduct } from '@/types';

export default function CatalogoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Perfumes Finos', 'Velas Botánicas', 'Difusores de Ambiente', 'Cosmética Natural'];

  const filteredProducts = mockCatalogProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.fragranceFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareWhatsApp = (product: CatalogProduct) => {
    const text = encodeURIComponent(
      `✨ *Kamelo Aromáticos* - Ficha de Producto ✨\n\n` +
      `🌸 *${product.name}*\n` +
      `📌 *Categoría:* ${product.category}\n` +
      `🏺 *Familia Olfativa:* ${product.fragranceFamily}\n` +
      `📦 *Formato:* ${product.format}\n\n` +
      `🍃 *Pirámide Olfativa:*\n` +
      `- Salida: ${product.topNotes}\n` +
      `- Corazón: ${product.heartNotes}\n` +
      `- Fondo: ${product.baseNotes}\n\n` +
      `💰 *Precio ARS:* $${product.priceARS.toLocaleString('es-AR')}\n\n` +
      `¿Te gustaría encargar o recibir asesoramiento personalizado? ¡Escríbenos!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6DFC8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#2A1E17]/10 text-[#2A1E17] text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Módulo de Ventas & Catálogo Digital
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1E17]">
            Catálogo Interactivo de Productos
          </h1>
          <p className="text-xs text-[#7A6B61] mt-1">
            Fichas aromáticas de presentación comercial y envío directo por WhatsApp a clientes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E6DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7A6B61] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por aroma, notas o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F4EE] border border-[#E6DFC8] rounded-xl text-xs text-[#2A1E17] focus:outline-none focus:border-[#C86D51]"
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
                  ? 'bg-[#C86D51] text-white shadow-sm'
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
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-[#E6DFC8] overflow-hidden flex flex-col justify-between hover:border-[#C86D51] transition-all group"
          >
            <div>
              {/* Card Top Banner */}
              <div className="p-5 bg-gradient-to-br from-[#2A1E17] to-[#3D2C22] text-[#F7F4EE] relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C86D51] text-white">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D9822B] text-white">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h2 className="font-serif font-bold text-lg text-white mt-3 group-hover:text-[#E6DFC8] transition-colors">
                  {product.name}
                </h2>
                <p className="text-xs text-[#E6DFC8]/80 mt-1">{product.format}</p>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-[#7A6B61] leading-relaxed">
                  {product.description}
                </p>

                <div className="p-3 bg-[#F7F4EE] rounded-xl border border-[#E6DFC8] space-y-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#C86D51] flex items-center gap-1">
                    <Flower2 className="w-3 h-3" /> Pirámide Olfativa
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
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 bg-[#F7F4EE]/50 border-t border-[#E6DFC8] flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-[#7A6B61] block font-medium">Precio Venta ARS</span>
                <span className="text-lg font-bold text-[#2A1E17]">
                  ${product.priceARS.toLocaleString('es-AR')}
                </span>
              </div>

              <button
                onClick={() => handleShareWhatsApp(product)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> Compartir WA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
