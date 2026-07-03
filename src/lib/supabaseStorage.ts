import { createClient } from '@/lib/supabase/client';

/**
 * A custom storage engine for Zustand (and general use) that syncs data 
 * to a single JSONB column in Supabase, tied to the user's account.
 * This guarantees that test progress, classrooms, and study plans 
 * follow the user across all devices.
 */
export const createSupabaseStorage = (columnName: 'classroom_state' | 'test_state' | 'study_plan_state') => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      if (typeof window === 'undefined') return null;
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
           return window.localStorage.getItem(name);
        }

        const { data, error } = await supabase
          .from('user_states')
          .select(columnName)
          .eq('user_id', session.user.id)
          .single();

        if (error || !data || !(data as any)[columnName]) {
           return window.localStorage.getItem(name);
        }

        return JSON.stringify((data as any)[columnName]);
      } catch (err) {
        console.error(`Error loading ${name} from Supabase:`, err);
        return window.localStorage.getItem(name);
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(name, value);
      
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const updates = {
          user_id: session.user.id,
          [columnName]: JSON.parse(value),
          updated_at: new Date().toISOString(),
        };

        await supabase.from('user_states').upsert(updates, { onConflict: 'user_id' });
      } catch (err) {
        console.error(`Error saving ${name} to Supabase:`, err);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(name);
      
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const updates = {
          user_id: session.user.id,
          [columnName]: null,
          updated_at: new Date().toISOString(),
        };

        await supabase.from('user_states').upsert(updates, { onConflict: 'user_id' });
      } catch (err) {
        console.error(`Error removing ${name} from Supabase:`, err);
      }
    },
  };
};
