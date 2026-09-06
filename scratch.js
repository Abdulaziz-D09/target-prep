const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://wvtokhuhokehqsgbyifm.supabase.co', 'sb_publishable_GERPzEMDKfSne8ZU78ezMg_LGhDHjAv');

async function test() {
  // sign up a dummy user to test RLS
  const email = `test-${Date.now()}@example.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123'
  });
  if (authError) {
    console.error("Auth Error:", authError);
    return;
  }
  
  const { data, error } = await supabase
    .from('classrooms')
    .select('*')
    .eq('join_code', 'GKXGCM');
  
  console.log("Classrooms for dummy user:", data);
  console.log("Error:", error);
}
test();
