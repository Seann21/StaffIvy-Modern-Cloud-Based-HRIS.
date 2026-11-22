'use client';

import React from 'react';
import { useHRIS } from '@/context/hris-context';
import { LogIn, ArrowRight } from 'lucide-react';

export function Navbar() {
  const { openLoginModal } = useHRIS();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#E5EAF2]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#top" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-obsidian-900">
            StaffIvy
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-obsidian-900 transition-colors">
            Fitur
          </a>
          <a href="#modules" className="hover:text-obsidian-900 transition-colors">
            Modul
          </a>
          <a href="#architecture" className="hover:text-obsidian-900 transition-colors">
            Arsitektur
          </a>
          <a href="#recruiter-access" className="hover:text-obsidian-900 transition-colors">
            Role Preview
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={openLoginModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-obsidian-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            onClick={openLoginModal}
            className="btn-obsidian text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

