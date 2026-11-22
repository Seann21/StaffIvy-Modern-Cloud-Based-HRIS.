'use client';

import React, { useState, useEffect } from 'react';
import { useHRIS } from '@/context/hris-context';
import { getWIBNow, pad2, formatDisplayDate } from '@/lib/utils';
import {
  Menu,
  Search,
  ShieldCheck,
  User,
  Bell,
} from 'lucide-react';

export function TopBar() {
  const {
    currentRole,
    switchRole,
    globalSearch,
    setGlobalSearch,
    setActiveTab,
    setIsMobileSidebarOpen,
    currentUser,
    leaveRequests,
  } = useHRIS();

  const [wibTime, setWibTime] = useState<string>('--:--:-- WIB');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const wib = getWIBNow();
      setWibTime(`${pad2(wib.getHours())}:${pad2(wib.getMinutes())}:${pad2(wib.getSeconds())} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isHR = currentRole === 'hr_admin';
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending');
  const userLeaves = leaveRequests.filter((r) => r.employeeId === currentUser.employeeId);
  const notifCount = isHR
    ? pendingLeaves.length
    : userLeaves.filter((r) => r.status !== 'Pending').length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5EAF2] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              if (e.target.value.trim().length > 0) {
                setActiveTab('directory');
              }
            }}
            placeholder="Cari karyawan, email, atau divisi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-sm text-obsidian-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live WIB Clock Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs font-semibold text-slate-600 tabular-nums">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{wibTime}</span>
        </div>

        {/* 1-Click Recruiter Role Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#F1F5F9] border border-[#E5EAF2]">
          <button
            onClick={() => switchRole('hr_admin')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              isHR ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-obsidian-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">HR Admin</span>
          </button>
          <button
            onClick={() => switchRole('employee')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              !isHR ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-500 hover:text-obsidian-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Employee</span>
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2.5 rounded-xl bg-white border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {notifCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E5EAF2] shadow-hero p-4 z-50 animate-fade-up">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E5EAF2]">
                <span className="font-display font-bold text-sm text-obsidian-900">Notifikasi Sistem</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">
                  {isHR ? 'HR Admin' : 'Employee'}
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                {isHR ? (
                  pendingLeaves.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">Semua pengajuan cuti sudah diproses.</div>
                  ) : (
                    pendingLeaves.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setActiveTab('leave');
                          setIsNotifOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-brand-50/60 border border-[#E5EAF2] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-obsidian-900">{r.employeeId}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                            Pending
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {r.type} • {r.days} hari ({formatDisplayDate(r.startDate)})
                        </div>
                      </button>
                    ))
                  )
                ) : userLeaves.length === 0 ? (
                  <div className="py-6 text-center text-slate-400">Belum ada riwayat pengajuan cuti.</div>
                ) : (
                  userLeaves.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setActiveTab('leave');
                        setIsNotifOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-brand-50/60 border border-[#E5EAF2] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-obsidian-900">{r.type}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            r.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {formatDisplayDate(r.startDate)} • {r.hrNote || 'Menunggu peninjauan HR'}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E5EAF2]">
          <div
            className={`w-9 h-9 rounded-xl ${
              isHR ? 'bg-brand-600' : 'bg-obsidian-900'
            } text-white font-display font-bold text-xs flex items-center justify-center shadow-sm shrink-0`}
          >
            {currentUser.avatar}
          </div>
          <div className="hidden md:block leading-tight">
            <div className="text-xs font-bold text-obsidian-900">{currentUser.name}</div>
            <div className="text-[11px] text-slate-400">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

