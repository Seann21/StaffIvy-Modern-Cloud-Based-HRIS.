import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload an attachment to Supabase Storage (bucket: 'leave-attachments')
 * Returns public URL or client fallback base64 string
 */
export async function uploadLeaveAttachment(file: File): Promise<{
  name: string;
  size: string;
  type: string;
  previewUrl: string;
}> {
  const sizeKB =
    file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      : Math.max(1, Math.round(file.size / 1024)) + ' KB';

  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('leave-attachments')
        .upload(fileName, file);

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('leave-attachments')
          .getPublicUrl(data.path);

        return {
          name: file.name,
          size: sizeKB,
          type: file.type || 'application/pdf',
          previewUrl: publicUrlData.publicUrl,
        };
      }
    } catch (e) {
      console.warn('Supabase upload skipped or failed, fallback to local URL preview:', e);
    }
  }

  // Client preview URL for live demo
  const previewUrl = file.type.startsWith('image/')
    ? URL.createObjectURL(file)
    : URL.createObjectURL(file);

  return {
    name: file.name,
    size: sizeKB,
    type: file.type || 'application/pdf',
    previewUrl,
  };
}

