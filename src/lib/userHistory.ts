import { createClient } from './supabase/client';

export async function saveToHistory(actionName: string, details: Record<string, any> = {}) {
    try {
        const supabase = createClient();
        
        // Check for an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
            // Silently return if no user is logged in (e.g. guest mode)
            return;
        }

        const { error } = await supabase
            .from('user_history')
            .insert({
                user_id: session.user.id,
                action_name: actionName,
                details: details,
            } as any);

        if (error) {
            console.warn('Error saving to user_history:', error.message);
        }
    } catch (err) {
        console.warn('Unexpected error in saveToHistory:', err);
    }
}
