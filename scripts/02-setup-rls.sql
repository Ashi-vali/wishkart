-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Registries policies
CREATE POLICY "Users can view own registries" ON public.registries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public registries" ON public.registries
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own registries" ON public.registries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registries" ON public.registries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own registries" ON public.registries
  FOR DELETE USING (auth.uid() = user_id);

-- Gifts policies
CREATE POLICY "Anyone can view gifts from public registries" ON public.gifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.registries 
      WHERE registries.id = gifts.registry_id 
      AND registries.is_public = true
    )
  );

CREATE POLICY "Registry owners can manage their gifts" ON public.gifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.registries 
      WHERE registries.id = gifts.registry_id 
      AND registries.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can reserve gifts from public registries" ON public.gifts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.registries 
      WHERE registries.id = gifts.registry_id 
      AND registries.is_public = true
    )
  );
