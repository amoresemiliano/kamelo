'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Copy,
  Trash2,
  FileText,
  Clock,
  MapPin,
} from 'lucide-react';
import { useKamelo } from '@/context/KameloContext';
import { Supplier, PurchaseOrder } from '@/types';
import ConfirmDialog from '@/components/ConfirmDialog';
import SectionHero from '@/components/SectionHero';

export default function ComprasPage() {
  const {
    suppliers,
    requirements,
    purchaseOrders,
    createPurchaseOrderFromRequirements,
    updatePurchaseOrderStatus,
    deletePurchaseOrder,
    duplicatePurchaseOrder,
    deleteSupplier,
    setActiveModal,
  } = useKamelo();

  // Sub-navigation tab: 'necesidades' | 'ordenes' | 'proveedores'
  const [activeTab, setActiveTab] = useState<'necesidades' | 'ordenes' | 'proveedores'>('necesidades');

  // Expanded supplier in requirements
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(requirements[0]?.supplierId || null);

  // Confirm dialogs
  const [poToDelete, setPoToDelete] = useState<PurchaseOrder | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  // Status badge style helper
  const getPOStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Solicitada':
      case 'Pendiente':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Confirmada':
        return 'bg-mejunje-papel text-mejunje-tabaco border-mejunje-arena';
      case 'Recibida':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Cancelada':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* Header Banner */}
      <SectionHero
        title="Abastecimiento & Directorio de Proveedores"
        subtitle="Consolidación de materias primas por proveedor para alcanzar mínimos de compra en ARS, emisor de órdenes de compra y contacto directo de taller."
        badgeText="MEJUNJE · ABASTECIMIENTO"
        badgeIcon={<ShoppingBag className="w-3.5 h-3.5 text-mejunje-salmon" />}
        bgImage="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1600&q=80"
        noticeText="consolidación inteligente de pedidos · optimización de fletes"
      >
        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-mejunje-espresso/90 backdrop-blur-md p-1.5 rounded-2xl border border-mejunje-arena/20 shadow-atelier-md">
          <button
            onClick={() => setActiveTab('necesidades')}
            className={`px-4 py-2 rounded-xl text-xs font-typewriter uppercase tracking-wider transition-all ${
              activeTab === 'necesidades'
                ? 'bg-mejunje-salmon text-white shadow-xs'
                : 'text-mejunje-arena/80 hover:text-white'
            }`}
          >
            Necesidades ({requirements.length})
          </button>

          <button
            onClick={() => setActiveTab('ordenes')}
            className={`px-4 py-2 rounded-xl text-xs font-typewriter uppercase tracking-wider transition-all ${
              activeTab === 'ordenes'
                ? 'bg-mejunje-salmon text-white shadow-xs'
                : 'text-mejunje-arena/80 hover:text-white'
            }`}
          >
            Órdenes ({purchaseOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('proveedores')}
            className={`px-4 py-2 rounded-xl text-xs font-typewriter uppercase tracking-wider transition-all ${
              activeTab === 'proveedores'
                ? 'bg-mejunje-salmon text-white shadow-xs'
                : 'text-mejunje-arena/80 hover:text-white'
            }`}
          >
            Proveedores ({suppliers.length})
          </button>
        </div>
      </SectionHero>

      {/* =================================================================== */}
      {/* SUBSECTION 1: NECESIDADES DE PRODUCCIÓN (REQUERIMIENTOS AGRUPADOS) */}
      {/* =================================================================== */}
      {activeTab === 'necesidades' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-mejunje-card p-4 rounded-2xl border border-mejunje-border shadow-atelier">
            <span className="text-xs text-mejunje-griscalido font-sans">
              Materias primas agrupadas dinámicamente por proveedor desde el Laboratorio de Fórmulas
            </span>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="px-4 py-2 bg-mejunje-salmon hover:bg-mejunje-terracota text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" /> Nueva Orden de Compra
            </button>
          </div>

          <div className="space-y-4">
            {requirements.map((group) => {
              const isExpanded = expandedSupplierId === group.supplierId;
              const percent = Math.min(100, Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100));

              return (
                <div
                  key={group.supplierId}
                  className="bg-mejunje-card rounded-3xl shadow-atelier border border-mejunje-border overflow-hidden transition-all"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedSupplierId(isExpanded ? null : group.supplierId)}
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-mejunje-papel/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-mejunje-espresso text-mejunje-salmon flex items-center justify-center font-bold shrink-0 border border-mejunje-tabaco">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-serif italic text-base text-mejunje-tinta">{group.supplierName}</h2>
                          {group.meetsMinimum ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium flex items-center gap-1 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mínimo Alcanzado
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-medium flex items-center gap-1 border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-mejunje-griscalido mt-0.5 font-sans">
                          Compra Mínima Requerida: <strong className="text-mejunje-tinta font-medium">${group.minPurchaseARS.toLocaleString('es-AR')} ARS</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="font-typewriter text-[10px] uppercase text-mejunje-griscalido">Total Acumulado:</span>
                        <div className="text-xl font-serif italic text-mejunje-salmon font-semibold">
                          ${group.totalARS.toLocaleString('es-AR')} ARS
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-mejunje-papel/60 text-mejunje-tinta border border-mejunje-border">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="px-5 pb-3">
                    <div className="w-full bg-mejunje-arena/30 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-mejunje-ambar' : 'bg-mejunje-salmon'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Collapsible Itemized Table */}
                  {isExpanded && (
                    <div className="p-5 border-t border-mejunje-border space-y-4 bg-white">
                      <h3 className="font-typewriter text-[10px] uppercase tracking-wider text-mejunje-griscalido">
                        Materias Primas Requeridas ({group.requirements.length} ítems)
                      </h3>

                      {group.requirements.length === 0 ? (
                        <p className="text-xs text-mejunje-griscalido italic py-2">No hay insumos pendientes para este proveedor.</p>
                      ) : (
                        <div className="overflow-x-auto border border-mejunje-border rounded-2xl">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-mejunje-espresso text-mejunje-marfil font-typewriter text-[10px] uppercase tracking-wider">
                              <tr>
                                <th className="p-3 font-normal">Materia Prima</th>
                                <th className="p-3 font-normal">Fórmulas de Destino</th>
                                <th className="p-3 font-normal text-center">Cantidad</th>
                                <th className="p-3 font-normal text-right">Subtotal Estimado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-mejunje-border">
                              {group.requirements.map((req) => (
                                <tr key={req.id} className="hover:bg-mejunje-papel/20 transition-colors">
                                  <td className="p-3 font-medium text-mejunje-tinta">{req.ingredientName}</td>
                                  <td className="p-3 text-mejunje-griscalido">
                                    {req.formulaReferences?.map((ref, idx) => (
                                      <span key={idx} className="inline-block bg-mejunje-papel/60 px-2 py-0.5 rounded text-[10px] mr-1 border border-mejunje-border font-sans">
                                        {ref}
                                      </span>
                                    ))}
                                  </td>
                                  <td className="p-3 text-center font-bold text-mejunje-salmon">
                                    {req.requiredQty} {req.unit}
                                  </td>
                                  <td className="p-3 text-right font-semibold text-mejunje-tinta">
                                    ${req.subtotalARS.toLocaleString('es-AR')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                        <button
                          disabled={group.requirements.length === 0}
                          onClick={() => createPurchaseOrderFromRequirements(group.supplierName)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs transition-all ${
                            group.requirements.length > 0
                              ? 'bg-mejunje-salmon hover:bg-mejunje-terracota text-white'
                              : 'bg-mejunje-papel text-mejunje-griscalido cursor-not-allowed border border-mejunje-border'
                          }`}
                        >
                          <FileText className="w-4 h-4" /> Emitir Orden de Compra Agrupada
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUBSECTION 2: ÓRDENES DE COMPRA (PURCHASE ORDERS) */}
      {/* =================================================================== */}
      {activeTab === 'ordenes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-mejunje-card p-4 rounded-2xl border border-mejunje-border shadow-atelier">
            <span className="text-xs text-mejunje-griscalido font-sans">
              Historial y seguimiento de Órdenes de Compra emitidas a proveedores de materias primas
            </span>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="px-4 py-2 bg-mejunje-salmon hover:bg-mejunje-terracota text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Crear Orden de Compra
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="bg-mejunje-card rounded-3xl p-6 shadow-atelier border border-mejunje-border space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-mejunje-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-typewriter font-bold text-xs text-mejunje-tinta">{po.code}</span>
                    <span className="text-[10px] text-mejunje-griscalido font-typewriter">{po.date}</span>
                  </div>

                  <select
                    value={po.status}
                    onChange={(e) => updatePurchaseOrderStatus(po.id, e.target.value as any)}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full border focus:outline-none ${getPOStatusBadge(
                      po.status
                    )}`}
                  >
                    <option value="Solicitada">Solicitada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Recibida">Recibida</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-serif italic text-base text-mejunje-tinta">{po.supplierName}</h4>
                  {po.observations && <p className="text-mejunje-griscalido text-[11px] mt-0.5">{po.observations}</p>}
                </div>

                {/* Items preview */}
                <div className="bg-mejunje-papel/30 p-3.5 rounded-2xl border border-mejunje-border space-y-1.5 font-sans">
                  <span className="font-typewriter text-[9px] uppercase tracking-wider text-mejunje-griscalido">Ítems en Orden:</span>
                  {po.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-mejunje-tinta font-medium">{item.ingredientName} ({item.requiredQty} {item.unit})</span>
                      <span className="font-semibold text-mejunje-salmon">${item.subtotalARS.toLocaleString('es-AR')} ARS</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-mejunje-border">
                  <div>
                    <span className="font-typewriter text-[9px] uppercase text-mejunje-griscalido">Total Orden:</span>
                    <div className="font-serif italic text-base text-mejunje-tinta font-semibold">
                      ${po.totalARS.toLocaleString('es-AR')} ARS
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => duplicatePurchaseOrder(po.id)}
                      title="Duplicar Orden"
                      className="p-1.5 bg-mejunje-papel/50 hover:bg-mejunje-papel text-mejunje-tinta rounded-lg transition-colors border border-mejunje-border"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPoToDelete(po)}
                      title="Eliminar Orden"
                      className="p-1.5 bg-mejunje-papel/50 hover:bg-rose-50 text-rose-700 rounded-lg transition-colors border border-mejunje-border"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUBSECTION 3: PROVEEDORES (DIRECTORY & WHATSAPP) */}
      {/* =================================================================== */}
      {activeTab === 'proveedores' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-mejunje-card p-4 rounded-2xl border border-mejunje-border shadow-atelier">
            <span className="text-xs text-mejunje-griscalido font-sans">
              Directorio comercial de proveedores, materias primas aprovisionadas y contacto de WhatsApp
            </span>

            <button
              onClick={() => setActiveModal('supplier')}
              className="px-4 py-2 bg-mejunje-salmon hover:bg-mejunje-terracota text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Registrar Proveedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suppliers.map((s) => {
              const waClean = s.phoneWhatsApp.replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${waClean}?text=${encodeURIComponent(
                `Hola ${s.contactPerson}! Te escribo de MEJUNJE (Atelier de Perfumería, Palermo) para consultar por materias primas.`
              )}`;

              return (
                <div key={s.id} className="bg-mejunje-card rounded-3xl p-6 shadow-atelier border border-mejunje-border space-y-4 text-xs flex flex-col justify-between overflow-hidden">
                  <div>
                    {s.imageUrl && (
                      <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="w-full h-full object-cover filter saturate-90 brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-mejunje-card via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-mejunje-espresso text-mejunje-salmon flex items-center justify-center font-bold border border-mejunje-tabaco">
                        <Building2 className="w-5 h-5" />
                      </div>

                      <button
                        onClick={() => setSupplierToDelete(s)}
                        className="text-mejunje-griscalido hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-serif italic text-lg text-mejunje-tinta mt-3">{s.name}</h3>
                    <p className="text-mejunje-griscalido text-[11px] font-sans">Contacto: <strong className="text-mejunje-tinta">{s.contactPerson}</strong></p>

                    <div className="mt-3 space-y-1.5 text-[11px] text-mejunje-griscalido font-sans">
                      {s.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-mejunje-salmon" /> {s.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-mejunje-ambar" /> Plazo de entrega: <strong className="text-mejunje-tinta">{s.deliveryTimeDays} días</strong>
                      </div>
                      <div>
                        Compra Mínima ARS: <strong className="text-mejunje-tinta">${s.minPurchaseARS.toLocaleString('es-AR')}</strong>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="mt-3 p-3 rounded-2xl bg-mejunje-papel/40 border border-mejunje-border text-[10px] text-mejunje-tabaco italic">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-mejunje-border">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors text-xs"
                    >
                      <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={!!poToDelete}
        title="Eliminar Orden de Compra"
        message={`¿Está seguro de eliminar la orden ${poToDelete?.code}?`}
        onConfirm={() => poToDelete && deletePurchaseOrder(poToDelete.id)}
        onCancel={() => setPoToDelete(null)}
      />

      <ConfirmDialog
        isOpen={!!supplierToDelete}
        title="Eliminar Proveedor"
        message={`¿Está seguro de eliminar el proveedor "${supplierToDelete?.name}"?`}
        onConfirm={() => supplierToDelete && deleteSupplier(supplierToDelete.id)}
        onCancel={() => setSupplierToDelete(null)}
      />
    </div>
  );
}
