-- ============================================================
-- TOKIYO STORE - Create Admin User
-- Run this in Supabase SQL Editor AFTER running database.sql
-- ============================================================

-- Step 1: Create the admin user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@tokiyostore.com',
  crypt('tokiyo123@', gen_salt('bf')),
  NOW(),                        -- email already confirmed
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Admin","last_name":"Tokiyo"}',
  false,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Step 2: Set the admin role in the profiles table
-- (The trigger should have created the profile automatically,
--  but we manually update the role to 'admin')
UPDATE profiles
SET role = 'admin',
    first_name = 'Admin',
    last_name = 'Tokiyo',
    updated_at = NOW()
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@tokiyostore.com'
);

-- Step 3: Verify it worked (optional - check the results)
SELECT 
  u.email,
  p.role,
  p.first_name,
  p.last_name,
  u.created_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@tokiyostore.com';

-- ============================================================
-- Expected result:
-- email: admin@tokiyostore.com
-- role:  admin
-- first_name: Admin
-- last_name: Tokiyo
-- ============================================================
