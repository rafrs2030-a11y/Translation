import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Next.js API Route: POST /api/auth/verify-email
 * التحقق من البريد الإلكتروني
 */
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'رمز التحقق مطلوب' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify OTP / Hash with Supabase
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (verifyError) {
      return NextResponse.json(
        { success: false, error: verifyError.message },
        { status: 400 }
      );
    }

    // Update email_verified status in the users table
    if (verifyData && verifyData.user) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', verifyData.user.id);

      if (updateError) {
        console.error('Error updating public user status:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم التحقق من البريد الإلكتروني بنجاح'
    });

  } catch (error) {
    console.error('Email verification route error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التحقق من البريد الإلكتروني' },
      { status: 500 }
    );
  }
}
