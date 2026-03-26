import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Next.js API Route: GET /api/auth/me
 * الحصول على بيانات المستخدم الحالي
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Get extra user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user from public table:', userError);
      return NextResponse.json(
        { success: false, error: 'خطأ في جلب بيانات المستخدم' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get user route error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
}
