/**
 * Supabase Client - Browser Version
 * إعدادات الاتصال بـ Supabase للعميل
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!url) {
    // During build time, return empty string to prevent build errors
    // Runtime checks will handle missing URLs
    if (typeof window === 'undefined') {
      return '';
    }
    throw new Error(
      'Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your .env.local file.'
    );
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) {
    // During build time, return empty string to prevent build errors
    // Runtime checks will handle missing keys
    if (typeof window === 'undefined') {
      return '';
    }
    throw new Error(
      'Missing Supabase Anon Key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY in your .env.local file.'
    );
  }
  return key;
}

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  // During build time, return a mock client to prevent errors
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't cause build errors
    return {
      from: () => ({ select: () => ({ eq: () => ({ data: null, error: null }) }) }),
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      storage: { from: () => ({ upload: async () => ({ data: null, error: null }) }) }
    } as any;
  }

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

