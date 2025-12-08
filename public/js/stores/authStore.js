/**
 * Auth Store
 * إدارة حالة المصادقة والمستخدم الحالي
 */

import { supabase } from '../config/supabase.js';

class AuthStore {
  constructor() {
    this.state = {
      user: null,
      session: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      role: null, // 'researcher' or 'admin'
    };

    this.listeners = [];
    this.initialize();
  }

  /**
   * تهيئة المتجر والاستماع لتغييرات المصادقة
   */
  async initialize() {
    try {
      // الحصول على الجلسة الحالية
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session) {
        await this.setSession(session);
      }

      // الاستماع لتغييرات المصادقة
      supabase.auth.onAuthStateChange(async (_event, session) => {
        await this.setSession(session);
      });

    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  /**
   * تعيين الجلسة والمستخدم
   */
  async setSession(session) {
    if (session) {
      let userData = null;
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
          userData = data;
        }
      } catch (err) {
        console.warn('Exception fetching user data:', err);
        fetchError = err;
      }

      // إذا فشل جلب البيانات من جدول users، استخدم البيانات من auth.users
      if (!userData || fetchError) {
        console.log('Using fallback user data from auth session');
        
        // محاولة جلب role من auth.users مباشرة
        let role = 'researcher';
        try {
          const { data: authUser, error: authError } = await supabase.auth.getUser();
          if (!authError && authUser?.user) {
            // التحقق من user_metadata أولاً
            role = authUser.user.user_metadata?.role || 'researcher';
            
            // إذا لم يكن موجوداً في metadata، حاول جلب من جدول users بطريقة مختلفة
            if (role === 'researcher') {
              try {
                const { data: roleData } = await supabase
                  .rpc('get_user_role', { user_id: session.user.id })
                  .single();
                if (roleData) role = roleData;
              } catch (rpcError) {
                // إذا فشل RPC، جرب SELECT مباشرة مع auth.uid()
                try {
                  const { data: directRole } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .maybeSingle();
                  if (directRole?.role) role = directRole.role;
                } catch (directError) {
                  console.warn('Could not fetch role directly:', directError);
                }
              }
            }
          }
        } catch (getUserError) {
          console.warn('Error getting user from auth:', getUserError);
        }

        const fallbackUser = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'مستخدم',
          role: role,
          email_verified: session.user.email_confirmed_at !== null,
          ...session.user.user_metadata
        };
        
        this.setState({
          user: fallbackUser,
          session,
          isAuthenticated: true,
          role: role,
          loading: false,
          error: null,
        });
        
        // محاولة تحديث البيانات لاحقاً في الخلفية
        setTimeout(() => {
          this.refreshUserData(session.user.id).catch(err => 
            console.warn('Background user data refresh failed:', err)
          );
        }, 1000);
        
        return;
      }

      // التأكد من أن role موجود وصحيح
      if (!userData.role) {
        console.warn('⚠️ User role is missing in database, checking auth metadata...');
        // محاولة جلب role من user_metadata كبديل
        const authRole = session.user.user_metadata?.role;
        if (authRole) {
          console.log('✅ Found role in user_metadata:', authRole);
          userData.role = authRole;
        } else {
          console.warn('⚠️ No role found, defaulting to researcher');
          userData.role = 'researcher';
        }
      }

      // مزامنة حالة التحقق من البريد الإلكتروني
      const authEmailVerified = session.user.email_confirmed_at !== null;
      if (authEmailVerified && !userData.email_verified) {
        try {
          const { error: updateError } = await supabase
            .from('users')
            .update({ email_verified: true, updated_at: new Date().toISOString() })
            .eq('id', session.user.id);
          
          if (!updateError) {
            userData.email_verified = true;
          } else {
            console.error('Error syncing email_verified:', updateError);
          }
        } catch (syncError) {
          console.error('Error syncing email verification:', syncError);
        }
      }

      // تسجيل معلومات المستخدم للتشخيص
      console.log('✅ User session set successfully:', {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        username: userData.username,
        email_verified: userData.email_verified
      });

      // تحديث الحالة مع التأكد من role
      this.setState({
        user: userData,
        session,
        isAuthenticated: true,
        role: userData.role, // التأكد من تحديث role في state
        loading: false,
        error: null,
      });
      
      // التأكد من أن role محدث في state
      console.log('✅ State updated with role:', this.state.role);
    } else {
      this.setState({
        user: null,
        session: null,
        isAuthenticated: false,
        role: null,
        loading: false,
      });
    }
  }

  /**
   * تسجيل مستخدم جديد
   */
  async register(userData) {
    this.setState({ loading: true, error: null });

    try {
      const { 
        username, 
        email, 
        national_id, 
        phone, 
        password, 
        gender, 
        country, 
        account_type,
        organization_name,
        organization_type
      } = userData;

      // التحقق من الحقول المطلوبة
      if (!username || !email || !password) {
        throw new Error('الاسم والبريد الإلكتروني وكلمة المرور مطلوبة');
      }

      // إنشاء حساب في Supabase Auth
      // تعطيل التحقق من البريد الإلكتروني (emailRedirectTo: null)
      const metadata = {
        username: username || (account_type === 'أعمال' ? organization_name : username),
        phone: phone || null,
        country: country || null,
        account_type: account_type || 'تجريبي',
      };
      
      // Add fields based on account type
      if (account_type === 'أفراد') {
        metadata.national_id = national_id || null;
        metadata.gender = gender || null;
      } else if (account_type === 'أعمال') {
        metadata.organization_name = organization_name || null;
        metadata.organization_type = organization_type || null;
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: null, // تعطيل إعادة التوجيه للتحقق
          data: metadata
        }
      });

      if (authError) {
        console.error('Supabase Auth Error:', authError);
        // تحسين رسائل الخطأ
        let errorMessage = authError.message;
        if (authError.message.includes('already registered')) {
          errorMessage = 'هذا البريد الإلكتروني مسجل بالفعل';
        } else if (authError.message.includes('Invalid email')) {
          errorMessage = 'البريد الإلكتروني غير صحيح';
        } else if (authError.message.includes('Password')) {
          errorMessage = 'كلمة المرور غير صحيحة';
        }
        throw new Error(errorMessage);
      }

      if (!authData || !authData.user) {
        throw new Error('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى');
      }

      // Trigger سينشئ السجل تلقائياً في جدول users باستخدام البيانات من metadata
      // البيانات (username, national_id, phone, gender, country) موجودة في authData.user.user_metadata
      // trigger سينشئ السجل تلقائياً عند إنشاء المستخدم في Auth
      
      // لا نحتاج لمحاولة إدراج أو تحديث البيانات هنا لأن:
      // 1. trigger سينشئ السجل تلقائياً من metadata
      // 2. RLS قد يمنع الإدراج/التحديث إذا لم تكن الجلسة نشطة
      // 3. البيانات موجودة في metadata ويمكن تحديثها لاحقاً عند تسجيل الدخول
      
      console.log('User created successfully. Trigger will create user record in database.');

      this.setState({ loading: false });
      return { success: true, data: authData };

    } catch (error) {
      console.error('Registration error:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * تسجيل الدخول
   */
  async login(email, password) {
    this.setState({ loading: true, error: null });

    try {
      // التحقق من الحقول المطلوبة
      if (!email || !password) {
        throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
      }

      // تنظيف البريد الإلكتروني
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error('Supabase Auth Error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusCode: error.statusCode,
          name: error.name,
          code: error.code
        });
        
        // تحسين رسائل الخطأ بناءً على نوع الخطأ
        let errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
        
        // معالجة أخطاء Supabase المختلفة
        const errorMsgLower = error.message?.toLowerCase() || '';
        const errorCode = error.code || error.statusCode || error.status;
        
        if (errorCode === 400 || error.status === 400) {
          if (errorMsgLower.includes('invalid login credentials') || 
              errorMsgLower.includes('invalid email or password') ||
              errorMsgLower.includes('invalid_credentials')) {
            errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
          } else if (errorMsgLower.includes('email not confirmed') ||
                     errorMsgLower.includes('email_not_confirmed') ||
                     errorMsgLower.includes('signup_disabled')) {
            errorMessage = 'يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول. تحقق من صندوق الوارد أو الرسائل غير المرغوب فيها';
          } else if (errorMsgLower.includes('user not found') ||
                     errorMsgLower.includes('user_not_found')) {
            errorMessage = 'البريد الإلكتروني غير مسجل. يرجى إنشاء حساب جديد';
          } else if (errorMsgLower.includes('email rate limit') ||
                     errorMsgLower.includes('too many')) {
            errorMessage = 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً';
          } else {
            // رسالة عامة مع تفاصيل الخطأ للمطور
            errorMessage = `بيانات تسجيل الدخول غير صحيحة. ${error.message || 'يرجى التحقق من البريد الإلكتروني وكلمة المرور'}`;
          }
        } else if (errorCode === 429 || error.status === 429 || errorMsgLower.includes('too many requests')) {
          errorMessage = 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً';
        } else if (errorCode === 401 || error.status === 401) {
          errorMessage = 'غير مصرح لك بالدخول. يرجى التحقق من بياناتك';
        } else if (errorCode === 500 || error.status === 500) {
          errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً';
        }
        
        throw new Error(errorMessage);
      }

      if (!data || !data.session) {
        throw new Error('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى');
      }

      // تحديث الحالة بعد تسجيل الدخول الناجح
      await this.setSession(data.session);

      this.setState({ loading: false });
      return { success: true, data };

    } catch (error) {
      console.error('Login error:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * تسجيل الخروج
   */
  async logout() {
    this.setState({ loading: true, error: null });

    try {
      // تسجيل الخروج من Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // تنظيف جميع البيانات المحلية
      try {
        // تنظيف مفاتيح Supabase من localStorage
        const supabaseKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || 
          key.startsWith('supabase.') ||
          key.includes('supabase')
        );
        supabaseKeys.forEach(key => localStorage.removeItem(key));

        // تنظيف sessionStorage
        sessionStorage.clear();

        // تنظيف أي بيانات أخرى محلية
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        localStorage.removeItem('auth');
      } catch (storageError) {
        console.warn('Error clearing storage:', storageError);
        // لا نرمي خطأ هنا، لأن تنظيف التخزين ليس ضرورياً لتسجيل الخروج
      }

      // تحديث الحالة
      this.setState({
        user: null,
        session: null,
        isAuthenticated: false,
        role: null,
        loading: false,
      });

      return { success: true };

    } catch (error) {
      // حتى في حالة الخطأ، نحاول تنظيف البيانات المحلية
      try {
        const supabaseKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || 
          key.startsWith('supabase.') ||
          key.includes('supabase')
        );
        supabaseKeys.forEach(key => localStorage.removeItem(key));
        sessionStorage.clear();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        localStorage.removeItem('auth');
      } catch (storageError) {
        console.warn('Error clearing storage on error:', storageError);
      }

      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * إعادة إرسال رابط التحقق من البريد الإلكتروني
   */
  async resendVerificationEmail(email) {
    this.setState({ loading: true, error: null });

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/pages/verify-email.html`,
        }
      });

      if (error) throw error;

      this.setState({ loading: false });
      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * طلب إعادة تعيين كلمة المرور
   */
  async requestPasswordReset(email) {
    this.setState({ loading: true, error: null });

    try {
      // تنظيف البريد الإلكتروني
      const cleanEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/pages/reset-password.html`,
      });

      if (error) {
        console.error('Password reset error:', error);
        
        // تحسين رسائل الخطأ
        let errorMessage = error.message;
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          errorMessage = 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً';
        } else if (error.message.includes('user not found')) {
          errorMessage = 'البريد الإلكتروني غير مسجل';
        } else {
          errorMessage = 'فشل إرسال رابط إعادة التعيين. يرجى التحقق من البريد الإلكتروني أو المحاولة لاحقاً';
        }
        
        throw new Error(errorMessage);
      }

      this.setState({ loading: false });
      return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' };

    } catch (error) {
      console.error('Password reset error:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * إعادة تعيين كلمة المرور مباشرة باستخدام رقم الهوية
   */
  async resetPasswordDirect(email, nationalId, newPassword) {
    this.setState({ loading: true, error: null });

    try {
      // التحقق من رقم الهوية مع البريد الإلكتروني
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, national_id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('البريد الإلكتروني غير مسجل');
      }

      // التحقق من رقم الهوية
      if (userData.national_id && userData.national_id !== nationalId) {
        throw new Error('رقم الهوية غير صحيح');
      }

      // الحصول على user ID من auth.users
      const userId = userData.id;

      // إعادة تعيين كلمة المرور باستخدام Supabase Admin API
      // لكن هذا يتطلب service_role key
      // بدلاً من ذلك، نستخدم طريقة آمنة:
      // 1. التحقق من رقم الهوية (تم)
      // 2. إرسال رابط إعادة التعيين مع token خاص
      
      // الحل الأفضل: استخدام Supabase Admin API
      // لكن الآن سنستخدم طريقة مباشرة من خلال RPC function
      
      // استخدام Edge Function أو API endpoint لإعادة تعيين كلمة المرور
      // لكن الآن سنستخدم طريقة مباشرة من خلال Supabase Auth
      // بعد التحقق من رقم الهوية، نرسل رابط إعادة التعيين
      
      // إعادة تعيين كلمة المرور مباشرة عبر API endpoint
      // بعد التحقق من رقم الهوية
      
      try {
        // محاولة استخدام API endpoint لإعادة تعيين كلمة المرور مباشرة
        const response = await fetch('/api/auth/reset-password-direct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            national_id: nationalId,
            new_password: newPassword
          })
        });

        const result = await response.json();

        if (result.success) {
          this.setState({ loading: false });
          return { 
            success: true, 
            message: 'تم إعادة تعيين كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.' 
          };
        } else {
          // إذا فشل API endpoint، نستخدم طريقة إرسال رابط إعادة التعيين
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/pages/reset-password.html`,
          });

          if (resetError) {
            throw new Error('فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى أو استخدام طريقة البريد الإلكتروني');
          }

          this.setState({ loading: false });
          return { 
            success: true, 
            message: 'تم التحقق من رقم الهوية بنجاح. تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد أو الرسائل غير المرغوب فيها' 
          };
        }
      } catch (apiError) {
        // إذا فشل API endpoint، نستخدم طريقة إرسال رابط إعادة التعيين
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/pages/reset-password.html`,
        });

        if (resetError) {
          throw new Error('فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى أو استخدام طريقة البريد الإلكتروني');
        }

        this.setState({ loading: false });
        return { 
          success: true, 
          message: 'تم التحقق من رقم الهوية بنجاح. تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد أو الرسائل غير المرغوب فيها' 
        };
      }

    } catch (error) {
      console.error('Direct password reset error:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * إعادة تعيين كلمة المرور
   */
  async resetPassword(newPassword) {
    this.setState({ loading: true, error: null });

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      this.setState({ loading: false });
      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * التحقق من البريد الإلكتروني
   */
  async verifyEmail(token) {
    this.setState({ loading: true, error: null });

    try {
      const { data: verifyData, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) throw error;

      // تحديث حالة التحقق في قاعدة البيانات
      const userId = verifyData?.user?.id || this.state.user?.id;
      if (userId) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            email_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating email_verified:', updateError);
        } else if (this.state.user && this.state.user.id === userId) {
          this.setState({
            user: { ...this.state.user, email_verified: true }
          });
        }
      }

      this.setState({ loading: false });
      return { success: true };

    } catch (error) {
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }

  /**
   * تحديث الحالة
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  /**
   * الحصول على الحالة الحالية
   */
  getState() {
    return this.state;
  }

  /**
   * الاشتراك في تغييرات الحالة
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * إشعار جميع المستمعين بالتغييرات
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * التحقق من صلاحيات المستخدم
   */
  hasRole(role) {
    return this.state.role === role;
  }

  /**
   * التحقق من تسجيل الدخول
   */
  isLoggedIn() {
    return this.state.isAuthenticated && this.state.session !== null;
  }

  /**
   * التحقق من التحقق من البريد
   */
  isEmailVerified() {
    return this.state.user?.email_verified || false;
  }

  /**
   * تحديث بيانات المستخدم من قاعدة البيانات
   */
  async refreshUserData(userId) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Error refreshing user data:', error);
        return null;
      }

      if (userData && userData.role) {
        // تحديث الحالة فقط إذا تغير role
        if (this.state.user?.role !== userData.role) {
          console.log('User role updated:', {
            old: this.state.user?.role,
            new: userData.role
          });
          
          this.setState({
            user: userData,
            role: userData.role
          });
        } else {
          // تحديث بيانات المستخدم الأخرى
          this.setState({
            user: userData
          });
        }
        
        return userData;
      }

      return null;
    } catch (error) {
      console.warn('Exception refreshing user data:', error);
      return null;
    }
  }

  /**
   * الحصول على المستخدم الحالي
   */
  async getCurrentUser() {
    try {
      // إذا كان المستخدم محفوظ بالفعل مع role، أرجعه
      if (this.state.user && this.state.user.role) {
        console.log('✅ Returning user from state:', {
          id: this.state.user.id,
          email: this.state.user.email,
          role: this.state.user.role
        });
        return this.state.user;
      }

      // الحصول على الجلسة الحالية
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        throw error;
      }
      
      if (!session) {
        console.warn('⚠️ No session found');
        return null;
      }

      console.log('🔍 Fetching user data from database for user:', session.user.id);

      // الحصول على بيانات المستخدم من قاعدة البيانات
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('❌ Error fetching user data from database:', userError);
        // محاولة استخدام البيانات من session
        const fallbackRole = session.user.user_metadata?.role || 'researcher';
        const fallbackUser = {
          id: session.user.id,
          email: session.user.email,
          role: fallbackRole,
          email_verified: session.user.email_confirmed_at !== null,
          ...session.user.user_metadata
        };
        console.log('⚠️ Using fallback user data:', fallbackUser);
        
        // تحديث state بالبيانات الاحتياطية
        this.setState({
          user: fallbackUser,
          role: fallbackRole
        });
        
        return fallbackUser;
      }

      // التأكد من وجود role
      if (!userData.role) {
        console.warn('⚠️ User role missing in database, checking metadata...');
        const metadataRole = session.user.user_metadata?.role;
        if (metadataRole) {
          console.log('✅ Found role in metadata:', metadataRole);
          userData.role = metadataRole;
        } else {
          console.warn('⚠️ No role found anywhere, defaulting to researcher');
          userData.role = 'researcher';
        }
      }

      console.log('✅ User data fetched successfully:', {
        id: userData.id,
        email: userData.email,
        role: userData.role
      });

      // تحديث الحالة دائماً لضمان التزامن
      this.setState({
        user: userData,
        role: userData.role,
        isAuthenticated: true,
        session: session
      });

      return userData;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  /**
   * انتظار انتهاء التحميل الأولي
   */
  async waitForInitialization() {
    return new Promise((resolve) => {
      if (!this.state.loading) {
        resolve();
        return;
      }

      const unsubscribe = this.subscribe((state) => {
        if (!state.loading) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
}

// إنشاء نسخة واحدة (Singleton)
const authStore = new AuthStore();

export default authStore;

