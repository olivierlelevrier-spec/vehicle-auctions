// Listings CRUD for MVP
import { getSupabaseClient } from './getSupabaseClient()-auth-mvp';

export interface ListingMVP {
  id?: string;
  seller_id?: string;
  brand: string;
  model: string;
  year?: number;
  license_plate?: string;
  fuel_type?: string;
  mileage?: number;
  engine_ref?: string;
  fiscal_power?: string;
  color?: string;
  price: number;
  description?: string;
  starting_bid?: number;
  current_bid?: number;
  status?: 'active' | 'sold' | 'draft';
  photo_urls?: string[];
  warranty_provider?: string;
  warranty_formula?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// CREATE LISTING
// ============================================
export async function createListingMVP(
  sellerId: string,
  listing: ListingMVP
) {
  try {
    const { data, error } = await getSupabaseClient()
      .from('listings')
      .insert([
        {
          seller_id: sellerId,
          brand: listing.brand,
          model: listing.model,
          year: listing.year || null,
          license_plate: listing.license_plate || null,
          fuel_type: listing.fuel_type || null,
          mileage: listing.mileage || null,
          engine_ref: listing.engine_ref || null,
          fiscal_power: listing.fiscal_power || null,
          color: listing.color || null,
          price: listing.price,
          description: listing.description || null,
          starting_bid: listing.starting_bid || listing.price,
          current_bid: listing.current_bid || listing.price,
          status: listing.status || 'active',
          photo_urls: listing.photo_urls || [],
          warranty_provider: listing.warranty_provider || null,
          warranty_formula: listing.warranty_formula || null,
        },
      ])
      .select();

    if (error) {
      console.error('Listing creation error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception creating listing:', err);
    return { success: false, error: String(err) };
  }
}

// ============================================
// GET LISTING BY ID
// ============================================
export async function getListingByIdMVP(listingId: string) {
  try {
    const { data, error } = await getSupabaseClient()
      .from('listings')
      .select(
        `*,
        profiles:seller_id(id, email, full_name, phone, avatar_url)`
      )
      .eq('id', listingId)
      .single();

    if (error) {
      console.error('Listing fetch error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching listing:', err);
    return null;
  }
}

// ============================================
// GET ALL ACTIVE LISTINGS (Browse)
// ============================================
export async function getActiveListingsMVP(limit = 50, offset = 0) {
  try {
    const { data, error, count } = await getSupabaseClient()
      .from('listings')
      .select(
        `*,
        profiles:seller_id(id, email, full_name, phone, avatar_url)`,
        { count: 'exact' }
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Active listings fetch error:', error);
      return { success: false, error: error.message, data: [], count: 0 };
    }

    return { success: true, data, count };
  } catch (err) {
    console.error('Exception fetching listings:', err);
    return { success: false, error: String(err), data: [], count: 0 };
  }
}

// ============================================
// GET SELLER'S LISTINGS
// ============================================
export async function getSellerListingsMVP(sellerId: string) {
  try {
    const { data, error } = await getSupabaseClient()
      .from('listings')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Seller listings fetch error:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception fetching seller listings:', err);
    return { success: false, error: String(err), data: [] };
  }
}

// ============================================
// UPDATE LISTING (only by seller)
// ============================================
export async function updateListingMVP(
  listingId: string,
  sellerId: string,
  updates: Partial<ListingMVP>
) {
  try {
    // Verify seller owns listing
    const { data: listing, error: fetchError } = await getSupabaseClient()
      .from('listings')
      .select('seller_id')
      .eq('id', listingId)
      .single();

    if (fetchError || !listing) {
      return { success: false, error: 'Listing not found' };
    }

    if (listing.seller_id !== sellerId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update listing
    const { data, error } = await getSupabaseClient()
      .from('listings')
      .update({
        brand: updates.brand,
        model: updates.model,
        year: updates.year,
        license_plate: updates.license_plate,
        fuel_type: updates.fuel_type,
        mileage: updates.mileage,
        engine_ref: updates.engine_ref,
        fiscal_power: updates.fiscal_power,
        color: updates.color,
        price: updates.price,
        description: updates.description,
        status: updates.status,
        photo_urls: updates.photo_urls,
      })
      .eq('id', listingId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============================================
// DELETE LISTING (only by seller, only if no bids)
// ============================================
export async function deleteListingMVP(listingId: string, sellerId: string) {
  try {
    // Verify seller owns listing
    const { data: listing, error: fetchError } = await getSupabaseClient()
      .from('listings')
      .select('seller_id')
      .eq('id', listingId)
      .single();

    if (fetchError || !listing) {
      return { success: false, error: 'Listing not found' };
    }

    if (listing.seller_id !== sellerId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check if bids exist
    const { count } = await getSupabaseClient()
      .from('bids')
      .select('id', { count: 'exact' })
      .eq('listing_id', listingId);

    if ((count || 0) > 0) {
      return {
        success: false,
        error: 'Cannot delete listing with active bids',
      };
    }

    // Delete listing
    const { error } = await getSupabaseClient()
      .from('listings')
      .delete()
      .eq('id', listingId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
