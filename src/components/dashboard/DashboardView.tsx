'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { formatIDR, formatShortIDR, getInitials } from '@/lib/utils';
import {
  Users,
  UserCheck,
  CalendarClock,
  Wallet,
  CalendarHeart,
  Clock,
  FileClock,
  Banknote,
  UserPlus,
  CheckSquare,
  Fingerprint,
  FileDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function DashboardView() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    currentRole,
    currentUser,
    employees,
    attendanceLogs,
    leaveRequests,
    activities,
    chartRange,
    setChartRange,
    calculatePayroll,
    getLeaveBalance,
    openEmployeeModal,
    setActiveTab,
  } = useHRIS();

  const isHR = currentRole === 'hr_admin';
  const today = '2026-11-22';

  // KPIs
  let kpis = [];
  if (isHR) {
    const todayLogs = attendanceLogs.filter((l) => l.date === today);
    const lateToday = todayLogs.filter((l) => l.status === 'Late').length;
    const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending').length;
    const totalMonthlyPayroll = employees.reduce(
      (sum, emp) => sum + calculatePayroll(emp).netSalary,
      0
    );

    kpis = [
      {
        label: 'Total Karyawan',
        value: employees.length,
        sub: `${employees.filter((e) => e.status === 'Active').length} Aktif • 3 Divisi`,
        trend: '+8%',
        trendTone: 'emerald',
        icon: Users,
        iconTone: 'brand',
      },
      {
        label: 'Hadir Hari Ini',
        value: `${todayLogs.length}/${employees.length}`,
        sub: `${lateToday} tercatat terlambat (>08:00)`,
        trend: `${Math.round((todayLogs.length / Math.max(1, employees.length)) * 100)}%`,
        trendTone: lateToday > 0 ? 'amber' : 'emerald',
        icon: UserCheck,
        iconTone: 'emerald',
      },
      {
        label: 'Pending Approval Cuti',
        value: pendingLeaves,
        sub: pendingLeaves > 0 ? 'Menunggu tindakan HR Admin' : 'Semua antrean bersih',
        trend: pendingLeaves > 0 ? 'Action' : 'Clear',
        trendTone: pendingLeaves > 0 ? 'amber' : 'emerald',
        icon: CalendarClock,
        iconTone: 'amber',
      },
      {
        label: 'Total Payroll Bulanan',
        value: formatShortIDR(totalMonthlyPayroll),
        sub: formatIDR(totalMonthlyPayroll),
        trend: 'Nov 2026',
        trendTone: 'brand',
        icon: Wallet,
        iconTone: 'indigo',
      },
    ];
  } else {
    const emp = employees.find((e) => e.id === currentUser.employeeId);
    const balance = getLeaveBalance(currentUser.employeeId);
    const todayAtt = attendanceLogs.find(
      (l) => l.employeeId === currentUser.employeeId && l.date === today
    );
    const myPending = leaveRequests.filter(
      (r) => r.employeeId === currentUser.employeeId && r.status === 'Pending'
    ).length;
    const myPayroll = emp ? calculatePayroll(emp) : { netSalary: 0, lateCount: 0 };

    kpis = [
      {
        label: 'Sisa Saldo Cuti Tahunan',
        value: `${balance.remaining} Hari`,
        sub: `Terpakai ${balance.used} dari ${balance.quota} hari`,
        trend: `${balance.pending} Pending`,
        trendTone: 'brand',
        icon: CalendarHeart,
        iconTone: 'brand',
      },
      {
        label: 'Status Presensi Hari Ini',
        value: todayAtt ? todayAtt.status : 'Belum Absen',
        sub: todayAtt ? `Clock In ${todayAtt.clockIn} WIB` : 'Klik Attendance untuk Clock In',
        trend: todayAtt ? (todayAtt.clockOut ? 'Selesai' : 'Aktif') : 'Wajib',
        trendTone: !todayAtt ? 'amber' : todayAtt.status === 'Late' ? 'rose' : 'emerald',
        icon: Clock,
        iconTone: todayAtt && todayAtt.status === 'On Time' ? 'emerald' : 'amber',
      },
      {
        label: 'Pengajuan Menunggu',
        value: myPending,
        sub: 'Sinkron real-time dengan HR',
        trend: myPending > 0 ? 'Review' : 'Clear',
        trendTone: myPending > 0 ? 'amber' : 'emerald',
        icon: FileClock,
        iconTone: 'amber',
      },
      {
        label: 'Estimasi Gaji Bersih',
        value: formatShortIDR(myPayroll.netSalary),
        sub: `${myPayroll.lateCount}x potongan keterlambatan`,
        trend: 'PDF Ready',
        trendTone: 'emerald',
        icon: Banknote,
        iconTone: 'indigo',
      },
    ];
  }

  // Chart data
  const chartDatasets: Record<string, { label: string; value: number }[]> = {
    '1W': isHR
      ? [
          { label: 'Sen', value: 92 },
          { label: 'Sel', value: 95 },
          { label: 'Rab', value: 88 },
          { label: 'Kam', value: 96 },
          { label: 'Jum', value: 94 },
          { label: 'Sab', value: 98 },
          { label: 'Min', value: 92 },
        ]
      : [
          { label: 'Sen', value: 8.5 },
          { label: 'Sel', value: 8.2 },
          { label: 'Rab', value: 9.0 },
          { label: 'Kam', value: 8.4 },
          { label: 'Jum', value: 8.8 },
          { label: 'Sab', value: 0 },
          { label: 'Min', value: 0 },
        ],
    '1M': isHR
      ? [
          { label: 'Ming 1', value: 86 },
          { label: 'Ming 2', value: 91 },
          { label: 'Ming 3', value: 89 },
          { label: 'Ming 4', value: 95 },
          { label: 'Ming 5', value: 93 },
        ]
      : [
          { label: 'Ming 1', value: 41 },
          { label: 'Ming 2', value: 43 },
          { label: 'Ming 3', value: 40 },
          { label: 'Ming 4', value: 44 },
          { label: 'Ming 5', value: 42 },
        ],
    '3M': isHR
      ? [
          { label: 'Sep', value: 89 },
          { label: 'Okt', value: 92 },
          { label: 'Nov', value: 95 },
        ]
      : [
          { label: 'Sep', value: 168 },
          { label: 'Okt', value: 174 },
          { label: 'Nov', value: 171 },
        ],
    '1Y': isHR
      ? [
          { label: 'Q1', value: 85 },
          { label: 'Q2', value: 89 },
          { label: 'Q3', value: 92 },
          { label: 'Q4', value: 95 },
        ]
      : [
          { label: 'Q1', value: 495 },
          { label: 'Q2', value: 512 },
          { label: 'Q3', value: 508 },
          { label: 'Q4', value: 520 },
        ],
  };

  const chartData = chartDatasets[chartRange] || chartDatasets['1M'];

  const iconBgMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  const trendBgMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="space-y-7 sm:space-y-8 animate-fade-up">
      {/* Page Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>{isHR ? 'HR Admin Command Center' : 'Employee Self-Service Portal'}</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-obsidian-900 tracking-tight">
            Selamat Datang, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            {isHR
              ? 'Ringkasan operasional SDM, presensi harian, antrean approval, dan kalkulasi payroll perusahaan.'
              : 'Pantau presensi harian, sisa saldo cuti tahunan, serta slip gaji resmi Anda secara langsung.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {isHR ? (
            <>
              <button
                onClick={() => openEmployeeModal()}
                className="btn-brand px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Karyawan</span>
              </button>
              <button
                onClick={() => setActiveTab('leave')}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE3EE] hover:bg-slate-50 text-obsidian-900 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-brand-600" />
                <span>Approval Queue</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('attendance')}
                className="btn-brand px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Absen Sekarang</span>
              </button>
              <button
                onClick={() => setActiveTab('payroll')}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE3EE] hover:bg-slate-50 text-obsidian-900 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-brand-600" />
                <span>Slip Gaji PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4 Crisp KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, idx) => {
          const Icon = k.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex items-center justify-between mb-3.5">
                <div
                  className={`w-10 h-10 rounded-xl ${iconBgMap[k.iconTone]} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${trendBgMap[k.trendTone]}`}>
                  {k.trend}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-500">{k.label}</div>
              <div className="font-display font-bold text-2xl text-obsidian-900 tabular-nums mt-1">{k.value}</div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Spline Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-6 shadow-soft flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-display font-bold text-base text-obsidian-900">
                {isHR ? 'Workforce Attendance & Punctuality Trend' : 'Monthly Work Hours Analytics'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHR
                  ? 'Persentase ketepatan waktu presensi seluruh divisi'
                  : 'Akumulasi jam kerja produktif tercatat oleh server WIB'}
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
              {(['1W', '1M', '3M', '1Y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    chartRange === r
                      ? 'bg-white text-brand-600 shadow-xs'
                      : 'text-slate-400 hover:text-obsidian-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-56">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B63F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B63F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="label"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    unit={isHR ? '%' : 'j'}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value}${isHR ? '%' : ' jam'}`, isHR ? 'Punctuality' : 'Jam Kerja']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B63F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#areaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50/60 rounded-xl animate-pulse">
                <span className="text-xs text-slate-400 font-medium">Memuat analitik chart...</span>
              </div>
            )}
          </div>

          {/* Division Distribution Footer */}
          <div className="mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-3 text-center sm:text-left">
            {(['Engineering', 'Marketing', 'HR'] as const).map((div) => {
              const count = employees.filter((e) => e.division === div).length;
              return (
                <div key={div} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]/80">
                  <div className="text-[11px] text-slate-400 font-medium">{div}</div>
                  <div className="font-display font-bold text-base text-obsidian-900 mt-0.5">
                    {count} <span className="text-xs font-normal text-slate-400">karyawan</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Workforce Activity Feed */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5EAF2] p-5 sm:p-6 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-obsidian-900">Workforce Activity</h2>
              <p className="text-xs text-slate-400">Log aktivitas real-time sistem</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {activities.slice(0, 7).map((act) => {
              const toneClasses: Record<string, string> = {
                emerald: 'bg-emerald-50 text-emerald-700',
                amber: 'bg-amber-50 text-amber-700',
                rose: 'bg-rose-50 text-rose-700',
                blue: 'bg-brand-50 text-brand-600',
              };
              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]/70"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {getInitials(act.actor)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-obsidian-900 truncate">{act.actor}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          toneClasses[act.tone] || toneClasses.blue
                        }`}
                      >
                        {act.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{act.action}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{act.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

