'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTestStore } from '@/store/testStore';

/**
 * SupabaseSync silently synchronizes local state with cloud state.
 * When a user logs into a new device, this pulls their data from the cloud
 * and populates localStorage so the app works exactly as they left it.
 */
export default function SupabaseSync() {
  useEffect(() => {
    async function sync() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('user_states')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error || !data) return;

        // Sync study plan and other pure localStorage data
        if (data.study_plan_state) {
            const sp = data.study_plan_state;
            if (sp.plan_state) localStorage.setItem('targetprep_plan_state', sp.plan_state);
            if (sp.exam_date) localStorage.setItem('targetprep_exam_date', sp.exam_date);
            if (sp.target_score) localStorage.setItem('targetprep_target_score', sp.target_score);
            if (sp.mastered_topics) localStorage.setItem('targetprep_mastered_topics', JSON.stringify(sp.mastered_topics));
            if (sp.plan_active) localStorage.setItem('targetprep_plan', 'true');
        }

        // Test Store (Zustand)
        if (data.test_state) {
            localStorage.setItem('targetprep_progress', JSON.stringify(data.test_state));
            useTestStore.getState().syncWithSupabase();
        }

      } catch (err) {
        console.error('Failed to run initial Supabase sync:', err);
      }
    }

    sync();
  }, []);

  return null;
}
