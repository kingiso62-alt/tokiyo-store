-- ============================================================
-- TOKIYO STORE - COMPLETE DATABASE RESET SCRIPT
-- Run this FIRST in Supabase SQL Editor to wipe the old schema.
-- Then run the main database.sql file.
-- ============================================================

-- DROP all functions first
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.decrement_inventory_stock(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.increment_inventory_stock(UUID, INTEGER) CASCADE;

-- DROP all tables (in reverse dependency order)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS returns CASCADE;
DROP TABLE IF EXISTS shipping CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- DROP all custom types (ENUMs)
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS return_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- DROP the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================================
-- Done! Now run database.sql to rebuild everything fresh.
-- ============================================================
