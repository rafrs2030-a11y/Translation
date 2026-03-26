import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

/**
 * Next.js API Route: POST /api/auth/reset-password-direct
 * إعادة تعيين كلمة المرور مباشرة بعد التحقق من رقم الهوية
 */
export async function POST(request: Request) {
  try {
    const { email, national_id, new_password } = await request.json();

    if (!email || !national_id || !new_password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني ورقم الهوية وكلمة المرور الجديدة مطلوبة' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Verify national ID with the provided email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, national_id')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني غير مسجل' },
        { status: 404 }
      );
    }

    // 2. National ID validation
    if (userData.national_id && userData.national_id !== national_id.trim()) {
      return NextResponse.json(
        { success: false, error: 'رقم الهوية غير صحيح' },
        { status: 403 }
      );
    }

    // 3. Reset password via Admin API (requires service_role key)
    const supabaseAdmin = createAdminClient();

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.id,
      { password: new_password }
    );

    if (updateError) {
      console.error('Admin update password error:', updateError);
      return NextResponse.json(
        { success: false, error: 'فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تعيين كلمة المرور بنجاح'
    });

  } catch (error) {
    console.error('Direct reset password route error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' },
      { status: 500 }
    );
  }
}
