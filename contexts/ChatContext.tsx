'use client';

/**
 * Chat Context
 * إدارة حالة الدردشة والمحادثات
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    email: string;
  };
}

interface Conversation {
  id: string;
  user_id: string;
  admin_id?: string;
  last_message_at?: string;
  unread_count: number;
  other_user: {
    id: string;
    username: string;
    email: string;
  };
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

interface ChatContextType extends ChatState {
  openChat: (userId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
    unreadCount: 0,
  });

  const { user } = useAuth();
  const supabase = createClient();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get conversations where user is user_id or admin_id
      const { data: convs, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          user:users!chat_conversations_user_id_fkey(id, username, email),
          admin:users!chat_conversations_admin_id_fkey(id, username, email)
        `)
        .or(`user_id.eq.${user.id},admin_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      // If table doesn't exist, return empty array
      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          console.warn('Chat tables not found. Chat feature requires database tables to be created.');
          setState(prev => ({
            ...prev,
            conversations: [],
            unreadCount: 0,
            loading: false,
            error: null,
          }));
          return;
        }
        throw error;
      }

      // Calculate unread count for each conversation
      const conversationsWithUnread = await Promise.all(
        (convs || []).map(async (conv: any) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          const unreadCount = count || 0;
          const otherUser = conv.user_id === user.id 
            ? conv.admin 
            : conv.user;

          return {
            id: conv.id,
            user_id: conv.user_id,
            admin_id: conv.admin_id,
            last_message_at: conv.last_message_at,
            unread_count: unreadCount,
            other_user: otherUser || { id: '', username: 'مستخدم', email: '' },
          };
        })
      );

      const totalUnread = conversationsWithUnread.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);

      setState(prev => ({
        ...prev,
        conversations: conversationsWithUnread,
        unreadCount: totalUnread,
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setState(prev => ({
        ...prev,
        error: err.message || 'فشل تحميل المحادثات',
        loading: false,
      }));
    }
  }, [user, supabase]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user?.id) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data: msgs, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey(id, username, email)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      // If table doesn't exist, return empty array
      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          console.warn('Messages table not found. Chat feature requires database tables to be created.');
          setState(prev => ({
            ...prev,
            messages: [],
            loading: false,
            error: null,
          }));
          return;
        }
        throw error;
      }

      setState(prev => ({
        ...prev,
        messages: (msgs || []) as Message[],
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setState(prev => ({
        ...prev,
        error: err.message || 'فشل تحميل الرسائل',
        loading: false,
      }));
    }
  }, [user, supabase]);

  // Open or create conversation with a user (for admin) or admin (for user)
  const openChat = useCallback(async (userId: string) => {
    if (!user?.id || !userId || userId === user.id) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Determine if current user is admin or regular user
      const isAdmin = user.role === 'admin' || user.role === 'super_admin';
      
      // Try to find existing conversation
      let existingConv: any = null;
      
      if (isAdmin) {
        // Admin chatting with a user
        const { data, error } = await supabase
          .from('chat_conversations')
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email),
            admin:users!chat_conversations_admin_id_fkey(id, username, email)
          `)
          .eq('user_id', userId)
          .eq('admin_id', user.id)
          .single();
        
        if (!error && data) {
          existingConv = data;
        }
      } else {
        // User chatting with admin (get any admin conversation or create with first admin)
        const { data, error } = await supabase
          .from('chat_conversations')
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email),
            admin:users!chat_conversations_admin_id_fkey(id, username, email)
          `)
          .eq('user_id', user.id)
          .eq('admin_id', userId)
          .single();
        
        if (!error && data) {
          existingConv = data;
        }
      }

      let conversation: any;

      if (existingConv) {
        conversation = existingConv;
      } else {
        // Create new conversation
        const conversationData: any = isAdmin
          ? { user_id: userId, admin_id: user.id, last_message_at: new Date().toISOString() }
          : { user_id: user.id, admin_id: userId, last_message_at: new Date().toISOString() };

        const { data: newConv, error: createError } = await supabase
          .from('chat_conversations')
          .insert(conversationData)
          .select(`
            *,
            user:users!chat_conversations_user_id_fkey(id, username, email),
            admin:users!chat_conversations_admin_id_fkey(id, username, email)
          `)
          .single();

        if (createError) throw createError;
        conversation = newConv;
      }

      const otherUser = conversation.user_id === user.id 
        ? conversation.admin 
        : conversation.user;

      // Calculate unread count
      const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversation.id)
        .eq('is_read', false)
        .neq('sender_id', user.id);

      const formattedConv: Conversation = {
        id: conversation.id,
        user_id: conversation.user_id,
        admin_id: conversation.admin_id,
        last_message_at: conversation.last_message_at,
        unread_count: count || 0,
        other_user: otherUser || { id: userId, username: 'مستخدم', email: '' },
      };

      await fetchMessages(conversation.id);

      setState(prev => ({
        ...prev,
        currentConversation: formattedConv,
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error opening chat:', err);
      setState(prev => ({
        ...prev,
        error: err.message || 'فشل فتح الدردشة',
        loading: false,
      }));
    }
  }, [user, supabase, fetchMessages]);

  // Send message
  const sendMessage = useCallback(async (message: string) => {
    if (!user?.id || !message.trim() || !state.currentConversation) return;

    try {
      const conversationId = state.currentConversation.id;

      // Insert message
      const { data: newMessage, error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          message: message.trim(),
          is_read: false,
        })
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey(id, username, email)
        `)
        .single();

      if (msgError) throw msgError;

      // Update conversation last_message_at
      await supabase
        .from('chat_conversations')
        .update({
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      // Add message to state
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage as Message],
      }));

      // Refresh conversations
      await fetchConversations();
    } catch (err: any) {
      console.error('Error sending message:', err);
      setState(prev => ({
        ...prev,
        error: err.message || 'فشل إرسال الرسالة',
      }));
    }
  }, [user, supabase, state.currentConversation, fetchConversations]);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      await fetchConversations();
    } catch (err: any) {
      console.error('Error marking as read:', err);
    }
  }, [user, supabase, fetchConversations]);

  // Close chat
  const closeChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentConversation: null,
      messages: [],
    }));
  }, []);

  // Load conversations on mount
  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        openChat,
        sendMessage,
        fetchConversations,
        fetchMessages,
        markAsRead,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
