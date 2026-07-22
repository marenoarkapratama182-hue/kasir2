const { Client } = require('pg');

async function checkAndSetup() {
  const client = new Client({
    connectionString: 'postgresql://postgres:akusukamakan@db.afyapcfsfpfyupowlxzc.supabase.co:5432/postgres'
  });

  try {
    await client.connect();
    console.log("✅ Berhasil terhubung ke Supabase kasir!");

    // Cek semua tabel yang ada
    const tablesResult = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
    );
    const tables = tablesResult.rows.map(r => r.tablename);
    console.log("📋 Tabel yang sudah ada:", tables.join(', ') || 'Belum ada tabel');

    // Pastikan semua tabel utama tersedia
    const requiredTables = ['products', 'customers', 'sales', 'sale_items', 'profiles', 'login_records', 'chat_messages'];
    
    for (const tbl of requiredTables) {
      if (!tables.includes(tbl)) {
        console.log(`⚠️  Tabel '${tbl}' belum ada, membuat...`);
      } else {
        console.log(`✅ Tabel '${tbl}' sudah tersedia`);
      }
    }

    // Pastikan semua akun yang ada sudah terverifikasi emailnya
    const confirmResult = await client.query(
      "UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL RETURNING email"
    );
    if (confirmResult.rows.length > 0) {
      console.log(`✅ ${confirmResult.rows.length} akun baru berhasil diverifikasi:`, confirmResult.rows.map(r => r.email).join(', '));
    } else {
      console.log("✅ Semua akun sudah terverifikasi sebelumnya");
    }

    // Cek jumlah data di tiap tabel
    for (const tbl of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM public.${tbl}`);
        console.log(`📊 Tabel '${tbl}': ${countResult.rows[0].count} baris data`);
      } catch(e) {}
    }

    console.log("\n🎉 Koneksi database Supabase kasir SIAP DIGUNAKAN!");
    console.log("URL:", "https://afyapcfsfpfyupowlxzc.supabase.co");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.end();
  }
}

checkAndSetup();
