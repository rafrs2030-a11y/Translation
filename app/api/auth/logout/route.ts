import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Next.js API Route: POST /api/auth/logout
 * تسجيل الخروج
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
}
