-- ============================================================
-- EnemGame Admin Schema Migration
-- Tables: plans, schools, teachers, student enrollment extension
-- ============================================================

-- Plans (subscription/tier plans)
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) DEFAULT 0.00,
  duration_months INTEGER DEFAULT 1,
  max_students INTEGER DEFAULT NULL, -- NULL = unlimited
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Schools
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Teachers
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  subject TEXT DEFAULT '', -- e.g. "Matemática", "Redação"
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Extend profiles table with plan and school references
-- Only run if columns don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'teacher_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- Enable Row Level Security
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies: allow authenticated users to read, admins to write
CREATE POLICY "plans_read" ON public.plans FOR SELECT USING (true);
CREATE POLICY "plans_write" ON public.plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "schools_read" ON public.schools FOR SELECT USING (true);
CREATE POLICY "schools_write" ON public.schools FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "teachers_read" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "teachers_write" ON public.teachers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teachers_school ON public.teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan_id);
CREATE INDEX IF NOT EXISTS idx_profiles_school ON public.profiles(school_id);
