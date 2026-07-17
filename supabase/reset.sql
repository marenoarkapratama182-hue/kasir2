-- 1. HAPUS SEMUA TABEL LAMA
DROP TABLE IF EXISTS public.sale_items CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 2. BUAT ULANG TABEL DENGAN SKEMA BERSIH

-- Tabel Produk (Menu)
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Pelanggan
CREATE TABLE public.customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  member_level TEXT DEFAULT 'Umum',
  point INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Penjualan (Riwayat Transaksi)
CREATE TABLE public.sales (
  id SERIAL PRIMARY KEY,
  invoice_no TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  date DATE NOT NULL,
  customer_id INTEGER REFERENCES public.customers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Detail Penjualan (Item yang dibeli)
CREATE TABLE public.sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id),
  qty INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  total NUMERIC NOT NULL
);

-- 3. MASUKKAN MENU BARU (TEMA CAFE MODERN)
INSERT INTO public.products (name, category, price, stock) VALUES
('Caramel Macchiato Dingin', 'Minuman', 28000, 50),
('Matcha Latte Spesial', 'Minuman', 25000, 40),
('Kopi Susu Gula Aren', 'Minuman', 18000, 100),
('Croissant Butter', 'Camilan', 22000, 25),
('Spaghetti Carbonara', 'Makanan', 35000, 20),
('Nasi Goreng Gila', 'Makanan', 30000, 30),
('Churros Saus Cokelat', 'Dessert', 20000, 35),
('Es Lemon Tea', 'Minuman', 12000, 60);

-- 4. MASUKKAN DATA PELANGGAN CONTOH
INSERT INTO public.customers (name, phone, member_level, point) VALUES
('Bapak Budi', '08123456789', 'VIP', 150),
('Ibu Siti', '08987654321', 'Reguler', 20),
('Andi', '08551234567', 'Umum', 0);
