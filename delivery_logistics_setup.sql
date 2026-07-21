-- ============================================================
-- TOKIYO STORE — Delivery & Logistics Database Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add 'driver' role to user_role ENUM
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'driver';

-- 2. Create Driver Profiles Table
CREATE TABLE IF NOT EXISTS driver_profiles (
  id                    UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type          TEXT NOT NULL,
  plate_number          TEXT NOT NULL,
  is_active             BOOLEAN DEFAULT TRUE,
  assigned_zones        TEXT[] DEFAULT '{}'::TEXT[],
  completed_deliveries  INTEGER DEFAULT 0,
  failed_deliveries     INTEGER DEFAULT 0,
  cash_collected        DECIMAL(10, 2) DEFAULT 0.00,
  cash_outstanding      DECIMAL(10, 2) DEFAULT 0.00,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Driver Profiles
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read driver profiles" ON driver_profiles;
CREATE POLICY "Admins read driver profiles" ON driver_profiles
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "Drivers manage own profile" ON driver_profiles;
CREATE POLICY "Drivers manage own profile" ON driver_profiles
  FOR ALL USING (id = auth.uid());

-- 3. Create Deliveries Table
CREATE TYPE delivery_status AS ENUM (
  'unassigned',
  'assigned',
  'accepted',
  'picked_up',
  'out_for_delivery',
  'customer_unreachable',
  'delivery_failed',
  'rescheduled',
  'delivered',
  'returned_to_store'
);

CREATE TABLE IF NOT EXISTS deliveries (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id            UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  driver_id           UUID REFERENCES driver_profiles(id) ON DELETE SET NULL,
  status              delivery_status NOT NULL DEFAULT 'unassigned',
  delivery_fee        DECIMAL(10, 2) DEFAULT 0.00,
  cash_to_collect     DECIMAL(10, 2) DEFAULT 0.00,
  cash_collected      DECIMAL(10, 2) DEFAULT 0.00,
  proof_image_url     TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);

-- Enable RLS for Deliveries
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage all deliveries" ON deliveries;
CREATE POLICY "Admins manage all deliveries" ON deliveries
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "Drivers see own deliveries" ON deliveries;
CREATE POLICY "Drivers see own deliveries" ON deliveries
  FOR SELECT USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "Drivers update own assigned deliveries" ON deliveries;
CREATE POLICY "Drivers update own assigned deliveries" ON deliveries
  FOR UPDATE USING (driver_id = auth.uid());

-- 4. Create Delivery Status History Table
CREATE TABLE IF NOT EXISTS delivery_status_history (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id   UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  status        delivery_status NOT NULL,
  note          TEXT,
  changed_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_history ON delivery_status_history(delivery_id);

-- Enable RLS for Delivery History
ALTER TABLE delivery_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins see all delivery history" ON delivery_status_history;
CREATE POLICY "Admins see all delivery history" ON delivery_status_history
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "Drivers see own delivery history" ON delivery_status_history;
CREATE POLICY "Drivers see own delivery history" ON delivery_status_history
  FOR SELECT USING (
    delivery_id IN (SELECT id FROM deliveries WHERE driver_id = auth.uid())
  );

DROP POLICY IF EXISTS "Drivers insert history logs" ON delivery_status_history;
CREATE POLICY "Drivers insert history logs" ON delivery_status_history
  FOR INSERT WITH CHECK (
    changed_by = auth.uid() AND
    delivery_id IN (SELECT id FROM deliveries WHERE driver_id = auth.uid())
  );

-- 5. Configure storage bucket for delivery-proofs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'delivery-proofs',
  'delivery-proofs',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Anyone can upload delivery proofs" ON storage.objects;
CREATE POLICY "Anyone can upload delivery proofs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'delivery-proofs');

DROP POLICY IF EXISTS "Anyone can read delivery proofs" ON storage.objects;
CREATE POLICY "Anyone can read delivery proofs" ON storage.objects
  FOR SELECT USING (bucket_id = 'delivery-proofs');

-- 6. Trigger to automatically log delivery updates and notify customers
CREATE OR REPLACE FUNCTION handle_delivery_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_order_user_id   UUID;
  v_order_number    TEXT;
  v_notification_msg TEXT;
  v_notification_title TEXT;
BEGIN
  -- Get associated order details
  SELECT user_id, order_number INTO v_order_user_id, v_order_number
  FROM orders WHERE id = NEW.order_id;

  -- Build customer notifications depending on delivery status changes
  IF NEW.status = 'assigned' THEN
    v_notification_title := 'Darawal ayaa Loo Qoondeeyay / Driver Assigned';
    v_notification_msg := 'Darawal ayaa loo xilsaaray inuu kuu keeno dalabkaaga ' || v_order_number || '. Aad ayaad u mahadsan tahay!';
  ELSIF NEW.status = 'picked_up' THEN
    v_notification_title := 'Dalabkaagii waa la soo qaatay / Package Picked Up';
    v_notification_msg := 'Darawalku wuxuu dukaanka ka soo qaatay dalabkaaga ' || v_order_number || '.';
  ELSIF NEW.status = 'out_for_delivery' THEN
    v_notification_title := 'Dalabkaagii wuu soo baxay / Out for Delivery';
    v_notification_msg := 'Darawalka wuxuu ku soo jiraa wadada si uu kuu soo gaadhsiiyo dalabkaaga ' || v_order_number || '.';
  ELSIF NEW.status = 'customer_unreachable' THEN
    v_notification_title := 'Darawalku waa ku waayay / Customer Unreachable';
    v_notification_msg := 'Darawalka wuu ku soo wacay laakiin wuu kugu waayay talefoonka. Fadlan la xiriir dukaanka.';
  ELSIF NEW.status = 'rescheduled' THEN
    v_notification_title := 'Dalabka waa la dib-dhigay / Delivery Rescheduled';
    v_notification_msg := 'Wadada gaadhsiinta dalabkaaga ' || v_order_number || ' waa la dib-dhigay wakhti kale.';
  ELSIF NEW.status = 'delivered' THEN
    v_notification_title := 'Dalabkaaga waa la keenay / Delivery Completed';
    v_notification_msg := 'Dalabkaaga ' || v_order_number || ' si guul leh ayaa laguugu soo gaadhsiiyay. Waad ku mahadsan tahay inaad TOKIYO dooratay!';
  END IF;

  -- Send notification if title and message exist
  IF v_notification_title IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (v_order_user_id, 'order', v_notification_title, v_notification_msg);
  END IF;

  -- Auto-update order status depending on delivery status
  IF NEW.status = 'out_for_delivery' THEN
    UPDATE orders SET status = 'out_for_delivery', updated_at = NOW() WHERE id = NEW.order_id;
  ELSIF NEW.status = 'delivered' THEN
    UPDATE orders SET status = 'delivered', updated_at = NOW() WHERE id = NEW.order_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_delivery_status_change ON deliveries;
CREATE TRIGGER trigger_delivery_status_change
  AFTER UPDATE OF status OR INSERT ON deliveries
  FOR EACH ROW EXECUTE FUNCTION handle_delivery_status_change();
