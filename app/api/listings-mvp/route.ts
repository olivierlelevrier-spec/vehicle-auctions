// MVP: Listings API (Browse + Create)
import { NextRequest, NextResponse } from 'next/server';
import {
  getActiveListingsMVP,
  createListingMVP,
  getSellerListingsMVP,
} from '@/lib/listings-mvp';
import { getCurrentUserMVP } from '@/lib/supabase-auth-mvp';

// GET: Browse active listings or get seller's listings
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sellerId = url.searchParams.get('seller_id');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (sellerId) {
      // Get seller's listings
      const result = await getSellerListingsMVP(sellerId);
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

    // Get active listings (browse)
    const result = await getActiveListingsMVP(limit, offset);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create new listing
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUserMVP();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Create listing
    const result = await createListingMVP(user.id, {
      brand: body.brand,
      model: body.model,
      year: body.year,
      license_plate: body.license_plate,
      fuel_type: body.fuel_type,
      mileage: body.mileage,
      engine_ref: body.engine_ref,
      fiscal_power: body.fiscal_power,
      color: body.color,
      price: body.price,
      description: body.description,
      status: 'active',
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Listing created successfully',
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
