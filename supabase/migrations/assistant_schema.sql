-- AISTEAM Assistant System Database Schema
-- This migration creates tables for conversations, messages, tasks, and workflows

-- Table: assistant_conversations
-- Purpose: Stores one assistant session for the user
CREATE TABLE IF NOT EXISTS assistant_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  started_at timestamptz DEFAULT now(),
  closed_at timestamptz NULL,
  active_flag boolean DEFAULT true,
  metadata jsonb NULL,
  current_agent text DEFAULT 'chief',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: assistant_messages
-- Purpose: Stores every message inside a conversation
CREATE TABLE IF NOT EXISTS assistant_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
  author text NOT NULL, -- 'user' or 'agent'
  agent_id text NULL, -- 'chief', 'deliveryLead', 'clientSuccess', 'creative', 'growth', 'tech', 'webEngineer'
  kind text DEFAULT 'text', -- 'text', 'status', 'form'
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table: assistant_tasks
-- Purpose: Stores structured tasks created from conversations or the task builder
CREATE TABLE IF NOT EXISTS assistant_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NULL REFERENCES assistant_conversations(id) ON DELETE SET NULL,
  status text DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  action text NOT NULL,
  target text NOT NULL,
  intent text NOT NULL,
  priority text NOT NULL, -- 'low', 'medium', 'high', 'urgent'
  notes text NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: assistant_workflows
-- Purpose: Stores multi-step workflows triggered by a conversation
CREATE TABLE IF NOT EXISTS assistant_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NULL REFERENCES assistant_conversations(id) ON DELETE SET NULL,
  name text NOT NULL,
  status text DEFAULT 'active', -- 'active', 'paused', 'completed', 'cancelled'
  definition jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assistant_conversations_tenant_user ON assistant_conversations(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_assistant_conversations_active ON assistant_conversations(tenant_id, user_id, active_flag) WHERE active_flag = true;
CREATE INDEX IF NOT EXISTS idx_assistant_messages_conversation ON assistant_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_assistant_tasks_conversation ON assistant_tasks(conversation_id);
CREATE INDEX IF NOT EXISTS idx_assistant_workflows_conversation ON assistant_workflows(conversation_id);

-- Row Level Security (RLS) policies
-- Note: These assume you have a proper auth system. Adjust based on your auth setup.

-- Enable RLS
ALTER TABLE assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_workflows ENABLE ROW LEVEL SECURITY;

-- RLS Policies (placeholder - adjust based on your auth system)
-- For now, we'll use service role key which bypasses RLS
-- In production, you should implement proper policies based on your auth setup

-- Example policy structure (commented out - implement based on your auth):
-- CREATE POLICY "Users can view their own conversations"
--   ON assistant_conversations FOR SELECT
--   USING (tenant_id = current_setting('app.tenant_id')::uuid AND user_id = current_setting('app.user_id')::uuid);

-- CREATE POLICY "Users can insert their own conversations"
--   ON assistant_conversations FOR INSERT
--   WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid AND user_id = current_setting('app.user_id')::uuid);

-- Similar policies for other tables...

