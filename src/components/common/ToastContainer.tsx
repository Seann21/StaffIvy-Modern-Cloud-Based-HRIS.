'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { CheckCircle2, AlertCircle, AlertTriangle, Sparkles, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useHRIS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none">
      {toasts.map((toast) => {
        const config = {
          success: {
            bg: 'bg-white border-emerald-200',
            iconBg: 'bg-emerald-50 text-emerald-600',
            icon: CheckCircle2,
          },
          error: {
            bg: 'bg-white border-rose-200',
            iconBg: 'bg-rose-50 text-rose-600',
            icon: AlertCircle,
          },
          warning: {
            bg: 'bg-white border-amber-200',
            iconBg: 'bg-amber-50 text-amber-600',
            icon: AlertTriangle,
          },
          info: {
            bg: 'bg-white border-brand-200',
            iconBg: 'bg-brand-50 text-brand-600',
            icon: Sparkles,
          },
        }[toast.type];

        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-hero ${config.bg} animate-fade-up`}
          >
            <div className={`w-8 h-8 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-obsidian-900">{toast.title}</div>
              {toast.message && (
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{toast.message}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

