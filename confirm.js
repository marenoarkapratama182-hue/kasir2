const { Client } = require('pg');

async function confirmEmail() {
  const connectionString = 'postgresql://postgres:akusukamakan@db.afyapcfsfpfyupowlxzc.supabase.co:5432/postgres';
  
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log("Connected to DB!");
    
    const res = await client.query(`
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email = 'admin@kasir.com'
      RETURNING id, email, email_confirmed_at;
    `);
    
    console.log("Updated rows:", res.rowCount);
    if (res.rowCount > 0) {
      console.log("Success:", res.rows[0]);
    }
  } catch (err) {
    console.error("Error connecting or querying:", err);
  } finally {
    await client.end();
  }
}

confirmEmail();
