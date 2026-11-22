'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useHRIS } from '@/context/hris-context';
import { LandingView } from '@/components/landing/LandingView';

// Lazy-load workspace modules to keep initial landing page bundle ultra-fast & lightweight
const Sidebar = dynamic(() => import('@/components/layout/Sidebar').then((m) => m.Sidebar), { ssr: false });
const TopBar = dynamic(() => import('@/components/layout/TopBar').then((m) => m.TopBar), { ssr: false });
const DashboardView = dynamic(() => import('@/components/dashboard/DashboardView').then((m) => m.DashboardView), { ssr: false });
const DirectoryView = dynamic(() => import('@/components/directory/DirectoryView').then((m) => m.DirectoryView), { ssr: false });
const AttendanceView = dynamic(() => import('@/components/attendance/AttendanceView').then((m) => m.AttendanceView), { ssr: false });
const LeaveView = dynamic(() => import('@/components/leave/LeaveView').then((m) => m.LeaveView), { ssr: false });
const PayrollView = dynamic(() => import('@/components/payroll/PayrollView').then((m) => m.PayrollView), { ssr: false });

export default function Home() {
  const { view, activeTab } = useHRIS();

  if (view === 'landing') {
    return <LandingView />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'directory' && <DirectoryView />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'leave' && <LeaveView />}
            {activeTab === 'payroll' && <PayrollView />}
          </main>
        </div>
      </div>
    </div>
  );
}

