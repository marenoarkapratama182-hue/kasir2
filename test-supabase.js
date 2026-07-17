require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: p, error: pe } = await supabase.from('products').select('*');
  console.log("PRODUCTS DATA (Fixed Key):", p);
  console.log("PRODUCTS ERROR (Fixed Key):", pe);
}

test();
