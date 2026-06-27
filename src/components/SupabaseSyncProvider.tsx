'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTestStore } from '@/store/testStore';
import { useClassroomStore } from '@/store/classroomStore';

export default function SupabaseSyncProvider() {
  useEffect(() => {
    const supabase = createClient();
    
    const syncAll = async (session: any) => {
      if (!session?.user) return;
      
      // Zustand syncs
      useTestStore.getState().syncWithSupabase?.();
      useClassroomStore.getState().syncWithSupabase?.();

      // Native localStorage syncs
      const supabase = createClient();
      const { data } = await supabase.from('user_states').select('study_plan_state').eq('user_id', session.user.id).single();
      if (data?.study_plan_state) {
          const sp = data.study_plan_state;
          if (sp.plan_state) localStorage.setItem('targetprep_plan_state', sp.plan_state);
          if (sp.exam_date) localStorage.setItem('targetprep_exam_date', sp.exam_date);
          if (sp.target_score) localStorage.setItem('targetprep_target_score', sp.target_score);
          if (sp.mastered_topics) localStorage.setItem('targetprep_mastered_topics', JSON.stringify(sp.mastered_topics));
          if (sp.plan_active) localStorage.setItem('targetprep_plan', 'true');
      }
    };

    // Initial sync on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAll(session);
    });

    // Sync on auth events (like SIGNED_IN)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        syncAll(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
