# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Copy your **Project URL** and **Anon Key**

## 2. Create Database Tables

Run these SQL queries in Supabase SQL Editor:

```sql
-- Announcements table
CREATE TABLE public.announcements (
  id BIGSERIAL PRIMARY KEY,
  license_plate TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  fuel_type TEXT,
  engine_ref TEXT,
  fiscal_power TEXT,
  mileage INTEGER,
  price INTEGER,
  description TEXT,
  color TEXT,
  warranty_provider TEXT,
  warranty_formula TEXT,
  seller_name TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  seller_phone TEXT,
  status TEXT DEFAULT 'active',
  starting_bid INTEGER,
  current_bid INTEGER DEFAULT 0,
  bid_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bids table
CREATE TABLE public.bids (
  id BIGSERIAL PRIMARY KEY,
  announcement_id BIGINT REFERENCES announcements(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  bidder_email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_seller_email ON announcements(seller_email);
CREATE INDEX idx_bids_announcement_id ON bids(announcement_id);
```

## 3. Disable Email Confirmation (Important!)

To allow users to login immediately after signup:

1. Go to Supabase Dashboard → Authentication → Providers → Email
2. **Uncheck "Confirm email"** to disable email verification
3. Save changes

This allows instant login without email confirmation for development/testing.

## 4. Configure Environment Variables

### Local Development (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Production (Vercel)
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 5. Enable Row-Level Security (Recommended)

```sql
-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON announcements
  FOR SELECT USING (true);

-- Allow insert own announcements
CREATE POLICY "Allow insert own announcements" ON announcements
  FOR INSERT WITH CHECK (auth.email() = seller_email);
```

## 6. Test

1. Restart dev server: `npm run dev`
2. Go to http://localhost:3000/signup
3. Create an account
4. Login with your credentials
5. Go to /dashboard to view your announcements

## Support

- Supabase Docs: https://supabase.com/docs
- Next.js + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
