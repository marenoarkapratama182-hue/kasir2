const { Client } = require('pg');

async function createProfiles() {
  const client = new Client({
    connectionString: 'postgresql://postgres:akusukamakan@db.afyapcfsfpfyupowlxzc.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log("Connected!");

    // Create profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id uuid references auth.users on delete cascade not null primary key,
        full_name text,
        business_name text,
        email text,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );
    `);
    console.log("✅ Tabel 'profiles' berhasil dibuat.");

    await client.query(`ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;`);

    // Auto-fill profiles from existing users
    await client.query(`
      INSERT INTO public.profiles (id, email)
      SELECT id, email FROM auth.users
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("✅ Data profil pengguna lama berhasil disalin.");

    // Trigger for new users
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name, business_name, email)
        VALUES (
          new.id,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'business_name',
          new.email
        );
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    await client.query(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
    await client.query(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);
    console.log("✅ Trigger otomatis untuk user baru aktif.");

    console.log("\n🎉 Database Supabase kasir 100% tersambung dan siap!");
    
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

createProfiles();
