import { z } from 'zod';

export const EmployeeFormSchema = z.object({
  name: z.string().trim().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  email: z.string().trim().email({ message: 'Format email tidak valid (contoh: nama@staffivy.id).' }),
  phone: z
    .string()
    .trim()
    .regex(/^(08|\+628)[0-9]{8,12}$/, {
      message: 'Gunakan format HP Indonesia valid (08... atau +628..., 10–14 digit).',
    }),
  division: z.enum(['Engineering', 'Marketing', 'HR'], {
    errorMap: () => ({ message: 'Pilih divisi yang valid.' }),
  }),
  role: z.string().trim().min(2, { message: 'Jabatan wajib diisi (minimal 2 karakter).' }),
  status: z.enum(['Active', 'On Leave']).default('Active'),
  baseSalary: z.coerce.number().min(3000000, { message: 'Gaji pokok minimal Rp 3.000.000.' }),
  allowance: z.coerce.number().min(0, { message: 'Tunjangan harus berupa angka >= 0.' }),
});

export type EmployeeFormValues = z.infer<typeof EmployeeFormSchema>;

export const LeaveRequestFormSchema = z.object({
  type: z.enum(['Cuti Tahunan', 'Cuti Sakit', 'Izin Khusus'], {
    errorMap: () => ({ message: 'Pilih jenis cuti.' }),
  }),
  startDate: z.string().min(1, { message: 'Tanggal mulai wajib dipilih.' }),
  endDate: z.string().min(1, { message: 'Tanggal selesai wajib dipilih.' }),
  reason: z.string().trim().min(5, { message: 'Alasan pengajuan cuti minimal 5 karakter.' }),
});

export type LeaveRequestFormValues = z.infer<typeof LeaveRequestFormSchema>;

