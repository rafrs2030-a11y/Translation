/**
 * Supabase Client - Server Version
 * إعدادات الاتصال بـ Supabase للخادم
 * Updated: Using get/set/remove instead of getAll/setAll
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 
              process.env.SUPABASE_URL || 
              (globalThis as any).NEXT_PUBLIC_SUPABASE_URL || 
              (globalThis as any).SUPABASE_URL;
  return url || '';
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
              process.env.SUPABASE_ANON_KEY || 
              (globalThis as any).NEXT_PUBLIC_SUPABASE_ANON_KEY || 
              (globalThis as any).SUPABASE_ANON_KEY;
  return key || '';
}

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing on server. Deployment may be incomplete or missing secrets.');
    // Return a proxy that handles common cases
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: () => ({ select: () => ({ eq: () => ({ data: [], error: null }) }) }),
    } as any;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch {
          // The `remove` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
