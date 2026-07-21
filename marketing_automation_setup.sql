-- ============================================================
-- TOKIYO STORE — Marketing Automation Database Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  target_segment      TEXT NOT NULL, -- e.g., 'all', 'vip', 'abandoned_cart', 'inactive'
  channel             TEXT NOT NULL, -- e.g., 'email', 'sms', 'whatsapp'
  subject_en          TEXT,
  subject_so          TEXT,
  body_en             TEXT NOT NULL,
  body_so             TEXT NOT NULL,
  discount_code       TEXT,
  status              TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'completed'
  sent_count          INTEGER DEFAULT 0,
  delivered_count     INTEGER DEFAULT 0,
  opened_count        INTEGER DEFAULT 0,
  clicked_count       INTEGER DEFAULT 0,
  revenue_generated   DECIMAL(10, 2) DEFAULT 0.00,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage campaigns" ON campaigns;
CREATE POLICY "Admins manage campaigns" ON campaigns
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- 2. Create Loyalty Programs Table (Phase 28 Post-purchase Points reward)
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  points        INTEGER NOT NULL DEFAULT 0,
  tier          TEXT NOT NULL DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'vip'
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Loyalty
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own loyalty info" ON loyalty_programs;
CREATE POLICY "Users view own loyalty info" ON loyalty_programs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage loyalty info" ON loyalty_programs;
CREATE POLICY "Admins manage loyalty info" ON loyalty_programs
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- 3. Configure default settings for marketing automations
INSERT INTO settings (key, value, description)
VALUES (
  'marketing_automations',
  '{
    "abandoned_cart": {
      "enabled": true,
      "delay_hours": 2,
      "discount_coupon": "CART10",
      "discount_value": 10,
      "message_en": "You left items in your cart! Here is a 10% coupon: CART10",
      "message_so": "Waxaad alaab kaga tagtay gaarigaaga! Halkan waa 10% kuuboon: CART10"
    },
    "welcome_series": {
      "enabled": true,
      "discount_coupon": "WELCOME10",
      "message_en": "Welcome to Tokiyo Store! Enjoy 10% off your first suit.",
      "message_so": "Ku soo dhawaada Tokiyo Store! Ku raaxayso 10% dhimis dalabkaaga koobaad."
    },
    "post_purchase": {
      "loyalty_points_per_dollar": 1,
      "recommend_related": true,
      "review_delay_days": 3
    }
  }'::jsonb,
  'Status and configurations of automated sales triggers.'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Function to automatically award loyalty points after successful order
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
  v_loyalty_ratio  INTEGER := 1;
  v_points_to_add  INTEGER;
BEGIN
  -- Check if order is delivered
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    v_points_to_add := FLOOR(NEW.total) * v_loyalty_ratio;
    
    INSERT INTO loyalty_programs (user_id, points, tier, updated_at)
    VALUES (NEW.user_id, v_points_to_add, 'bronze', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      points = loyalty_programs.points + EXCLUDED.points,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_award_loyalty ON orders;
CREATE TRIGGER trigger_award_loyalty
  AFTER UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION award_loyalty_points();
