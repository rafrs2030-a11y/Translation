/**
 * Chat Store
 * إدارة حالة الدردشة بين المستخدمين والإدمن
 */

import { supabase } from '../config/supabase.js';
import authStore from './authStore.js';

class ChatStore {
  constructor() {
    this.state = {
      conversations: [],
      currentConversation: null,
      messages: [],
      unreadCount: 0,
      loading: false,
      error: null,
      realtimeSubscription: null,
    };

    this.listeners = [];
  }

  /**
   * تهيئة الدردشة
   */
  async initialize() {
    try {
      const user = authStore.getState().user;
      if (!user) return;

      // جلب المحادثات
      await this.fetchConversations();

      // الاشتراك في الرسائل الفورية
      this.subscribeToRealtime();

    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  }

  /**
   * الاشتراك في الرسائل الفورية
   */
  subscribeToRealtime() {
    const user = authStore.getState().user;
    if (!user) return;

    // إلغاء الاشتراك السابق إن وُجد
    if (this.state.realtimeSubscription) {
      this.state.realtimeSubscription.unsubscribe();
    }

    // الاشتراك الجديد
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
      }, (payload) => {
        this.handleNewMessage(payload.new);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
      }, (payload) => {
        this.handleMessageUpdate(payload.new);
      })
      .subscribe();

    this.setState({ realtimeSubscription: subscription });
  }

  /**
   * إلغاء الاشتراك في الرسائل الفورية
   */
  unsubscribeFromRealtime() {
    if (this.state.realtimeSubscription) {
      this.state.realtimeSubscription.unsubscribe();
      this.setState({ realtimeSubscription: null });
    }
  }

  /**
   * معالجة رسالة جديدة
   */
  async handleNewMessage(message) {
    // تحديث الرسائل إذا كانت المحادثة مفتوحة
    if (this.state.currentConversation && message.conversation_id === this.state.currentConversation.id) {
      this.setState({
        messages: [...this.state.messages, message],
      });
    }

    // تحديث عدد الرسائل غير المقروءة
    await this.updateUnreadCount();
    
    // تحديث المحادثات
    await this.fetchConversations();
  }

  /**
   * معالجة تحديث رسالة
   */
  handleMessageUpdate(message) {
    this.setState({
      messages: this.state.messages.map(m => 
        m.id === message.id ? message : m
      ),
    });
  }

  /**
   * جلب جميع المحادثات
   */
  async fetchConversations() {
    this.setState({ loading: true, error: null });

    try {
      const user = authStore.getState().user;
      if (!user) {
        this.setState({ conversations: [], loading: false });
        return { success: false, data: [] };
      }

      // بناء الاستعلام حسب دور المستخدم
      let query;
      
      if (user.role === 'researcher') {
        // للباحث: جلب محادثاته فقط
        query = supabase
          .from('chat_conversations')
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email, profile_picture),
            admin:users!chat_conversations_admin_id_fkey(id, username, email, profile_picture)
          `)
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false });
      } else if (user.role === 'admin' || user.role === 'super_admin') {
        // للإدمن: جلب جميع المحادثات التي هو إدمن فيها
        query = supabase
          .from('chat_conversations')
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email, profile_picture),
            admin:users!chat_conversations_admin_id_fkey(id, username, email, profile_picture)
          `)
          .eq('admin_id', user.id)
          .order('last_message_at', { ascending: false });
      } else {
        this.setState({ conversations: [], loading: false });
        return { success: false, data: [] };
      }

      // إذا لم يكن هناك استعلام، إرجاع قائمة فارغة
      if (!query) {
        this.setState({ conversations: [], loading: false });
        return { success: false, data: [] };
      }

      const { data, error } = await query;

      if (error) throw error;

      this.setState({
        conversations: data || [],
        loading: false,
      });

      // تحديث عدد الرسائل غير المقروءة
      await this.updateUnreadCount();

      return { success: true, data: data || [] };

    } catch (error) {
      console.error('Error fetching conversations:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * إنشاء محادثة جديدة أو جلب المحادثة الموجودة
   */
  async getOrCreateConversation(userId = null) {
    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      // إذا كان المستخدم باحث، نحتاج إلى معرف الإدمن
      if (user.role === 'researcher') {
        let adminId = userId; // في حالة الباحث، userId هو adminId
        
        if (!adminId) {
          // جلب أول إدمن متاح
          const { data: admins, error: adminError } = await supabase
            .from('users')
            .select('id')
            .in('role', ['admin', 'super_admin'])
            .limit(1);

          if (adminError) throw adminError;
          if (!admins || admins.length === 0) {
            throw new Error('لا يوجد إدمن متاح');
          }

          adminId = admins[0].id;
        }

        // البحث عن محادثة موجودة
        const { data: existing, error: searchError } = await supabase
          .from('chat_conversations')
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email, profile_picture),
            admin:users!chat_conversations_admin_id_fkey(id, username, email, profile_picture)
          `)
          .eq('user_id', user.id)
          .eq('admin_id', adminId)
          .maybeSingle();

        if (searchError) throw searchError;

        if (existing) {
          this.setState({ currentConversation: existing });
          await this.fetchMessages(existing.id);
          return { success: true, conversation: existing };
        }

        // إنشاء محادثة جديدة
        const { data: newConversation, error: insertError } = await supabase
          .from('chat_conversations')
          .insert([{
            user_id: user.id,
            admin_id: adminId,
          }])
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email, profile_picture),
            admin:users!chat_conversations_admin_id_fkey(id, username, email, profile_picture)
          `)
          .single();

        if (insertError) {
          console.error('Error creating conversation:', insertError);
          throw insertError;
        }

        if (!newConversation) {
          throw new Error('فشل إنشاء المحادثة');
        }

        this.setState({ currentConversation: newConversation });
        await this.fetchConversations();
        return { success: true, conversation: newConversation };

      } else if (user.role === 'admin' || user.role === 'super_admin') {
        // إذا كان المستخدم إدمن، نحتاج معرف المستخدم (الباحث)
        if (!userId) {
          throw new Error('يجب تحديد معرف المستخدم');
        }

        // البحث عن محادثة موجودة
        const { data: existing, error: searchError } = await supabase
          .from('chat_conversations')
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email, profile_picture),
            admin:users!chat_conversations_admin_id_fkey(id, username, email, profile_picture)
          `)
          .eq('user_id', userId)
          .eq('admin_id', user.id)
          .maybeSingle();

        if (searchError) throw searchError;

        if (existing) {
          this.setState({ currentConversation: existing });
          await this.fetchMessages(existing.id);
          return { success: true, conversation: existing };
        }

        // إنشاء محادثة جديدة
        const { data: newConversation, error: insertError } = await supabase
          .from('chat_conversations')
          .insert([{
            user_id: userId,
            admin_id: user.id,
          }])
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email, profile_picture),
            admin:users!chat_conversations_admin_id_fkey(id, username, email, profile_picture)
          `)
          .single();

        if (insertError) {
          console.error('Error creating conversation:', insertError);
          throw insertError;
        }

        if (!newConversation) {
          throw new Error('فشل إنشاء المحادثة');
        }

        this.setState({ currentConversation: newConversation });
        await this.fetchConversations();
        return { success: true, conversation: newConversation };
      }

    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * جلب قائمة المستخدمين (للإدمن)
   */
  async fetchUsersForChat() {
    try {
      const user = authStore.getState().user;
      if (!user) {
        return { success: false, data: [] };
      }

      let query;
      
      if (user.role === 'admin' || user.role === 'super_admin') {
        // للإدمن: جلب جميع الباحثين
        query = supabase
          .from('users')
          .select('id, username, email, role, profile_picture')
          .eq('role', 'researcher')
          .order('username', { ascending: true });
      } else if (user.role === 'researcher') {
        // للباحث: جلب جميع الإدمنين
        query = supabase
          .from('users')
          .select('id, username, email, role, profile_picture')
          .in('role', ['admin', 'super_admin'])
          .order('username', { ascending: true });
      } else {
        return { success: false, data: [] };
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };

    } catch (error) {
      console.error('Error fetching users for chat:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * جلب رسائل محادثة
   */
  async fetchMessages(conversationId) {
    this.setState({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, sender:users!chat_messages_sender_id_fkey(id, username, email, profile_picture)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      this.setState({
        messages: data || [],
        loading: false,
      });

      // وضع علامة مقروء على الرسائل
      await this.markMessagesAsRead(conversationId);

      return { success: true, data: data || [] };

    } catch (error) {
      console.error('Error fetching messages:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * إرسال رسالة
   */
  async sendMessage(message, conversationId = null) {
    try {
      const user = authStore.getState().user;
      if (!user) throw new Error('المستخدم غير مسجل الدخول');

      let convId = conversationId || this.state.currentConversation?.id;

      if (!convId) {
        // إنشاء محادثة جديدة
        const result = await this.getOrCreateConversation();
        if (!result.success) throw new Error(result.error);
        convId = result.conversation.id;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: convId,
          sender_id: user.id,
          message: message,
        }])
        .select()
        .single();

      if (error) throw error;

      // إضافة الرسالة إلى القائمة
      this.setState({
        messages: [...this.state.messages, data],
      });

      // تحديث المحادثات
      await this.fetchConversations();

      return { success: true, message: data };

    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * وضع علامة مقروء على الرسائل
   */
  async markMessagesAsRead(conversationId) {
    try {
      const user = authStore.getState().user;
      if (!user) return;

      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // تحديث عدد الرسائل غير المقروءة
      await this.updateUnreadCount();

    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  /**
   * تحديث عدد الرسائل غير المقروءة
   */
  async updateUnreadCount() {
    try {
      const user = authStore.getState().user;
      if (!user) {
        this.setState({ unreadCount: 0 });
        return;
      }

      let query = supabase
        .from('chat_messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id);

      // إذا كان المستخدم باحث، جلب الرسائل غير المقروءة في محادثاته
      // إذا كان إدمن، جلب الرسائل غير المقروءة في محادثاته
      if (user.role === 'researcher') {
        const { data: conversations } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('user_id', user.id);

        if (conversations && conversations.length > 0) {
          const conversationIds = conversations.map(c => c.id);
          query = query.in('conversation_id', conversationIds);
        } else {
          this.setState({ unreadCount: 0 });
          return;
        }
      } else if (user.role === 'admin' || user.role === 'super_admin') {
        const { data: conversations } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('admin_id', user.id);

        if (conversations && conversations.length > 0) {
          const conversationIds = conversations.map(c => c.id);
          query = query.in('conversation_id', conversationIds);
        } else {
          this.setState({ unreadCount: 0 });
          return;
        }
      } else {
        this.setState({ unreadCount: 0 });
        return;
      }

      const { count, error } = await query;

      if (error) throw error;

      this.setState({ unreadCount: count || 0 });

    } catch (error) {
      console.error('Error updating unread count:', error);
    }
  }

  /**
   * تنظيف (عند تسجيل الخروج)
   */
  cleanup() {
    this.unsubscribeFromRealtime();
    this.setState({
      conversations: [],
      currentConversation: null,
      messages: [],
      unreadCount: 0,
      loading: false,
      error: null,
    });
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
}

// إنشاء نسخة واحدة (Singleton)
const chatStore = new ChatStore();

export default chatStore;

