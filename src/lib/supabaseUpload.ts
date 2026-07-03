import { createClient } from '@/lib/supabase/client';

export const uploadFileToSupabase = async (file: File, bucket: string = 'uploads'): Promise<string> => {
    try {
        const supabase = createClient();
        
        // Check if user is authenticated (optional, but good practice)
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || 'anonymous';

        // Generate unique filename to avoid collisions
        const fileExt = file.name.split('.').pop();
        const randomString = Math.random().toString(36).substring(2, 10);
        const fileName = `${userId}/${Date.now()}_${randomString}.${fileExt}`;

        // Upload the file to the specified bucket
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Failed to upload file: ${error.message}`);
        }

        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (err) {
        console.error('Error in uploadFileToSupabase:', err);
        throw err;
    }
};
