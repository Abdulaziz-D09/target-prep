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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('question_bank').select('id').eq('subject', 'Math').limit(5000).then(res => {
   if (res.error) console.error("MATH ERROR:", res.error);
   else console.log("MATH SUCCESS length:", res.data.length);
});
supabase.from('question_bank').select('id').eq('subject', 'EBRW').limit(5000).then(res => {
   if (res.error) console.error("EBRW ERROR:", res.error);
   else console.log("EBRW SUCCESS length:", res.data.length);
});
