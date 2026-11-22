'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  TabKey,
  ViewMode,
  ClockMode,
  ChartRange,
  Employee,
  AttendanceLog,
  LeaveRequest,
  ActivityItem,
  UserIdentity,
  LeaveBalance,
  PayrollCalculation,
  Attachment,
} from '@/types';
import {
  INITIAL_IDENTITIES,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ACTIVITIES,
  ANNUAL_LEAVE_QUOTA,
  LATE_DEDUCTION_RATE,
  TAX_RATE,
} from '@/lib/mock-data';
import { EmployeeFormValues } from '@/lib/schemas';
import { getWIBNow, pad2 } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ConfirmModalData {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
}

interface AttachmentModalData {
  isOpen: boolean;
  attachment: Attachment | null;
  title: string;
  subtitle: string;
}

interface HRISContextType {
  view: ViewMode;
  currentRole: Role;
  activeTab: TabKey;
  chartRange: ChartRange;
  attendanceClockMode: ClockMode;
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  leaveRequests: LeaveRequest[];
  activities: ActivityItem[];
  globalSearch: string;
  currentUser: UserIdentity;
  isMobileSidebarOpen: boolean;
  toasts: ToastItem[];
  // Modals
  isLoginModalOpen: boolean;
  employeeModal: { isOpen: boolean; employeeId: string | null };
  confirmModal: ConfirmModalData;
  attachmentModal: AttachmentModalData;
  payslipModal: { isOpen: boolean; employeeId: string | null };
  // Actions
  enterWorkspace: (role?: Role, tab?: TabKey) => void;
  exitToLanding: () => void;
  switchRole: (role: Role) => void;
  setActiveTab: (tab: TabKey) => void;
  setChartRange: (range: ChartRange) => void;
  setAttendanceClockMode: (mode: ClockMode) => void;
  setGlobalSearch: (q: string) => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
  showToast: (title: string, message?: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  // CRUD & Operations
  addEmployee: (values: EmployeeFormValues) => boolean;
  updateEmployee: (id: string, values: EmployeeFormValues) => boolean;
  deleteEmployee: (id: string) => void;
  handleClockAction: () => void;
  resetTodayAttendance: () => void;
  submitLeaveRequest: (
    values: { type: 'Cuti Tahunan' | 'Cuti Sakit' | 'Izin Khusus'; startDate: string; endDate: string; reason: string },
    days: number,
    attachment: Attachment | null
  ) => boolean;
  processLeaveDecision: (id: string, decision: 'Approved' | 'Rejected', note?: string) => void;
  getLeaveBalance: (employeeId: string) => LeaveBalance;
  calculatePayroll: (employee: Employee) => PayrollCalculation;
  // Modal helpers
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openEmployeeModal: (id?: string) => void;
  closeEmployeeModal: () => void;
  openConfirmModal: (title: string, description: string, onConfirm: () => void) => void;
  closeConfirmModal: () => void;
  openAttachmentModal: (att: Attachment, title: string, subtitle: string) => void;
  closeAttachmentModal: () => void;
  openPayslipModal: (employeeId: string) => void;
  closePayslipModal: () => void;
  getEffectiveClockTime: () => { hh: number; mm: number; ss: number; label: string; full: string };
}

const HRISContext = createContext<HRISContextType | undefined>(undefined);

export function HRISProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>('landing');
  const [currentRole, setCurrentRole] = useState<Role>('hr_admin');
  const [activeTab, setActiveTabState] = useState<TabKey>('dashboard');
  const [chartRange, setChartRange] = useState<ChartRange>('1M');
  const [attendanceClockMode, setAttendanceClockMode] = useState<ClockMode>('live');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Entities
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(INITIAL_ATTENDANCE);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [employeeModal, setEmployeeModal] = useState<{ isOpen: boolean; employeeId: string | null }>({
    isOpen: false,
    employeeId: null,
  });
  const [confirmModal, setConfirmModal] = useState<ConfirmModalData>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });
  const [attachmentModal, setAttachmentModal] = useState<AttachmentModalData>({
    isOpen: false,
    attachment: null,
    title: '',
    subtitle: '',
  });
  const [payslipModal, setPayslipModal] = useState<{ isOpen: boolean; employeeId: string | null }>({
    isOpen: false,
    employeeId: null,
  });

  const currentUser = INITIAL_IDENTITIES[currentRole];

  useEffect(() => {
    async function loadFromSupabase() {
      if (!isSupabaseConfigured) return;
      try {
        const { data: emps } = await supabase.from('employees').select('*');
        if (emps && emps.length > 0) {
          setEmployees(
            emps.map((e: any) => ({
              id: e.id,
              name: e.name,
              email: e.email,
              phone: e.phone,
              division: e.division,
              role: e.role,
              baseSalary: Number(e.base_salary),
              allowance: Number(e.allowance),
              status: e.status,
              joinDate: e.join_date,
            }))
          );
        }

        const { data: atts } = await supabase.from('attendance_logs').select('*');
        if (atts && atts.length > 0) {
          setAttendanceLogs(
            atts.map((a: any) => ({
              id: a.id,
              employeeId: a.employee_id,
              date: a.date,
              clockIn: a.clock_in ? a.clock_in.substring(0, 5) : '',
              clockOut: a.clock_out ? a.clock_out.substring(0, 5) : null,
              status: a.status,
              lateMinutes: a.late_minutes,
            }))
          );
        }

        const { data: lvs } = await supabase.from('leave_requests').select('*');
        if (lvs && lvs.length > 0) {
          setLeaveRequests(
            lvs.map((l: any) => ({
              id: l.id,
              employeeId: l.employee_id,
              type: l.type,
              startDate: l.start_date,
              endDate: l.end_date,
              days: l.days,
              reason: l.reason,
              attachment: l.attachment,
              status: l.status,
              hrNote: l.hr_note || '',
              submittedAt: l.submitted_at,
            }))
          );
        }

        const { data: acts } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (acts && acts.length > 0) {
          setActivities(
            acts.map((act: any) => ({
              id: act.id,
              actor: act.actor,
              action: act.action,
              time: act.time,
              badge: act.badge,
              tone: act.tone,
            }))
          );
        }
      } catch (err) {
        console.warn('Failed to load from Supabase:', err);
      }
    }

    loadFromSupabase();
  }, []);

  // Toast manager
  const showToast = (title: string, message = '', type: ToastItem['type'] = 'info') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (
    actor: string,
    action: string,
    badge: string,
    tone: 'emerald' | 'amber' | 'rose' | 'blue' = 'blue'
  ) => {
    const t = getEffectiveClockTime();
    const newAct: ActivityItem = {
      id: 'ACT-' + Date.now(),
      actor,
      action,
      time: `${t.label} WIB`,
      badge,
      tone,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 14)]);
    if (isSupabaseConfigured) {
      supabase.from('activity_logs').insert(newAct).then();
    }
  };

  const getEffectiveClockTime = () => {
    if (attendanceClockMode === 'sim_ontime') {
      return { hh: 7, mm: 45, ss: 12, label: '07:45', full: '07:45:12 WIB (Simulasi On Time)' };
    }
    if (attendanceClockMode === 'sim_late') {
      return { hh: 8, mm: 25, ss: 38, label: '08:25', full: '08:25:38 WIB (Simulasi Late)' };
    }
    const wib = getWIBNow();
    const hh = wib.getHours();
    const mm = wib.getMinutes();
    const ss = wib.getSeconds();
    return {
      hh,
      mm,
      ss,
      label: `${pad2(hh)}:${pad2(mm)}`,
      full: `${pad2(hh)}:${pad2(mm)}:${pad2(ss)} WIB`,
    };
  };

  const enterWorkspace = (role: Role = 'hr_admin', tab: TabKey = 'dashboard') => {
    setCurrentRole(role);
    setActiveTabState(tab);
    setView('workspace');
    setIsMobileSidebarOpen(false);
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch (_) {
        window.scrollTo(0, 0);
      }
    }
    const user = INITIAL_IDENTITIES[role];
    showToast(
      `Masuk sebagai ${role === 'hr_admin' ? 'HR Admin' : 'Employee'}`,
      `${user.name} (${user.role}) — Sandbox siap digunakan.`,
      'info'
    );
  };

  const exitToLanding = () => {
    setView('landing');
    setIsMobileSidebarOpen(false);
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_) {
        window.scrollTo(0, 0);
      }
    }
  };

  const switchRole = (newRole: Role) => {
    if (currentRole === newRole) return;
    setCurrentRole(newRole);
    setIsMobileSidebarOpen(false);
    const user = INITIAL_IDENTITIES[newRole];
    showToast(
      `Role beralih ke ${newRole === 'hr_admin' ? 'HR Admin' : 'Employee'}`,
      `Aktif sebagai ${user.name}. Seluruh perubahan data tetap tersinkronisasi.`,
      'success'
    );
  };

  const setActiveTab = (tab: TabKey) => {
    setActiveTabState(tab);
    setIsMobileSidebarOpen(false);
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_) {
        window.scrollTo(0, 0);
      }
    }
  };

  const getLeaveBalance = (employeeId: string): LeaveBalance => {
    const approvedAnnual = leaveRequests
      .filter((r) => r.employeeId === employeeId && r.type === 'Cuti Tahunan' && r.status === 'Approved')
      .reduce((sum, r) => sum + r.days, 0);

    const pendingAnnual = leaveRequests
      .filter((r) => r.employeeId === employeeId && r.type === 'Cuti Tahunan' && r.status === 'Pending')
      .reduce((sum, r) => sum + r.days, 0);

    const remaining = Math.max(0, ANNUAL_LEAVE_QUOTA - approvedAnnual);
    return {
      quota: ANNUAL_LEAVE_QUOTA,
      used: approvedAnnual,
      pending: pendingAnnual,
      remaining,
    };
  };

  const calculatePayroll = (employee: Employee): PayrollCalculation => {
    const lateLogs = attendanceLogs.filter((l) => l.employeeId === employee.id && l.status === 'Late');
    const lateCount = lateLogs.length;
    const gross = employee.baseSalary + employee.allowance;
    const attendanceDeduction = lateCount * LATE_DEDUCTION_RATE;
    const taxDeduction = Math.round(gross * TAX_RATE);
    const totalDeductions = attendanceDeduction + taxDeduction;
    const netSalary = Math.max(0, gross - totalDeductions);
    return {
      employee,
      lateCount,
      gross,
      attendanceDeduction,
      taxDeduction,
      totalDeductions,
      netSalary,
    };
  };

  const addEmployee = (values: EmployeeFormValues): boolean => {
    // Check duplicate email
    const duplicate = employees.find((e) => e.email.toLowerCase() === values.email.toLowerCase());
    if (duplicate) {
      showToast('Duplikasi Email', `Email ${values.email} sudah digunakan oleh ${duplicate.name}.`, 'error');
      return false;
    }

    const nextNum =
      employees.reduce((max, e) => Math.max(max, parseInt(e.id.replace('EMP-', ''), 10) || 0), 0) + 1;
    const newEmp: Employee = {
      id: `EMP-${String(nextNum).padStart(3, '0')}`,
      ...values,
      joinDate: '2026-11-22',
    };

    setEmployees((prev) => [newEmp, ...prev]);
    if (isSupabaseConfigured) {
      supabase.from('employees').insert({
        id: newEmp.id,
        name: newEmp.name,
        email: newEmp.email,
        phone: newEmp.phone,
        division: newEmp.division,
        role: newEmp.role,
        base_salary: newEmp.baseSalary,
        allowance: newEmp.allowance,
        status: newEmp.status,
        join_date: newEmp.joinDate,
      }).then();
    }
    logActivity('Nadia Kusuma', `Menambahkan karyawan baru: ${newEmp.name}`, 'New Hire', 'emerald');
    showToast('Karyawan Berhasil Ditambahkan', `${newEmp.name} (${newEmp.id}) masuk ke direktori.`, 'success');
    return true;
  };

  const updateEmployee = (id: string, values: EmployeeFormValues): boolean => {
    const duplicate = employees.find(
      (e) => e.email.toLowerCase() === values.email.toLowerCase() && e.id !== id
    );
    if (duplicate) {
      showToast('Duplikasi Email', `Email ${values.email} sudah digunakan oleh ${duplicate.name}.`, 'error');
      return false;
    }

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...values } : emp))
    );
    if (isSupabaseConfigured) {
      supabase.from('employees').update({
        name: values.name,
        email: values.email,
        phone: values.phone,
        division: values.division,
        role: values.role,
        base_salary: values.baseSalary,
        allowance: values.allowance,
        status: values.status,
      }).eq('id', id).then();
    }
    logActivity('Nadia Kusuma', `Memperbarui profil ${values.name}`, 'Core HR', 'blue');
    showToast('Data Karyawan Diperbarui', `${values.name} berhasil disimpan.`, 'success');
    return true;
  };

  const deleteEmployee = (id: string) => {
    if (id === 'EMP-001' || id === 'EMP-002') {
      showToast('Akun Demo Dilindungi', 'Akun demo utama (Nadia Kusuma & Raka Pratama) tidak dapat dihapus.', 'warning');
      return;
    }
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (isSupabaseConfigured) {
      supabase.from('employees').delete().eq('id', id).then();
    }
    if (target) {
      logActivity('Nadia Kusuma', `Menghapus data karyawan ${target.name}`, 'Removed', 'rose');
      showToast('Karyawan Dihapus', `${target.name} telah dihapus dari direktori.`, 'info');
    }
  };

  const handleClockAction = () => {
    const today = '2026-11-22';
    const clock = getEffectiveClockTime();
    const existing = attendanceLogs.find(
      (l) => l.employeeId === currentUser.employeeId && l.date === today
    );

    if (!existing) {
      // Clock In with Auto Late Detection (> 08:00 WIB)
      const totalMins = clock.hh * 60 + clock.mm;
      const isLate = totalMins > 480;
      const lateMinutes = isLate ? totalMins - 480 : 0;

      const newLog: AttendanceLog = {
        id: 'ATT-' + Date.now(),
        employeeId: currentUser.employeeId,
        date: today,
        clockIn: clock.label,
        clockOut: null,
        status: isLate ? 'Late' : 'On Time',
        lateMinutes,
      };

      setAttendanceLogs((prev) => [newLog, ...prev]);
      if (isSupabaseConfigured) {
        supabase.from('attendance_logs').insert({
          id: newLog.id,
          employee_id: newLog.employeeId,
          date: newLog.date,
          clock_in: `${newLog.clockIn}:00`,
          clock_out: null,
          status: newLog.status,
          late_minutes: newLog.lateMinutes,
        }).then();
      }
      logActivity(
        currentUser.name,
        `Clock In pukul ${clock.label} WIB (${isLate ? 'Terlambat ' + lateMinutes + ' mnt' : 'Tepat Waktu'})`,
        isLate ? 'Late' : 'On Time',
        isLate ? 'amber' : 'emerald'
      );

      showToast(
        isLate ? 'Clock In Tercatat (Late)' : 'Clock In Berhasil (On Time)',
        isLate
          ? `Absen pukul ${clock.label} WIB (+${lateMinutes} menit lewat 08:00). Potongan presensi otomatis diperbarui.`
          : `Absen pukul ${clock.label} WIB tercatat tepat waktu!`,
        isLate ? 'warning' : 'success'
      );
    } else if (!existing.clockOut) {
      // Clock Out
      let outLabel = clock.label;
      const [inH, inM] = existing.clockIn.split(':').map(Number);
      const [outH, outM] = outLabel.split(':').map(Number);
      if (outH * 60 + outM <= inH * 60 + inM) {
        outLabel = '17:05'; // Demo fallback if simulation clock is before clock in
      }

      setAttendanceLogs((prev) =>
        prev.map((log) => (log.id === existing.id ? { ...log, clockOut: outLabel } : log))
      );
      if (isSupabaseConfigured) {
        supabase.from('attendance_logs').update({
          clock_out: `${outLabel}:00`,
        }).eq('id', existing.id).then();
      }
      logActivity(currentUser.name, `Clock Out pukul ${outLabel} WIB`, 'Completed', 'blue');
      showToast('Clock Out Berhasil', `Jam pulang tercatat pukul ${outLabel} WIB.`, 'success');
    }
  };

  const resetTodayAttendance = () => {
    const today = '2026-11-22';
    setAttendanceLogs((prev) =>
      prev.filter((l) => !(l.employeeId === currentUser.employeeId && l.date === today))
    );
    showToast('Presensi Hari Ini Direset', 'Anda dapat menguji ulang fitur Clock In On Time / Late.', 'info');
  };

  const submitLeaveRequest = (
    values: { type: 'Cuti Tahunan' | 'Cuti Sakit' | 'Izin Khusus'; startDate: string; endDate: string; reason: string },
    days: number,
    attachment: Attachment | null
  ): boolean => {
    const balance = getLeaveBalance(currentUser.employeeId);
    if (values.type === 'Cuti Tahunan' && days > balance.remaining) {
      showToast('Saldo Cuti Tidak Cukup', `Sisa cuti tahunan Anda tinggal ${balance.remaining} hari.`, 'error');
      return false;
    }

    const clock = getEffectiveClockTime();
    const newReq: LeaveRequest = {
      id: 'LV-' + Date.now(),
      employeeId: currentUser.employeeId,
      type: values.type,
      startDate: values.startDate,
      endDate: values.endDate,
      days,
      reason: values.reason,
      attachment,
      status: 'Pending',
      hrNote: '',
      submittedAt: `22 Nov 2026, ${clock.label} WIB`,
    };

    setLeaveRequests((prev) => [newReq, ...prev]);
    if (isSupabaseConfigured) {
      supabase.from('leave_requests').insert({
        id: newReq.id,
        employee_id: newReq.employeeId,
        type: newReq.type,
        start_date: newReq.startDate,
        end_date: newReq.endDate,
        days: newReq.days,
        reason: newReq.reason,
        attachment: newReq.attachment,
        status: newReq.status,
        hr_note: newReq.hrNote,
        submitted_at: newReq.submittedAt,
      }).then();
    }
    logActivity(currentUser.name, `Mengajukan ${values.type} (${days} hari)`, 'Pending', 'amber');
    showToast(
      'Pengajuan Cuti Terkirim!',
      'Berhasil masuk ke Approval Queue HR Admin. Beralih ke HR Admin untuk menyetujui.',
      'success'
    );
    return true;
  };

  const processLeaveDecision = (id: string, decision: 'Approved' | 'Rejected', note = '') => {
    const target = leaveRequests.find((r) => r.id === id);
    if (!target) return;
    const emp = employees.find((e) => e.id === target.employeeId);

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: decision,
              hrNote:
                note ||
                (decision === 'Approved'
                  ? 'Disetujui oleh HR Admin. Selamat beristirahat.'
                  : 'Ditolak oleh HR Admin.'),
            }
          : r
      )
    );

    if (isSupabaseConfigured) {
      supabase.from('leave_requests').update({
        status: decision,
        hr_note: note || (decision === 'Approved' ? 'Disetujui oleh HR Admin. Selamat beristirahat.' : 'Ditolak oleh HR Admin.'),
      }).eq('id', id).then();
    }

    logActivity(
      'Nadia Kusuma',
      `${decision === 'Approved' ? 'Menyetujui' : 'Menolak'} ${target.type} milik ${emp?.name || target.employeeId}`,
      decision,
      decision === 'Approved' ? 'emerald' : 'rose'
    );

    showToast(
      decision === 'Approved' ? 'Pengajuan Cuti Disetujui' : 'Pengajuan Cuti Ditolak',
      `Status & sisa saldo cuti ${emp?.name || 'karyawan'} langsung diperbarui secara real-time.`,
      decision === 'Approved' ? 'success' : 'info'
    );
  };

  // Modal handlers
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openEmployeeModal = (id?: string) =>
    setEmployeeModal({ isOpen: true, employeeId: id || null });
  const closeEmployeeModal = () =>
    setEmployeeModal({ isOpen: false, employeeId: null });

  const openConfirmModal = (title: string, description: string, onConfirm: () => void) =>
    setConfirmModal({ isOpen: true, title, description, onConfirm });
  const closeConfirmModal = () =>
    setConfirmModal({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  const openAttachmentModal = (attachment: Attachment, title: string, subtitle: string) =>
    setAttachmentModal({ isOpen: true, attachment, title, subtitle });
  const closeAttachmentModal = () =>
    setAttachmentModal({ isOpen: false, attachment: null, title: '', subtitle: '' });

  const openPayslipModal = (employeeId: string) =>
    setPayslipModal({ isOpen: true, employeeId });
  const closePayslipModal = () =>
    setPayslipModal({ isOpen: false, employeeId: null });

  return (
    <HRISContext.Provider
      value={{
        view,
        currentRole,
        activeTab,
        chartRange,
        attendanceClockMode,
        employees,
        attendanceLogs,
        leaveRequests,
        activities,
        globalSearch,
        currentUser,
        isMobileSidebarOpen,
        toasts,
        isLoginModalOpen,
        employeeModal,
        confirmModal,
        attachmentModal,
        payslipModal,
        enterWorkspace,
        exitToLanding,
        switchRole,
        setActiveTab,
        setChartRange,
        setAttendanceClockMode,
        setGlobalSearch,
        setIsMobileSidebarOpen,
        showToast,
        removeToast,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        handleClockAction,
        resetTodayAttendance,
        submitLeaveRequest,
        processLeaveDecision,
        getLeaveBalance,
        calculatePayroll,
        openLoginModal,
        closeLoginModal,
        openEmployeeModal,
        closeEmployeeModal,
        openConfirmModal,
        closeConfirmModal,
        openAttachmentModal,
        closeAttachmentModal,
        openPayslipModal,
        closePayslipModal,
        getEffectiveClockTime,
      }}
    >
      {children}
    </HRISContext.Provider>
  );
}

export function useHRIS() {
  const context = useContext(HRISContext);
  if (!context) {
    throw new Error('useHRIS must be used within an HRISProvider');
  }
  return context;
}

