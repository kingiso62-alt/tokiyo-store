-- ============================================================
-- TOKIYO STORE — Marketing Automation Schema Migration V2
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Alter profiles table to add marketing preferences and demographics
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS marketing_subscribed BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS favorite_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS location TEXT;

-- 2. Alter campaigns table to support scheduling and advanced metrics
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'bilingual',
  ADD COLUMN IF NOT EXISTS schedule_type TEXT DEFAULT 'immediate', -- 'immediate', 'scheduled'
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS orders_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unsubscribed_count INTEGER DEFAULT 0;

-- 3. Create marketing logs table for detailed analytics
CREATE TABLE IF NOT EXISTS marketing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  flow_name TEXT, -- e.g., 'abandoned_cart', 'welcome_series', 'post_purchase', etc.
  channel TEXT NOT NULL, -- 'email', 'sms', 'push', 'website', 'whatsapp'
  status TEXT NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'unsubscribed', 'failed'
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  revenue_generated DECIMAL(10, 2) DEFAULT 0.00
);

-- Enable RLS for marketing_logs
ALTER TABLE marketing_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage marketing_logs" ON marketing_logs;
CREATE POLICY "Admins manage marketing_logs" ON marketing_logs
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- 4. Create abandoned cart reminders tracking table
CREATE TABLE IF NOT EXISTS abandoned_cart_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  step INTEGER NOT NULL DEFAULT 1, -- 1 = First, 2 = Second
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'converted', 'unsubscribed'
  discount_code TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cart_id, step)
);

-- Enable RLS for abandoned_cart_reminders
ALTER TABLE abandoned_cart_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage abandoned_cart_reminders" ON abandoned_cart_reminders;
CREATE POLICY "Admins manage abandoned_cart_reminders" ON abandoned_cart_reminders
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );
