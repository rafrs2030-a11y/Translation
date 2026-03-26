import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Next.js API Route: POST /api/auth/register
 * تسجيل مستخدم جديد
 */
export async function POST(request: Request) {
  try {
    const { username, email, national_id, phone, password } = await request.json();

    // Validate required fields
    if (!username || !email || !national_id || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          national_id,
          phone
        }
      }
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'فشل إنشاء حساب المستخدم' },
        { status: 500 }
      );
    }

    // Insert user data into public.users table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        username,
        email,
        national_id,
        phone,
        role: 'researcher',
        email_verified: false
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database insertion error:', dbError);
      return NextResponse.json(
        { success: false, error: 'خطأ في حفظ بيانات المستخدم' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration route error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التسجيل' },
      { status: 500 }
    );
  }
}
