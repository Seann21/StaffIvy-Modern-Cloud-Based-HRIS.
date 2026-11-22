import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { HRISProvider } from '@/context/hris-context';
import { ToastContainer } from '@/components/common/ToastContainer';

const LoginModal = dynamic(() => import('@/components/modals/LoginModal').then((m) => m.LoginModal), { ssr: false });
const EmployeeModal = dynamic(() => import('@/components/modals/EmployeeModal').then((m) => m.EmployeeModal), { ssr: false });
const ConfirmModal = dynamic(() => import('@/components/modals/ConfirmModal').then((m) => m.ConfirmModal), { ssr: false });
const AttachmentModal = dynamic(() => import('@/components/modals/AttachmentModal').then((m) => m.AttachmentModal), { ssr: false });
const PayslipModal = dynamic(() => import('@/components/modals/PayslipModal').then((m) => m.PayslipModal), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StaffIvy — Modern Cloud-Based HRIS & Workforce Management',
  description:
    'Platform SaaS internal perusahaan untuk mengotomatisasi administrasi SDM secara end-to-end, mencakup manajemen data karyawan, absensi harian, approval pengajuan cuti, hingga kalkulasi dan ekspor slip gaji otomatis berbasis peran (RBAC).',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`scroll-smooth ${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-white text-obsidian-900 selection:bg-brand-100 selection:text-brand-700">
        <HRISProvider>
          {children}
          <ToastContainer />
          <LoginModal />
          <EmployeeModal />
          <ConfirmModal />
          <AttachmentModal />
          <PayslipModal />
        </HRISProvider>
      </body>
    </html>
  );
}

