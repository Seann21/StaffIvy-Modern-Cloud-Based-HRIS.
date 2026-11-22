'use client';

import React, { useState, useEffect } from 'react';
import { useHRIS } from '@/context/hris-context';
import { formatDisplayDate, computeWorkDuration, getInitials } from '@/lib/utils';
import {
  LogIn,
  LogOut,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export function AttendanceView() {
  const {
    currentRole,
    currentUser,
    attendanceLogs,
    employees,
    attendanceClockMode,
    setAttendanceClockMode,
    handleClockAction,
    resetTodayAttendance,
    getEffectiveClockTime,
  } = useHRIS();

  const isHR = currentRole === 'hr_admin';
  const today = '2026-11-22';
  const [clockDisplay, setClockDisplay] = useState(getEffectiveClockTime().full);
  const [divFilter, setDivFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const timer = setInterval(() => {
      setClockDisplay(getEffectiveClockTime().full);
    }, 1000);
    return () => clearInterval(timer);
  }, [getEffectiveClockTime]);

  const clock = getEffectiveClockTime();
  const currentMinutes = clock.hh * 60 + clock.mm;
  const wouldBeLate = currentMinutes > 480; // > 08:00 WIB

  const myTodayLog = attendanceLogs.find(
    (l) => l.employeeId === currentUser.employeeId && l.date === today
  );
  const hasClockedIn = Boolean(myTodayLog);
  const hasClockedOut = Boolean(myTodayLog && myTodayLog.clockOut);

  // Filter attendance logs
  let logs = isHR
    ? [...attendanceLogs]
    : attendanceLogs.filter((l) => l.employeeId === currentUser.employeeId);

  if (isHR) {
    if (divFilter !== 'All') {
      logs = logs.filter((l) => {
        const emp = employees.find((e) => e.id === l.employeeId);
        return emp?.division === divFilter;
      });
    }
    if (statusFilter !== 'All') {
      logs = logs.filter((l) => l.status === statusFilter);
    }
  }

  return (
    <div className="space-y-7 sm:space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-obsidian-900">
          One-Click Attendance &amp; Real-Time Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Pencatatan presensi presisi server WIB dengan deteksi otomatis status{' '}
          <strong className="text-amber-600">Late</strong> bila Clock In melewati pukul <strong>08:00 WIB</strong>.
        </p>
      </div>

      {/* Prominent Attendance Action Card */}
      <div className="bg-white rounded-3xl border border-[#E5EAF2] shadow-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Live Clock & Interactive Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-white to-brand-50/50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <span>Minggu, 22 November 2026 • Waktu Indonesia Barat (UTC+7)</span>
              </div>

              <div className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-obsidian-900 tabular-nums">
                {clockDisplay}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E5EAF2] text-slate-600 font-medium">
                  Batas Jam Masuk: <strong className="text-obsidian-900">08:00 WIB</strong>
                </span>
                {!hasClockedIn ? (
                  <span
                    className={`px-2.5 py-1 rounded-lg font-semibold ${
                      wouldBeLate
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {wouldBeLate
                      ? 'Clock In sekarang akan tercatat: Late (>08:00)'
                      : 'Clock In sekarang akan tercatat: On Time'}
                  </span>
                ) : (
                  <span
                    className={`px-2.5 py-1 rounded-lg font-semibold ${
                      myTodayLog?.status === 'Late'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    Status Hari Ini: {myTodayLog?.status}
                    {(myTodayLog?.lateMinutes ?? 0) > 0 ? ` (+${myTodayLog?.lateMinutes} mnt)` : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Recruiter Clock Override Toggle */}
            <div className="mt-6 pt-5 border-t border-[#E5EAF2]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                <span>Demo Clock Override (Uji Deteksi On Time / Late Kapan Saja)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'live', label: 'Live WIB Time' },
                  { id: 'sim_ontime', label: 'Simulasi 07:45 (On Time)' },
                  { id: 'sim_late', label: 'Simulasi 08:25 (Late)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAttendanceClockMode(opt.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      attendanceClockMode === opt.id
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-white text-slate-600 border-[#DCE3EE] hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F8FAFC] border-t lg:border-t-0 lg:border-l border-[#E5EAF2] flex flex-col items-center justify-center text-center">
            <div className="text-xs font-semibold text-slate-500 mb-4">
              Absensi untuk <span className="text-obsidian-900 font-bold">{currentUser.name}</span>
            </div>

            {!hasClockedIn ? (
              <button
                onClick={handleClockAction}
                className="relative pulse-ring btn-brand text-white w-44 h-44 rounded-full flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-8 h-8" />
                <span className="font-display font-bold text-lg">Clock In</span>
                <span className="text-[11px] text-white/80">Tap untuk masuk</span>
              </button>
            ) : !hasClockedOut ? (
              <button
                onClick={handleClockAction}
                className="relative pulse-ring btn-obsidian text-white w-44 h-44 rounded-full flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-8 h-8 text-amber-400" />
                <span className="font-display font-bold text-lg">Clock Out</span>
                <span className="text-[11px] text-slate-300">Masuk: {myTodayLog?.clockIn} WIB</span>
              </button>
            ) : (
              <div className="w-44 h-44 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-700 flex flex-col items-center justify-center gap-1.5">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                <span className="font-display font-bold text-base">Absensi Selesai</span>
                <span className="text-[11px] text-emerald-600 font-medium">
                  {myTodayLog?.clockIn} – {myTodayLog?.clockOut}
                </span>
              </div>
            )}

            {hasClockedIn ? (
              <button
                onClick={resetTodayAttendance}
                className="mt-4 text-[11px] font-semibold text-slate-400 hover:text-brand-600 underline underline-offset-2 cursor-pointer"
              >
                Reset absensi hari ini (Demo)
              </button>
            ) : (
              <p className="mt-4 text-[11px] text-slate-400 max-w-xs">
                Keterlambatan otomatis terhubung ke kalkulasi potongan presensi di modul Payroll.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Attendance Log Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#E5EAF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-base text-obsidian-900">
              {isHR ? 'Log Presensi Seluruh Karyawan' : 'Riwayat Presensi Saya'}
            </h2>
            <p className="text-xs text-slate-400">Menampilkan {logs.length} catatan presensi terbaru</p>
          </div>
          {isHR && (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={divFilter}
                onChange={(e) => setDivFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs font-semibold text-slate-600 focus:outline-none"
              >
                <option value="All">Semua Divisi</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs font-semibold text-slate-600 focus:outline-none"
              >
                <option value="All">Semua Status</option>
                <option value="On Time">On Time</option>
                <option value="Late">Late</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5EAF2] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Karyawan</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Clock In</th>
                <th className="py-3.5 px-4">Clock Out</th>
                <th className="py-3.5 px-4">Durasi</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-sm">
              {logs.map((log) => {
                const emp = employees.find((e) => e.id === log.employeeId);
                const isLate = log.status === 'Late';
                return (
                  <tr key={log.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(emp?.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-obsidian-900 text-xs sm:text-sm">
                            {emp?.name || log.employeeId}
                          </div>
                          <div className="text-[11px] text-slate-400">{emp?.division || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                      {formatDisplayDate(log.date)}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-obsidian-900 tabular-nums">
                      {log.clockIn} WIB
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 tabular-nums">
                      {log.clockOut ? `${log.clockOut} WIB` : <span className="text-brand-600">Aktif</span>}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 tabular-nums">
                      {computeWorkDuration(log.clockIn, log.clockOut)}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isLate
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isLate ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          {log.status}
                        </span>
                        {isLate && log.lateMinutes > 0 && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            +{log.lateMinutes} mnt
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

