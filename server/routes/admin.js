/**
 * Admin Routes
 * مسارات المشرفين
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// Apply authentication middleware to all admin routes
router.use(requireAuth);

/**
 * PUT /api/admin/users/:id/verification
 * تحديث حالة توثيق المستخدم
 */
router.put('/users/:id/verification', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email_verified } = req.body;

    // التحقق من الحقول المطلوبة
    if (email_verified === undefined) {
      return res.status(400).json({
        success: false,
        error: 'حالة التوثيق مطلوبة'
      });
    }

    // الحصول على token من header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'رمز المصادقة مطلوب'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // التحقق من أن المستخدم الحالي هو admin
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !currentUser) {
      return res.status(401).json({
        success: false,
        error: 'رمز المصادقة غير صحيح'
      });
    }

    // التحقق من role في جدول users
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (adminCheckError || !adminCheck) {
      return res.status(500).json({
        success: false,
        error: 'فشل التحقق من صلاحيات المشرف'
      });
    }

    if (adminCheck.role !== 'admin' && adminCheck.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'ليس لديك صلاحية لتعديل بيانات المستخدمين'
      });
    }

    // تحديث حالة التوثيق باستخدام service role (يتجاوز RLS)
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ 
        email_verified: email_verified === true || email_verified === 'true',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user verification:', error);
      return res.status(500).json({
        success: false,
        error: 'فشل تحديث حالة التوثيق'
      });
    }

    // تسجيل في audit log
    try {
      await supabase
        .from('audit_log')
        .insert([{
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

    res.json({
      success: true,
      user: updatedUser,
      message: 'تم تحديث حالة التوثيق بنجاح'
    });

  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تحديث حالة التوثيق'
    });
  }
});

/**
 * PUT /api/admin/users/:id
 * تحديث بيانات المستخدم (شامل)
 */
router.put('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, phone, national_id, email_verified } = req.body;

    // الحصول على token من header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'رمز المصادقة مطلوب'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // التحقق من أن المستخدم الحالي هو admin
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !currentUser) {
      return res.status(401).json({
        success: false,
        error: 'رمز المصادقة غير صحيح'
      });
    }

    // التحقق من role في جدول users
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (adminCheckError || !adminCheck) {
      return res.status(500).json({
        success: false,
        error: 'فشل التحقق من صلاحيات المشرف'
      });
    }

    if (adminCheck.role !== 'admin' && adminCheck.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'ليس لديك صلاحية لتعديل بيانات المستخدمين'
      });
    }

    // بناء بيانات التحديث
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (username !== undefined) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone || null;
    if (national_id !== undefined) updateData.national_id = national_id || null;
    if (email_verified !== undefined) {
      updateData.email_verified = email_verified === true || email_verified === 'true';
    }

    // تحديث البيانات
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        success: false,
        error: 'فشل تحديث بيانات المستخدم'
      });
    }

    // تسجيل في audit log
    try {
      await supabase
        .from('audit_log')
        .insert([{
          admin_id: currentUser.id,
          action: 'update_user',
          entity_type: 'user',
          entity_id: id,
          details: {
            changes: updateData
          }
        }]);
    } catch (auditError) {
      console.warn('Failed to log audit action:', auditError);
    }

    res.json({
      success: true,
      user: updatedUser,
      message: 'تم تحديث بيانات المستخدم بنجاح'
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تحديث بيانات المستخدم'
    });
  }
});

module.exports = router;
