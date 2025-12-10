/**
 * Supabase Client - Browser Version
 * إعدادات الاتصال بـ Supabase للعميل
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!url) {
    throw new Error(
      'Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your .env.local file.'
    );
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      'Missing Supabase Anon Key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY in your .env.local file.'
    );
  }
  return key;
}

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  // Use SSR client if available, otherwise fallback to regular client
  if (typeof window !== 'undefined') {
    try {
      return createBrowserClient(supabaseUrl, supabaseAnonKey);
    } catch {
      // Fallback to regular client
      return createSupabaseClient(supabaseUrl, supabaseAnonKey);
    }
  }
  
  // Server-side fallback
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

