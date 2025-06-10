-- Check if the trigger function exists
SELECT EXISTS (
  SELECT 1 
  FROM pg_proc 
  WHERE proname = 'handle_new_user'
) AS trigger_function_exists;

-- Check if the trigger is attached to the auth.users table
SELECT EXISTS (
  SELECT 1 
  FROM pg_trigger 
  WHERE tgname = 'on_auth_user_created'
) AS trigger_exists;

-- Re-create the trigger function if needed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
