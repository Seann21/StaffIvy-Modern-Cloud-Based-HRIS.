'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { Receipt, X, FileDown } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import { generatePayslipPDF } from '@/lib/pdf-generator';

export function PayslipModal() {
  const { payslipModal, closePayslipModal, employees, calculatePayroll, showToast } = useHRIS();
  const { isOpen, employeeId } = payslipModal;

  if (!isOpen || !employeeId) return null;

  const emp = employees.find((e) => e.id === employeeId);
  if (!emp) return null;

  const calc = calculatePayroll(emp);

  const handleDownload = () => {
    try {
      generatePayslipPDF(calc, 'November 2026');
      showToast('Slip Gaji PDF Diunduh', `Berkas slip gaji resmi ${emp.name} berhasil diunduh.`, 'success');
    } catch (e) {
      showToast('Gagal Mengunduh PDF', 'Terjadi kesalahan saat membuat file PDF.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E5EAF2] shadow-hero w-full max-w-xl p-6 sm:p-7 my-8 animate-fade-up">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E5EAF2]">
          <div className="flex items-center gap-3">
            <div className="brand-mark w-10 h-10 rounded-xl flex items-center justify-center text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-obsidian-900">Rincian Slip Gaji Resmi</h3>
              <p className="text-xs text-slate-500">
                {emp.name} ({emp.id}) • Periode November 2026
              </p>
            </div>
          </div>
          <button
            onClick={closePayslipModal}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs">
            <div>
              <span className="text-slate-400">Divisi:</span>{' '}
              <strong className="text-obsidian-900">{emp.division}</strong>
            </div>
            <div>
              <span className="text-slate-400">Jabatan:</span>{' '}
              <strong className="text-obsidian-900">{emp.role}</strong>
            </div>
            <div>
              <span className="text-slate-400">Email:</span>{' '}
              <strong className="text-obsidian-900">{emp.email}</strong>
            </div>
            <div>
              <span className="text-slate-400">Keterlambatan:</span>{' '}
              <strong className={calc.lateCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                {calc.lateCount}x Late
              </strong>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-slate-500">Gaji Pokok</span>
              <span className="font-semibold tabular-nums">{formatIDR(emp.baseSalary)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-slate-500">Tunjangan Tetap</span>
              <span className="font-semibold tabular-nums">{formatIDR(emp.allowance)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-slate-500">
                Potongan Presensi ({calc.lateCount}x Rp 75.000)
              </span>
              <span className="font-semibold text-rose-600 tabular-nums">
                - {formatIDR(calc.attendanceDeduction)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
              <span className="text-slate-500">Pajak PPh 21 (5%)</span>
              <span className="font-semibold text-rose-600 tabular-nums">
                - {formatIDR(calc.taxDeduction)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700 uppercase">Gaji Bersih (Net Salary)</span>
            <span className="font-display font-extrabold text-2xl text-brand-700 tabular-nums">
              {formatIDR(calc.netSalary)}
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              onClick={closePayslipModal}
              className="px-4 py-2.5 rounded-xl border border-[#DCE3EE] text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              className="btn-brand px-5 py-2.5 rounded-xl text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Payslip (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

