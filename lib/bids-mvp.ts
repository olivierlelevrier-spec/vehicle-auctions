// Bids CRUD for MVP
import { supabase } from './supabase-auth-mvp';

export interface BidMVP {
  id?: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  created_at?: string;
  profiles?: {
    id: string;
    email: string;
    full_name: string;
  };
}

// ============================================
// CREATE BID (Place a bid on listing)
// ============================================
export async function createBidMVP(
  listingId: string,
  bidderId: string,
  amount: number
) {
  try {
    // 1. Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, seller_id, current_bid, status')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return { success: false, error: 'Listing not found' };
    }

    // 2. Validate: Bidder cannot bid on own listing
    if (listing.seller_id === bidderId) {
      return {
        success: false,
        error: 'You cannot bid on your own listing',
      };
    }

    // 3. Validate: Listing must be active
    if (listing.status !== 'active') {
      return {
        success: false,
        error: 'This listing is not active',
      };
    }

    // 4. Validate: Bid amount must be higher than current bid
    if (amount <= listing.current_bid) {
      return {
        success: false,
        error: `Bid must be higher than current bid (${listing.current_bid}€)`,
      };
    }

    // 5. Insert bid
    const { data: bidData, error: bidError } = await supabase
      .from('bids')
      .insert([
        {
          listing_id: listingId,
          bidder_id: bidderId,
          amount,
        },
      ])
      .select();

    if (bidError) {
      console.error('Bid creation error:', bidError);
      return { success: false, error: bidError.message };
    }

    // 6. Update listing current_bid
    const { error: updateError } = await supabase
      .from('listings')
      .update({ current_bid: amount })
      .eq('id', listingId);

    if (updateError) {
      console.error('Listing update error:', updateError);
      // Bid was created but listing update failed
      // Still return success as bid exists
    }

    return { success: true, data: bidData };
  } catch (err) {
    console.error('Exception creating bid:', err);
    return { success: false, error: String(err) };
  }
}

// ============================================
// GET BIDS FOR LISTING
// ============================================
export async function getBidsForListingMVP(listingId: string) {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select(
        `*,
        profiles:bidder_id(id, email, full_name)`
      )
      .eq('listing_id', listingId)
      .order('amount', { ascending: false });

    if (error) {
      console.error('Bids fetch error:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception fetching bids:', err);
    return { success: false, error: String(err), data: [] };
  }
}

// ============================================
// GET BIDS BY BIDDER
// ============================================
export async function getBidsByBidderMVP(bidderId: string) {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select(
        `*,
        listings:listing_id(id, brand, model, year, price, current_bid, status)
        `
      )
      .eq('bidder_id', bidderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Bidder bids fetch error:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception fetching bidder bids:', err);
    return { success: false, error: String(err), data: [] };
  }
}

// ============================================
// GET HIGHEST BID FOR LISTING
// ============================================
export async function getHighestBidMVP(listingId: string) {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select(
        `*,
        profiles:bidder_id(id, email, full_name)`
      )
      .eq('listing_id', listingId)
      .order('amount', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') {
      // No bids found
      return { success: true, data: null };
    }

    if (error) {
      console.error('Highest bid fetch error:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception fetching highest bid:', err);
    return { success: false, error: String(err), data: null };
  }
}

// ============================================
// GET BID COUNT FOR LISTING
// ============================================
export async function getBidCountMVP(listingId: string) {
  try {
    const { count, error } = await supabase
      .from('bids')
      .select('id', { count: 'exact' })
      .eq('listing_id', listingId);

    if (error) {
      return { success: false, error: error.message, count: 0 };
    }

    return { success: true, count: count || 0 };
  } catch (err) {
    return { success: false, error: String(err), count: 0 };
  }
}
