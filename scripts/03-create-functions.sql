-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate unique custom URLs
CREATE OR REPLACE FUNCTION public.generate_custom_url(base_text TEXT)
RETURNS TEXT AS $$
DECLARE
  clean_text TEXT;
  final_url TEXT;
  counter INTEGER := 0;
BEGIN
  -- Clean and format the base text
  clean_text := LOWER(REGEXP_REPLACE(base_text, '[^a-zA-Z0-9\s]', '', 'g'));
  clean_text := REGEXP_REPLACE(clean_text, '\s+', '-', 'g');
  clean_text := TRIM(clean_text, '-');
  
  -- Ensure it's not too long
  IF LENGTH(clean_text) > 50 THEN
    clean_text := SUBSTRING(clean_text, 1, 50);
  END IF;
  
  final_url := clean_text;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.registries WHERE custom_url = final_url) LOOP
    counter := counter + 1;
    final_url := clean_text || '-' || counter;
  END LOOP;
  
  RETURN final_url;
END;
$$ LANGUAGE plpgsql;
