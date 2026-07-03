const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadBank(filename, subject) {
  const filePath = path.join(__dirname, '..', 'src', 'data', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filename}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Loaded ${data.length} questions from ${filename}. Migrating to Supabase...`);

  // Batch insert to avoid payload limits
  const BATCH_SIZE = 100;
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    
    const formattedBatch = batch.map(q => {
      // Extract top-level fields for faster filtering
      const { id, domain, skill, difficulty, type, passage, question, options, answer, answerType, answerText, explanation, ...rest } = q;
      
      return {
        id: id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        subject: subject,
        domain: domain || 'Uncategorized',
        skill: skill || 'Uncategorized',
        difficulty: difficulty || 'Medium',
        question_data: {
            type,
            passage,
            question,
            options,
            answer,
            answerType,
            answerText,
            explanation,
            ...rest
        } // Store everything else in JSONB
      };
    });

    const { error } = await supabase.from('question_bank').upsert(formattedBatch, { onConflict: 'id' });
    
    if (error) {
      console.error(`Error uploading batch ${i} - ${i + BATCH_SIZE} for ${subject}:`, error.message);
    } else {
      console.log(`✅ Uploaded batch ${i} - ${i + BATCH_SIZE} for ${subject}`);
    }
  }
}

async function run() {
  await uploadBank('math_bank.json', 'Math');
  await uploadBank('ebrw_bank.json', 'EBRW');
  console.log('Migration complete!');
}

run();
