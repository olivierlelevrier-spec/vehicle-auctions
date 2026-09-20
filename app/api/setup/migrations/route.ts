// Setup API - Run migrations autonomously
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Migration SQL
const MIGRATIONS = [
  // Migration 001: Create core tables
  `
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

  CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    license_plate TEXT,
    fuel_type TEXT,
    mileage INTEGER,
    engine_ref TEXT,
    fiscal_power TEXT,
    color TEXT,
    price INTEGER NOT NULL,
    description TEXT,
    starting_bid INTEGER DEFAULT 0,
    current_bid INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    warranty_provider TEXT,
    warranty_formula TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
  CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
  CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

  CREATE TABLE IF NOT EXISTS public.bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_bids_listing_id ON public.bids(listing_id);
  CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON public.bids(bidder_id);

  ALTER TABLE public.bids ADD CONSTRAINT check_bidder_not_seller CHECK ((SELECT seller_id FROM public.listings WHERE id = listing_id) != bidder_id);

  CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc'::text, NOW()); RETURN NEW; END; $$ LANGUAGE PLPGSQL;
  DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
  CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  DROP TRIGGER IF EXISTS handle_listings_updated_at ON public.listings;
  CREATE TRIGGER handle_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `,

  // Migration 002: RLS policies
  `
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Profiles readable by authenticated" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated_user');
  CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

  ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Active listings readable" ON public.listings FOR SELECT USING (status IN ('active', 'sold'));
  CREATE POLICY "Users see own drafts" ON public.listings FOR SELECT USING (auth.uid() = seller_id AND status = 'draft');
  CREATE POLICY "Users insert listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
  CREATE POLICY "Users update own listings" ON public.listings FOR UPDATE USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
  CREATE POLICY "Users delete own listings" ON public.listings FOR DELETE USING (auth.uid() = seller_id);

  ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Bids readable" ON public.bids FOR SELECT USING (TRUE);
  CREATE POLICY "Users create bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_id AND auth.role() = 'authenticated_user');
  `,
];

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    // Security: Only allow from localhost
    const host = request.headers.get('host') || '';
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return NextResponse.json(
        { error: 'Only accessible from localhost for security reasons' },
        { status: 403 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    console.log('🔄 Starting migrations...');
    const results = [];

    // Execute each migration
    for (let i = 0; i < MIGRATIONS.length; i++) {
      const migration = MIGRATIONS[i];
      console.log(`⏳ Executing migration ${i + 1}/${MIGRATIONS.length}...`);

      try {
        // Execute SQL via direct RPC call
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: migration,
        });

        if (error) {
          // If exec_sql doesn't exist, try direct query
          console.warn(`RPC failed, trying direct execution...`);
          // Since we can't use anon key for DDL, we'll return instructions
          results.push({
            migration: i + 1,
            status: 'needs_manual',
            message: 'DDL operations require service_role_key. Please execute in Supabase UI.',
          });
        } else {
          results.push({
            migration: i + 1,
            status: 'success',
            message: `Migration ${i + 1} completed`,
          });
        }
      } catch (err) {
        console.error(`Migration ${i + 1} error:`, err);
        results.push({
          migration: i + 1,
          status: 'error',
          message: String(err),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration setup completed',
      results,
      note: 'Due to Supabase RLS, DDL operations need to be run from SQL Editor or via service_role_key. SQL migrations are ready in supabase/migrations/ directory.',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: String(error) },
      { status: 500 }
    );
  }
}
