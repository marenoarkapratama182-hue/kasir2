const { Client } = require('pg');
require('dotenv').config({path: '.env.local'});
async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query("ALTER TABLE sales ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Berhasil'");
  console.log('Column added');
  await client.end();
}
run();
