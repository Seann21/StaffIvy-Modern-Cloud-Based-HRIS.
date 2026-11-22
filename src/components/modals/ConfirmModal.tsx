'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { Trash2 } from 'lucide-react';

export function ConfirmModal() {
  const { confirmModal, closeConfirmModal } = useHRIS();
  const { isOpen, title, description, onConfirm } = confirmModal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/45 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E5EAF2] shadow-hero w-full max-w-sm p-6 animate-fade-up text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-lg text-obsidian-900">{title || 'Konfirmasi Tindakan'}</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{description}</p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={closeConfirmModal}
            className="py-2.5 rounded-xl border border-[#DCE3EE] text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              closeConfirmModal();
            }}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}

