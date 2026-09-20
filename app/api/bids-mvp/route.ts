// MVP: Bids API
import { NextRequest, NextResponse } from 'next/server';
import {
  createBidMVP,
  getBidsForListingMVP,
  getBidsByBidderMVP,
  getHighestBidMVP,
} from '@/lib/bids-mvp';
import { getCurrentUserMVP } from '@/lib/supabase-auth-mvp';

// GET: Get bids (for listing or by bidder)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const listingId = url.searchParams.get('listing_id');
    const bidderId = url.searchParams.get('bidder_id');
    const highest = url.searchParams.get('highest') === 'true';

    if (listingId && highest) {
      // Get highest bid for listing
      const result = await getHighestBidMVP(listingId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }

    if (listingId) {
      // Get all bids for listing
      const result = await getBidsForListingMVP(listingId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }

    if (bidderId) {
      // Get bids by bidder
      const result = await getBidsByBidderMVP(bidderId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }

    return NextResponse.json(
      { error: 'Missing listing_id or bidder_id parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Get bids error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create new bid
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserMVP();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { listing_id, amount } = await request.json();

    if (!listing_id || !amount) {
      return NextResponse.json(
        { error: 'listing_id and amount are required' },
        { status: 400 }
      );
    }

    const result = await createBidMVP(listing_id, user.id, amount);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bid placed successfully',
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create bid error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
