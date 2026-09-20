-- MVP Core Tables
-- Created: 2026-09-20
-- Description: Profiles, Listings, Bids for vehicle auction MVP

-- ============================================
-- 1. PROFILES TABLE (Users public data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================
-- 2. LISTINGS TABLE (Vehicle announcements)
-- ============================================
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Vehicle details
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  fuel_type TEXT,
  mileage INTEGER,
  engine_ref TEXT,
  fiscal_power TEXT,
  color TEXT,

  -- Auction details
  price INTEGER NOT NULL,
  description TEXT,
  starting_bid INTEGER DEFAULT 0,
  current_bid INTEGER DEFAULT 0,

  -- Status
  status TEXT NOT NULL DEFAULT 'active',
  -- active, sold, draft

  -- Photos
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Warranty/Credit
  warranty_provider TEXT,
  warranty_formula TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for listing queries
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_brand_model ON public.listings(brand, model);

-- ============================================
-- 3. BIDS TABLE (Auction bids)
-- ============================================
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Bid amount
  amount INTEGER NOT NULL,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for bid queries
CREATE INDEX IF NOT EXISTS idx_bids_listing_id ON public.bids(listing_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON public.bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON public.bids(created_at DESC);

-- Constraint: Bidder cannot bid on own listing
ALTER TABLE public.bids
ADD CONSTRAINT check_bidder_not_seller
CHECK ((
  SELECT seller_id FROM public.listings WHERE id = listing_id
) != bidder_id);

-- ============================================
-- 4. AUDIT: Track when profiles/listings change
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

-- Trigger for profiles
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for listings
DROP TRIGGER IF EXISTS handle_listings_updated_at ON public.listings;
CREATE TRIGGER handle_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 5. SETUP: Enable required extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

COMMIT;
