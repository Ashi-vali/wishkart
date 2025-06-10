-- This script manually creates a profile for a user
-- Replace 'USER_ID_HERE' with the actual user ID from Supabase Auth

-- First, check if the user already has a profile
SELECT * FROM public.profiles WHERE id = 'USER_ID_HERE';

-- If no profile exists, create one manually
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
VALUES (
  'USER_ID_HERE',
  'user-email@example.com',
  'Test User',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify the profile was created
SELECT * FROM public.profiles WHERE id = 'USER_ID_HERE';
