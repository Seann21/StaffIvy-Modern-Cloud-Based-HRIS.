'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { useHRIS } from '@/context/hris-context';
import { Employee, Division } from '@/types';
import { formatIDR, formatShortIDR, getInitials } from '@/lib/utils';
import { Plus, Lock, Search, Pencil, Trash2, SearchX } from 'lucide-react';

export function DirectoryView() {
  const {
    currentRole,
    employees,
    globalSearch,
    setGlobalSearch,
    openEmployeeModal,
    openConfirmModal,
    deleteEmployee,
  } = useHRIS();

  const isHR = currentRole === 'hr_admin';
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  // Filter by division first
  const data = useMemo(() => {
    if (selectedDivision === 'All') return employees;
    return employees.filter((e) => e.division === selectedDivision);
  }, [employees, selectedDivision]);

  const divisionBadge = (div: Division) => {
    if (div === 'Engineering') return 'bg-brand-50 text-brand-700 border-brand-100';
    if (div === 'Marketing') return 'bg-violet-50 text-violet-700 border-violet-100';
    return 'bg-sky-50 text-sky-700 border-sky-100';
  };

  const columns = useMemo<ColumnDef<Employee>[]>(() => {
    const cols: ColumnDef<Employee>[] = [
      {
        header: 'Karyawan',
        accessorKey: 'name',
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-display font-bold text-xs flex items-center justify-center shrink-0">
                {getInitials(emp.name)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-obsidian-900 truncate">{emp.name}</div>
                <div className="text-[11px] text-slate-400 font-medium">{emp.id}</div>
              </div>
            </div>
          );
        },
      },
      {
        header: 'Divisi & Jabatan',
        accessorKey: 'division',
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${divisionBadge(
                  emp.division
                )} mb-1`}
              >
                {emp.division}
              </span>
              <div className="text-xs text-slate-600 font-medium">{emp.role}</div>
            </div>
          );
        },
      },
      {
        header: 'Kontak',
        accessorKey: 'email',
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div>
              <div className="text-xs font-medium text-obsidian-900">{emp.email}</div>
              <div className="text-[11px] text-slate-400 tabular-nums mt-0.5">{emp.phone}</div>
            </div>
          );
        },
      },
    ];

    if (isHR) {
      cols.push({
        header: 'Gaji Pokok',
        accessorKey: 'baseSalary',
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div>
              <div className="text-xs font-bold text-obsidian-900 tabular-nums">{formatIDR(emp.baseSalary)}</div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                + {formatShortIDR(emp.allowance)} tunj.
              </div>
            </div>
          );
        },
      });
    }

    cols.push({
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const emp = row.original;
        const isActive = emp.status === 'Active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {emp.status}
          </span>
        );
      },
    });

    if (isHR) {
      cols.push({
        id: 'actions',
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div className="text-right whitespace-nowrap">
              <button
                onClick={() => openEmployeeModal(emp.id)}
                className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                title="Edit Karyawan"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  openConfirmModal(
                    'Hapus Data Karyawan?',
                    `Anda akan menghapus ${emp.name} (${emp.role}) dari direktori karyawan StaffIvy.`,
                    () => deleteEmployee(emp.id)
                  )
                }
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Hapus Karyawan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      });
    }

    return cols;
  }, [isHR, openEmployeeModal, openConfirmModal, deleteEmployee]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: globalSearch,
    },
    onGlobalFilterChange: setGlobalSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const totalFiltered = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const showFrom = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1;
  const showTo = Math.min((pageIndex + 1) * pageSize, totalFiltered);

  return (
    <div className="space-y-7 sm:space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-obsidian-900">Employee Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Manajemen data karyawan terpusat dengan pencarian instan TanStack Table, filter divisi, dan validasi skema
            Zod.
          </p>
        </div>
        {isHR ? (
          <button
            onClick={() => openEmployeeModal()}
            className="btn-brand px-4 py-2.5 rounded-xl text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
            <Lock className="w-3.5 h-3.5" />
            <span>Read-Only Mode (Employee RBAC)</span>
          </div>
        )}
      </div>

      {/* Search & Division Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] p-4 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Cari nama, email, jabatan, atau ID (EMP-001)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 md:pb-0">
          {(['All', 'Engineering', 'Marketing', 'HR'] as const).map((div) => {
            const active = selectedDivision === div;
            const count = div === 'All' ? employees.length : employees.filter((e) => e.division === div).length;
            return (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-brand-600 text-white shadow-blue-glow'
                    : 'bg-[#F8FAFC] text-slate-600 border border-[#E5EAF2] hover:bg-slate-100'
                }`}
              >
                <span>{div}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TanStack Table Card */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-[#F8FAFC] border-b border-[#E5EAF2] text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3.5 px-5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-sm">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                    <SearchX className="w-8 h-8 mx-auto mb-2 opacity-60" />
                    <div className="text-sm font-medium text-slate-600">Tidak ada karyawan yang cocok</div>
                    <div className="text-xs mt-0.5">Coba ubah kata kunci pencarian atau filter divisi.</div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3.5 px-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#E5EAF2] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-obsidian-900">{showFrom}–{showTo}</span> of{' '}
            <span className="font-semibold text-obsidian-900">{totalFiltered}</span> employees
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-lg border border-[#DCE3EE] bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Prev
            </button>
            {Array.from({ length: pageCount }, (_, i) => i).map((pIdx) => (
              <button
                key={pIdx}
                onClick={() => table.setPageIndex(pIdx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pageIndex === pIdx
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white border border-[#DCE3EE] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pIdx + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-lg border border-[#DCE3EE] bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

