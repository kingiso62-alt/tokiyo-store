-- ============================================================
-- TOKIYO STORE — Complete Order Workflow SQL
-- Run this in Supabase SQL Editor AFTER database.sql
-- ============================================================

-- -------------------------------------------------------
-- 1. EXTEND ORDER STATUS ENUM (add full lifecycle statuses)
-- -------------------------------------------------------
-- First drop the old enum safely and recreate with full statuses
ALTER TABLE orders ALTER COLUMN status TYPE TEXT;
DROP TYPE IF EXISTS order_status CASCADE;

CREATE TYPE order_status AS ENUM (
  'pending',
  'awaiting_payment',
  'payment_under_review',
  'paid',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refunded'
);

-- Convert the column back to the enum type
ALTER TABLE orders 
  ALTER COLUMN status TYPE order_status 
  USING status::order_status;

-- Set correct default
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- -------------------------------------------------------
-- 2. ADD MISSING COLUMNS TO ORDERS TABLE
-- -------------------------------------------------------
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_total DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- -------------------------------------------------------
-- 3. ORDER STATUS HISTORY TABLE (for real-time tracking)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_status_history (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status        order_status NOT NULL,
  note          TEXT,
  changed_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_osh_order_id ON order_status_history(order_id);

-- RLS for order_status_history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own order history" ON order_status_history
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );
CREATE POLICY "Admin insert history" ON order_status_history
  FOR INSERT WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- -------------------------------------------------------
-- 4. SECURE create_order RPC FUNCTION
-- This runs server-side — NEVER trusts frontend prices
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION create_order(
  p_user_id         UUID,
  p_idempotency_key UUID,
  p_items           JSONB,       -- [{inventory_id, quantity}]
  p_shipping_addr   JSONB,
  p_billing_addr    JSONB,
  p_coupon_code     TEXT DEFAULT NULL,
  p_payment_provider TEXT DEFAULT 'card',
  p_currency        TEXT DEFAULT 'USD',
  p_notes           TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id        UUID;
  v_order_number    TEXT;
  v_item            JSONB;
  v_inventory       RECORD;
  v_product         RECORD;
  v_subtotal        DECIMAL(10,2) := 0;
  v_discount_total  DECIMAL(10,2) := 0;
  v_shipping_fee    DECIMAL(10,2) := 0;
  v_tax_amount      DECIMAL(10,2) := 0;
  v_grand_total     DECIMAL(10,2) := 0;
  v_coupon_id       UUID;
  v_coupon          RECORD;
  v_item_total      DECIMAL(10,2);
  v_qty             INTEGER;
  v_inv_id          UUID;
  v_existing_order  UUID;
BEGIN

  -- 1. IDEMPOTENCY CHECK: prevent duplicate orders
  SELECT id INTO v_existing_order FROM orders WHERE idempotency_key = p_idempotency_key;
  IF FOUND THEN
    -- Order already exists — return it safely
    RETURN jsonb_build_object(
      'success', true,
      'duplicate', true,
      'order_id', v_existing_order,
      'order_number', (SELECT order_number FROM orders WHERE id = v_existing_order)
    );
  END IF;

  -- 2. VALIDATE items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cart is empty / Gaari madhan yahay');
  END IF;

  -- 3. INVENTORY CHECK + PRICE CALCULATION (server-side, never trust frontend)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_inv_id := (v_item->>'inventory_id')::UUID;
    v_qty := (v_item->>'quantity')::INTEGER;

    IF v_qty IS NULL OR v_qty < 1 THEN
      RETURN jsonb_build_object('success', false, 'error', 'Invalid quantity / Tirada waa khalad');
    END IF;

    -- Get inventory and product price from DB
    SELECT i.*, p.price, p.title
    INTO v_inventory
    FROM inventory i
    JOIN products p ON p.id = i.product_id
    WHERE i.id = v_inv_id;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'Product not found: ' || v_inv_id::TEXT);
    END IF;

    IF v_inventory.stock_quantity < v_qty THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Insufficient stock for: ' || v_inventory.title || ' (' || v_inventory.size || ' / ' || v_inventory.color || ')',
        'error_so', 'Kaydku ma filna: ' || v_inventory.title
      );
    END IF;

    v_item_total := v_inventory.price * v_qty;
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  -- 4. COUPON VALIDATION (if provided)
  IF p_coupon_code IS NOT NULL AND p_coupon_code != '' THEN
    SELECT * INTO v_coupon 
    FROM coupons 
    WHERE code = UPPER(TRIM(p_coupon_code))
      AND is_active = true
      AND (valid_from IS NULL OR valid_from <= NOW())
      AND (valid_until IS NULL OR valid_until >= NOW())
      AND (usage_limit IS NULL OR times_used < usage_limit)
      AND (minimum_order_amount IS NULL OR minimum_order_amount <= v_subtotal);

    IF NOT FOUND THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Invalid or expired coupon / Cupon khalad ah ama wuu dhammaaday'
      );
    END IF;

    v_coupon_id := v_coupon.id;

    -- Apply discount
    IF v_coupon.discount_type = 'percentage' THEN
      v_discount_total := ROUND((v_subtotal * v_coupon.discount_value / 100)::numeric, 2);
    ELSIF v_coupon.discount_type = 'fixed' THEN
      v_discount_total := LEAST(v_coupon.discount_value, v_subtotal);
    END IF;
  END IF;

  -- 5. SHIPPING FEE (free over $500)
  v_shipping_fee := CASE WHEN (v_subtotal - v_discount_total) >= 500 THEN 0 ELSE 15 END;

  -- 6. TAX (8%)
  v_tax_amount := ROUND(((v_subtotal - v_discount_total + v_shipping_fee) * 0.08)::numeric, 2);

  -- 7. GRAND TOTAL
  v_grand_total := v_subtotal - v_discount_total + v_shipping_fee + v_tax_amount;

  -- 8. GENERATE UNIQUE ORDER NUMBER
  v_order_number := 'TK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 6));

  -- 9. CREATE ORDER (atomic)
  INSERT INTO orders (
    user_id, order_number, idempotency_key, status, currency,
    subtotal, discount_total, shipping_fee, tax_amount, total,
    shipping_address, billing_address,
    coupon_id, payment_provider, notes
  ) VALUES (
    p_user_id, v_order_number, p_idempotency_key, 'pending', p_currency,
    v_subtotal, v_discount_total, v_shipping_fee, v_tax_amount, v_grand_total,
    p_shipping_addr, p_billing_addr,
    v_coupon_id, p_payment_provider, p_notes
  ) RETURNING id INTO v_order_id;

  -- 10. CREATE ORDER ITEMS + DECREMENT INVENTORY
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_inv_id := (v_item->>'inventory_id')::UUID;
    v_qty := (v_item->>'quantity')::INTEGER;

    SELECT i.*, p.price, p.title, p.id as product_id
    INTO v_inventory
    FROM inventory i
    JOIN products p ON p.id = i.product_id
    WHERE i.id = v_inv_id;

    INSERT INTO order_items (
      order_id, product_id, inventory_id, product_name,
      quantity, unit_price, total_price,
      product_snapshot
    ) VALUES (
      v_order_id, v_inventory.product_id, v_inv_id, v_inventory.title,
      v_qty, v_inventory.price, v_inventory.price * v_qty,
      jsonb_build_object(
        'title', v_inventory.title,
        'price', v_inventory.price,
        'color', v_inventory.color,
        'size', v_inventory.size,
        'sku', v_inventory.sku
      )
    );

    -- Decrement inventory atomically
    UPDATE inventory
    SET stock_quantity = stock_quantity - v_qty,
        updated_at = NOW()
    WHERE id = v_inv_id AND stock_quantity >= v_qty;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Race condition: insufficient stock for %', v_inv_id;
    END IF;
  END LOOP;

  -- 11. CREATE PAYMENT RECORD
  INSERT INTO payments (order_id, amount, provider, status)
  VALUES (v_order_id, v_grand_total, p_payment_provider, 'unpaid');

  -- 12. INCREMENT COUPON USAGE
  IF v_coupon_id IS NOT NULL THEN
    UPDATE coupons SET times_used = times_used + 1 WHERE id = v_coupon_id;
  END IF;

  -- 13. LOG INITIAL STATUS HISTORY
  INSERT INTO order_status_history (order_id, status, note)
  VALUES (v_order_id, 'pending', 'Order created successfully');

  -- 14. SEND NOTIFICATION
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (
    p_user_id, 'order',
    'Order Confirmed — ' || v_order_number,
    'Dalabkaaga ' || v_order_number || ' si guul leh ayaa la diiwaangeliyay. Waad ku mahadsan tahay inaad TOKIYO dooratay!'
  );

  RETURN jsonb_build_object(
    'success', true,
    'duplicate', false,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'discount_total', v_discount_total,
    'shipping_fee', v_shipping_fee,
    'tax_amount', v_tax_amount,
    'grand_total', v_grand_total,
    'currency', p_currency
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- -------------------------------------------------------
-- 5. update_order_status RPC (admin only)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_status   order_status,
  p_note     TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_role TEXT;
  v_order     RECORD;
BEGIN
  -- Check admin/manager role
  SELECT role INTO v_user_role FROM profiles WHERE id = auth.uid();
  IF v_user_role NOT IN ('admin', 'manager') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  SELECT * INTO v_order FROM orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  -- If cancelling, restore inventory
  IF p_status = 'cancelled' AND v_order.status != 'cancelled' THEN
    UPDATE inventory i
    SET stock_quantity = i.stock_quantity + oi.quantity,
        updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = p_order_id AND oi.inventory_id = i.id;
  END IF;

  -- Update order status + timestamps
  UPDATE orders SET
    status = p_status,
    shipped_at = CASE WHEN p_status = 'shipped' THEN NOW() ELSE shipped_at END,
    delivered_at = CASE WHEN p_status = 'delivered' THEN NOW() ELSE delivered_at END,
    updated_at = NOW()
  WHERE id = p_order_id;

  -- Update payment status if paid
  IF p_status IN ('paid', 'confirmed') THEN
    UPDATE payments SET status = 'paid', updated_at = NOW() WHERE order_id = p_order_id;
  END IF;
  IF p_status = 'refunded' THEN
    UPDATE payments SET status = 'refunded', updated_at = NOW() WHERE order_id = p_order_id;
  END IF;

  -- Log history
  INSERT INTO order_status_history (order_id, status, note, changed_by)
  VALUES (p_order_id, p_status, p_note, auth.uid());

  -- Notify customer
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (
    v_order.user_id, 'order',
    'Order Update — ' || v_order.order_number,
    'Dalabkaaga ' || v_order.order_number || ' waxaa loo beddelay: ' || p_status::TEXT
  );

  RETURN jsonb_build_object('success', true, 'status', p_status);
END;
$$;

-- -------------------------------------------------------
-- 6. GET ORDER WITH FULL DETAILS (for customer tracking)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION get_order_details(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT * INTO v_order FROM orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Order not found');
  END IF;

  -- Only allow owner or admin to view
  IF v_order.user_id != auth.uid() AND
     (SELECT role FROM profiles WHERE id = auth.uid()) NOT IN ('admin', 'manager') THEN
    RETURN jsonb_build_object('error', 'Unauthorized');
  END IF;

  RETURN (
    SELECT jsonb_build_object(
      'order', row_to_json(o),
      'items', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'snapshot', oi.product_snapshot
          )
        )
        FROM order_items oi WHERE oi.order_id = p_order_id
      ),
      'status_history', (
        SELECT jsonb_agg(
          jsonb_build_object('status', osh.status, 'note', osh.note, 'created_at', osh.created_at)
          ORDER BY osh.created_at ASC
        )
        FROM order_status_history osh WHERE osh.order_id = p_order_id
      )
    )
    FROM orders o WHERE o.id = p_order_id
  );
END;
$$;

-- -------------------------------------------------------
-- 7. ADD MISSING COLUMNS TO ORDER ITEMS (snapshot, inventory_id)
-- -------------------------------------------------------
ALTER TABLE order_items 
  ADD COLUMN IF NOT EXISTS product_snapshot JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL;

-- -------------------------------------------------------
-- 8. RLS POLICIES
-- -------------------------------------------------------
-- Orders: users see own, admins see all
DROP POLICY IF EXISTS "Users view own orders" ON orders;
CREATE POLICY "Users view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

DROP POLICY IF EXISTS "System creates orders" ON orders;
CREATE POLICY "System creates orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin updates orders" ON orders;
CREATE POLICY "Admin updates orders" ON orders
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- Order items: users see items in their own orders
DROP POLICY IF EXISTS "Users view own order items" ON order_items;
CREATE POLICY "Users view own order items" ON order_items
  FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- -------------------------------------------------------
-- 9. REALTIME: Enable for order_status_history
-- -------------------------------------------------------
ALTER TABLE order_status_history REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;

-- -------------------------------------------------------
-- 10. VERIFICATION
-- -------------------------------------------------------
SELECT 
  'order_status enum values' AS check_name,
  string_agg(enumlabel, ', ' ORDER BY enumsortorder) AS values
FROM pg_enum 
WHERE enumtypid = 'order_status'::regtype;
