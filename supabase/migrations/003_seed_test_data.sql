-- Test Data Seed
-- Created: 2026-09-20
-- Description: Create test users and sample data for MVP testing
-- Note: These are FICTIONAL IDs. Real IDs from auth.users will be different.

-- ============================================
-- TEST PROFILES (created after auth signup)
-- ============================================

-- Seller account: seller@test.local
INSERT INTO public.profiles (id, email, phone, full_name, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'seller@test.local',
  '+33612345678',
  'Pierre Vendeur',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Buyer account: buyer@test.local
INSERT INTO public.profiles (id, email, phone, full_name, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'buyer@test.local',
  '+33687654321',
  'Marie Acheteuse',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- TEST LISTING (created by seller)
-- ============================================

INSERT INTO public.listings (
  id, seller_id, brand, model, year, license_plate, fuel_type, mileage,
  engine_ref, fiscal_power, color, price, description, starting_bid,
  status, created_at, updated_at
)
VALUES (
  '650e8400-e29b-41d4-a716-446655440001'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Porsche',
  '911',
  1985,
  'PA-123-CD',
  'Essence',
  120000,
  'EC-911',
  '10',
  'Noir',
  50000,
  'Porsche 911 1985 en excellent état. Authentique, full original, jamais accidentée. Parfait pour collectionneur.',
  50000,
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TEST BID (created by buyer on seller's listing)
-- ============================================

INSERT INTO public.bids (id, listing_id, bidder_id, amount, created_at)
VALUES (
  '750e8400-e29b-41d4-a716-446655440001'::uuid,
  '650e8400-e29b-41d4-a716-446655440001'::uuid,
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  55000,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- UPDATE LISTING with current bid
-- ============================================

UPDATE public.listings
SET current_bid = 55000
WHERE id = '650e8400-e29b-41d4-a716-446655440001'::uuid;

COMMIT;
