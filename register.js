const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerAdmin() {
  console.log("Mencoba mendaftarkan admin...");
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@kasir.com',
    password: 'password123',
  });

  if (error) {
    console.error("Gagal:", error.message);
  } else {
    console.log("Berhasil daftar! Data User:", data.user?.email);
    console.log("Session:", data.session ? "Ada session" : "Tidak ada session (butuh verifikasi email)");
  }
}

registerAdmin();
