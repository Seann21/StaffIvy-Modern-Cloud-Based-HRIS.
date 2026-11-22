-- ========================================================
-- StaffIvy Cloud HRIS — Supabase PostgreSQL Database Schema
-- ========================================================

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY, -- e.g. EMP-001
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    division TEXT NOT NULL CHECK (division IN ('Engineering', 'Marketing', 'HR')),
    role TEXT NOT NULL,
    base_salary NUMERIC NOT NULL DEFAULT 0,
    allowance NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave')),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Attendance Logs Table
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id TEXT PRIMARY KEY, -- e.g. ATT-101
    employee_id TEXT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    clock_in TIME WITHOUT TIME ZONE NOT NULL,
    clock_out TIME WITHOUT TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('On Time', 'Late')),
    late_minutes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Leave Requests Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id TEXT PRIMARY KEY, -- e.g. LV-201
    employee_id TEXT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('Cuti Tahunan', 'Cuti Sakit', 'Izin Khusus')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    attachment JSONB, -- { name, size, type, previewUrl }
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    hr_note TEXT DEFAULT '',
    submitted_at TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    time TEXT NOT NULL,
    badge TEXT NOT NULL,
    tone TEXT NOT NULL CHECK (tone IN ('emerald', 'amber', 'rose', 'blue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Row Level Security (RLS) policies
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for live recruiter demo
CREATE POLICY "Public full access employees" ON public.employees FOR ALL USING (true);
CREATE POLICY "Public full access attendance" ON public.attendance_logs FOR ALL USING (true);
CREATE POLICY "Public full access leave" ON public.leave_requests FOR ALL USING (true);
CREATE POLICY "Public full access activities" ON public.activity_logs FOR ALL USING (true);

-- 6. Storage Bucket for Leave Attachments & Doctor Notes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('leave-attachments', 'leave-attachments', true)
ON CONFLICT (id) DO NOTHING;

