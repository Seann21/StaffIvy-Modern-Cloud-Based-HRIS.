import { jsPDF } from 'jspdf';
import { PayrollCalculation } from '@/types';
import { formatIDR } from './utils';

export function generatePayslipPDF(
  calc: PayrollCalculation,
  payrollMonth: string = 'November 2026'
): void {
  const { employee, lateCount, gross, attendanceDeduction, taxDeduction, totalDeductions, netSalary } = calc;
  const safeName = employee.name.replace(/\s+/g, '_');
  const safeMonth = payrollMonth.replace(/\s+/g, '_');
  const filename = `Slip_Gaji_StaffIvy_${safeName}_${safeMonth}.pdf`;

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Royal Blue Brand Header Bar
    doc.setFillColor(59, 99, 246);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('StaffIvy', 18, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text('PT StaffIvy Teknologi Indonesia  |  Cloud-Based HRIS & Workforce Management', 18, 25);
    doc.text('SLIP GAJI KARYAWAN RESMI (CONFIDENTIAL)', 18, 32);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(payrollMonth, 192, 18, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Ref: PAY-${employee.id}-202611`, 192, 25, { align: 'right' });

    // Employee Details Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 234, 242);
    doc.roundedRect(18, 48, 174, 32, 3, 3, 'FD');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8.5);
    doc.text('Nama Karyawan', 24, 56);
    doc.text('ID Karyawan', 112, 56);
    doc.text('Divisi & Jabatan', 24, 69);
    doc.text('Email Perusahaan', 112, 69);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(employee.name, 24, 61);
    doc.text(employee.id, 112, 61);
    doc.text(`${employee.division} — ${employee.role}`, 24, 74);
    doc.text(employee.email, 112, 74);

    // Earnings & Deductions Table Header
    let y = 94;
    doc.setFillColor(238, 243, 255);
    doc.rect(18, y, 174, 9, 'F');
    doc.setTextColor(45, 79, 217);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('KOMPONEN PENGHASILAN & POTONGAN', 24, y + 6);
    doc.text('NOMINAL (IDR)', 186, y + 6, { align: 'right' });

    y += 16;
    const addRow = (label: string, value: string, isRed = false, isBold = false) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(10);
      doc.setTextColor(isBold ? 15 : 71, isBold ? 23 : 85, isBold ? 42 : 105);
      doc.text(label, 24, y);
      if (isRed) {
        doc.setTextColor(220, 38, 38);
      } else if (isBold) {
        doc.setTextColor(15, 23, 42);
      } else {
        doc.setTextColor(15, 23, 42);
      }
      doc.text(value, 186, y, { align: 'right' });
      doc.setDrawColor(241, 245, 249);
      doc.line(18, y + 3, 192, y + 3);
      y += 10;
    };

    addRow('Gaji Pokok (Base Salary)', formatIDR(employee.baseSalary));
    addRow('Tunjangan Tetap (Fixed Allowance)', formatIDR(employee.allowance));
    addRow('Total Pendapatan Kotor (Gross Income)', formatIDR(gross), false, true);
    y += 4;
    addRow(
      `Potongan Keterlambatan Presensi (${lateCount}x Late @ Rp 75.000)`,
      `- ${formatIDR(attendanceDeduction)}`,
      true
    );
    addRow('Potongan Pajak PPh 21 (5%)', `- ${formatIDR(taxDeduction)}`, true);
    addRow('Total Potongan (Total Deductions)', `- ${formatIDR(totalDeductions)}`, true, true);

    // Highlighted Take-Home Pay Box
    y += 6;
    doc.setFillColor(238, 243, 255);
    doc.setDrawColor(59, 99, 246);
    doc.roundedRect(18, y, 174, 24, 3, 3, 'FD');

    doc.setTextColor(45, 79, 217);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('GAJI BERSIH DITERIMA (TAKE-HOME PAY)', 24, y + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Formula: (Gaji Pokok + Tunjangan) - (Potongan Presensi + Pajak PPh 21)', 24, y + 17);

    doc.setTextColor(45, 79, 217);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(formatIDR(netSalary), 186, y + 14.5, { align: 'right' });

    // Digital Signature & Stamp Footer
    y += 42;
    doc.setDrawColor(229, 234, 242);
    doc.roundedRect(128, y, 64, 32, 3, 3, 'D');
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Disahkan Secara Digital Oleh:', 160, y + 8, { align: 'center' });
    doc.setTextColor(59, 99, 246);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Nadia Kusuma', 160, y + 18, { align: 'center' });
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('HR Manager • StaffIvy HRIS', 160, y + 25, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Dokumen slip gaji ini dibuat otomatis oleh StaffIvy Cloud HRIS dan sah tanpa tanda tangan basah.',
      18,
      282
    );

    doc.save(filename);
  } catch (err) {
    console.error('jsPDF generation failed:', err);
    throw err;
  }
}

