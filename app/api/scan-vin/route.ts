import { NextRequest, NextResponse } from 'next/server';
import { decodeVIN, isValidVIN } from '@/lib/vin-decoder';

export async function GET(request: NextRequest) {
  const vin = request.nextUrl.searchParams.get('vin')?.toUpperCase();

  if (!vin) {
    return NextResponse.json(
      { error: 'VIN requis' },
      { status: 400 }
    );
  }

  try {
    // Validate VIN format
    if (!isValidVIN(vin)) {
      return NextResponse.json(
        {
          error: 'VIN invalide',
          suggestion: 'Format: 17 caractères alphanumériques (sans I, O, Q). Ex: WVWZZZ3CZ9E123456'
        },
        { status: 400 }
      );
    }

    // Decode VIN
    const vinData = decodeVIN(vin);

    // Return decoded data
    return NextResponse.json({
      vin,
      brand: vinData.brand,
      model: vinData.model,
      year: vinData.year,
      countryOfOrigin: vinData.countryOfOrigin,
      message: vinData.message || `✅ VIN décodé: ${vinData.brand} ${vinData.model} (${vinData.year})`
    });
  } catch (error) {
    console.error('Erreur scan VIN:', error);
    return NextResponse.json(
      { error: 'Erreur lors du scan du VIN' },
      { status: 500 }
    );
  }
}
