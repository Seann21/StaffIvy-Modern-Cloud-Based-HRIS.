'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { Navbar } from '@/components/layout/Navbar';
import {
  ShieldCheck,
  UserCircle,
  Sparkles,
  ChevronRight,
  ArrowRight,
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck2,
  Wallet,
  Search,
  CheckCircle2,
  CalendarClock,
  Banknote,
  ShieldAlert,
  FileDown,
} from 'lucide-react';

export function LandingView() {
  const { enterWorkspace } = useHRIS();

  return (
    <div id="landing-view" className="min-h-screen bg-white relative overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="top" className="relative pt-14 sm:pt-20 lg:pt-24 pb-20 sm:pb-32 hero-grid-bg overflow-hidden">
        {/* Subtle radial white vignette over grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,#ffffff_85%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Version Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E5EAF2] shadow-soft text-xs font-medium text-slate-500 mb-7 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>Introducing StaffIvy Cloud HRIS v2.4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
          </div>

          {/* Bold Headline */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.22] sm:leading-[1.2] tracking-[-0.03em] text-obsidian-900 max-w-4xl mx-auto">
            Run Your Entire <span className="text-brand-600">Workforce</span> From One Intelligent Platform
          </h1>

          {/* Subtitle */}
          <p className="mt-6 sm:mt-7 text-base sm:text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed sm:leading-[1.8]">
            Kelola SDM lebih cepat, akurat, dan transparan dari pencatatan absensi realtime hingga kalkulasi payroll &amp; ekspor slip gaji otomatis dalam satu dashboard terintegrasi.
          </p>

          {/* Dual-Role Demo Switcher (Fitur Wajib untuk Recruiter) */}
          <div id="recruiter-access" className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={() => enterWorkspace('hr_admin')}
              className="btn-brand w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl text-white font-semibold text-sm inline-flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Demo as HR Admin</span>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

            <button
              onClick={() => enterWorkspace('employee')}
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-slate-50 text-obsidian-900 font-semibold text-sm border border-[#DCE3EE] shadow-soft inline-flex items-center justify-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <UserCircle className="w-4 h-4 text-brand-600" />
              <span>Demo as Employee</span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600">
                No Signup
              </span>
            </button>
          </div>

          <p className="mt-6 sm:mt-7 text-xs text-slate-400 flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Instant Recruiter Sandbox
            </span>
            <span>•</span>
            <span>Shared Live State antar HR Admin &amp; Employee</span>
            <span>•</span>
            <span>Zero Registration</span>
          </p>
        </div>

        {/* Floating Interactive Dashboard Showcase over Glossy Flowing Royal-Blue Ribbon Wave */}
        <div className="relative mt-16 sm:mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Signature Glossy Flowing Royal-Blue Wave Ribbon */}
          <div className="pointer-events-none absolute -inset-x-20 top-1/2 -translate-y-1/2 h-[340px] sm:h-[420px] z-0 overflow-visible">
            <svg
              viewBox="0 0 1440 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-cover opacity-95"
            >
              <defs>
                <linearGradient id="ribbonMain" x1="0" y1="0" x2="1440" y2="380" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#93B4FF" stopOpacity="0.35" />
                  <stop offset="35%" stopColor="#3B63F6" stopOpacity="0.88" />
                  <stop offset="68%" stopColor="#537AFF" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#2747D9" stopOpacity="0.75" />
                </linearGradient>
                <linearGradient id="ribbonGlow" x1="200" y1="60" x2="1200" y2="360" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#A8C5FF" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#3B63F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6D8EFF" stopOpacity="0.6" />
                </linearGradient>
                <filter id="softBlur" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
              </defs>
              <path
                d="M-120 270 C180 340, 420 90, 740 160 C1040 225, 1180 30, 1560 110 L1560 225 C1200 175, 1030 330, 710 265 C400 200, 180 410, -120 345 Z"
                fill="url(#ribbonGlow)"
                filter="url(#softBlur)"
              />
              <path
                d="M-100 295 C210 345, 450 115, 760 185 C1070 255, 1210 55, 1540 135 L1540 198 C1220 135, 1060 305, 745 240 C445 178, 210 385, -100 330 Z"
                fill="url(#ribbonMain)"
              />
            </svg>
          </div>

          {/* Floating Dashboard Preview Frame */}
          <div className="relative z-10 rounded-[24px] bg-white/95 backdrop-blur-xl border border-white/80 shadow-hero p-2 sm:p-3">
            <div className="rounded-[18px] bg-[#F8FAFC] border border-[#E5EAF2] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
                {/* Mini Preview Sidebar */}
                <div className="hidden lg:flex lg:col-span-3 bg-white border-r border-[#E5EAF2] p-4 flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 px-2 mb-6">
                      <div className="brand-mark w-8 h-8 rounded-lg flex items-center justify-center text-white">
                        <svg
                          width="16"
                          height="16"
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
                        <div className="font-display font-bold text-sm text-obsidian-900 leading-tight">StaffIvy</div>
                        <div className="text-[11px] text-slate-400">HR Admin Portal</div>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs font-medium">
                      <button
                        onClick={() => enterWorkspace('hr_admin', 'dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-brand-50 text-brand-600 font-semibold border-l-[3px] border-brand-600 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </button>
                      <button
                        onClick={() => enterWorkspace('hr_admin', 'directory')}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Users className="w-4 h-4" /> Employee Directory
                      </button>
                      <button
                        onClick={() => enterWorkspace('hr_admin', 'attendance')}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Clock className="w-4 h-4" /> Attendance
                      </button>
                      <button
                        onClick={() => enterWorkspace('hr_admin', 'leave')}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <CalendarCheck2 className="w-4 h-4" /> Leave Requests
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">
                          3
                        </span>
                      </button>
                      <button
                        onClick={() => enterWorkspace('hr_admin', 'payroll')}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Wallet className="w-4 h-4" /> Payroll &amp; Slip
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-left">
                    <div className="text-[11px] font-semibold text-obsidian-900">Quick Switch Mode</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Uji fitur RBAC secara instan tanpa logout manual.</p>
                  </div>
                </div>

                {/* Mini Preview Main Panel */}
                <div className="lg:col-span-9 p-4 sm:p-6 bg-[#F8FAFC]">
                  {/* Top Bar Preview */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E5EAF2]">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E5EAF2] text-xs text-slate-400 w-full sm:w-64">
                      <Search className="w-3.5 h-3.5" />
                      <span>Cari karyawan, divisi, slip gaji...</span>
                    </div>
                    <div className="flex items-center gap-2.5 ml-auto">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Sync Active
                      </span>
                      <div className="flex items-center gap-2 pl-2 border-l border-[#E5EAF2]">
                        <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                          NK
                        </div>
                        <span className="text-xs font-semibold text-obsidian-900 hidden sm:inline">Nadia Kusuma</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF2] text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          +8%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Total Karyawan</div>
                      <div className="font-display font-bold text-lg text-obsidian-900 tabular-nums mt-0.5">12</div>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF2] text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          92%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Hadir Hari Ini</div>
                      <div className="font-display font-bold text-lg text-obsidian-900 tabular-nums mt-0.5">
                        11 <span className="text-[11px] font-medium text-amber-600">(2 Late)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF2] text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <CalendarClock className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          Action
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Pending Cuti</div>
                      <div className="font-display font-bold text-lg text-obsidian-900 tabular-nums mt-0.5">3</div>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF2] text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Banknote className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">
                          Auto
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Payroll Nov 2026</div>
                      <div className="font-display font-bold text-lg text-obsidian-900 tabular-nums mt-0.5">Rp 168Jt</div>
                    </div>
                  </div>

                  {/* Mini Spline Path & Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-7 bg-white rounded-2xl border border-[#E5EAF2] p-4 text-left">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-xs font-bold text-obsidian-900">Attendance &amp; Payroll Analytics</div>
                          <div className="text-[10px] text-slate-400">Ketepatan waktu presensi 30 hari terakhir</div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-semibold">
                          <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-600">1M</span>
                          <span className="px-2 py-0.5 rounded-md text-slate-400">3M</span>
                          <span className="px-2 py-0.5 rounded-md text-slate-400">1Y</span>
                        </div>
                      </div>
                      <svg viewBox="0 0 360 110" className="w-full h-24 overflow-visible">
                        <defs>
                          <linearGradient id="miniArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B63F6" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#3B63F6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 88 C45 84, 70 35, 115 40 C160 45, 190 78, 235 52 C280 26, 315 36, 360 18 L360 110 L0 110 Z"
                          fill="url(#miniArea)"
                        />
                        <path
                          d="M0 88 C45 84, 70 35, 115 40 C160 45, 190 78, 235 52 C280 26, 315 36, 360 18"
                          fill="none"
                          stroke="#3B63F6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="235" cy="52" r="4" fill="#FFFFFF" stroke="#3B63F6" strokeWidth="2.5" />
                        <circle cx="360" cy="18" r="4" fill="#3B63F6" />
                      </svg>
                    </div>

                    <div className="md:col-span-5 bg-white rounded-2xl border border-[#E5EAF2] p-4 text-left flex flex-col justify-between">
                      <div className="text-xs font-bold text-obsidian-900 mb-2.5">Workforce Activity</div>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                              RP
                            </div>
                            <div className="truncate">
                              <div className="text-[11px] font-semibold text-obsidian-900 truncate">Raka Pratama</div>
                              <div className="text-[10px] text-slate-400">Clock In • 07:52 WIB</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                            On Time
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                              DA
                            </div>
                            <div className="truncate">
                              <div className="text-[11px] font-semibold text-obsidian-900 truncate">Dimas Anggara</div>
                              <div className="text-[10px] text-slate-400">Ajukan Cuti Tahunan</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 shrink-0">
                            Pending
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                              SL
                            </div>
                            <div className="truncate">
                              <div className="text-[11px] font-semibold text-obsidian-900 truncate">Sinta Lestari</div>
                              <div className="text-[10px] text-slate-400">Download Slip PDF</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 shrink-0">
                            Payroll
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered Editorial Walkthrough Section */}
      <section id="features" className="py-20 sm:py-32 bg-white border-t border-[#F1F5F9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 sm:mb-24">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
              <span>How StaffIvy Works</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-obsidian-900 leading-tight">
              Go From Manual Spreadsheets To <span className="text-brand-600">Automated HRIS</span> In Minutes.
            </h2>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-500 leading-relaxed">
              Empat modul inti terintegrasi dalam satu arsitektur modern berbasis Role-Based Access Control.
            </p>
          </div>

          {/* Module 01: Core HR Directory */}
          <div id="modules" className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center mb-20 sm:mb-28">
            <div className="md:col-span-6 space-y-5">
              <div className="brand-mark w-9 h-9 rounded-xl text-white font-display font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="font-display font-bold text-2xl text-obsidian-900 leading-snug">
                Interactive Core HR &amp; Zod Validation
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Kelola direktori seluruh karyawan dengan pencarian instan real-time, filter divisi (Engineering,
                Marketing, HR), serta paginasi responsif. Form tambah &amp; edit dilindungi skema validasi ketat ala Zod.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 pt-1">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" /> Cegah duplikasi email perusahaan secara
                  otomatis
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" /> Validasi format nomor HP Indonesia &amp;
                  nominal gaji
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" /> Akses penuh HR Admin &amp; direktori
                  read-only karyawan
                </li>
              </ul>
            </div>
            <div className="md:col-span-6">
              <div className="rounded-3xl bg-[#F8FAFC] border border-[#E5EAF2] p-6 sm:p-8 shadow-soft">
                <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-obsidian-900">Employee Schema Guard</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Zod Validated
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-obsidian-900">raka.pratama@staffivy.id</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Engineering • Senior Frontend Engineer</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-brand-50 text-brand-600">
                      Active
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center gap-2.5 text-[11px] text-rose-700">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Duplikasi email &amp; format telepon salah ditolak otomatis.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Module 02: Attendance & Leave Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center mb-20 sm:mb-28">
            <div className="md:col-span-6 order-2 md:order-1">
              <div className="rounded-3xl bg-[#F8FAFC] border border-[#E5EAF2] p-6 sm:p-8 shadow-soft">
                <div className="bg-white rounded-2xl border border-[#E5EAF2] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display font-bold text-sm text-obsidian-900">November 2026</span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-600">
                      WIB Precision
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-slate-400 mb-3">
                    <span>Sen</span>
                    <span>Sel</span>
                    <span>Rab</span>
                    <span>Kam</span>
                    <span>Jum</span>
                    <span>Sab</span>
                    <span>Min</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-600">
                    <span className="py-1.5 text-slate-300">16</span>
                    <span className="py-1.5">17</span>
                    <span className="py-1.5">18</span>
                    <span className="py-1.5">19</span>
                    <span className="py-1.5">20</span>
                    <span className="py-1.5 text-slate-300">21</span>
                    <span className="py-1.5 rounded-lg bg-brand-600 text-white font-bold shadow-blue-glow">22</span>
                    <span className="py-1.5 rounded-lg bg-brand-50 text-brand-700 font-semibold">23</span>
                    <span className="py-1.5 rounded-lg bg-brand-50 text-brand-700 font-semibold">24</span>
                    <span className="py-1.5">25</span>
                    <span className="py-1.5">26</span>
                    <span className="py-1.5">27</span>
                    <span className="py-1.5 text-slate-300">28</span>
                    <span className="py-1.5 text-slate-300">29</span>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-[#E5EAF2] flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Batas Masuk: <strong className="text-obsidian-900">08:00 WIB</strong>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px]">
                      Auto-Detect Late
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-6 order-1 md:order-2 space-y-5">
              <div className="brand-mark w-9 h-9 rounded-xl text-white font-display font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="font-display font-bold text-2xl text-obsidian-900 leading-snug">
                One-Click Attendance &amp; Two-Way Leave Flow
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Clock In/Clock Out sekali klik dengan deteksi keterlambatan otomatis setelah pukul 08:00 WIB. Dilengkapi
                pengajuan cuti kalender dinamis, upload surat dokter, dan antrean approval real-time di sisi HR.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 pt-1">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" /> Kalkulasi otomatis hari kerja &amp; sisa
                  kuota cuti tahunan
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" /> Approve / Reject + catatan revisi HR
                  tersinkron instan
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" /> Mode simulasi jam WIB untuk uji coba
                  perekrut kapan saja
                </li>
              </ul>
            </div>
          </div>

          {/* Module 03: Automated Payroll Engine & PDF Exporter */}
          <div id="architecture" className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="md:col-span-6 space-y-5">
              <div className="brand-mark w-9 h-9 rounded-xl text-white font-display font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="font-display font-bold text-2xl text-obsidian-900 leading-snug">
                Automated Payroll Engine &amp; PDF Payslip
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Hitung gaji bersih otomatis dari Gaji Pokok, Tunjangan, Potongan Keterlambatan Presensi, dan PPh 21. Ekspor
                slip gaji PDF resmi berformat rapi hanya dengan satu klik.
              </p>
              <div className="pt-2 flex flex-wrap gap-3.5">
                <button
                  onClick={() => enterWorkspace('hr_admin', 'payroll')}
                  className="btn-brand px-5 py-2.5 sm:py-3 rounded-xl text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Coba Payroll HR Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => enterWorkspace('employee', 'payroll')}
                  className="px-5 py-2.5 sm:py-3 rounded-xl bg-white border border-[#DCE3EE] hover:bg-slate-50 text-obsidian-900 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Lihat Slip Karyawan</span>
                </button>
              </div>
            </div>
            <div className="md:col-span-6">
              <div className="rounded-3xl bg-[#F8FAFC] border border-[#E5EAF2] p-6 sm:p-8 shadow-soft">
                <div className="bg-white rounded-2xl border border-[#E5EAF2] p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2]">
                    <div>
                      <div className="text-[11px] text-slate-400">Take-Home Pay • Nov 2026</div>
                      <div className="font-display font-bold text-2xl text-obsidian-900 tabular-nums mt-1">
                        Rp 19.387.500
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      Disbursed
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Gaji Pokok + Tunjangan</span>
                      <span className="font-semibold text-obsidian-900 tabular-nums">Rp 20.500.000</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Potongan Presensi (1x Late)</span>
                      <span className="font-semibold text-rose-600 tabular-nums">- Rp 75.000</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Pajak PPh 21 (5%)</span>
                      <span className="font-semibold text-rose-600 tabular-nums">- Rp 1.025.000</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-[#E5EAF2] flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Slip_Gaji_StaffIvy_Raka.pdf</span>
                    <span className="text-xs font-semibold text-brand-600 inline-flex items-center gap-1.5">
                      <FileDown className="w-3.5 h-3.5" /> Ready PDF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8FAFC] border-t border-[#E5EAF2] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white">
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
              <div className="font-display font-bold text-obsidian-900">StaffIvy Cloud HRIS</div>
              <div className="text-xs text-slate-500">
                Modern Workforce Management Platform • &copy; 2026 StaffIvy Indonesia
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => enterWorkspace('hr_admin')}
              className="btn-brand px-4 py-2.5 rounded-xl text-white text-xs font-semibold cursor-pointer"
            >
              Demo as HR Admin
            </button>
            <button
              onClick={() => enterWorkspace('employee')}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE3EE] text-obsidian-900 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Demo as Employee
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

