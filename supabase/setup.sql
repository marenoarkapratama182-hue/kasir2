-- 1. Bersihkan tabel lama
DROP TABLE IF EXISTS public.sale_items CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.stock_balances CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.warehouses CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.tenant_memberships CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;

-- 2. Ekstensi UUID
create extension if not exists "uuid-ossp";

-- 3. Buat Tabel
-- Tenants
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active','suspended','closed')),
  default_currency char(3) not null default 'IDR',
  timezone text not null default 'Asia/Jakarta',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Branches
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  address text,
  active boolean default true,
  created_at timestamptz not null default now()
);

-- Warehouses
create table public.warehouses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  branch_id uuid references public.branches(id),
  name text not null,
  active boolean default true,
  created_at timestamptz not null default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  name text not null,
  product_type text not null default 'stocked' check (product_type in ('stocked','service','composite','digital')),
  category_id uuid,
  brand_id uuid,
  track_stock boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Product Variants
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  product_id uuid not null references public.products(id),
  sku text not null,
  barcode text,
  name text not null,
  unit_id uuid,
  cost numeric(18,2) not null default 0 check (cost >= 0),
  base_price numeric(18,2) not null check (base_price >= 0),
  minimum_stock numeric(18,3) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, sku)
);

-- Sales
create table public.sales (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  branch_id uuid not null references public.branches(id),
  warehouse_id uuid not null references public.warehouses(id),
  shift_id uuid,
  customer_id uuid,
  invoice_number text not null,
  status text not null default 'draft' check (status in ('draft','held','pending_payment','paid','partially_refunded','refunded','voided')),
  subtotal numeric(18,2) not null default 0,
  discount_total numeric(18,2) not null default 0,
  tax_total numeric(18,2) not null default 0,
  grand_total numeric(18,2) not null default 0,
  paid_total numeric(18,2) not null default 0,
  change_total numeric(18,2) not null default 0,
  payment_method text,
  business_date date not null,
  posted_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, branch_id, invoice_number)
);

-- Sale Items
create table public.sale_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  sale_id uuid not null references public.sales(id) on delete restrict,
  variant_id uuid not null references public.product_variants(id),
  product_name_snapshot text not null,
  sku_snapshot text not null,
  quantity numeric(18,3) not null check (quantity > 0),
  unit_price numeric(18,2) not null check (unit_price >= 0),
  cost_snapshot numeric(18,2) not null default 0,
  discount_total numeric(18,2) not null default 0,
  tax_total numeric(18,2) not null default 0,
  line_total numeric(18,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

-- 4. Masukkan Data Dummy
INSERT INTO public.tenants (id, name, slug) VALUES ('00000000-0000-0000-0000-000000000001', 'Kasir Utama', 'kasir-utama');
INSERT INTO public.branches (id, tenant_id, name) VALUES ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Cabang Jakarta');
INSERT INTO public.warehouses (id, tenant_id, branch_id, name) VALUES ('00000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'Gudang Utama');

INSERT INTO public.products (id, tenant_id, name, category_id) VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Espresso', NULL),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Margherita Pizza', NULL),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Vanilla Gelato', NULL);

INSERT INTO public.product_variants (id, tenant_id, product_id, sku, name, base_price) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'KOP-001', 'Espresso', 25000),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'MAK-001', 'Margherita Pizza', 85000),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'DES-001', 'Vanilla Gelato', 30000);
