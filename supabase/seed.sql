-- Insert Tenant
INSERT INTO public.tenants (id, name, slug, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Kasir Utama', 'kasir-utama', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert Branch
INSERT INTO public.branches (id, tenant_id, name)
VALUES ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Cabang Jakarta Selatan')
ON CONFLICT (id) DO NOTHING;

-- Insert Warehouse
INSERT INTO public.warehouses (id, tenant_id, branch_id, name)
VALUES ('00000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'Gudang Utama')
ON CONFLICT (id) DO NOTHING;

-- Insert Products
INSERT INTO public.products (id, tenant_id, name, product_type)
VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Espresso', 'stocked'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Cappuccino', 'stocked'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Margherita Pizza', 'stocked'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', 'Vanilla Gelato', 'stocked')
ON CONFLICT (id) DO NOTHING;

-- Insert Product Variants
INSERT INTO public.product_variants (id, tenant_id, product_id, sku, name, cost, base_price, minimum_stock)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'KOP-001', 'Espresso', 10000, 25000, 10),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'KOP-002', 'Cappuccino', 15000, 35000, 10),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'MAK-001', 'Margherita Pizza', 40000, 85000, 5),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'DES-001', 'Vanilla Gelato', 12000, 30000, 10)
ON CONFLICT (id) DO NOTHING;

-- Insert Stock Balances
INSERT INTO public.stock_balances (tenant_id, warehouse_id, variant_id, on_hand)
VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 100),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 150),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 20),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 50)
ON CONFLICT (warehouse_id, variant_id) DO NOTHING;
