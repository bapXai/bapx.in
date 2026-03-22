-- Migration: Create storage usage tracking table
CREATE TABLE IF NOT EXISTS storage_usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES basejump.accounts(id) ON DELETE CASCADE,
    total_size_bytes BIGINT NOT NULL,
    trailbase_size_bytes BIGINT NOT NULL,
    sandbox_size_bytes BIGINT NOT NULL,
    billed_size_gb NUMERIC(10,2) NOT NULL,
    cost_credits NUMERIC(10,2) NOT NULL,
    measured_at TIMESTAMPTZ DEFAULT NOW(),
    billing_period_start TIMESTAMPTZ,
    billing_period_end TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' -- pending, billed, failed
);

CREATE INDEX IF NOT EXISTS idx_storage_usage_account_id ON storage_usage_records(account_id);
CREATE INDEX IF NOT EXISTS idx_storage_usage_measured_at ON storage_usage_records(measured_at);

-- Add storage settings to accounts if needed
ALTER TABLE basejump.accounts ADD COLUMN IF NOT EXISTS storage_billing_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE basejump.accounts ADD COLUMN IF NOT EXISTS last_storage_billing_at TIMESTAMPTZ;
