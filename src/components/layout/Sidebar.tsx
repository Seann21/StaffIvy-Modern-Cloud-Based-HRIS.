'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { TabKey } from '@/types';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck2,
  Wallet,
  ArrowLeft,
  X,
} from 'lucide-react';

export function Sidebar() {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    switchRole,
    exitToLanding,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    employees,
    leaveRequests,
    currentUser,
  } = useHRIS();

  const isHR = currentRole === 'hr_admin';
  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;
  const empPendingCount = leaveRequests.filter(
    (r) => r.employeeId === currentUser.employeeId && r.status === 'Pending'
  ).length;

  const navItems: { id: TabKey; label: string; icon: React.ElementType; badge?: number | null; badgeAmber?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Employee Directory', icon: Users, badge: employees.length },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    {
      id: 'leave',
      label: isHR ? 'Leave Approvals' : 'Leave Requests',
      icon: CalendarCheck2,
      badge: isHR
        ? pendingLeavesCount > 0 ? pendingLeavesCount : null
        : empPendingCount > 0 ? empPendingCount : null,
      badgeAmber: true,
    },
    { id: 'payroll', label: isHR ? 'Payroll Engine' : 'My Payslip', icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-obsidian-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#E5EAF2] flex flex-col justify-between transition-transform duration-200 ease-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-2 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0">
                <svg
                  width="18"
                  height="18"
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
                <div className="font-display font-bold text-base text-obsidian-900 leading-tight">StaffIvy</div>
                <div className="text-[11px] font-medium text-brand-600">
                  {isHR ? 'HR Admin Portal' : 'Employee Self-Service'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Main Menu
          </div>
          <nav className="space-y-1 flex-1 px-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'nav-item-active'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-obsidian-900 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.badgeAmber ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Role Switcher & Back to Landing */}
          <div className="mt-6 pt-4 border-t border-[#E5EAF2] space-y-2.5">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500">Recruiter Switcher</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white border border-[#E5EAF2]">
                <button
                  onClick={() => switchRole('hr_admin')}
                  className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    isHR ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-500 hover:text-obsidian-900'
                  }`}
                >
                  HR Admin
                </button>
                <button
                  onClick={() => switchRole('employee')}
                  className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    !isHR ? 'bg-obsidian-900 text-white shadow-xs' : 'text-slate-500 hover:text-obsidian-900'
                  }`}
                >
                  Employee
                </button>
              </div>
            </div>

            <button
              onClick={exitToLanding}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-obsidian-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Landing Page</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

