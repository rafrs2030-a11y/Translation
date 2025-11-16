/**
 * Authentication Routes
 * مسارات المصادقة
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authRateLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

/**
 * POST /api/auth/login
 * تسجيل الدخول باستخدام Supabase Auth
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Get user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        error: 'خطأ في جلب بيانات المستخدم'
      });
    }

    res.json({
      success: true,
      user: userData,
      session: data.session
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
});

/**
 * POST /api/auth/register
 * تسجيل مستخدم جديد
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, national_id, phone, password } = req.body;

    // Validate required fields
    if (!username || !email || !national_id || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'جميع الحقول مطلوبة'
      });
    }

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
      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    // Insert user data into users table
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
      return res.status(500).json({
        success: false,
        error: 'خطأ في حفظ بيانات المستخدم'
      });
    }

    res.status(201).json({
      success: true,
      user: userData,
      message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء التسجيل'
    });
  }
});

/**
 * POST /api/auth/logout
 * تسجيل الخروج
 */
router.post('/logout', async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تسجيل الخروج'
    });
  }
});

/**
 * POST /api/auth/verify-email
 * التحقق من البريد الإلكتروني
 */
router.post('/verify-email', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'رمز التحقق مطلوب'
      });
    }

    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'تم التحقق من البريد الإلكتروني بنجاح'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء التحقق من البريد الإلكتروني'
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * طلب إعادة تعيين كلمة المرور
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني مطلوب'
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.APP_URL}/reset-password`
    });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * إعادة تعيين كلمة المرور
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور الجديدة مطلوبة'
      });
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تغيير كلمة المرور'
    });
  }
});

/**
 * GET /api/auth/me
 * الحصول على بيانات المستخدم الحالي
 */
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'غير مصرح'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'غير مصرح'
      });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        error: 'خطأ في جلب بيانات المستخدم'
      });
    }

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب بيانات المستخدم'
    });
  }
});

module.exports = router;

