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
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-xs font-medium transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-[#2A1E17] text-[#F7F4EE] border-[#6E8B74] shadow-[#6E8B74]/10'
                : isWarning
                ? 'bg-[#2A1E17] text-[#F7F4EE] border-[#D9822B] shadow-[#D9822B]/10'
                : isError
                ? 'bg-[#2A1E17] text-[#F7F4EE] border-[#C86D51] shadow-[#C86D51]/10'
                : 'bg-[#2A1E17] text-[#F7F4EE] border-[#8C7A6B]'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#6E8B74] shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-5 h-5 text-[#D9822B] shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-[#8C7A6B] shrink-0 mt-0.5" />}

            <div className="flex-1 leading-relaxed">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#E6DFC8]/60 hover:text-white p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
