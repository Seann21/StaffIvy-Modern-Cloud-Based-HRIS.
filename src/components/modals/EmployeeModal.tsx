'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeFormSchema, EmployeeFormValues } from '@/lib/schemas';
import { useHRIS } from '@/context/hris-context';
import { X, ShieldCheck, Check } from 'lucide-react';

export function EmployeeModal() {
  const { employeeModal, closeEmployeeModal, employees, addEmployee, updateEmployee } = useHRIS();
  const { isOpen, employeeId } = employeeModal;

  const currentEmp = employeeId ? employees.find((e) => e.id === employeeId) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      division: 'Engineering',
      role: '',
      status: 'Active',
      baseSalary: 12000000,
      allowance: 1500000,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (currentEmp) {
        reset({
          name: currentEmp.name,
          email: currentEmp.email,
          phone: currentEmp.phone,
          division: currentEmp.division,
          role: currentEmp.role,
          status: currentEmp.status,
          baseSalary: currentEmp.baseSalary,
          allowance: currentEmp.allowance,
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          division: 'Engineering',
          role: '',
          status: 'Active',
          baseSalary: 12000000,
          allowance: 1500000,
        });
      }
    }
  }, [isOpen, currentEmp, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: EmployeeFormValues) => {
    let success = false;
    if (employeeId) {
      success = updateEmployee(employeeId, data);
    } else {
      success = addEmployee(data);
    }
    if (success) {
      closeEmployeeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/45 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E5EAF2] shadow-hero w-full max-w-2xl p-6 sm:p-7 my-8 animate-fade-up">
        <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#E5EAF2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[11px] font-semibold mb-1.5">
              <ShieldCheck className="w-3 h-3" /> Zod Schema Validated Form
            </div>
            <h3 className="font-display font-bold text-xl text-obsidian-900">
              {employeeId ? `Edit Karyawan — ${employeeId}` : 'Tambah Karyawan Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mencegah duplikasi email serta memvalidasi format nomor telepon Indonesia &amp; nominal gaji.
            </p>
          </div>
          <button
            onClick={closeEmployeeModal}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-obsidian-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Contoh: Bagas Mahendra"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-colors ${
                  errors.name ? 'border-rose-500 bg-rose-50/40' : 'border-[#DCE3EE]'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Perusahaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="nama@staffivy.id"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-colors ${
                  errors.email ? 'border-rose-500 bg-rose-50/40' : 'border-[#DCE3EE]'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Telepon (ID) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('phone')}
                placeholder="081234567890 atau +62812..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-colors ${
                  errors.phone ? 'border-rose-500 bg-rose-50/40' : 'border-[#DCE3EE]'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* Division */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Divisi <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('division')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE3EE] text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-colors"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jabatan / Role <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('role')}
                placeholder="Contoh: Product Designer"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-colors ${
                  errors.role ? 'border-rose-500 bg-rose-50/40' : 'border-[#DCE3EE]'
                }`}
              />
              {errors.role && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.role.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status Karyawan</label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE3EE] text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-colors"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            {/* Base Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gaji Pokok (IDR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={100000}
                {...register('baseSalary')}
                placeholder="Min. 3000000"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm tabular-nums focus:outline-none focus:bg-white focus:border-brand-500 transition-colors ${
                  errors.baseSalary ? 'border-rose-500 bg-rose-50/40' : 'border-[#DCE3EE]'
                }`}
              />
              {errors.baseSalary && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.baseSalary.message}</p>
              )}
            </div>

            {/* Allowance */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tunjangan Tetap (IDR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={50000}
                {...register('allowance')}
                placeholder="Contoh: 2500000"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm tabular-nums focus:outline-none focus:bg-white focus:border-brand-500 transition-colors ${
                  errors.allowance ? 'border-rose-500 bg-rose-50/40' : 'border-[#DCE3EE]'
                }`}
              />
              {errors.allowance && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.allowance.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5EAF2]">
            <button
              type="button"
              onClick={closeEmployeeModal}
              className="px-4 py-2.5 rounded-xl border border-[#DCE3EE] text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-brand px-5 py-2.5 rounded-xl text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{employeeId ? 'Simpan Perubahan' : 'Simpan Data Karyawan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

