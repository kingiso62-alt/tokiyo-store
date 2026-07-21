-- ============================================================
-- TOKIYO STORE - Fix / Verify Admin User
-- Run this in Supabase SQL Editor if you already created the user
-- via the Dashboard UI (Authentication > Users > Add user)
-- ============================================================

-- Option A: You already added user via Supabase Dashboard UI
-- Just run this to promote the existing user to admin role:
UPDATE profiles
SET 
  role = 'admin',
  first_name = 'Admin',
  last_name = 'Tokiyo',
  updated_at = NOW()
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@tokiyostore.com'
  LIMIT 1
);

-- Verify the update worked:
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.first_name,
  p.last_name
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@tokiyostore.com';

-- ============================================================
-- If the profile row doesn't exist yet (trigger didn't fire),
-- create it manually:
-- ============================================================
INSERT INTO profiles (id, role, first_name, last_name)
SELECT 
  u.id, 
  'admin'::user_role, 
  'Admin', 
  'Tokiyo'
FROM auth.users u
WHERE u.email = 'admin@tokiyostore.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  first_name = 'Admin',
  last_name = 'Tokiyo',
  updated_at = NOW();

-- Final check:
SELECT u.email, p.role FROM auth.users u JOIN profiles p ON p.id = u.id WHERE u.email = 'admin@tokiyostore.com';
