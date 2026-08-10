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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-[#3E342F] text-[#FBF8F4] border border-[#C98F7A]/40 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#D8C7B8]/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C98F7A]/20 border border-[#C98F7A]/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#C98F7A]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#FBF8F4] mb-1">{title}</h3>
            <p className="text-xs text-[#D8C7B8] leading-relaxed mb-6">{message}</p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#D8C7B8] bg-[#4B4038] hover:bg-[#5a4e45] transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#C98F7A] hover:bg-[#b87e6a] transition-colors shadow-xs"
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
