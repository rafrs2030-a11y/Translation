'use client';

/**
 * Auth Context
 * إدارة حالة المصادقة والمستخدم الحالي
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User, Session } from '@supabase/supabase-js';

interface UserData {
  id: string;
  email: string;
  username: string;
  role: 'researcher' | 'admin';
  email_verified: boolean;
  [key: string]: any;
}

interface AuthState {
  user: UserData | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: 'researcher' | 'admin' | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    role: null,
  });

  const router = useRouter();
  const supabase = createClient();

  const setSession = useCallback(async (session: Session | null) => {
    if (session) {
      let userData: UserData | null = null;
      let fetchError = null;

      // محاولة جلب بيانات المستخدم من جدول users
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.warn('Error fetching user data from users table:', error);
          fetchError = error;
        } else {
          userData = data as UserData;
        }
      } catch (err) {
        console.warn('Exception fetching user data:', err);
        fetchError = err;
      }

      // إذا فشل جلب البيانات من جدول users، استخدم البيانات من auth.users
      if (!userData || fetchError) {
        let role: 'researcher' | 'admin' = 'researcher';
        try {
          const { data: authUser, error: authError } = await supabase.auth.getUser();
          if (!authError && authUser?.user) {
            role = (authUser.user.user_metadata?.role || 'researcher') as 'researcher' | 'admin';
          }
        } catch (getUserError) {
          console.warn('Error getting user from auth:', getUserError);
        }

        const fallbackUser: UserData = {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'مستخدم',
          role: role,
          email_verified: session.user.email_confirmed_at !== null,
          ...session.user.user_metadata,
        };

        setState({
          user: fallbackUser,
          session,
          isAuthenticated: true,
          role: role,
          loading: false,
          error: null,
        });

        // محاولة تحديث البيانات لاحقاً في الخلفية
        setTimeout(() => {
          refreshUserData().catch(err =>
            console.warn('Background user data refresh failed:', err)
          );
        }, 1000);

        return;
      }

      // التأكد من أن role موجود وصحيح
      if (!userData.role) {
        const authRole = session.user.user_metadata?.role;
        if (authRole) {
          userData.role = authRole as 'researcher' | 'admin';
        } else {
          userData.role = 'researcher';
        }
      }

      setState({
        user: userData,
        session,
        isAuthenticated: true,
        role: userData.role,
        loading: false,
        error: null,
      });
    } else {
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        role: null,
        loading: false,
        error: null,
      });
    }
  }, [supabase]);

  const refreshUserData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await setSession(session);
    }
  }, [supabase, setSession]);

  useEffect(() => {
    // الحصول على الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }));
        return;
      }
      if (session) {
        setSession(session);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    // الاستماع لتغييرات المصادقة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setSession]);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (!email || !password) {
        throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
      }

      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        let errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
        const errorMsgLower = error.message?.toLowerCase() || '';

        if (errorMsgLower.includes('invalid login credentials') ||
            errorMsgLower.includes('invalid email or password')) {
          errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (errorMsgLower.includes('email not confirmed')) {
          errorMessage = 'يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول';
        }

        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        return { success: false, error: errorMessage };
      }

      if (!data || !data.session) {
        throw new Error('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى');
      }

      // Get user role before setting session
      let userRole: 'researcher' | 'admin' = 'researcher';
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.session.user.id)
          .single();

        if (!userError && userData?.role) {
          userRole = userData.role as 'researcher' | 'admin';
        } else {
          // Fallback to metadata
          userRole = (data.session.user.user_metadata?.role || 'researcher') as 'researcher' | 'admin';
        }
      } catch (err) {
        // Fallback to metadata
        userRole = (data.session.user.user_metadata?.role || 'researcher') as 'researcher' | 'admin';
      }

      await setSession(data.session);
      
      // Ensure loading is set to false (setSession should do this, but ensure it)
      setState(prev => ({ ...prev, loading: false }));
      
      // Use the determined role for navigation
      router.push(userRole === 'admin' ? '/admin/dashboard' : '/researcher/dashboard');

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, [supabase, setSession, router]);

  const register = useCallback(async (userData: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const {
        username,
        email,
        password,
        account_type,
        ...otherData
      } = userData;

      if (!username || !email || !password) {
        throw new Error('الاسم والبريد الإلكتروني وكلمة المرور مطلوبة');
      }

      const normalizedAccountType = account_type === 'أفراد' ? 'فرد' : (account_type || 'تجريبي');

      const metadata = {
        username: username,
        account_type: normalizedAccountType,
        ...otherData,
      };

      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) {
        let errorMessage = error.message;
        const errorMsgLower = error.message?.toLowerCase() || '';

        if (errorMsgLower.includes('already registered') ||
            errorMsgLower.includes('email already exists')) {
          errorMessage = 'هذا البريد الإلكتروني مسجل بالفعل';
        } else if (errorMsgLower.includes('invalid email')) {
          errorMessage = 'البريد الإلكتروني غير صحيح';
        }

        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        return { success: false, error: errorMessage };
      }

      setState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'حدث خطأ أثناء التسجيل';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  }, [supabase]);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // تنظيف localStorage
      const supabaseKeys = Object.keys(localStorage).filter(key =>
        key.startsWith('sb-') ||
        key.startsWith('supabase.') ||
        key.includes('supabase')
      );
      supabaseKeys.forEach(key => localStorage.removeItem(key));

      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        role: null,
        loading: false,
        error: null,
      });

      router.push('/');
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  }, [supabase, router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

