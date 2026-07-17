-- Customers Table
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  name text not null,
  phone text,
  email text,
  segment text not null default 'Umum' check (segment in ('Umum','Reguler','VIP')),
  total_spent numeric(18,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Insert Dummy Customers
INSERT INTO public.customers (id, tenant_id, name, phone, segment, total_spent) VALUES
('11111111-2222-3333-4444-555555555551', '00000000-0000-0000-0000-000000000001', 'Budi Santoso', '0812-3456-7890', 'VIP', 1500000),
('11111111-2222-3333-4444-555555555552', '00000000-0000-0000-0000-000000000001', 'Siti Aminah', '0856-7890-1234', 'Reguler', 250000),
('11111111-2222-3333-4444-555555555553', '00000000-0000-0000-0000-000000000001', 'Andi Wijaya', '0811-2233-4455', 'Umum', 45000);
