import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Next.js API Route: POST /api/auth/login
 * تسجيل الدخول باستخدام Supabase Auth
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Get user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('User data fetch error:', userError);
      return NextResponse.json(
        { success: false, error: 'خطأ في جلب بيانات المستخدم' },
        { status: 500 }
      );
    }

    // Sync email verification status
    const authEmailVerified = data.user.email_confirmed_at !== null;
    if (authEmailVerified && !userData.email_verified) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.user.id);
      
      if (!updateError) {
        userData.email_verified = true;
      } else {
        console.error('Error syncing email_verified on login:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      user: userData,
      session: data.session
    });

  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
