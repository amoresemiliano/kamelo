'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-[#2A1E17] text-[#F7F4EE] border border-[#C86D51]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#E6DFC8]/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C86D51]/20 border border-[#C86D51]/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#C86D51]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#F7F4EE] mb-1">{title}</h3>
            <p className="text-xs text-[#E6DFC8]/80 leading-relaxed mb-6">{message}</p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#E6DFC8] bg-[#3D2C22] hover:bg-[#523B2E] transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#C86D51] hover:bg-[#a85239] transition-colors shadow-md"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
