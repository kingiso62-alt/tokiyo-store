-- TOKIYO STORE - Complete Production-Ready Supabase Database Schema
-- Project: Premium Men's Fashion

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-------------------------------------------------------
-- ENUMS
-------------------------------------------------------
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_status AS ENUM ('unpaid', 'processing', 'paid', 'failed', 'refunded');
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'manager');
CREATE TYPE return_status AS ENUM ('requested', 'approved', 'rejected', 'received', 'refunded');
CREATE TYPE notification_type AS ENUM ('order', 'promo', 'system', 'account');

-------------------------------------------------------
-- 1. USERS & PROFILES
-------------------------------------------------------
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'customer',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- Trigger to create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-------------------------------------------------------
-- 2. BRANDS
-------------------------------------------------------
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_brands_slug ON brands(slug);

-------------------------------------------------------
-- 3. CATEGORIES
-------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-------------------------------------------------------
-- 4. COLLECTIONS (E.g., "Summer 2026", "VIP Luxury")
-------------------------------------------------------
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_collections_slug ON collections(slug);

-------------------------------------------------------
-- 5. PRODUCTS
-------------------------------------------------------
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(10, 2) CHECK (compare_at_price >= price),
  cost_per_item DECIMAL(10, 2),
  sku TEXT UNIQUE,
  barcode TEXT,
  material TEXT,
  care_instructions TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_published ON products(is_published);

-------------------------------------------------------
-- 6. INVENTORY (Variants: Size/Color matrix)
-------------------------------------------------------
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  color TEXT,
  size TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  weight_grams INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_sku ON inventory(sku);

-------------------------------------------------------
-- 7. PRODUCT IMAGES
-------------------------------------------------------
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL, -- specific to a color variant
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-------------------------------------------------------
-- 8. COUPONS
-------------------------------------------------------
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2) DEFAULT 0.0,
  max_discount_amount DECIMAL(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_coupons_code ON coupons(code);

-------------------------------------------------------
-- 9. ORDERS
-------------------------------------------------------
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0.0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0.0,
  discount_total DECIMAL(10, 2) DEFAULT 0.0,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  customer_note TEXT,
  internal_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

-------------------------------------------------------
-- 10. ORDER ITEMS
-------------------------------------------------------
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  color TEXT,
  size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-------------------------------------------------------
-- 11. PAYMENTS
-------------------------------------------------------
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  provider TEXT NOT NULL, -- e.g., 'stripe', 'evc_plus', 'paypal'
  provider_transaction_id TEXT,
  status payment_status DEFAULT 'unpaid',
  payment_method_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_order ON payments(order_id);

-------------------------------------------------------
-- 12. SHIPPING
-------------------------------------------------------
CREATE TABLE shipping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  carrier TEXT,
  tracking_number TEXT,
  shipping_method TEXT,
  estimated_delivery_date DATE,
  actual_delivery_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  shipping_label_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_shipping_order ON shipping(order_id);

-------------------------------------------------------
-- 13. RETURNS
-------------------------------------------------------
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status return_status DEFAULT 'requested',
  reason TEXT NOT NULL,
  refund_amount DECIMAL(10, 2),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_returns_order ON returns(order_id);

-------------------------------------------------------
-- 14. WISHLIST
-------------------------------------------------------
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-------------------------------------------------------
-- 15. CART (Persistent Server-side Cart for logged-in users)
-------------------------------------------------------
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, inventory_id)
);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-------------------------------------------------------
-- 16. REVIEWS
-------------------------------------------------------
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true, -- Admin moderation
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-------------------------------------------------------
-- 17. NOTIFICATIONS
-------------------------------------------------------
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = false;

-------------------------------------------------------
-- 18. SETTINGS (Global App Settings)
-------------------------------------------------------
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-------------------------------------------------------
-- 19. ANALYTICS (Events tracking)
-------------------------------------------------------
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  page_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_event ON analytics_events(event_name);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) & POLICIES
-------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 1. Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Brands, Categories, Collections, Products, Images (Public Read, Admin Write)
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Admin write brands" ON brands FOR ALL USING (is_admin());

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin write categories" ON categories FOR ALL USING (is_admin());

CREATE POLICY "Public read collections" ON collections FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin write collections" ON collections FOR ALL USING (is_admin());

CREATE POLICY "Public read products" ON products FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Admin write products" ON products FOR ALL USING (is_admin());

CREATE POLICY "Public read images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin write images" ON product_images FOR ALL USING (is_admin());

-- 3. Inventory (Public Read, Admin Write)
CREATE POLICY "Public read inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Admin write inventory" ON inventory FOR ALL USING (is_admin());

-- 4. Coupons (Admin All, Public Read if active)
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin write coupons" ON coupons FOR ALL USING (is_admin());

-- 5. Orders & Order Items
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin update orders" ON orders FOR UPDATE USING (is_admin());

CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()) OR is_admin()
);
CREATE POLICY "Users insert own order items" ON order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);

-- 6. Payments & Shipping & Returns
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Users insert own payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin write payments" ON payments FOR ALL USING (is_admin());

CREATE POLICY "Users view own shipping" ON shipping FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()) OR is_admin()
);
CREATE POLICY "Admin write shipping" ON shipping FOR ALL USING (is_admin());

CREATE POLICY "Users view own returns" ON returns FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Users insert own returns" ON returns FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin write returns" ON returns FOR ALL USING (is_admin());

-- 7. Wishlists
CREATE POLICY "Users manage own wishlist" ON wishlists FOR ALL USING (user_id = auth.uid());

-- 8. Cart & Cart Items
CREATE POLICY "Users manage own cart" ON carts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own cart items" ON cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
);

-- 9. Reviews
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true OR is_admin() OR user_id = auth.uid());
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users delete own reviews" ON reviews FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- 10. Notifications
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- 11. Settings (Public Read, Admin Write)
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON settings FOR ALL USING (is_admin());

-- 12. Analytics
CREATE POLICY "Public insert events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read events" ON analytics_events FOR SELECT USING (is_admin());

-------------------------------------------------------
-- RPC FUNCTIONS (for safe inventory management)
-------------------------------------------------------

-- Decrement stock (used when an order is confirmed)
-- Will fail with a check constraint if stock goes below 0
CREATE OR REPLACE FUNCTION decrement_inventory_stock(
  p_inventory_id UUID,
  p_quantity INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE inventory
  SET stock_quantity = stock_quantity - p_quantity,
      updated_at = NOW()
  WHERE id = p_inventory_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item % not found', p_inventory_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment stock (used when an order is cancelled)
CREATE OR REPLACE FUNCTION increment_inventory_stock(
  p_inventory_id UUID,
  p_quantity INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE inventory
  SET stock_quantity = stock_quantity + p_quantity,
      updated_at = NOW()
  WHERE id = p_inventory_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item % not found', p_inventory_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-------------------------------------------------------
-- SAMPLE SEED DATA (uncomment to use)
-------------------------------------------------------
-- Run this after creating the schema to have initial test data.

-- INSERT INTO categories (name, slug, description, is_active) VALUES
--   ('Suits', 'suits', 'Premium tailored suits', true),
--   ('Watches', 'watches', 'Luxury timepieces', true),
--   ('Shoes', 'shoes', 'Premium footwear', true),
--   ('Accessories', 'accessories', 'Bags, ties, and more', true);

-- INSERT INTO brands (name, slug, description) VALUES
--   ('Tokiyo Premium', 'tokiyo-premium', 'Our exclusive in-house brand'),
--   ('Milano Craft', 'milano-craft', 'Italian artisan fashion');

