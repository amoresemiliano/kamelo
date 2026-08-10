'use client';

import React from 'react';
import { useKamelo } from '@/context/KameloContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useKamelo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-xs font-medium transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-[#3E342F] text-[#FBF8F4] border-[#7D9882] shadow-[#7D9882]/10'
                : isWarning
                ? 'bg-[#3E342F] text-[#FBF8F4] border-[#D6A36D] shadow-[#D6A36D]/10'
                : isError
                ? 'bg-[#3E342F] text-[#FBF8F4] border-[#C98F7A] shadow-[#C98F7A]/10'
                : 'bg-[#3E342F] text-[#FBF8F4] border-[#CBB8A6]'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#7D9882] shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-5 h-5 text-[#D6A36D] shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-[#C98F7A] shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-[#D8C7B8] shrink-0 mt-0.5" />}

            <div className="flex-1 leading-relaxed">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#D8C7B8]/70 hover:text-white p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
