-- 1. HAPUS TABEL SEMENTARA
DROP TABLE IF EXISTS public.sale_items CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 2. BUAT ULANG TABEL DENGAN SKEMA ASLI (Seperti Semula)
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  member_level TEXT DEFAULT 'Bronze',
  point INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sales (
  id SERIAL PRIMARY KEY,
  invoice_no TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  date DATE NOT NULL,
  customer_id INTEGER REFERENCES public.customers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id),
  qty INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  total NUMERIC NOT NULL
);

-- 3. KEMBALIKAN DATA PRODUK (MENU LAMA)
INSERT INTO public.products (id, name, category, price, stock, created_at) VALUES
(1, 'Kopi Gula Aren', 'Minuman', 18000, 45, '2026-07-08T02:14:31.785035'),
(2, 'Americano Dingin', 'Minuman', 15000, 36, '2026-07-08T02:14:31.785035'),
(3, 'Nasi Goreng Spesial', 'Makanan', 25000, 21, '2026-07-08T02:14:31.785035'),
(4, 'Roti Bakar Cokelat Keju', 'Camilan', 18000, 25, '2026-07-08T02:14:31.785035');

-- Reset Auto-Increment (Sequence) untuk products
SELECT setval(pg_get_serial_sequence('public.products', 'id'), coalesce(max(id),0) + 1, false) FROM public.products;

-- 4. KEMBALIKAN DATA PELANGGAN LAMA
INSERT INTO public.customers (id, name, phone, email, address, member_level, point, created_at) VALUES
(1, 'Test User', '0812', null, null, 'Bronze', 18, '2026-07-08T02:52:49.156479'),
(2, 'reno', '12345', null, null, 'Bronze', 27, '2026-07-08T02:55:01.770788'),
(3, 'roro', '7777', null, null, 'Bronze', 16, '2026-07-08T03:52:52.619394'),
(4, 'qqq', '11', null, null, 'Bronze', 16, '2026-07-08T03:56:16.04199'),
(5, 'www', '222', null, null, 'Bronze', 39, '2026-07-08T04:49:20.290129'),
(6, 'jjj', '333', null, null, 'Bronze', 47, '2026-07-08T08:05:39.946388');

-- Reset Auto-Increment (Sequence) untuk customers
SELECT setval(pg_get_serial_sequence('public.customers', 'id'), coalesce(max(id),0) + 1, false) FROM public.customers;

-- 5. KEMBALIKAN DATA RIWAYAT TRANSAKSI LAMA
INSERT INTO public.sales (id, invoice_no, total_amount, payment_method, date, created_at, customer_id) VALUES
(1, 'INV-202607-9811', 39600, 'Debit', '2026-07-08', '2026-07-08T02:34:25.40758', null),
(2, 'INV-202607-1179', 39600, 'Tunai', '2026-07-08', '2026-07-08T02:35:42.549835', null),
(3, 'INV-TEST', 18000, 'Tunai', '2026-07-08', '2026-07-08T02:52:49.156479', 1),
(4, 'INV-202607-5139', 27500, 'QRIS', '2026-07-08', '2026-07-08T02:55:01.770788', 2),
(5, 'INV-202607-3955', 39600, 'Debit', '2026-07-08', '2026-07-08T03:51:25.253566', null),
(6, 'INV-202607-2315', 16500, 'QRIS', '2026-07-08', '2026-07-08T03:52:52.619394', 3),
(7, 'INV-202607-9406', 16500, 'Debit', '2026-07-08', '2026-07-08T03:56:16.04199', 4),
(8, 'INV-202607-9470', 39600, 'Tunai', '2026-07-08', '2026-07-08T04:49:20.290129', 5),
(9, 'INV-202607-5704', 55000, 'Debit', '2026-07-08', '2026-07-08T08:04:06.253195', null),
(10, 'INV-202607-2098', 33000, 'Tunai', '2026-07-08', '2026-07-08T08:05:02.828789', null),
(11, 'INV-202607-9437', 47300, 'Tunai', '2026-07-08', '2026-07-08T08:05:39.946388', 6);

SELECT setval(pg_get_serial_sequence('public.sales', 'id'), coalesce(max(id),0) + 1, false) FROM public.sales;

-- 6. KEMBALIKAN DATA DETAIL ITEM PENJUALAN
INSERT INTO public.sale_items (id, sale_id, product_id, qty, price, total) VALUES
(1, 1, 1, 2, 18000, 36000),
(2, 2, 4, 2, 18000, 36000),
(3, 3, 1, 1, 18000, 18000),
(4, 4, 3, 1, 25000, 25000),
(5, 5, 4, 2, 18000, 36000),
(6, 6, 2, 1, 15000, 15000),
(7, 7, 2, 1, 15000, 15000),
(8, 8, 1, 2, 18000, 36000),
(9, 9, 3, 2, 25000, 50000),
(10, 10, 2, 2, 15000, 30000),
(11, 11, 4, 1, 18000, 18000),
(12, 11, 3, 1, 25000, 25000);

SELECT setval(pg_get_serial_sequence('public.sale_items', 'id'), coalesce(max(id),0) + 1, false) FROM public.sale_items;
