require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function updateProfiles() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to Supabase.");

    await client.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS phone text,
      ADD COLUMN IF NOT EXISTS address text,
      ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb;
    `);
    
    console.log("✅ Added phone, address, and preferences to profiles table.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

updateProfiles();
