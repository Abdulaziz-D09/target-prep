import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.user_metadata?.role === 'teacher') {
    redirect('/teacher');
  } else {
    redirect('/dashboard');
  }
}
