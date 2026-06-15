'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTestStore } from '@/store/testStore';
import { useClassroomStore } from '@/store/classroomStore';

export default function SupabaseSyncProvider() {
  useEffect(() => {
    const supabase = createClient();
    
    // Initial sync on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        useTestStore.getState().syncWithSupabase?.();
        useClassroomStore.getState().syncWithSupabase?.();
      }
    });

    // Sync on auth events (like SIGNED_IN)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        useTestStore.getState().syncWithSupabase?.();
        useClassroomStore.getState().syncWithSupabase?.();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
