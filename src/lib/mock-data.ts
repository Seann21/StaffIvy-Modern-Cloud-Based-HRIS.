import { Employee, AttendanceLog, LeaveRequest, ActivityItem, UserIdentity } from '@/types';

export const LATE_DEDUCTION_RATE = 75000; // Rp 75.000 per late attendance
export const TAX_RATE = 0.05; // 5% PPh 21 simplified payroll engine
export const ANNUAL_LEAVE_QUOTA = 12; // 12 days annual quota

export const INITIAL_IDENTITIES: Record<'hr_admin' | 'employee', UserIdentity> = {
  hr_admin: {
    employeeId: 'EMP-002',
    name: 'Nadia Kusuma',
    role: 'HR Manager',
    division: 'HR',
    avatar: 'NK',
    email: 'nadia.kusuma@staffivy.id',
  },
  employee: {
    employeeId: 'EMP-001',
    name: 'Raka Pratama',
    role: 'Senior Frontend Engineer',
    division: 'Engineering',
    avatar: 'RP',
    email: 'raka.pratama@staffivy.id',
  },
};

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Raka Pratama', email: 'raka.pratama@staffivy.id', phone: '081234567801', division: 'Engineering', role: 'Senior Frontend Engineer', baseSalary: 18000000, allowance: 2500000, status: 'Active', joinDate: '2023-03-14' },
  { id: 'EMP-002', name: 'Nadia Kusuma', email: 'nadia.kusuma@staffivy.id', phone: '081298765402', division: 'HR', role: 'HR Manager', baseSalary: 17500000, allowance: 3000000, status: 'Active', joinDate: '2022-08-01' },
  { id: 'EMP-003', name: 'Dimas Anggara', email: 'dimas.anggara@staffivy.id', phone: '081345678903', division: 'Engineering', role: 'Backend Cloud Architect', baseSalary: 21000000, allowance: 3000000, status: 'Active', joinDate: '2022-11-10' },
  { id: 'EMP-004', name: 'Sinta Lestari', email: 'sinta.lestari@staffivy.id', phone: '085678901204', division: 'Marketing', role: 'Growth Marketing Lead', baseSalary: 15500000, allowance: 2000000, status: 'Active', joinDate: '2023-05-20' },
  { id: 'EMP-005', name: 'Fajar Nugroho', email: 'fajar.nugroho@staffivy.id', phone: '081223344505', division: 'Engineering', role: 'DevOps Engineer', baseSalary: 16500000, allowance: 2200000, status: 'Active', joinDate: '2024-01-08' },
  { id: 'EMP-006', name: 'Aulia Rahmawati', email: 'aulia.rahma@staffivy.id', phone: '085711223306', division: 'HR', role: 'Talent Acquisition Specialist', baseSalary: 11000000, allowance: 1500000, status: 'Active', joinDate: '2024-04-15' },
  { id: 'EMP-007', name: 'Bima Santoso', email: 'bima.santoso@staffivy.id', phone: '081399887707', division: 'Marketing', role: 'Performance Marketer', baseSalary: 12000000, allowance: 1500000, status: 'Active', joinDate: '2023-09-04' },
  { id: 'EMP-008', name: 'Citra Dewi', email: 'citra.dewi@staffivy.id', phone: '081844556608', division: 'Engineering', role: 'UI/UX Product Designer', baseSalary: 14500000, allowance: 1800000, status: 'On Leave', joinDate: '2023-06-12' },
  { id: 'EMP-009', name: 'Reza Mahendra', email: 'reza.mahendra@staffivy.id', phone: '081266778809', division: 'Engineering', role: 'QA Automation Engineer', baseSalary: 12500000, allowance: 1500000, status: 'Active', joinDate: '2024-02-19' },
  { id: 'EMP-010', name: 'Putri Wulandari', email: 'putri.wulandari@staffivy.id', phone: '081955443310', division: 'Marketing', role: 'Content & Brand Strategist', baseSalary: 11500000, allowance: 1400000, status: 'Active', joinDate: '2024-07-01' },
  { id: 'EMP-011', name: 'Hendra Wijaya', email: 'hendra.wijaya@staffivy.id', phone: '081277665511', division: 'HR', role: 'Payroll & Compliance Officer', baseSalary: 13000000, allowance: 1800000, status: 'Active', joinDate: '2023-01-16' },
  { id: 'EMP-012', name: 'Larasati Puspita', email: 'larasati.p@staffivy.id', phone: '085233445512', division: 'Marketing', role: 'Social Media Manager', baseSalary: 10500000, allowance: 1250000, status: 'Active', joinDate: '2024-09-09' },
];

export const INITIAL_ATTENDANCE: AttendanceLog[] = [
  { id: 'ATT-101', employeeId: 'EMP-002', date: '2026-11-22', clockIn: '07:42', clockOut: '17:05', status: 'On Time', lateMinutes: 0 },
  { id: 'ATT-102', employeeId: 'EMP-003', date: '2026-11-22', clockIn: '08:18', clockOut: '17:30', status: 'Late', lateMinutes: 18 },
  { id: 'ATT-103', employeeId: 'EMP-004', date: '2026-11-22', clockIn: '07:55', clockOut: '17:02', status: 'On Time', lateMinutes: 0 },
  { id: 'ATT-104', employeeId: 'EMP-005', date: '2026-11-22', clockIn: '08:27', clockOut: '17:15', status: 'Late', lateMinutes: 27 },
  { id: 'ATT-105', employeeId: 'EMP-006', date: '2026-11-22', clockIn: '07:49', clockOut: '17:00', status: 'On Time', lateMinutes: 0 },
  { id: 'ATT-106', employeeId: 'EMP-007', date: '2026-11-22', clockIn: '07:58', clockOut: '17:10', status: 'On Time', lateMinutes: 0 },
  { id: 'ATT-107', employeeId: 'EMP-009', date: '2026-11-22', clockIn: '07:44', clockOut: '16:59', status: 'On Time', lateMinutes: 0 },
  { id: 'ATT-108', employeeId: 'EMP-001', date: '2026-11-21', clockIn: '08:14', clockOut: '17:20', status: 'Late', lateMinutes: 14 },
  { id: 'ATT-109', employeeId: 'EMP-001', date: '2026-11-20', clockIn: '07:51', clockOut: '17:08', status: 'On Time', lateMinutes: 0 },
  { id: 'ATT-110', employeeId: 'EMP-001', date: '2026-11-19', clockIn: '07:46', clockOut: '17:04', status: 'On Time', lateMinutes: 0 },
  { id: 'ATT-111', employeeId: 'EMP-003', date: '2026-11-21', clockIn: '08:09', clockOut: '17:12', status: 'Late', lateMinutes: 9 },
  { id: 'ATT-112', employeeId: 'EMP-010', date: '2026-11-22', clockIn: '07:53', clockOut: '17:01', status: 'On Time', lateMinutes: 0 },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LV-201',
    employeeId: 'EMP-001',
    type: 'Cuti Tahunan',
    startDate: '2026-11-26',
    endDate: '2026-11-27',
    days: 2,
    reason: 'Menghadiri acara pernikahan keluarga besar di Yogyakarta.',
    attachment: { name: 'Undangan_Keluarga_Raka.pdf', size: '420 KB', type: 'application/pdf' },
    status: 'Pending',
    hrNote: '',
    submittedAt: '22 Nov 2026, 09:15 WIB',
  },
  {
    id: 'LV-202',
    employeeId: 'EMP-003',
    type: 'Cuti Sakit',
    startDate: '2026-11-23',
    endDate: '2026-11-24',
    days: 2,
    reason: 'Demam tinggi dan disarankan istirahat oleh dokter RS Pondok Indah.',
    attachment: { name: 'Surat_Dokter_Dimas_Nov2026.pdf', size: '685 KB', type: 'application/pdf' },
    status: 'Pending',
    hrNote: '',
    submittedAt: '22 Nov 2026, 08:40 WIB',
  },
  {
    id: 'LV-203',
    employeeId: 'EMP-004',
    type: 'Cuti Tahunan',
    startDate: '2026-12-03',
    endDate: '2026-12-04',
    days: 2,
    reason: 'Liburan singkat bersama keluarga akhir tahun.',
    attachment: null,
    status: 'Pending',
    hrNote: '',
    submittedAt: '21 Nov 2026, 16:20 WIB',
  },
  {
    id: 'LV-204',
    employeeId: 'EMP-001',
    type: 'Cuti Tahunan',
    startDate: '2026-10-12',
    endDate: '2026-10-14',
    days: 3,
    reason: 'Cuti tahunan untuk urusan keluarga di Bandung.',
    attachment: null,
    status: 'Approved',
    hrNote: 'Disetujui. Pastikan handover sprint frontend sudah selesai.',
    submittedAt: '05 Okt 2026, 10:12 WIB',
  },
  {
    id: 'LV-205',
    employeeId: 'EMP-008',
    type: 'Cuti Tahunan',
    startDate: '2026-11-20',
    endDate: '2026-11-24',
    days: 3,
    reason: 'Istirahat tahunan dan kunjungan orang tua.',
    attachment: null,
    status: 'Approved',
    hrNote: 'Disetujui oleh HR Manager.',
    submittedAt: '14 Nov 2026, 14:05 WIB',
  },
  {
    id: 'LV-206',
    employeeId: 'EMP-007',
    type: 'Izin Khusus',
    startDate: '2026-11-18',
    endDate: '2026-11-18',
    days: 1,
    reason: 'Keperluan administrasi bank di luar kantor.',
    attachment: null,
    status: 'Rejected',
    hrNote: 'Mohon ajukan ulang pada hari Jumat karena jadwal peluncuran kampanye.',
    submittedAt: '16 Nov 2026, 11:30 WIB',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: 'ACT-1', actor: 'Raka Pratama', action: 'Mengajukan Cuti Tahunan (2 hari)', time: '09:15 WIB', badge: 'Pending', tone: 'amber' },
  { id: 'ACT-2', actor: 'Dimas Anggara', action: 'Mengunggah Surat Dokter & ajukan cuti', time: '08:40 WIB', badge: 'Leave', tone: 'blue' },
  { id: 'ACT-3', actor: 'Fajar Nugroho', action: 'Clock In tercatat pukul 08:27 WIB', time: '08:27 WIB', badge: 'Late', tone: 'rose' },
  { id: 'ACT-4', actor: 'Nadia Kusuma', action: 'Clock In tercatat pukul 07:42 WIB', time: '07:42 WIB', badge: 'On Time', tone: 'emerald' },
  { id: 'ACT-5', actor: 'Hendra Wijaya', action: 'Sinkronisasi kalkulasi Payroll Nov 2026', time: 'Kemarin', badge: 'Payroll', tone: 'blue' },
];

