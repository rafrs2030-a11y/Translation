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
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        this.setState({ error: error.message, loading: false });
        return;
      }

      this.setState({
        user: userData,
        session,
        isAuthenticated: true,
        role: userData.role,
        loading: false,
        error: null,
      });
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
      const { username, email, national_id, phone, password } = userData;

      // إنشاء حساب في Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            national_id,
            phone,
          }
        }
      });

      if (authError) throw authError;

      // إضافة بيانات إضافية في جدول users
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          username,
          email,
          national_id,
          phone,
          role: 'researcher',
          email_verified: false,
        }]);

      if (dbError) throw dbError;

      this.setState({ loading: false });
      return { success: true, data: authData };

    } catch (error) {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      this.setState({ loading: false });
      return { success: true, data };

    } catch (error) {
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      this.setState({
        user: null,
        session: null,
        isAuthenticated: false,
        role: null,
        loading: false,
      });

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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
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
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) throw error;

      // تحديث حالة التحقق في قاعدة البيانات
      if (this.state.user) {
        await supabase
          .from('users')
          .update({ email_verified: true })
          .eq('id', this.state.user.id);
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
}

// إنشاء نسخة واحدة (Singleton)
const authStore = new AuthStore();

export default authStore;

