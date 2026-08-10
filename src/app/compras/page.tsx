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
  ExternalLink,
  Edit,
  Sparkles
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
    addPurchaseOrder,
    updatePurchaseOrderStatus,
    deletePurchaseOrder,
    duplicatePurchaseOrder,
    deleteSupplier,
    setActiveModal,
    showToast,
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
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmada':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Recibida':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelada':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <SectionHero
        title="Compras & Gestión de Proveedores"
        subtitle="Agrupación de requerimientos por proveedor para alcanzar mínimos de compra en ARS, emisor de órdenes y directorio de proveedores."
        badgeText="Módulo de Logística & Adquisiciones"
        badgeIcon={<ShoppingBag className="w-3.5 h-3.5 text-[#7D9882]" />}
        bgImage="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1600&q=80"
      >
        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-[#2D2521]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#D8C7B8]/20 shadow-lg">
          <button
            onClick={() => setActiveTab('necesidades')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'necesidades'
                ? 'bg-[#7D9882] text-white shadow-xs'
                : 'text-[#D8C7B8] hover:text-white'
            }`}
          >
            Necesidades ({requirements.length})
          </button>

          <button
            onClick={() => setActiveTab('ordenes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ordenes'
                ? 'bg-[#7D9882] text-white shadow-xs'
                : 'text-[#D8C7B8] hover:text-white'
            }`}
          >
            Órdenes ({purchaseOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('proveedores')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'proveedores'
                ? 'bg-[#7D9882] text-white shadow-xs'
                : 'text-[#D8C7B8] hover:text-white'
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
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E6DFC8]">
            <span className="text-xs text-[#7A6B61]">
              Insumos agrupados dinámicamente por proveedor desde el Laboratorio de Fórmulas
            </span>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="px-4 py-2 bg-[#6E8B74] hover:bg-[#58725d] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Nueva Orden de Compra Manual
            </button>
          </div>

          <div className="space-y-4">
            {requirements.map((group) => {
              const isExpanded = expandedSupplierId === group.supplierId;
              const percent = Math.min(100, Math.round((group.totalARS / (group.minPurchaseARS || 1)) * 100));

              return (
                <div
                  key={group.supplierId}
                  className="bg-white rounded-3xl shadow-xs border border-[#E6DFC8] overflow-hidden transition-all"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedSupplierId(isExpanded ? null : group.supplierId)}
                    className="p-5 bg-gradient-to-r from-white via-[#F7F4EE]/50 to-[#F7F4EE] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F4EE] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#2A1E17] text-[#D9822B] flex items-center justify-center font-bold shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-serif font-bold text-base text-[#2A1E17]">{group.supplierName}</h2>
                          {group.meetsMinimum ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Mínimo Alcanzado
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7A6B61] mt-0.5">
                          Compra Mínima Exigida: <strong className="text-[#2A1E17]">${group.minPurchaseARS.toLocaleString('es-AR')} ARS</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs text-[#7A6B61]">Total Acumulado:</span>
                        <div className="text-lg font-serif font-bold text-[#C86D51]">
                          ${group.totalARS.toLocaleString('es-AR')} ARS
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#E6DFC8]/50 text-[#2A1E17]">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="px-5 pb-3">
                    <div className="w-full bg-[#E6DFC8] rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          group.meetsMinimum ? 'bg-[#6E8B74]' : 'bg-[#D9822B]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Collapsible Itemized Table */}
                  {isExpanded && (
                    <div className="p-5 border-t border-[#E6DFC8] space-y-4 bg-white">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B61]">
                        Insumos Requeridos ({group.requirements.length} ítems)
                      </h3>

                      {group.requirements.length === 0 ? (
                        <p className="text-xs text-[#7A6B61] italic py-2">No hay insumos pendientes para este proveedor.</p>
                      ) : (
                        <div className="overflow-x-auto border border-[#E6DFC8] rounded-2xl">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#2A1E17] text-[#E6DFC8]">
                              <tr>
                                <th className="p-3 font-semibold">Insumo</th>
                                <th className="p-3 font-semibold">Fórmulas Referencia</th>
                                <th className="p-3 font-semibold text-center">Cantidad Requerida</th>
                                <th className="p-3 font-semibold text-right">Subtotal Estimado ARS</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E6DFC8]">
                              {group.requirements.map((req) => (
                                <tr key={req.id} className="hover:bg-[#F7F4EE]/60 transition-colors">
                                  <td className="p-3 font-bold text-[#2A1E17]">{req.ingredientName}</td>
                                  <td className="p-3 text-[#7A6B61]">
                                    {req.formulaReferences?.map((ref, idx) => (
                                      <span key={idx} className="inline-block bg-[#F7F4EE] px-2 py-0.5 rounded text-[10px] mr-1 border border-[#E6DFC8]">
                                        {ref}
                                      </span>
                                    ))}
                                  </td>
                                  <td className="p-3 text-center font-bold text-[#C86D51]">
                                    {req.requiredQty} {req.unit}
                                  </td>
                                  <td className="p-3 text-right font-bold text-[#2A1E17]">
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
                          className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
                            group.requirements.length > 0
                              ? 'bg-[#6E8B74] hover:bg-[#58725d] text-white'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E6DFC8]">
            <span className="text-xs text-[#7A6B61]">
              Historial y seguimiento de Órdenes de Compra emitidas a proveedores
            </span>

            <button
              onClick={() => setActiveModal('purchaseOrder')}
              className="px-4 py-2 bg-[#6E8B74] hover:bg-[#58725d] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Crear Orden de Compra
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8] space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#E6DFC8] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#2A1E17]">{po.code}</span>
                    <span className="text-[10px] text-[#7A6B61]">{po.date}</span>
                  </div>

                  <select
                    value={po.status}
                    onChange={(e) => updatePurchaseOrderStatus(po.id, e.target.value as any)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border focus:outline-none ${getPOStatusBadge(
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
                  <h4 className="font-serif font-bold text-base text-[#2A1E17]">{po.supplierName}</h4>
                  {po.observations && <p className="text-[#7A6B61] text-[11px] mt-0.5">{po.observations}</p>}
                </div>

                {/* Items preview */}
                <div className="bg-[#F7F4EE] p-3 rounded-2xl border border-[#E6DFC8] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#7A6B61]">Ítems en Orden:</span>
                  {po.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-[#2A1E17] font-medium">{item.ingredientName} ({item.requiredQty} {item.unit})</span>
                      <span className="font-bold text-[#C86D51]">${item.subtotalARS.toLocaleString('es-AR')} ARS</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E6DFC8]">
                  <div>
                    <span className="text-[10px] text-[#7A6B61]">Total Orden:</span>
                    <div className="font-serif font-bold text-base text-[#2A1E17]">
                      ${po.totalARS.toLocaleString('es-AR')} ARS
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicatePurchaseOrder(po.id)}
                      title="Duplicar Orden"
                      className="p-1.5 bg-[#F7F4EE] hover:bg-[#E6DFC8] text-[#2A1E17] rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPoToDelete(po)}
                      title="Eliminar Orden"
                      className="p-1.5 bg-[#F7F4EE] hover:bg-red-50 text-[#C86D51] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E6DFC8]">
            <span className="text-xs text-[#7A6B61]">
              Directorio comercial de proveedores, insumos aprovisionados y contacto directo
            </span>

            <button
              onClick={() => setActiveModal('supplier')}
              className="px-4 py-2 bg-[#C86D51] hover:bg-[#a85239] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Registrar Proveedor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((s) => {
              const waClean = s.phoneWhatsApp.replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${waClean}?text=${encodeURIComponent(
                `Hola ${s.contactPerson}! Te escribo de Kamelo Aromáticos para consultar por insumos.`
              )}`;

              return (
                <div key={s.id} className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6DFC8] space-y-4 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#2A1E17] text-[#D9822B] flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>

                      <button
                        onClick={() => setSupplierToDelete(s)}
                        className="text-[#C86D51] hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#2A1E17] mt-3">{s.name}</h3>
                    <p className="text-[#7A6B61] text-[11px]">Contacto: <strong>{s.contactPerson}</strong></p>

                    <div className="mt-3 space-y-1.5 text-[11px] text-[#7A6B61]">
                      {s.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C86D51]" /> {s.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D9822B]" /> Tiempo entrega: <strong>{s.deliveryTimeDays} días</strong>
                      </div>
                      <div>
                        Compra Mínima ARS: <strong className="text-[#2A1E17]">${s.minPurchaseARS.toLocaleString('es-AR')}</strong>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="mt-3 p-2.5 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8] text-[10px] text-[#7A6B61] italic">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E6DFC8]">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-[#25D366] hover:bg-[#1eb855] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-xs"
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
