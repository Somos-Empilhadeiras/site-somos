import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET_NAME = 'files-site-somos';

export async function deleteImageFromStorage(url: string | null | undefined) {
    if (!url) return;
    try {
        const parts = url.split(`/${BUCKET_NAME}/`);
        if (parts.length < 2) return;
        const pathToFile = parts[1];
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([pathToFile]);
        if (error) console.error('Erro delete bucket:', error);
    } catch (err) {
        console.error('Erro func delete:', err);
    }
}