Salin dan jalankan seluruh kode SQL berikut ke dalam **Supabase SQL Editor** Anda untuk membersihkan *setup* lama dan menerapkan struktur database, trigger, RLS policy bebas rekursi, serta view finance secara bersih:

```sql
-- ==============================================================================
-- 0. CLEANUP (HAPUS STRUKTUR LAMA YANG BENTROK)
-- ==============================================================================
DROP VIEW IF EXISTS public.view_finance_queue CASCADE;
DROP TABLE IF EXISTS public.reimbursements CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP SEQUENCE IF EXISTS public.reimbursement_seq CASCADE;

DROP TYPE IF EXISTS public.reimbursement_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP FUNCTION IF EXISTS public.get_my_role() CASCADE;

-- ==============================================================================
-- 1. ENUMS & EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE public.user_role AS ENUM ('employee', 'manager', 'finance', 'admin');
CREATE TYPE public.reimbursement_status AS ENUM ('Draft', 'Submitted', 'Approved', 'Rejected', 'Paid');

-- ==============================================================================
-- 2. TABEL PROFIL USER (PUBLIC.PROFILES)
-- ==============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    department TEXT DEFAULT 'General',
    role public.user_role NOT NULL DEFAULT 'employee',
    default_bank_name TEXT DEFAULT 'Bank BCA',
    default_bank_account TEXT DEFAULT '-',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABEL KATEGORI REIMBURSEMENT
-- ==============================================================================
CREATE TABLE public.categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    max_limit NUMERIC(15, 2) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABEL REIMBURSEMENT (TRANSAKSI)
-- ==============================================================================
CREATE TABLE public.reimbursements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code TEXT UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    purpose TEXT NOT NULL,
    receipt_url TEXT,
    status public.reimbursement_status NOT NULL DEFAULT 'Submitted',
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    manager_id UUID REFERENCES public.profiles(id),
    manager_note TEXT,
    
    finance_id UUID REFERENCES public.profiles(id),
    transfer_ref TEXT,
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. FUNCTION & TRIGGER AUTOMATION
-- ==============================================================================

-- A. Fungsi Pengecekan Role Aman (Security Definer untuk Mencegah Rekursi RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- B. Trigger Otomatis Buat Profil saat User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role public.user_role;
BEGIN
  BEGIN
    assigned_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'employee'))::public.user_role;
  EXCEPTION WHEN OTHERS THEN
    assigned_role := 'employee'::public.user_role;
  END;

  INSERT INTO public.profiles (id, full_name, department, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Operasional'),
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    department = EXCLUDED.department,
    role = EXCLUDED.role;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- C. Penomoran Otomatis Request Code (REV-001, REV-002, dst.)
CREATE SEQUENCE public.reimbursement_seq START 1;

CREATE OR REPLACE FUNCTION public.set_request_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.request_code IS NULL THEN
    NEW.request_code := 'REV-' || LPAD(NEXTVAL('public.reimbursement_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_request_code
  BEFORE INSERT ON public.reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.set_request_code();

-- D. Trigger Otomatis Update Kolom updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_reimbursements_updated_at 
  BEFORE UPDATE ON public.reimbursements 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES (BEBAS REKURSI)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursements ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Read profiles policy" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    public.get_my_role() IN ('manager', 'finance', 'admin')
  );

CREATE POLICY "Update own profile policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin full access on profiles" ON public.profiles
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- Categories Policies
CREATE POLICY "Anyone authenticated can view categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage categories" ON public.categories
  FOR ALL USING (
    public.get_my_role() = 'admin'
  );

-- Reimbursements Policies
CREATE POLICY "View reimbursements policy" ON public.reimbursements
  FOR SELECT USING (
    auth.uid() = user_id OR
    public.get_my_role() IN ('manager', 'finance', 'admin')
  );

CREATE POLICY "Create reimbursement policy" ON public.reimbursements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update reimbursement policy" ON public.reimbursements
  FOR UPDATE USING (
    (auth.uid() = user_id AND status = 'Draft') OR
    public.get_my_role() IN ('manager', 'finance', 'admin')
  );

-- ==============================================================================
-- 7. INITIAL SEED DATA & VIEW
-- ==============================================================================
INSERT INTO public.categories (name, description, max_limit) VALUES
  ('Transport', 'Bensin, Tol, Parkir, Tiket Pesawat, Taksi/Ojek Online', 5000000.00),
  ('Makan', 'Makanan, Minuman & Jamuan Klien', 2000000.00),
  ('Akomodasi', 'Hotel & Penginapan Perjalanan Dinas', 10000000.00),
  ('Operasional', 'Pembelian Alat Tulis, Perangkat IT, Domain/Hosting', 15000000.00),
  ('Lainnya', 'Kebutuhan mendesak lainnya', 1000000.00)
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE VIEW public.view_finance_queue AS
SELECT 
    r.id,
    r.request_code,
    r.user_id,
    r.category,
    r.amount AS total_amount,
    r.purpose,
    r.receipt_url,
    r.status,
    r.manager_note,
    r.created_at,
    p.full_name AS employee_name,
    p.department,
    p.default_bank_name AS bank_name,
    p.default_bank_account AS bank_account
FROM public.reimbursements r
JOIN public.profiles p ON r.user_id = p.id
WHERE r.status = 'Approved';