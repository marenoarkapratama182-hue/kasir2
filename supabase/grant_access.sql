-- Memberikan izin akses ke aplikasi kasir (anon) agar bisa membaca dan menulis data
GRANT ALL PRIVILEGES ON TABLE public.products TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.customers TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.sales TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.sale_items TO anon, authenticated;

-- Memberikan izin akses ke sistem penomoran otomatis (Auto-Increment ID)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
