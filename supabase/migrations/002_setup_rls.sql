-- RLS Policies for MVP
-- Created: 2026-09-20
-- Description: Row-Level Security for profiles, listings, bids

-- ============================================
-- PROFILES TABLE RLS
-- ============================================

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read any profile
CREATE POLICY "Profiles are readable by authenticated users"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated_user');

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: New profile created on signup (handled via trigger + function)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- LISTINGS TABLE RLS
-- ============================================

-- Enable RLS on listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active/sold listings
CREATE POLICY "Active listings readable by anyone"
ON public.listings FOR SELECT
USING (status IN ('active', 'sold'));

-- Policy: Users can read their own draft listings
CREATE POLICY "Users can see own draft listings"
ON public.listings FOR SELECT
USING (auth.uid() = seller_id AND status = 'draft');

-- Policy: Only seller can create listings
CREATE POLICY "Users can insert listings as sellers"
ON public.listings FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- Policy: Only seller can update own listing
CREATE POLICY "Users can update own listings"
ON public.listings FOR UPDATE
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

-- Policy: Only seller can delete own listing
CREATE POLICY "Users can delete own listings"
ON public.listings FOR DELETE
USING (auth.uid() = seller_id);

-- ============================================
-- BIDS TABLE RLS
-- ============================================

-- Enable RLS on bids
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read bids on a listing (for transparency)
CREATE POLICY "Bids readable by anyone"
ON public.bids FOR SELECT
USING (TRUE);

-- Policy: Authenticated users can create bids (constraint prevents self-bidding)
CREATE POLICY "Authenticated users can create bids"
ON public.bids FOR INSERT
WITH CHECK (auth.uid() = bidder_id AND auth.role() = 'authenticated_user');

-- Policy: Users cannot delete or modify bids (immutable)
-- (No DELETE or UPDATE policies = prevent both)

COMMIT;
