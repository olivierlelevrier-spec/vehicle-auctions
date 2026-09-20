# MVP Implementation Guide

**Branch**: `mvp/core`
**Status**: Ready for Supabase deployment
**Date**: 2026-09-20

---

## Architecture

### Database Schema

```
auth.users (Supabase managed)
    ↓
public.profiles (user public profile)
    ↓
public.listings (vehicle announcements)
    ↓
public.bids (auction bids)
```

### Authentication Flow

1. User signs up with email/password
2. Supabase creates auth.users record
3. Trigger creates profiles record (optional, can be done via app)
4. User logs in → gets session token
5. All DB queries use RLS policies for authorization

### Authorization (RLS)

- **Profiles**: Readable by authenticated users, updatable only by owner
- **Listings**: Active listings readable by anyone, draft only by owner, insert/update/delete by owner
- **Bids**: Readable by anyone, insertable by authenticated users (with constraint preventing self-bidding)

---

## Files Created

### Migrations

```
supabase/migrations/
├── 001_create_core_tables.sql     # profiles, listings, bids tables
├── 002_setup_rls.sql               # Row-Level Security policies
└── 003_seed_test_data.sql          # Test data (fictional UUIDs)
```

### Libraries

```
lib/
├── supabase-auth-mvp.ts            # signUpMVP, signInMVP, getCurrentUserMVP, etc
├── listings-mvp.ts                 # createListingMVP, getListingByIdMVP, etc
└── bids-mvp.ts                     # createBidMVP, getBidsForListingMVP, etc
```

---

## Deployment Steps

### Phase 1: Supabase Setup (REQUIRED)

1. **Verify/Create Tables**
   - Run `supabase/migrations/001_create_core_tables.sql` in Supabase SQL Editor
   - Verify: profiles, listings, bids tables exist

2. **Configure RLS**
   - Run `supabase/migrations/002_setup_rls.sql`
   - Verify: RLS policies applied

3. **Seed Test Data** (Optional, for initial testing)
   - Create 2 test users via signup process OR run `003_seed_test_data.sql`
   - Test data: 1 listing, 1 bid

4. **Verify env vars in Supabase**
   ```
   NEXT_PUBLIC_SUPABASE_URL         ✅
   NEXT_PUBLIC_SUPABASE_ANON_KEY    ✅
   SUPABASE_SERVICE_ROLE_KEY        ✅ (needed for any server-side ops)
   ```

### Phase 2: Replace Old Code

1. **Replace Auth**
   - Old: `lib/supabase-auth.ts` (dev-only fallback)
   - New: `lib/supabase-auth-mvp.ts` (real Supabase Auth)
   - Update imports in pages

2. **Replace Listings Logic**
   - Old: `lib/supabase.ts:saveAnnouncement()` (called `announcements` table)
   - New: `lib/listings-mvp.ts` (uses `listings` table)
   - Update imports in pages

3. **Add Bids Logic**
   - New: `lib/bids-mvp.ts`
   - Will be imported in new pages

### Phase 3: Create/Update Pages

#### `/signup` (Update)
```typescript
import { signUpMVP } from '@/lib/supabase-auth-mvp';

const result = await signUpMVP(email, password, fullName, phone);
// Returns: { success: true/false, userId, data }
```

#### `/login` (Update)
```typescript
import { signInMVP } from '@/lib/supabase-auth-mvp';

const result = await signInMVP(email, password);
// Returns: { success: true/false, data }
```

#### `/sell` (Update)
```typescript
import { createListingMVP } from '@/lib/listings-mvp';

const result = await createListingMVP(userId, {
  brand: 'Porsche',
  model: '911',
  year: 1985,
  price: 50000,
  description: '...',
  // other fields
});
// Returns: { success: true/false, data: [listing] }
```

#### `/browse` (Update)
```typescript
import { getActiveListingsMVP } from '@/lib/listings-mvp';

const result = await getActiveListingsMVP(50, 0);
// Returns: { success: true/false, data: [listings], count: N }
```

#### `/listings/[id]` (New/Update)
```typescript
import { getListingByIdMVP } from '@/lib/listings-mvp';
import { getBidsForListingMVP } from '@/lib/bids-mvp';

const listing = await getListingByIdMVP(listingId);
const bidsResult = await getBidsForListingMVP(listingId);
// Display listing + bid history
```

#### Bid Form (New)
```typescript
import { createBidMVP } from '@/lib/bids-mvp';

const result = await createBidMVP(listingId, userId, amount);
// Returns: { success: true/false, error: message, data: [bid] }
```

---

## Test Scenario (End-to-End)

### Setup
1. Two test accounts created:
   - seller@test.local / password (creates Listing)
   - buyer@test.local / password (creates Bid)

### Test Flow

**Step 1: Seller Signup & Login**
```
POST /api/signup → sellerUserId
POST /api/login → session token
```

**Step 2: Seller Creates Listing**
```
POST /api/listings (with sellerUserId)
Response: { id: "listing-123", brand: "Porsche", price: 50000, status: "active" }
```

**Step 3: Browse Shows Listing**
```
GET /api/listings → includes "Porsche" listing
```

**Step 4: Buyer Signup & Login**
```
POST /api/signup → buyerUserId
POST /api/login → session token
```

**Step 5: Buyer Views Listing Detail**
```
GET /api/listings/listing-123
Response: full listing + seller info
```

**Step 6: Buyer Places Bid**
```
POST /api/bids { listingId, amount: 55000 }
Response: { id: "bid-123", amount: 55000, bidder: "buyer@test.local" }
```

**Step 7: Seller Sees Bid**
```
GET /api/listings/listing-123 → current_bid: 55000
GET /api/listings/listing-123/bids → includes bid from buyer@test.local
```

**Step 8: Persistence Test**
```
F5 refresh on /listings/listing-123
→ Still shows bid of 55000 from buyer
→ Data persisted in Supabase ✅
```

---

## API Endpoints Needed

New endpoints to create/update:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/signup` | POST | User signup (calls signUpMVP) |
| `/api/auth/login` | POST | User login (calls signInMVP) |
| `/api/listings` | GET | Browse active listings |
| `/api/listings` | POST | Create listing |
| `/api/listings/[id]` | GET | Get listing detail |
| `/api/listings/[id]` | PUT | Update listing (seller only) |
| `/api/listings/[id]` | DELETE | Delete listing (seller only) |
| `/api/listings/[id]/bids` | GET | Get bids for listing |
| `/api/bids` | POST | Place bid |

---

## Known Limitations (MVP)

❌ **Not Implemented**
- Photos upload (Storage not configured)
- Notifications/Emails
- Warranty/Credit integrations
- Scanner (Histovec, VIN)
- Price estimation (Auto1)
- Dashboard analytics
- Real-time bidding (WebSocket)

✅ **Core Only**
- User signup/login/profile
- Create/read/list/update listings
- Place bids
- RLS authorization
- Persistence in Supabase

---

## Blockers Until Supabase Access

🚨 **MUST HAVE**
- Access to Supabase project (collaborator or admin)
- Ability to run migrations in SQL editor
- Ability to configure env vars in Vercel

❌ **CANNOT PROCEED WITHOUT**
- These 3 items above

---

## Timeline

- **Supabase migrations**: 1-2 hours
- **Pages + API endpoints**: 2-3 hours
- **Testing + fixes**: 2-3 hours
- **Total**: 5-8 hours = 1 day

---

## Rollback Plan

Each migration is reversible:

```sql
-- Rollback 003_seed_test_data
DELETE FROM bids WHERE listing_id = '650e8400-e29b-41d4-a716-446655440001'::uuid;
DELETE FROM listings WHERE id = '650e8400-e29b-41d4-a716-446655440001'::uuid;
DELETE FROM profiles WHERE email IN ('seller@test.local', 'buyer@test.local');

-- Rollback 002_setup_rls
DROP POLICY ... ON profiles;
... (all RLS policies)

-- Rollback 001_create_core_tables
DROP TABLE bids CASCADE;
DROP TABLE listings CASCADE;
DROP TABLE profiles CASCADE;
DROP FUNCTION handle_updated_at();
DROP EXTENSION "uuid-ossp";
```

---

## Next Steps

1. ✅ Code created on branch `mvp/core`
2. ⏳ Awaiting: Supabase access (collaborator invite)
3. ⏳ Awaiting: Vercel env vars configuration
4. → Deploy migrations
5. → Update pages
6. → Test scenario
7. → Merge to main
8. → Deploy to production

---

**Author**: Claude MVP Implementation
**Status**: Ready for deployment (pending Supabase access)
