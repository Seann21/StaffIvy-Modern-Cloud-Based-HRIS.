'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { Paperclip, X, FileText, ShieldCheck } from 'lucide-react';

export function AttachmentModal() {
  const { attachmentModal, closeAttachmentModal } = useHRIS();
  const { isOpen, attachment, title, subtitle } = attachmentModal;

  if (!isOpen || !attachment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E5EAF2] shadow-hero w-full max-w-lg p-6 animate-fade-up">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5EAF2]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Paperclip className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-display font-bold text-sm text-obsidian-900 truncate">
                {title || attachment.name}
              </div>
              <div className="text-[11px] text-slate-400">
                {subtitle || `${attachment.size} • Dokumen Lampiran`}
              </div>
            </div>
          </div>
          <button
            onClick={closeAttachmentModal}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] p-6 text-center">
          {attachment.previewUrl && attachment.type.startsWith('image/') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={attachment.previewUrl}
              alt="Lampiran"
              className="max-h-72 mx-auto rounded-xl border border-[#E5EAF2] object-contain"
            />
          ) : (
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <div className="font-display font-bold text-sm text-obsidian-900">{attachment.name}</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Dokumen lampiran terverifikasi tersimpan dengan aman di storage sistem.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Document ({attachment.size})
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={closeAttachmentModal}
            className="btn-obsidian px-4 py-2 rounded-xl text-white text-xs font-semibold cursor-pointer"
          >
            Tutup Preview
          </button>
        </div>
      </div>
    </div>
  );
}

