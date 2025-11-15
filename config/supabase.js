/**
 * Supabase Configuration
 * إعدادات الاتصال بـ Supabase
 */

import { createClient } from '@supabase/supabase-js';

// التحقق من وجود المتغيرات البيئية
if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

// إنشاء عميل Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'Arab Research Publishing Platform',
    },
  },
});

// Storage buckets
export const STORAGE_BUCKETS = {
  RESEARCH_FILES: 'research-files',
};

// Helper functions
export const getStorageUrl = (bucket, path) => {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

export default supabase;

