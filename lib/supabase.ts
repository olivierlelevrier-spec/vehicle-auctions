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

export async function placeBid(announcementId: string, bidAmount: number, bidderEmail: string) {
  try {
    const { data, error } = await supabase
      .from('bids')
      .insert([
        {
          announcement_id: announcementId,
          amount: bidAmount,
          bidder_email: bidderEmail,
        },
      ]);

    if (error) {
      console.error('Error placing bid:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception placing bid:', error);
    return { success: false, error: String(error) };
  }
}
