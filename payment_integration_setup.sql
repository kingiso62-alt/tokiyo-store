-- ============================================================
-- TOKIYO STORE — Payment & Reconciliations Database Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Ensure payments table has all required columns
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE,
  ADD COLUMN IF NOT EXISTS refund_notes TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(payment_reference);

-- 2. Ensure webhook logs table exists
CREATE TABLE IF NOT EXISTS payment_webhook_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider      TEXT NOT NULL,
  event_type    TEXT,
  payload       JSONB NOT NULL,
  processed_at  TIMESTAMPTZ DEFAULT NOW(),
  status        TEXT NOT NULL DEFAULT 'logged', -- 'logged', 'processed', 'failed'
  error_message TEXT,
  payment_id    UUID REFERENCES payments(id) ON DELETE SET NULL,
  idempotency_key TEXT UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_webhook_payment ON payment_webhook_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_status ON payment_webhook_logs(status);

-- Enable RLS for webhook logs
ALTER TABLE payment_webhook_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read webhook logs" ON payment_webhook_logs;
CREATE POLICY "Admins read webhook logs" ON payment_webhook_logs
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- 3. Configure storage bucket for payment-proofs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Enable RLS and define policies for the payment-proofs storage bucket
-- Anyone (guests and clients) can upload payment proof images
DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;
CREATE POLICY "Anyone can upload payment proofs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

-- Anyone can read payment proofs (needed to display on profile / checkout / admin dashboard)
DROP POLICY IF EXISTS "Anyone can read payment proofs" ON storage.objects;
CREATE POLICY "Anyone can read payment proofs" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-proofs');

-- Admin can manage/delete objects
DROP POLICY IF EXISTS "Admin manage payment proofs" ON storage.objects;
CREATE POLICY "Admin manage payment proofs" ON storage.objects
  FOR ALL USING (
    bucket_id = 'payment-proofs' AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- 5. Seed default configurations for local, international, and offline payments
INSERT INTO settings (key, value, description)
VALUES (
  'payment_methods',
  '{
    "evc": {
      "enabled": true,
      "name": "EVC Plus",
      "type": "local",
      "instructions_en": "Transfer to EVC Plus number +252 61 1234567 and enter transaction reference below.",
      "instructions_so": "Fadlan u wareeji lambarka EVC Plus +252 61 1234567 kadibna geli tixraaca hoos.",
      "fee": 0,
      "min_amount": 1,
      "max_amount": 1000,
      "test_mode": true
    },
    "zaad": {
      "enabled": true,
      "name": "Zaad",
      "type": "local",
      "instructions_en": "Dial *252*611234567# to transfer via Zaad and enter transaction reference below.",
      "instructions_so": "Wac *252*611234567# si aad ugu wareejiso Zaad kadibna geli tixraaca hoos.",
      "fee": 0,
      "min_amount": 1,
      "max_amount": 1000,
      "test_mode": true
    },
    "sahal": {
      "enabled": true,
      "name": "Sahal",
      "type": "local",
      "instructions_en": "Dial *252*901234567# to transfer via Sahal and enter transaction reference below.",
      "instructions_so": "Wac *252*901234567# si aad ugu wareejiso Sahal kadibna geli tixraaca hoos.",
      "fee": 0,
      "min_amount": 1,
      "max_amount": 1000,
      "test_mode": true
    },
    "edahab": {
      "enabled": true,
      "name": "eDahab",
      "type": "local",
      "instructions_en": "Send payment to eDahab Merchant ID 76239 and enter transaction reference below.",
      "instructions_so": "Ku shub eDahab merchant ID 76239 kadibna geli tixraaca hoos.",
      "fee": 0,
      "min_amount": 1,
      "max_amount": 1000,
      "test_mode": true
    },
    "jeeb": {
      "enabled": true,
      "name": "Jeeb",
      "type": "local",
      "instructions_en": "Send payment to Jeeb handle @tokiyo and enter transaction reference below.",
      "instructions_so": "Ku shub Jeeb account @tokiyo kadibna geli tixraaca hoos.",
      "fee": 0,
      "min_amount": 1,
      "max_amount": 1000,
      "test_mode": true
    },
    "card": {
      "enabled": true,
      "name": "Visa / Mastercard / Stripe",
      "type": "international",
      "fee": 2.50,
      "min_amount": 5,
      "max_amount": 5000,
      "test_mode": true
    },
    "paypal": {
      "enabled": true,
      "name": "PayPal",
      "type": "international",
      "fee": 3.00,
      "min_amount": 5,
      "max_amount": 5000,
      "test_mode": true
    },
    "cod": {
      "enabled": true,
      "name": "Cash on Delivery",
      "type": "manual",
      "fee": 5.00,
      "min_amount": 1,
      "max_amount": 500,
      "instructions_en": "Pay with cash to our delivery agent upon receipt.",
      "instructions_so": "Lacagta ku bixi cadaan marka laguu keeno alaabta."
    },
    "bank": {
      "enabled": true,
      "name": "Bank Transfer",
      "type": "manual",
      "fee": 0,
      "min_amount": 20,
      "max_amount": 10000,
      "instructions_en": "Bank: Premier Bank Somalia\nAcc Name: Tokiyo Store Ltd\nAcc No: 1234567890123\nSwift: PRBKSOSQ",
      "instructions_so": "Bank: Premier Bank Somalia\nMagaca: Tokiyo Store Ltd\nKoontada: 1234567890123\nSwift: PRBKSOSQ"
    }
  }'::jsonb,
  'Configurable payment gateway details, instructions and currencies.'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
