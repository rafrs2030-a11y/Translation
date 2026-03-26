import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js API Route: PUT /api/admin/users/[id]/verification
 * تحديث حالة توثيق المستخدم
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email_verified } = await request.json();

    if (email_verified === undefined) {
      return NextResponse.json(
        { success: false, error: 'حالة التوثيق مطلوبة' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Verify that the current user is an admin
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Check user role from public.users table
    const { data: userRecord, error: userRecordError } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (userRecordError || !userRecord) {
      return NextResponse.json(
        { success: false, error: 'فشل التحقق من الصلاحيات' },
        { status: 500 }
      );
    }

    if (userRecord.role !== 'admin' && userRecord.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'ليس لديك صلاحية للقيام بهذا الإجراء' },
        { status: 403 }
      );
    }

    // 2. Perform administrative status update (using Admin Client to bypass RLS)
    const supabaseAdmin = createAdminClient();

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        email_verified: email_verified === true || email_verified === 'true',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Admin update user error:', updateError);
      return NextResponse.json(
        { success: false, error: 'فشل تحديث حالة التوثيق' },
        { status: 500 }
      );
    }

    // 3. Log the action (Audit Log)
    try {
      await supabaseAdmin.from('audit_log').insert([{
        admin_id: currentUser.id,
        action: 'update_verification',
        entity_type: 'user',
        entity_id: id,
        details: {
          email_verified: email_verified === true || email_verified === 'true'
        }
      }]);
    } catch (auditError) {
      console.warn('Failed to log audit action:', auditError);
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'تم تحديث حالة التوثيق بنجاح'
    });

  } catch (error) {
    console.error('Admin verification route error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحديث حالة التوثيق' },
      { status: 500 }
    );
  }
}
