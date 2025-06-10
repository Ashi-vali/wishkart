-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registries table
CREATE TABLE public.registries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('Wedding', 'Baby shower', 'Birthday', 'Housewarming')),
  event_date DATE,
  custom_url TEXT UNIQUE,
  is_public BOOLEAN DEFAULT true,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gifts table
CREATE TABLE public.gifts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  registry_id UUID REFERENCES public.registries(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  product_url TEXT,
  image_url TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  is_reserved BOOLEAN DEFAULT false,
  reserved_by_name TEXT,
  reserved_by_email TEXT,
  reserved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  thank_you_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_registries_user_id ON public.registries(user_id);
CREATE INDEX idx_registries_custom_url ON public.registries(custom_url);
CREATE INDEX idx_gifts_registry_id ON public.gifts(registry_id);
CREATE INDEX idx_gifts_is_reserved ON public.gifts(is_reserved);
