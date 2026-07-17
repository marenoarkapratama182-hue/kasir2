const { Client } = require('pg');

async function testConnection() {
  const connectionString = 'postgresql://postgres:akusukamakan@db.afyapcfsfpfyupowlxzc.supabase.co:5432/postgres';
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    console.log("Dropping and recreating tables for Sushi...");
    await client.query(`
      DROP TABLE IF EXISTS public.sale_items CASCADE;
      DROP TABLE IF EXISTS public.sales CASCADE;
      DROP TABLE IF EXISTS public.customers CASCADE;
      DROP TABLE IF EXISTS public.products CASCADE;

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
        member_level TEXT DEFAULT 'Umum',
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

      INSERT INTO public.products (name, category, price, stock) VALUES
      ('Salmon Nigiri', 'Sushi', 35000, 50),
      ('Tuna Sashimi', 'Sashimi', 45000, 40),
      ('Spicy Tuna Roll', 'Sushi', 40000, 100),
      ('California Roll', 'Sushi', 38000, 25),
      ('Miso Soup', 'Appetizer', 15000, 20),
      ('Edamame', 'Appetizer', 12000, 30),
      ('Ocha Dingin', 'Minuman', 10000, 35),
      ('Matcha Ice Cream', 'Dessert', 25000, 60);

      INSERT INTO public.customers (name, phone, member_level, point) VALUES
      ('Kenjiro', '08123456789', 'VIP', 150),
      ('Akira', '08987654321', 'Gold', 20),
      ('Sakura', '08551234567', 'Reguler', 0),
      ('Haruto', '08551234568', 'Reguler', 0),
      ('Hinata', '08551234569', 'Umum', 0);
    `);
    
    console.log("Disabling RLS on new tables...");
    await client.query(`
      ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.sales DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.sale_items DISABLE ROW LEVEL SECURITY;
    `);

    console.log("Granting permissions to anon...");
    await client.query(`
      GRANT ALL PRIVILEGES ON TABLE public.products TO anon, authenticated;
      GRANT ALL PRIVILEGES ON TABLE public.customers TO anon, authenticated;
      GRANT ALL PRIVILEGES ON TABLE public.sales TO anon, authenticated;
      GRANT ALL PRIVILEGES ON TABLE public.sale_items TO anon, authenticated;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
      NOTIFY pgrst, 'reload schema';
    `);
    
    console.log("All done!");

  } catch (err) {
    console.error("Connection error", err.stack);
  } finally {
    await client.end();
  }
}

testConnection();
