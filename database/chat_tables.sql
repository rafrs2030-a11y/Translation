-- ============================================
-- CHAT TABLES
-- جداول الدردشة
-- ============================================

-- ============================================
-- 9. CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_conversation UNIQUE (participant1_id, participant2_id),
  CONSTRAINT different_participants CHECK (participant1_id != participant2_id)
);

-- Indexes for conversations table
CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ============================================
-- 10. MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for messages table
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================
-- TRIGGERS FOR CHAT
-- ============================================

-- Update conversation's last_message and last_message_at when a message is inserted
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message = NEW.message,
    last_message_at = NEW.created_at,
    updated_at = NOW(),
    unread_count = CASE 
      WHEN NEW.receiver_id = conversations.participant1_id OR NEW.receiver_id = conversations.participant2_id
      THEN unread_count + 1
      ELSE unread_count
    END
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message();

-- ============================================
-- ROW LEVEL SECURITY (RLS) FOR CHAT TABLES
-- ============================================

-- Enable RLS on conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see conversations where they are participants
CREATE POLICY "Users can view their own conversations"
ON conversations
FOR SELECT
USING (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);

-- Policy: Users can insert conversations where they are participant1
CREATE POLICY "Users can create conversations as participant1"
ON conversations
FOR INSERT
WITH CHECK (auth.uid() = participant1_id);

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages from conversations they are part of
CREATE POLICY "Users can view messages from their conversations"
ON messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  )
);

-- Policy: Users can send messages where they are the sender
CREATE POLICY "Users can send messages"
ON messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update their received messages (to mark as read)
CREATE POLICY "Users can update their received messages"
ON messages
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

