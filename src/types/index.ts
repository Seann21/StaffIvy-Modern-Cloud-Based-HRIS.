export type Role = 'hr_admin' | 'employee';
export type Division = 'Engineering' | 'Marketing' | 'HR';
export type EmployeeStatus = 'Active' | 'On Leave';
export type AttendanceStatus = 'On Time' | 'Late';
export type LeaveType = 'Cuti Tahunan' | 'Cuti Sakit' | 'Izin Khusus';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type ViewMode = 'landing' | 'workspace';
export type TabKey = 'dashboard' | 'directory' | 'attendance' | 'leave' | 'payroll';
export type ClockMode = 'live' | 'sim_ontime' | 'sim_late';
export type ChartRange = '1W' | '1M' | '3M' | '1Y';

export interface Attachment {
  name: string;
  size: string;
  type: string;
  previewUrl?: string | null;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  division: Division;
  role: string;
  baseSalary: number;
  allowance: number;
  status: EmployeeStatus;
  joinDate: string;
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: AttendanceStatus;
  lateMinutes: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  attachment: Attachment | null;
  status: LeaveStatus;
  hrNote: string;
  submittedAt: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  time: string;
  badge: string;
  tone: 'emerald' | 'amber' | 'rose' | 'blue';
}

export interface UserIdentity {
  employeeId: string;
  name: string;
  role: string;
  division: Division;
  avatar: string;
  email: string;
}

export interface LeaveBalance {
  quota: number;
  used: number;
  pending: number;
  remaining: number;
}

export interface PayrollCalculation {
  employee: Employee;
  lateCount: number;
  gross: number;
  attendanceDeduction: number;
  taxDeduction: number;
  totalDeductions: number;
  netSalary: number;
}

