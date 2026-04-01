/**
 * Supabase Client - Browser Version
 * إعدادات الاتصال بـ Supabase للعميل
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabaseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 
              process.env.SUPABASE_URL || 
              (globalThis as any).NEXT_PUBLIC_SUPABASE_URL || 
              (globalThis as any).SUPABASE_URL;
  if (!url) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ Missing Supabase URL in client context.');
    }
    return undefined;
  }
  return url;
}

function getSupabaseAnonKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
              process.env.SUPABASE_ANON_KEY || 
              (globalThis as any).NEXT_PUBLIC_SUPABASE_ANON_KEY || 
              (globalThis as any).SUPABASE_ANON_KEY;
  if (!key) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ Missing Supabase Anon Key in client context.');
    }
    return undefined;
  }
  return key;
}

/**
 * Create a mock Supabase client that handles missing credentials gracefully
 */
function createMockClient() {
  const mockError = {
    message: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.',
    details: 'Missing environment variables',
    hint: 'Check your Netlify environment variables or .env.local file',
    code: 'MISSING_CONFIG'
  };

  return {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({ data: null, error: mockError }),
        insert: () => ({ data: null, error: mockError }),
        update: () => ({ data: null, error: mockError }),
        delete: () => ({ data: null, error: mockError }),
      }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: mockError }),
      getSession: async () => ({ data: { session: null }, error: mockError }),
      signInWithPassword: async () => ({ data: null, error: mockError }),
      signUp: async () => ({ data: null, error: mockError }),
      signOut: async () => ({ error: mockError }),
      onAuthStateChange: () => ({ data: { subscription: null }, error: mockError }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: mockError }),
        download: async () => ({ data: null, error: mockError }),
        remove: async () => ({ data: null, error: mockError }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as any;
}

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  // If credentials are missing, return a mock client that won't crash the app
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient();
  }

  // Use SSR client if available, otherwise fallback to regular client
  if (typeof window !== 'undefined') {
    try {
      return createBrowserClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
      console.error('Error creating Supabase browser client:', error);
      // Fallback to regular client
      try {
        return createSupabaseClient(supabaseUrl, supabaseAnonKey);
      } catch (fallbackError) {
        console.error('Error creating Supabase client:', fallbackError);
        return createMockClient();
      }
    }
  }
  
  // Server-side fallback
  try {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error creating Supabase server client:', error);
    return createMockClient();
  }
}

