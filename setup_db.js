const { Client } = require('pg');

async function setupDatabase() {
  const connectionString = 'postgresql://postgres:akusukamakan@db.afyapcfsfpfyupowlxzc.supabase.co:5432/postgres';
  
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to Supabase DB!");
    
    // Create profiles table to store user details (NOT the raw password, which is insecure)
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id uuid references auth.users on delete cascade not null primary key,
        full_name text,
        business_name text,
        email text,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );
    `);
    console.log("Table 'profiles' checked/created.");

    // Create a trigger to automatically copy new users to the profiles table
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
    console.log("Function 'handle_new_user' created.");

    // Drop the trigger if it exists to avoid duplicates, then recreate
    await client.query(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
    await client.query(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);
    console.log("Trigger 'on_auth_user_created' created.");

    // Make sure our admin user gets confirmed so the user can login
    await client.query(`
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email_confirmed_at IS NULL;
    `);
    console.log("All existing unconfirmed users have been confirmed.");

  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    await client.end();
  }
}

setupDatabase();
