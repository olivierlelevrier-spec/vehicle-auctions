import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Announcement {
  id?: string;
  licensePlate: string;
  brand: string;
  model: string;
  year?: number;
  fuelType: string;
  engineRef: string;
  fiscalPower: string;
  mileage: string;
  price: string;
  description: string;
  color?: string;
  warrantyProvider?: string;
  warrantyFormula?: string;
  name: string;
  email: string;
  phone: string;
  status?: 'active' | 'sold' | 'draft';
  createdAt?: string;
  startingBid?: number;
  currentBid?: number;
  bidCount?: number;
}

export async function saveAnnouncement(data: Announcement) {
  try {
    const { data: result, error } = await supabase
      .from('announcements')
      .insert([
        {
          license_plate: data.licensePlate,
          brand: data.brand,
          model: data.model,
          year: data.year,
          fuel_type: data.fuelType,
          engine_ref: data.engineRef,
          fiscal_power: data.fiscalPower,
          mileage: parseInt(data.mileage) || 0,
          price: parseInt(data.price) || 0,
          description: data.description,
          color: data.color,
          warranty_provider: data.warrantyProvider,
          warranty_formula: data.warrantyFormula,
          seller_name: data.name,
          seller_email: data.email,
          seller_phone: data.phone,
          status: 'active',
          starting_bid: parseInt(data.price) || 0,
        },
      ])
      .select();

    if (error) {
      console.error('Error saving announcement:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Exception saving announcement:', error);
    return { success: false, error: String(error) };
  }
}

export async function getAnnouncements(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching announcements:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching announcements:', error);
    return { success: false, error: String(error) };
  }
}

export async function getAnnouncementsByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('seller_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller announcements:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching seller announcements:', error);
    return { success: false, error: String(error) };
  }
}

export async function getAnnouncementById(id: string) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching announcement:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching announcement:', error);
    return { success: false, error: String(error), data: null };
  }
}

export async function placeBid(announcementId: string, bidAmount: number, bidderEmail: string, bidderName: string) {
  try {
    // Get current announcement
    const { data: announcement, error: annError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .single();

    if (annError || !announcement) {
      return { success: false, error: 'Announcement not found' };
    }

    // Check if bid is higher than current
    if (bidAmount <= (announcement.current_bid || announcement.starting_bid || 0)) {
      return { success: false, error: 'Bid must be higher than current bid' };
    }

    // Insert bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert([
        {
          announcement_id: announcementId,
          amount: bidAmount,
          bidder_email: bidderEmail,
          bidder_name: bidderName,
        },
      ])
      .select();

    if (bidError) {
      console.error('Error placing bid:', bidError);
      return { success: false, error: bidError.message };
    }

    // Update announcement with new bid
    const { error: updateError } = await supabase
      .from('announcements')
      .update({
        current_bid: bidAmount,
        bid_count: (announcement.bid_count || 0) + 1,
      })
      .eq('id', announcementId);

    if (updateError) {
      console.error('Error updating announcement:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true, data: bid };
  } catch (error) {
    console.error('Exception placing bid:', error);
    return { success: false, error: String(error) };
  }
}

export async function getBidsForAnnouncement(announcementId: string) {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('announcement_id', announcementId)
      .order('amount', { ascending: false });

    if (error) {
      console.error('Error fetching bids:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Exception fetching bids:', error);
    return { success: false, error: String(error), data: [] };
  }
}

export async function updateAnnouncementStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating announcement status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception updating announcement status:', error);
    return { success: false, error: String(error) };
  }
}
