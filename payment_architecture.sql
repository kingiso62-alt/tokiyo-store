-- ============================================================
-- TOKIYO STORE — Secure Payment Architecture
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Extend the payments table with columns for verification & proof
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE,
  ADD COLUMN IF NOT EXISTS refund_notes TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id);

-- Create index for faster lookups of transaction references
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(payment_reference);

-- 2. Create webhook logs table for tracking callbacks
CREATE TABLE IF NOT EXISTS payment_webhook_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider      TEXT NOT NULL,
  event_type    TEXT,
  payload       JSONB NOT NULL,
  processed_at  TIMESTAMPTZ DEFAULT NOW(),
  status        TEXT NOT NULL DEFAULT 'logged', -- 'logged', 'processed', 'failed'
  error_message TEXT,
  payment_id    UUID REFERENCES payments(id) ON DELETE SET NULL,
  idempotency_key TEXT UNIQUE -- to prevent duplicate webhooks / replay attacks
);

CREATE INDEX IF NOT EXISTS idx_webhook_payment ON payment_webhook_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_status ON payment_webhook_logs(status);

-- Enable RLS for webhook logs (Admin only)
ALTER TABLE payment_webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read webhook logs" ON payment_webhook_logs
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- 3. Configure default payment methods in settings table
INSERT INTO settings (key, value, description)
VALUES (
  'payment_methods',
  '{
    "evc": {"enabled": true, "name": "EVC Plus", "type": "local", "instructions": "Fadlan u wareeji lambarka +252 61 1234567 oo geli tixraaca hoos."},
    "zaad": {"enabled": true, "name": "Zaad", "type": "local", "instructions": "U wareeji lambarka *252*611234567# oo geli tixraaca hoos."},
    "sahal": {"enabled": true, "name": "Sahal", "type": "local", "instructions": "U wareeji lambarka *252*901234567# oo geli tixraaca hoos."},
    "edahab": {"enabled": true, "name": "eDahab", "type": "local", "instructions": "Ku shub eDahab merchant ID 76239 oo geli tixraaca hoos."},
    "jeeb": {"enabled": true, "name": "Jeeb", "type": "local", "instructions": "Ku shub Jeeb account @tokiyo oo geli tixraaca hoos."},
    "card": {"enabled": true, "name": "Visa / Mastercard / Stripe", "type": "international"},
    "paypal": {"enabled": true, "name": "PayPal", "type": "international"},
    "cod": {"enabled": true, "name": "Cash on Delivery", "type": "manual", "fee": 5.00},
    "bank": {"enabled": true, "name": "Bank Transfer", "type": "manual", "instructions": "Bank: Premier Bank Somalia\nAccount: Tokiyo Store Ltd\nNo: 1234567890123\nSwift: PRBKSOSQ"}
  }'::jsonb,
  'Configurable state of local, international, and manual payment methods.'
)
ON CONFLICT (key) DO NOTHING;

-- 4. Server-Side Payment Verification (RPC to avoid front-end trust)
-- Handles manual approvals or incoming webhook processors securely
CREATE OR REPLACE FUNCTION verify_payment(
  p_payment_id UUID,
  p_status     payment_status,
  p_reference  TEXT DEFAULT NULL,
  p_notes      TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_role  TEXT;
  v_payment    RECORD;
  v_order      RECORD;
BEGIN
  -- Verify user has permission (admin or manager)
  SELECT role INTO v_user_role FROM profiles WHERE id = auth.uid();
  IF v_user_role NOT IN ('admin', 'manager') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized / Ma lihid ogolaansho');
  END IF;

  -- Get payment record
  SELECT * INTO v_payment FROM payments WHERE id = p_payment_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;

  -- Get order details
  SELECT * INTO v_order FROM orders WHERE id = v_payment.order_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  -- Update payment status
  UPDATE payments SET
    status = p_status,
    payment_reference = COALESCE(p_reference, payment_reference),
    refund_notes = COALESCE(p_notes, refund_notes),
    verified_at = NOW(),
    verified_by = auth.uid(),
    updated_at = NOW()
  WHERE id = p_payment_id;

  -- Sync order status accordingly
  IF p_status = 'paid' THEN
    -- Move order to confirmed / processing
    UPDATE orders SET
      status = 'confirmed',
      updated_at = NOW()
    WHERE id = v_payment.order_id;

    -- Add to status history
    INSERT INTO order_status_history (order_id, status, note, changed_by)
    VALUES (v_payment.order_id, 'confirmed', 'Payment verified manually by admin', auth.uid());

    -- Send notification
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
      v_order.user_id, 'order',
      'Payment Received — ' || v_order.order_number,
      'Lacag bixintaada waa la xaqiijiyay. Dalabkaaga hadda waa la diyaarinayaa!'
    );

  ELSIF p_status = 'failed' THEN
    UPDATE orders SET
      status = 'awaiting_payment',
      updated_at = NOW()
    WHERE id = v_payment.order_id;

    INSERT INTO order_status_history (order_id, status, note, changed_by)
    VALUES (v_payment.order_id, 'awaiting_payment', 'Payment verification failed: ' || COALESCE(p_notes, ''), auth.uid());

  ELSIF p_status = 'refunded' THEN
    -- Cancel and refund
    UPDATE orders SET
      status = 'refunded',
      updated_at = NOW()
    WHERE id = v_payment.order_id;

    INSERT INTO order_status_history (order_id, status, note, changed_by)
    VALUES (v_payment.order_id, 'refunded', 'Order refunded by admin: ' || COALESCE(p_notes, ''), auth.uid());

    -- Restore inventory
    UPDATE inventory i
    SET stock_quantity = i.stock_quantity + oi.quantity,
        updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = v_payment.order_id AND oi.inventory_id = i.id;
  END IF;

  RETURN jsonb_build_object('success', true, 'payment_status', p_status, 'order_status', (SELECT status FROM orders WHERE id = v_payment.order_id));
END;
$$;

-- 5. Webhook receiver function with idempotency protection
CREATE OR REPLACE FUNCTION process_payment_webhook(
  p_provider        TEXT,
  p_event_type      TEXT,
  p_payload         JSONB,
  p_webhook_key     TEXT, -- unique webhook identifier
  p_payment_id      UUID,
  p_amount          DECIMAL(10,2),
  p_status          payment_status,
  p_transaction_id  TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_log UUID;
  v_payment      RECORD;
  v_order        RECORD;
BEGIN
  -- Idempotency check: prevent duplicate webhooks & replay attacks
  SELECT id INTO v_existing_log FROM payment_webhook_logs WHERE idempotency_key = p_webhook_key;
  IF FOUND THEN
    RETURN jsonb_build_object('success', true, 'duplicate', true, 'log_id', v_existing_log);
  END IF;

  -- Retrieve payment
  SELECT * INTO v_payment FROM payments WHERE id = p_payment_id;
  IF NOT FOUND THEN
    INSERT INTO payment_webhook_logs (provider, event_type, payload, status, error_message, idempotency_key)
    VALUES (p_provider, p_event_type, p_payload, 'failed', 'Payment record not found', p_webhook_key);
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;

  -- Validate amount & currency
  IF v_payment.amount != p_amount THEN
    INSERT INTO payment_webhook_logs (provider, event_type, payload, status, error_message, payment_id, idempotency_key)
    VALUES (p_provider, p_event_type, p_payload, 'failed', 'Amount mismatch', p_payment_id, p_webhook_key);
    RETURN jsonb_build_object('success', false, 'error', 'Amount mismatch');
  END IF;

  -- Log the webhook as processed
  INSERT INTO payment_webhook_logs (provider, event_type, payload, status, payment_id, idempotency_key)
  VALUES (p_provider, p_event_type, p_payload, 'processed', p_payment_id, p_webhook_key)
  RETURNING id INTO v_existing_log;

  -- Update payment status
  UPDATE payments SET
    status = p_status,
    provider_transaction_id = p_transaction_id,
    updated_at = NOW()
  WHERE id = p_payment_id;

  -- Sync order status
  SELECT * INTO v_order FROM orders WHERE id = v_payment.order_id;
  IF p_status = 'paid' THEN
    UPDATE orders SET status = 'confirmed', updated_at = NOW() WHERE id = v_payment.order_id;
    INSERT INTO order_status_history (order_id, status, note)
    VALUES (v_payment.order_id, 'confirmed', 'Payment received via ' || p_provider || ' (Webhook)');
  ELSIF p_status = 'failed' THEN
    UPDATE orders SET status = 'awaiting_payment', updated_at = NOW() WHERE id = v_payment.order_id;
    INSERT INTO order_status_history (order_id, status, note)
    VALUES (v_payment.order_id, 'awaiting_payment', 'Payment failed via ' || p_provider || ' (Webhook)');
  END IF;

  RETURN jsonb_build_object('success', true, 'log_id', v_existing_log);
END;
$$;
