import { NextRequest, NextResponse } from 'next/server';
import { saveAnnouncement } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await saveAnnouncement({
      licensePlate: body.licensePlate,
      brand: body.brand,
      model: body.model,
      fuelType: body.fuelType,
      engineRef: body.engineRef,
      fiscalPower: body.fiscalPower,
      mileage: body.mileage,
      price: body.price,
      description: body.description,
      color: body.color,
      warrantyProvider: body.warrantyProvider,
      warrantyFormula: body.warrantyFormula,
      name: body.name,
      email: body.email,
      phone: body.phone,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de l\'annonce' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email requis' },
      { status: 400 }
    );
  }

  try {
    const { getAnnouncementsByEmail } = await import('@/lib/supabase');
    const result = await getAnnouncementsByEmail(email);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
      { status: 500 }
    );
  }
}
