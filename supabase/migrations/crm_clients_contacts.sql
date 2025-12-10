-- CRM Module: Clients and Contacts Tables
-- This migration creates the clients and contacts tables for the CRM module

-- Table: clients
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  website text,
  industry text,
  contact_person jsonb,
  custom_data jsonb,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT clients_slug_tenant_unique UNIQUE (slug, tenant_id)
);

-- Table: contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  role text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Update projects table to add client_id and primary_contact_id if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'client_id'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN client_id uuid REFERENCES public.clients(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'primary_contact_id'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN primary_contact_id uuid REFERENCES public.contacts(id);
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_slug ON public.clients(slug);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant ON public.contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contacts_client ON public.contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_contacts_primary ON public.contacts(client_id, is_primary) WHERE is_primary = true;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (using service role bypasses RLS, but policies are here for future auth)
-- Note: Adjust these based on your actual auth system
CREATE POLICY IF NOT EXISTS "Users can view clients in their tenant"
  ON public.clients FOR SELECT
  USING (true); -- Service role bypasses, adjust for production

CREATE POLICY IF NOT EXISTS "Users can insert clients in their tenant"
  ON public.clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Users can update clients in their tenant"
  ON public.clients FOR UPDATE
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can view contacts in their tenant"
  ON public.contacts FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert contacts in their tenant"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Users can update contacts in their tenant"
  ON public.contacts FOR UPDATE
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can delete contacts in their tenant"
  ON public.contacts FOR DELETE
  USING (true);

