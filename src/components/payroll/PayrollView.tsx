'use client';

import React, { useState } from 'react';
import { useHRIS } from '@/context/hris-context';
import { formatIDR, formatShortIDR, getInitials } from '@/lib/utils';
import { generatePayslipPDF } from '@/lib/pdf-generator';
import { Calculator, FileDown, PlusCircle, MinusCircle, Download } from 'lucide-react';

export function PayrollView() {
  const { currentRole } = useHRIS();
  return currentRole === 'hr_admin' ? <HRPayrollView /> : <EmployeePayslipView />;
}

/* =====================================================================
 * HR ADMIN PAYROLL ENGINE
 * ===================================================================== */
function HRPayrollView() {
  const { employees, calculatePayroll, openPayslipModal, showToast } = useHRIS();
  const [payrollMonth, setPayrollMonth] = useState('November 2026');
  const [divisionFilter, setDivisionFilter] = useState('All');

  const rows = employees
    .filter((e) => divisionFilter === 'All' || e.division === divisionFilter)
    .map(calculatePayroll);

  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  const totalDeductions = rows.reduce((s, r) => s + r.totalDeductions, 0);
  const totalNet = rows.reduce((s, r) => s + r.netSalary, 0);

  const handleDownloadPDF = (calc: any) => {
    try {
      generatePayslipPDF(calc, payrollMonth);
      showToast('Slip Gaji PDF Diunduh', `Slip gaji ${calc.employee.name} siap.`, 'success');
    } catch {
      showToast('Gagal Mengunduh', 'Terjadi masalah pembuatan PDF.', 'error');
    }
  };

  return (
    <div className="space-y-7 sm:space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-obsidian-900">Automated Payroll Engine</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Kalkulasi gaji bersih otomatis tersinkron dengan log keterlambatan presensi &amp; ekspor slip PDF resmi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={payrollMonth}
            onChange={(e) => setPayrollMonth(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE3EE] text-xs font-semibold text-obsidian-900 focus:outline-none"
          >
            <option value="November 2026">November 2026</option>
            <option value="Oktober 2026">Oktober 2026</option>
            <option value="September 2026">September 2026</option>
          </select>
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE3EE] text-xs font-semibold text-obsidian-900 focus:outline-none"
          >
            <option value="All">Semua Divisi</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      {/* Transparent Formula Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/70 border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-obsidian-900">Rumus Kalkulasi Otomatis StaffIvy</div>
            <div className="text-slate-600 mt-0.5">
              <span className="font-semibold text-brand-700">Gaji Bersih</span> = (Gaji Pokok + Tunjangan) &minus;
              (Potongan Presensi <strong>Rp 75.000/Late</strong> + Pajak PPh 21 <strong>5%</strong>)
            </div>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white text-brand-700 border border-brand-100 self-start sm:self-center shrink-0">
          Live Attendance Linked
        </span>
      </div>

      {/* Payroll Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-soft">
          <div className="text-xs text-slate-500 font-medium">Total Pendapatan Kotor (Gross)</div>
          <div className="font-display font-bold text-2xl text-obsidian-900 tabular-nums mt-1">
            {formatIDR(totalGross)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {rows.length} karyawan pada periode {payrollMonth}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-soft">
          <div className="text-xs text-slate-500 font-medium">Total Potongan Presensi &amp; PPh 21</div>
          <div className="font-display font-bold text-2xl text-rose-600 tabular-nums mt-1">
            - {formatIDR(totalDeductions)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Termasuk akumulasi keterlambatan WIB</div>
        </div>
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 text-white shadow-blue-glow">
          <div className="text-xs text-white/80 font-medium">Total Take-Home Pay (Net)</div>
          <div className="font-display font-bold text-2xl tabular-nums mt-1">{formatIDR(totalNet)}</div>
          <div className="text-[11px] text-white/80 mt-1">Siap dibayarkan &amp; ekspor PDF</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5EAF2] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Karyawan</th>
                <th className="py-3.5 px-4">Gaji Pokok + Tunj.</th>
                <th className="py-3.5 px-4">Pot. Presensi</th>
                <th className="py-3.5 px-4">PPh 21 (5%)</th>
                <th className="py-3.5 px-4">Gaji Bersih</th>
                <th className="py-3.5 px-5 text-right">Slip Gaji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-sm">
              {rows.map((r) => (
                <tr key={r.employee.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(r.employee.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-obsidian-900 text-xs sm:text-sm">
                          {r.employee.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {r.employee.division} • {r.employee.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-semibold text-obsidian-900 tabular-nums">
                      {formatIDR(r.gross)}
                    </div>
                    <div className="text-[11px] text-slate-400 tabular-nums">
                      {formatShortIDR(r.employee.baseSalary)} + {formatShortIDR(r.employee.allowance)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {r.lateCount > 0 ? (
                      <div>
                        <div className="text-xs font-semibold text-rose-600 tabular-nums">
                          - {formatIDR(r.attendanceDeduction)}
                        </div>
                        <div className="text-[10px] font-semibold text-amber-600">{r.lateCount}x Late</div>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600">Rp 0 (Disiplin)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-rose-600 tabular-nums">
                    - {formatIDR(r.taxDeduction)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs sm:text-sm font-bold text-obsidian-900 tabular-nums">
                      {formatIDR(r.netSalary)}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openPayslipModal(r.employee.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#DCE3EE] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(r)}
                        className="btn-brand px-3 py-1.5 rounded-lg text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
 * EMPLOYEE SELF-SERVICE PAYSLIP VIEW
 * ===================================================================== */
function EmployeePayslipView() {
  const { currentUser, employees, calculatePayroll, showToast } = useHRIS();
  const [payrollMonth, setPayrollMonth] = useState('November 2026');

  const emp = employees.find((e) => e.id === currentUser.employeeId);
  if (!emp) return null;

  const calc = calculatePayroll(emp);

  const handleDownload = () => {
    try {
      generatePayslipPDF(calc, payrollMonth);
      showToast('Slip Gaji PDF Diunduh', `Berkas slip gaji resmi ${emp.name} berhasil diunduh.`, 'success');
    } catch {
      showToast('Gagal Mengunduh PDF', 'Terjadi kesalahan saat membuat file PDF.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-obsidian-900">Slip Gaji Resmi (Payslip)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rincian kalkulasi gaji bersih otomatis periode {payrollMonth}.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <select
            value={payrollMonth}
            onChange={(e) => setPayrollMonth(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE3EE] text-xs font-semibold text-obsidian-900 focus:outline-none"
          >
            <option value="November 2026">November 2026</option>
            <option value="Oktober 2026">Oktober 2026</option>
            <option value="September 2026">September 2026</option>
          </select>
          <button
            onClick={handleDownload}
            className="btn-brand px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Payslip (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Payslip Card */}
      <div className="bg-white rounded-3xl border border-[#E5EAF2] shadow-card overflow-hidden max-w-3xl mx-auto">
        {/* Brand Header Bar */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center">
              <svg
                width="22"
                height="22"
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
              <div className="font-display font-bold text-lg">PT StaffIvy Teknologi Indonesia</div>
              <div className="text-xs text-white/80">Official Confidential Salary Slip • {payrollMonth}</div>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Verified Payroll
            </span>
            <div className="text-[11px] text-white/75 mt-1">Ref: PAY-{emp.id}-202611</div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Employee Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs">
            <div>
              <div className="text-slate-400">Nama Karyawan</div>
              <div className="font-bold text-obsidian-900 mt-0.5">{emp.name}</div>
            </div>
            <div>
              <div className="text-slate-400">ID Karyawan</div>
              <div className="font-bold text-obsidian-900 mt-0.5">{emp.id}</div>
            </div>
            <div>
              <div className="text-slate-400">Divisi</div>
              <div className="font-bold text-obsidian-900 mt-0.5">{emp.division}</div>
            </div>
            <div>
              <div className="text-slate-400">Jabatan</div>
              <div className="font-bold text-obsidian-900 mt-0.5">{emp.role}</div>
            </div>
          </div>

          {/* Earnings & Deductions Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" /> Pendapatan (Earnings)
              </div>
              <div className="space-y-2.5 text-sm border-t border-[#E5EAF2] pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gaji Pokok</span>
                  <span className="font-semibold text-obsidian-900 tabular-nums">{formatIDR(emp.baseSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tunjangan Tetap</span>
                  <span className="font-semibold text-obsidian-900 tabular-nums">{formatIDR(emp.allowance)}</span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-dashed border-[#DCE3EE] font-bold">
                  <span className="text-obsidian-900">Total Pendapatan</span>
                  <span className="text-emerald-700 tabular-nums">{formatIDR(calc.gross)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <MinusCircle className="w-4 h-4" /> Potongan (Deductions)
              </div>
              <div className="space-y-2.5 text-sm border-t border-[#E5EAF2] pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Potongan Presensi ({calc.lateCount}x Late)</span>
                  <span className="font-semibold text-rose-600 tabular-nums">
                    - {formatIDR(calc.attendanceDeduction)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pajak PPh 21 (5%)</span>
                  <span className="font-semibold text-rose-600 tabular-nums">- {formatIDR(calc.taxDeduction)}</span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-dashed border-[#DCE3EE] font-bold">
                  <span className="text-obsidian-900">Total Potongan</span>
                  <span className="text-rose-600 tabular-nums">- {formatIDR(calc.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Take-Home Pay Callout */}
          <div className="p-5 rounded-2xl bg-brand-50 border border-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Gaji Bersih Diterima (Take-Home Pay)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Formula: ({formatShortIDR(emp.baseSalary)} + {formatShortIDR(emp.allowance)}) &minus; (
                {formatShortIDR(calc.attendanceDeduction)} + {formatShortIDR(calc.taxDeduction)})
              </div>
            </div>
            <div className="font-display font-extrabold text-3xl text-brand-700 tabular-nums">
              {formatIDR(calc.netSalary)}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E5EAF2]">
            <div className="text-[11px] text-slate-400">
              Dokumen ini diterbitkan secara otomatis oleh <strong>StaffIvy Cloud HRIS</strong> dan sah tanpa tanda tangan
              basah.
            </div>
            <button
              onClick={handleDownload}
              className="btn-obsidian w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Payslip (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

