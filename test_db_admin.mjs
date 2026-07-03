import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  const val = rest.join('=');
  if (key && val) {
     acc[key] = val.trim().replace(/^"|"$/g, '');
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('question_bank').select('id', { count: 'exact', head: true }).then(res => {
   if (res.error) console.error("ERROR:", res.error);
   else console.log("ADMIN SUCCESS count:", res.count);
});
