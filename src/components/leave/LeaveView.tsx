'use client';

import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeaveRequestFormSchema, LeaveRequestFormValues } from '@/lib/schemas';
import { useHRIS } from '@/context/hris-context';
import { calculateBusinessDays, formatDisplayDate, getInitials } from '@/lib/utils';
import { uploadLeaveAttachment } from '@/lib/supabase';
import { Attachment, LeaveStatus } from '@/types';
import {
  CalendarPlus,
  Send,
  UploadCloud,
  FileCheck2,
  X,
  Calendar,
  Paperclip,
  Check,
  CheckCheck,
  User,
  ArrowUpRight,
} from 'lucide-react';

export function LeaveView() {
  const { currentRole } = useHRIS();
  return currentRole === 'hr_admin' ? <HRLeaveQueue /> : <EmployeeLeavePortal />;
}

/* =====================================================================
 * EMPLOYEE SELF-SERVICE LEAVE PORTAL
 * ===================================================================== */
function EmployeeLeavePortal() {
  const {
    currentUser,
    getLeaveBalance,
    leaveRequests,
    submitLeaveRequest,
    openAttachmentModal,
    switchRole,
    showToast,
  } = useHRIS();

  const balance = getLeaveBalance(currentUser.employeeId);
  const myRequests = leaveRequests.filter((r) => r.employeeId === currentUser.employeeId);
  const fileInputId = useId();

  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(LeaveRequestFormSchema),
    defaultValues: {
      type: 'Cuti Tahunan',
      startDate: '2026-12-07',
      endDate: '2026-12-08',
      reason: '',
    },
  });

  const watchType = watch('type');
  const watchStart = watch('startDate');
  const watchEnd = watch('endDate');

  const days = calculateBusinessDays(watchStart, watchEnd);
  const projectedRemaining = watchType === 'Cuti Tahunan' ? balance.remaining - days : balance.remaining;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const att = await uploadLeaveAttachment(file);
      setPendingAttachment(att);
      showToast('Lampiran Terunggah', `${file.name} (${att.size}) siap dilampirkan.`, 'info');
    } catch (err) {
      showToast('Gagal Mengunggah', 'Tidak dapat memproses berkas.', 'error');
    }
  };

  const onSubmit = (data: LeaveRequestFormValues) => {
    if (days <= 0) {
      showToast(
        'Tanggal Tidak Valid',
        'Pastikan rentang tanggal cuti berada pada hari kerja dan selesai setelah tanggal mulai.',
        'error'
      );
      return;
    }

    const success = submitLeaveRequest(data, days, pendingAttachment);
    if (success) {
      reset({
        type: 'Cuti Tahunan',
        startDate: '2026-12-07',
        endDate: '2026-12-08',
        reason: '',
      });
      setPendingAttachment(null);
    }
  };

  return (
    <div className="space-y-7 sm:space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-obsidian-900">
          Pengajuan Cuti &amp; Saldo Tahunan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Ajukan cuti dengan kalkulasi hari kerja otomatis, unggah surat dokter, dan pantau status persetujuan HR secara
          real-time.
        </p>
      </div>

      {/* 4 Annual Leave Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-soft">
          <div className="text-xs text-slate-500 font-medium">Kuota Cuti Tahunan</div>
          <div className="font-display font-bold text-2xl text-obsidian-900 mt-1.5 tabular-nums">
            {balance.quota} <span className="text-xs font-normal text-slate-400">Hari</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-soft">
          <div className="text-xs text-slate-500 font-medium">Terpakai (Approved)</div>
          <div className="font-display font-bold text-2xl text-brand-600 mt-1.5 tabular-nums">
            {balance.used} <span className="text-xs font-normal text-slate-400">Hari</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-soft">
          <div className="text-xs text-slate-500 font-medium">Menunggu Approval</div>
          <div className="font-display font-bold text-2xl text-amber-600 mt-1.5 tabular-nums">
            {balance.pending} <span className="text-xs font-normal text-slate-400">Hari</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 text-white shadow-blue-glow">
          <div className="text-xs text-white/80 font-medium">Sisa Saldo Tersedia</div>
          <div className="font-display font-bold text-2xl mt-1.5 tabular-nums">
            {balance.remaining} <span className="text-xs font-normal text-white/80">Hari</span>
          </div>
        </div>
      </div>

      {/* Form + History Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
        {/* Dynamic Leave Request Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5EAF2] p-6 shadow-soft">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#E5EAF2]">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-obsidian-900">Form Pengajuan Cuti</h2>
              <p className="text-[11px] text-slate-400">Langsung masuk ke Approval Queue HR Admin</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jenis Cuti</label>
              <select
                {...register('type')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE3EE] text-sm focus:outline-none focus:bg-white focus:border-brand-500"
              >
                <option value="Cuti Tahunan">Cuti Tahunan (Memotong Saldo)</option>
                <option value="Cuti Sakit">Cuti Sakit (Lampirkan Surat Dokter)</option>
                <option value="Izin Khusus">Izin Khusus</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Mulai</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE3EE] text-sm focus:outline-none focus:bg-white focus:border-brand-500"
                />
                {errors.startDate && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Selesai</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE3EE] text-sm focus:outline-none focus:bg-white focus:border-brand-500"
                />
                {errors.endDate && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Live Duration & Remaining Balance Box */}
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
                projectedRemaining < 0
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-brand-50/60 border-brand-100'
              }`}
            >
              <div>
                <div className="text-slate-500">Durasi Hari Kerja</div>
                <div className="font-display font-bold text-sm text-obsidian-900 mt-0.5">
                  {days > 0 ? `${days} Hari Kerja` : 'Rentang tanggal tidak valid'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-500">Proyeksi Sisa Saldo</div>
                <div
                  className={`font-display font-bold text-sm mt-0.5 ${
                    projectedRemaining < 0 ? 'text-rose-600' : 'text-brand-700'
                  }`}
                >
                  {watchType === 'Cuti Tahunan'
                    ? projectedRemaining < 0
                      ? `Melebihi saldo (${projectedRemaining} Hari)`
                      : `${projectedRemaining} Hari`
                    : `${balance.remaining} Hari (Tetap)`}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alasan / Keterangan</label>
              <textarea
                rows={3}
                {...register('reason')}
                placeholder="Jelaskan keperluan cuti dan rencana delegasi pekerjaan..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none focus:bg-white focus:border-brand-500 ${
                  errors.reason ? 'border-rose-500 bg-rose-50/40' : 'border-[#DCE3EE]'
                }`}
              />
              {errors.reason && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.reason.message}</p>
              )}
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lampiran / Surat Dokter <span className="text-slate-400 font-normal">(PDF, JPG, PNG)</span>
              </label>
              <label
                htmlFor={fileInputId}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-brand-400 bg-[#F8FAFC] hover:bg-brand-50/30 cursor-pointer transition-all text-center"
              >
                <UploadCloud className="w-5 h-5 text-brand-600 mb-1" />
                <span className="text-xs font-semibold text-obsidian-900">Klik untuk unggah dokumen pendukung</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Maksimal 5 MB • Supabase Storage Ready</span>
                <input
                  id={fileInputId}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {pendingAttachment && (
                <div className="mt-2 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-brand-50 border border-brand-200 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="font-semibold text-obsidian-900 truncate">{pendingAttachment.name}</span>
                    <span className="text-[11px] text-slate-500 shrink-0">({pendingAttachment.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-brand w-full py-3 rounded-xl text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pengajuan Cuti</span>
            </button>
          </form>
        </div>

        {/* Personal Leave History */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5EAF2] p-6 shadow-soft flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2]">
            <div>
              <h2 className="font-display font-bold text-base text-obsidian-900">Riwayat Pengajuan Cuti Saya</h2>
              <p className="text-[11px] text-slate-400">Status dan catatan revisi HR diperbarui otomatis</p>
            </div>
            <button
              onClick={() => switchRole('hr_admin')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Uji Approve di HR Admin</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 flex-1">
            {myRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">Belum ada pengajuan cuti.</div>
            ) : (
              myRequests.map((req) => {
                const statusStyles = {
                  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
                  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                }[req.status];

                return (
                  <div key={req.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-obsidian-900">{req.type}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E5EAF2] text-slate-600">
                          {req.days} Hari
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyles}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      <span>
                        {formatDisplayDate(req.startDate)} – {formatDisplayDate(req.endDate)}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>Dikirim {req.submittedAt}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{req.reason}</p>

                    {req.attachment && (
                      <button
                        onClick={() =>
                          openAttachmentModal(
                            req.attachment!,
                            req.attachment!.name,
                            `Lampiran ${req.type} • ${req.days} hari`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#DCE3EE] text-[11px] font-semibold text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>{req.attachment.name}</span>
                      </button>
                    )}

                    {req.hrNote && (
                      <div
                        className={`p-3 rounded-xl text-xs ${
                          req.status === 'Rejected'
                            ? 'bg-rose-50 border border-rose-100 text-rose-800'
                            : 'bg-emerald-50 border border-emerald-100 text-emerald-800'
                        }`}
                      >
                        <div className="font-bold text-[11px] mb-0.5">Catatan HR Admin:</div>
                        <div>{req.hrNote}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
 * HR ADMIN APPROVAL QUEUE
 * ===================================================================== */
function HRLeaveQueue() {
  const {
    leaveRequests,
    employees,
    getLeaveBalance,
    processLeaveDecision,
    openAttachmentModal,
    switchRole,
    showToast,
  } = useHRIS();

  const [activeStatusTab, setActiveStatusTab] = useState<LeaveStatus | 'All'>('Pending');
  const [hrNotes, setHrNotes] = useState<Record<string, string>>({});

  const counts = {
    Pending: leaveRequests.filter((r) => r.status === 'Pending').length,
    Approved: leaveRequests.filter((r) => r.status === 'Approved').length,
    Rejected: leaveRequests.filter((r) => r.status === 'Rejected').length,
    All: leaveRequests.length,
  };

  const list =
    activeStatusTab === 'All'
      ? leaveRequests
      : leaveRequests.filter((r) => r.status === activeStatusTab);

  const handleDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    const note = hrNotes[id]?.trim() || '';
    if (decision === 'Rejected' && !note) {
      showToast('Catatan Revisi Diperlukan', 'Mohon isi alasan penolakan atau instruksi revisi sebelum menolak.', 'warning');
      return;
    }
    processLeaveDecision(id, decision, note);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-obsidian-900">Leave Approval Queue</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tinjau pengajuan cuti karyawan, periksa lampiran surat dokter, dan berikan keputusan sekali klik beserta
            catatan revisi.
          </p>
        </div>
        <button
          onClick={() => switchRole('employee')}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE3EE] hover:bg-slate-50 text-xs font-semibold text-obsidian-900 inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <User className="w-4 h-4 text-brand-600" />
          <span>Lihat Sisi Employee</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((tab) => {
          const active = activeStatusTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveStatusTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 transition-all cursor-pointer ${
                active
                  ? 'bg-brand-600 text-white shadow-blue-glow'
                  : 'bg-white border border-[#E5EAF2] text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Approval Cards List */}
      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5EAF2] p-12 text-center shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCheck className="w-6 h-6" />
            </div>
            <div className="font-display font-bold text-base text-obsidian-900">
              Tidak Ada Pengajuan di Tab {activeStatusTab}
            </div>
            <p className="text-xs text-slate-400 mt-1">Semua pengajuan pada kategori ini sudah ditangani.</p>
          </div>
        ) : (
          list.map((req) => {
            const emp = employees.find((e) => e.id === req.employeeId);
            const bal = getLeaveBalance(req.employeeId);
            const badgeStyle = {
              Pending: 'bg-amber-50 text-amber-700 border-amber-200',
              Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
            }[req.status];

            return (
              <div key={req.id} className="bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-6 shadow-soft">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Request Details */}
                  <div className={`${req.status === 'Pending' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-display font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(emp?.name)}
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm sm:text-base text-obsidian-900">
                            {emp?.name || req.employeeId}
                          </div>
                          <div className="text-xs text-slate-400">
                            {emp?.role || ''} • {emp?.division || ''}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Jenis &amp; Durasi</div>
                        <div className="text-xs font-bold text-obsidian-900 mt-0.5">
                          {req.type} ({req.days} Hari)
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Tanggal Cuti</div>
                        <div className="text-xs font-bold text-obsidian-900 mt-0.5">
                          {formatDisplayDate(req.startDate)} – {formatDisplayDate(req.endDate)}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] col-span-2 sm:col-span-1">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Sisa Saldo Tahunan</div>
                        <div className="text-xs font-bold text-brand-600 mt-0.5">
                          {bal.remaining} / {bal.quota} Hari
                        </div>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <span className="font-semibold text-obsidian-900">Alasan:</span> {req.reason}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {req.attachment ? (
                        <button
                          onClick={() =>
                            openAttachmentModal(
                              req.attachment!,
                              req.attachment!.name,
                              `Diunggah oleh ${emp?.name || req.employeeId}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Lihat Lampiran: {req.attachment.name}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Tanpa lampiran dokumen</span>
                      )}
                      <span className="text-[11px] text-slate-400">Dikirim: {req.submittedAt}</span>
                    </div>

                    {req.status !== 'Pending' && req.hrNote && (
                      <div
                        className={`p-3 rounded-xl text-xs ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 border border-emerald-100 text-emerald-800'
                            : 'bg-rose-50 border border-rose-100 text-rose-800'
                        }`}
                      >
                        <strong>Catatan Keputusan HR:</strong> {req.hrNote}
                      </div>
                    )}
                  </div>

                  {/* One-Click HR Decision Panel */}
                  {req.status === 'Pending' && (
                    <div className="lg:col-span-5 lg:border-l lg:border-[#E5EAF2] lg:pl-5 flex flex-col justify-between gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Catatan / Revisi HR Admin
                        </label>
                        <textarea
                          rows={3}
                          value={hrNotes[req.id] || ''}
                          onChange={(e) =>
                            setHrNotes((prev) => ({ ...prev, [req.id]: e.target.value }))
                          }
                          placeholder="Tambahkan catatan persetujuan atau instruksi revisi untuk karyawan..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE3EE] text-xs focus:outline-none focus:bg-white focus:border-brand-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => handleDecision(req.id, 'Approved')}
                          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleDecision(req.id, 'Rejected')}
                          className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

