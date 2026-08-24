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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white text-mejunje-tinta border border-mejunje-border rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-mejunje-griscalido hover:text-mejunje-tinta p-1 rounded-full hover:bg-mejunje-papel transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-700" />
          </div>
          <div>
            <h3 className="font-serif italic text-xl text-mejunje-tinta mb-1">{title}</h3>
            <p className="text-xs text-mejunje-griscalido leading-relaxed mb-6 font-sans">{message}</p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-medium text-mejunje-tinta bg-white border border-mejunje-border hover:bg-mejunje-papel transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-rose-700 hover:bg-rose-800 transition-colors shadow-xs"
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
