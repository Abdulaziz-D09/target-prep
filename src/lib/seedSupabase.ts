import { createClient } from '@/lib/supabase/client';

// Mock data to seed
const MOCK_CLASSROOMS = [
  {
    name: 'SAT March–May 2026',
    invite_code: 'SAT001',
  },
  {
    name: 'Math Bootcamp',
    invite_code: 'MATH2A',
  },
];

export async function seedSupabaseData() {
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) return false;
  const userId = session.session.user.id;

  try {
    // Check if classes already exist
    const { data: existing } = await supabase.from('classes').select('id').eq('teacher_id', userId);
    if (existing && existing.length > 0) return true; // Already seeded

    console.log('Seeding classes...');
    for (const cls of MOCK_CLASSROOMS) {
      await supabase.from('classes').insert({
        name: cls.name,
        teacher_id: userId,
        invite_code: cls.invite_code,
      });
    }
    console.log('Done seeding classes!');
    return true;
  } catch (error) {
    console.error('Error seeding data', error);
    return false;
  }
}
