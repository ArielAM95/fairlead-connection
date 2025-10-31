-- =============================================================================
-- INVOICES TABLE MIGRATION - RUN THIS ONCE IN SUPABASE SQL EDITOR
-- =============================================================================
--
-- HOW TO RUN:
-- 1. Go to: https://supabase.com/dashboard/project/erlfsougrkzbgonumhoa/sql/new
-- 2. Copy this entire file content
-- 3. Paste into SQL Editor
-- 4. Click "Run" button
-- 5. Delete this file after successful run
--
-- =============================================================================

-- Create invoices table for storing all Tranzila invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  transaction_log_id UUID REFERENCES transaction_logs(id),
  commission_id UUID REFERENCES commissions(id),

  -- Invoice identification
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('registration', 'commission', 'subscription')),

  -- Financial details
  amount NUMERIC(10,2) NOT NULL, -- Before VAT
  vat_amount NUMERIC(10,2) NOT NULL, -- 18% VAT
  total_amount NUMERIC(10,2) NOT NULL, -- What customer paid
  description TEXT NOT NULL,

  -- Tranzila response data
  tranzila_invoice_id TEXT,
  tranzila_document_number TEXT,
  tranzila_response JSONB,
  pdf_url TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'failed', 'sent')),
  error_message TEXT,

  -- Webhook tracking
  webhook_sent_at TIMESTAMPTZ,
  webhook_response JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_invoices_professional_id ON invoices(professional_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_type ON invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoices_updated_at();

-- Add RLS policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role has full access to invoices"
  ON invoices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Professionals can view their own invoices (for future app integration)
CREATE POLICY "Professionals can view their own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (professional_id = auth.uid());

-- Verification query - Run this to confirm table was created
SELECT
  tablename,
  schemaname
FROM pg_tables
WHERE tablename = 'invoices';
