'use client';

import React, { useState } from 'react';
import { useHRIS } from '@/context/hris-context';
import { X, ShieldCheck, UserCircle, ArrowRight } from 'lucide-react';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, enterWorkspace } = useHRIS();
  const [ssoEmail, setSsoEmail] = useState('nadia.kusuma@staffivy.id');

  if (!isLoginModalOpen) return null;

  const handleSSO = (e: React.FormEvent) => {
    e.preventDefault();
    closeLoginModal();
    if (ssoEmail.includes('nadia') || ssoEmail.includes('hr')) {
      enterWorkspace('hr_admin');
    } else {
      enterWorkspace('employee');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/45 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E5EAF2] shadow-hero w-full max-w-md p-6 sm:p-8 animate-fade-up relative">
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-obsidian-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="brand-mark w-10 h-10 rounded-xl flex items-center justify-center text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-obsidian-900">Masuk ke StaffIvy</h3>
            <p className="text-xs text-slate-500">Pilih peran demo instan tanpa registrasi manual</p>
          </div>
        </div>

        {/* Dual-Role Demo Switcher */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => {
              closeLoginModal();
              enterWorkspace('hr_admin');
            }}
            className="w-full p-4 rounded-2xl border-2 border-brand-500 bg-brand-50/50 hover:bg-brand-50 text-left flex items-center justify-between gap-3 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-obsidian-900">Demo as HR Admin</div>
                <div className="text-xs text-slate-500">Nadia Kusuma • Akses penuh direktori, approval &amp; payroll</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => {
              closeLoginModal();
              enterWorkspace('employee');
            }}
            className="w-full p-4 rounded-2xl border border-[#DCE3EE] bg-white hover:bg-slate-50 text-left flex items-center justify-between gap-3 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-obsidian-900 text-white flex items-center justify-center shrink-0">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-obsidian-900">Demo as Employee</div>
                <div className="text-xs text-slate-500">Raka Pratama • Clock In/Out, ajukan cuti &amp; unduh slip PDF</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-[#E5EAF2] w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 whitespace-nowrap">
            atau SSO Perusahaan
          </span>
          <div className="border-t border-[#E5EAF2] w-full" />
        </div>

        <form onSubmit={handleSSO} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Perusahaan</label>
            <input
              type="email"
              value={ssoEmail}
              onChange={(e) => setSsoEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-sm focus:outline-none focus:bg-white focus:border-brand-500"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-obsidian w-full py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer"
          >
            Lanjutkan dengan SSO
          </button>
        </form>
      </div>
    </div>
  );
}

