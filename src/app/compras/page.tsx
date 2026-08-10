'use client';

import { useState } from 'react';
import {
  ShoppingBag,
  Factory,
  AlertTriangle,
  CheckCircle,
  Plus,
  FileText,
  ChevronDown,
  ChevronUp,
  PackageCheck
} from '@/components/Icons';
import { mockSupplierGroups, mockSuppliers } from '@/data/mockData';
import { SupplierRequirementGroup } from '@/types';

export default function ComprasPage() {
  const [groups, setGroups] = useState<SupplierRequirementGroup[]>(mockSupplierGroups);
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(groups[0].supplierId);

  const handleAddRequirement = (supplierId: string) => {
    // Add extra requirement simulation to reach minimum
    setGroups(prev => prev.map(group => {
      if (group.supplierId === supplierId) {
        const extraARS = 30000;
        const updatedTotal = group.totalARS + extraARS;
        return {
          ...group,
          totalARS: updatedTotal,
          meetsMinimum: updatedTotal >= group.minPurchaseARS,
          requirements: [
            ...group.requirements,
            {
              ingredientId: `extra-${Date.now()}`,
              ingredientName: 'Reserva Adicional de Esencias de Seguridad',
              requiredQty: 150,
              unit: 'ml',
              estimatedCostARS: extraARS,
              formulaReferences: ['Stock de Seguridad General'],
            }
          ]
        };
      }
      return group;
    }));
  };

  const handleGeneratePO = (supplierName: string) => {
    alert(`Orden de Compra generada exitosamente para ${supplierName}. Enviando notificación al proveedor.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6DFC8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#6E8B74]/20 text-[#6E8B74] text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" /> Módulo de Logística & Adquisiciones
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2A1E17]">
            Compras Consolidadas por Proveedor
          </h1>
          <p className="text-xs text-[#7A6B61] mt-1">
            Agrupación inteligente de requerimientos para alcanzar el monto mínimo de compra en ARS y maximizar bonificaciones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Simulación: Sincronizando con stocks de laboratorio')}
            className="px-4 py-2 bg-[#2A1E17] text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-[#3D2C22] transition-colors"
          >
            <PackageCheck className="w-4 h-4 text-[#D9822B]" /> Sincronizar Requerimientos
          </button>
        </div>
      </div>

      {/* Supplier Groups Cards */}
      <div className="space-y-6">
        {groups.map((group) => {
          const isExpanded = expandedSupplier === group.supplierId;
          const percent = Math.min(100, Math.round((group.totalARS / group.minPurchaseARS) * 100));

          return (
            <div
              key={group.supplierId}
              className="bg-white rounded-2xl shadow-sm border border-[#E6DFC8] overflow-hidden transition-all"
            >
              {/* Group Header */}
              <div
                onClick={() => setExpandedSupplier(isExpanded ? null : group.supplierId)}
                className="p-5 bg-gradient-to-r from-white to-[#F7F4EE] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F4EE] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2A1E17] text-white flex items-center justify-center font-bold">
                    <Factory className="w-5 h-5 text-[#D9822B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-base text-[#2A1E17]">{group.supplierName}</h2>
                      {group.meetsMinimum ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Mínimo Alcanzado
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Faltan ${(group.minPurchaseARS - group.totalARS).toLocaleString('es-AR')} ARS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6B61] mt-0.5">
                      Mínimo de Compra Exigido: <strong className="text-[#2A1E17]">${group.minPurchaseARS.toLocaleString('es-AR')} ARS</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-[#7A6B61]">Total Acumulado:</span>
                    <div className="text-lg font-bold text-[#C86D51]">
                      ${group.totalARS.toLocaleString('es-AR')} ARS
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#E6DFC8]/50 text-[#2A1E17]">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-5 pb-2">
                <div className="w-full bg-[#E6DFC8] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 transition-all duration-500 ${
                      group.meetsMinimum ? 'bg-[#6E8B74]' : 'bg-[#D9822B]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Collapsible Detail Table */}
              {isExpanded && (
                <div className="p-5 border-t border-[#E6DFC8] space-y-4 bg-white">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A6B61]">
                    Insumos Requeridos en este Pedido
                  </h3>

                  <div className="overflow-x-auto border border-[#E6DFC8] rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#2A1E17] text-[#E6DFC8]">
                        <tr>
                          <th className="p-3 font-semibold">Insumo / Ingrediente</th>
                          <th className="p-3 font-semibold">Fórmulas Destino</th>
                          <th className="p-3 font-semibold text-center">Cantidad Requerida</th>
                          <th className="p-3 font-semibold text-right">Subtotal Estimado ARS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6DFC8]">
                        {group.requirements.map((req) => (
                          <tr key={req.ingredientId} className="hover:bg-[#F7F4EE]/60 transition-colors">
                            <td className="p-3 font-bold text-[#2A1E17]">{req.ingredientName}</td>
                            <td className="p-3 text-[#7A6B61]">
                              {req.formulaReferences.map((ref, idx) => (
                                <span key={idx} className="inline-block bg-[#F7F4EE] px-2 py-0.5 rounded text-[10px] mr-1 border border-[#E6DFC8]">
                                  {ref}
                                </span>
                              ))}
                            </td>
                            <td className="p-3 text-center font-bold text-[#C86D51]">
                              {req.requiredQty} {req.unit}
                            </td>
                            <td className="p-3 text-right font-bold text-[#2A1E17]">
                              ${req.estimatedCostARS.toLocaleString('es-AR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                    <button
                      onClick={() => handleAddRequirement(group.supplierId)}
                      className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#F7F4EE] border border-[#E6DFC8] text-[#2A1E17] text-xs font-semibold flex items-center justify-center gap-2 hover:border-[#C86D51] transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#C86D51]" /> Agregar Insumo para Completar Mínimo
                    </button>

                    <button
                      disabled={!group.meetsMinimum}
                      onClick={() => handleGeneratePO(group.supplierName)}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                        group.meetsMinimum
                          ? 'bg-[#6E8B74] hover:bg-[#5b7561] text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FileText className="w-4 h-4" /> Generar Orden de Compra Agrupada
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
