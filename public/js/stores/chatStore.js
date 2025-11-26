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
      conversationSubscription: null,
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

    // بناء filter حسب دور المستخدم
    let conversationFilter = '';
    if (user.role === 'researcher') {
      conversationFilter = `user_id=eq.${user.id}`;
    } else if (user.role === 'admin' || user.role === 'super_admin') {
      conversationFilter = `admin_id=eq.${user.id}`;
    } else {
      return; // لا يوجد دور صالح
    }

    // الاشتراك في المحادثات
    const conversationsChannel = supabase
      .channel('chat_conversations_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_conversations',
        filter: conversationFilter,
      }, async (payload) => {
        console.log('Conversation changed:', payload);
        // تحديث قائمة المحادثات
        await this.fetchConversations();
      })
      .subscribe();

    // الاشتراك في الرسائل - فقط الرسائل الموجهة للمستخدم
    const messagesChannel = supabase
      .channel('chat_messages_realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
      }, async (payload) => {
        const newMessage = payload.new;
        console.log('New message received:', newMessage);
        
        // التحقق من أن الرسالة في محادثة المستخدم
        const isInUserConversation = this.state.conversations.some(
          conv => conv.id === newMessage.conversation_id
        );
        
        if (isInUserConversation) {
          await this.handleNewMessage(newMessage);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
      }, (payload) => {
        console.log('Message updated:', payload);
        this.handleMessageUpdate(payload.new);
      })
      .subscribe();

    // دمج الاشتراكات
    const combinedSubscription = {
      unsubscribe: () => {
        conversationsChannel.unsubscribe();
        messagesChannel.unsubscribe();
      }
    };

    this.setState({ realtimeSubscription: combinedSubscription });
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
    const user = authStore.getState().user;
    if (!user) return;

    // جلب معلومات المرسل إذا لم تكن موجودة
    if (!message.sender) {
      try {
        const { data: sender } = await supabase
          .from('users')
          .select('id, username, email, profile_picture')
          .eq('id', message.sender_id)
          .single();
        
        if (sender) {
          message.sender = sender;
        }
      } catch (error) {
        console.error('Error fetching sender:', error);
      }
    }

    // تحديث الرسائل إذا كانت المحادثة مفتوحة
    if (this.state.currentConversation && message.conversation_id === this.state.currentConversation.id) {
      // التحقق من عدم تكرار الرسالة
      const messageExists = this.state.messages.some(m => m.id === message.id);
      if (!messageExists) {
        this.setState({
          messages: [...this.state.messages, message],
        });

        // إذا كانت الرسالة من شخص آخر، وضع علامة مقروء
        if (message.sender_id !== user.id) {
          await this.markMessagesAsRead(this.state.currentConversation.id);
        }
      }
    } else {
      // إذا كانت المحادثة غير مفتوحة، تحديث عدد الرسائل غير المقروءة فقط
      // (لن نضيف الرسالة للقائمة لأن المحادثة غير مفتوحة)
    }

    // تحديث عدد الرسائل غير المقروءة
    await this.updateUnreadCount();
    
    // تحديث المحادثات (لتحديث last_message_at)
    await this.fetchConversations();

    // إرسال إشعار للمستخدم إذا كانت الرسالة من شخص آخر
    if (message.sender_id !== user.id) {
      this.notifyNewMessage(message);
    }
  }

  /**
   * إنشاء إشعار في قاعدة البيانات للمستلم
   */
  async createChatNotification(conversationId, message, sender) {
    try {
      const user = authStore.getState().user;
      if (!user) return;

      // جلب معلومات المحادثة لتحديد المستلم
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .select('user_id, admin_id')
        .eq('id', conversationId)
        .single();

      if (convError || !conversation) {
        console.error('Error fetching conversation:', convError);
        return;
      }

      // تحديد المستلم (الشخص الآخر في المحادثة)
      const recipientId = conversation.user_id === user.id 
        ? conversation.admin_id 
        : conversation.user_id;

      // إنشاء معاينة للرسالة
      const messagePreview = message.message.length > 100 
        ? message.message.substring(0, 100) + '...' 
        : message.message;

      // إنشاء إشعار
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: recipientId,
          type: 'request_submitted', // استخدام نوع موجود
          channel: 'in_app',
          payload: {
            conversation_id: conversationId,
            message_id: message.id,
            sender_id: sender.id,
            sender_username: sender.username || sender.email || 'مستخدم',
            message_preview: messagePreview,
            is_chat_message: true
          }
        }]);

      if (notifError) {
        console.error('Error creating chat notification:', notifError);
      } else {
        console.log('Chat notification created successfully');
      }
    } catch (error) {
      console.error('Error in createChatNotification:', error);
    }
  }

  /**
   * إرسال إشعار بوجود رسالة جديدة
   */
  notifyNewMessage(message) {
    // إرسال إشعار المتصفح إذا كان متاحاً
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('رسالة جديدة', {
        body: message.message.length > 50 
          ? message.message.substring(0, 50) + '...' 
          : message.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `chat-${message.conversation_id}`,
        requireInteraction: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // إرسال حدث مخصص للواجهة
    window.dispatchEvent(new CustomEvent('chat:new-message', {
      detail: { message }
    }));
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

      // جلب عدد الرسائل غير المقروءة لكل محادثة
      const conversationsWithUnread = await Promise.all(
        (data || []).map(async (conversation) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          return {
            ...conversation,
            unread_count: count || 0,
          };
        })
      );

      this.setState({
        conversations: conversationsWithUnread,
        loading: false,
      });

      // تحديث عدد الرسائل غير المقروءة الإجمالي
      await this.updateUnreadCount();

      return { success: true, data: conversationsWithUnread };

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

      // الاشتراك في رسائل هذه المحادثة بشكل خاص
      this.subscribeToConversationMessages(conversationId);

      return { success: true, data: data || [] };

    } catch (error) {
      console.error('Error fetching messages:', error);
      this.setState({ error: error.message, loading: false });
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * الاشتراك في رسائل محادثة محددة
   */
  subscribeToConversationMessages(conversationId) {
    const user = authStore.getState().user;
    if (!user) return;

    // إلغاء الاشتراك السابق لهذه المحادثة إن وُجد
    if (this.state.conversationSubscription) {
      this.state.conversationSubscription.unsubscribe();
    }

    // الاشتراك في رسائل هذه المحادثة فقط
    const subscription = supabase
      .channel(`chat_messages_${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, async (payload) => {
        const newMessage = payload.new;
        console.log('New message in conversation:', newMessage);
        
        // جلب معلومات المرسل
        if (!newMessage.sender) {
          try {
            const { data: sender } = await supabase
              .from('users')
              .select('id, username, email, profile_picture')
              .eq('id', newMessage.sender_id)
              .single();
            
            if (sender) {
              newMessage.sender = sender;
            }
          } catch (error) {
            console.error('Error fetching sender:', error);
          }
        }

        // إضافة الرسالة إذا لم تكن موجودة
        const messageExists = this.state.messages.some(m => m.id === newMessage.id);
        if (!messageExists) {
          this.setState({
            messages: [...this.state.messages, newMessage],
          });

          // إذا كانت الرسالة من شخص آخر، وضع علامة مقروء
          if (newMessage.sender_id !== user.id) {
            await this.markMessagesAsRead(conversationId);
          }
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        const updatedMessage = payload.new;
        this.setState({
          messages: this.state.messages.map(m => 
            m.id === updatedMessage.id ? updatedMessage : m
          ),
        });
      })
      .subscribe();

    this.setState({ conversationSubscription: subscription });
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
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey(id, username, email, profile_picture)
        `)
        .single();

      if (error) throw error;

      // إضافة معلومات المرسل
      if (data && !data.sender) {
        data.sender = {
          id: user.id,
          username: user.username,
          email: user.email,
          profile_picture: user.profile_picture
        };
      }

      // إضافة الرسالة إلى القائمة (Realtime سيتولى الباقي لكن نضيفها فوراً للUX)
      const messageExists = this.state.messages.some(m => m.id === data.id);
      if (!messageExists) {
        this.setState({
          messages: [...this.state.messages, data],
        });
      }

      // تحديث المحادثات (سيتم تحديثها تلقائياً عبر Realtime أيضاً)
      await this.fetchConversations();

      // إنشاء إشعار للمستلم
      await this.createChatNotification(convId, data, user);

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

      // تحديث الرسائل غير المقروءة فقط
      const { data: updatedMessages, error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
        .select();

      if (error) throw error;

      // تحديث حالة الرسائل في الـ store
      if (updatedMessages && updatedMessages.length > 0) {
        this.setState({
          messages: this.state.messages.map(msg => {
            const updated = updatedMessages.find(um => um.id === msg.id);
            return updated ? { ...msg, is_read: true } : msg;
          }),
        });
      }

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
    
    // إلغاء الاشتراك في محادثة محددة
    if (this.state.conversationSubscription) {
      this.state.conversationSubscription.unsubscribe();
    }
    
    // مسح الكاش المحلي
    this.clearCache();
    
    this.setState({
      conversations: [],
      currentConversation: null,
      messages: [],
      unreadCount: 0,
      loading: false,
      error: null,
      conversationSubscription: null,
    });
  }

  /**
   * مسح كاش المحادثات
   */
  clearCache() {
    try {
      const chatKeys = [
        'chat_conversations',
        'chat_messages',
        'chat_unread_count',
        'chat_last_fetch',
        'chat_cache',
        'chat_state'
      ];
      
      chatKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (err) {
          // تجاهل الأخطاء
        }
      });
      
      console.log('✅ تم مسح كاش المحادثات');
    } catch (error) {
      console.error('❌ خطأ في مسح كاش المحادثات:', error);
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
}

// إنشاء نسخة واحدة (Singleton)
const chatStore = new ChatStore();

export default chatStore;

