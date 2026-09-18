import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const vehicleData = await request.json();

    // Validate required fields
    if (!vehicleData.brand || !vehicleData.model || !vehicleData.year || !vehicleData.price) {
      return NextResponse.json(
        { error: 'Marque, modèle, année et prix requis' },
        { status: 400 }
      );
    }

    // TODO: Store in Supabase table `auto1_market_data`
    const storedData = {
      id: crypto.randomUUID(),
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      mileage: vehicleData.mileage || 0,
      price: vehicleData.price,
      color: vehicleData.color,
      fuelType: vehicleData.fuelType,
      transmission: vehicleData.transmission,
      enginePower: vehicleData.enginePower,
      listingUrl: vehicleData.listingUrl,
      source: 'auto1',
      scrapedAt: new Date(),
      createdAt: new Date(),
    };

    console.log('Auto1 market data received:', storedData);

    // In production: await supabase.from('auto1_market_data').insert([storedData]);

    return NextResponse.json({
      success: true,
      data: storedData,
      message: `${vehicleData.brand} ${vehicleData.model} sauvegardé - €${vehicleData.price}`,
    });
  } catch (error) {
    console.error('Market data error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des données marché' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve market data for estimation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');

    if (!brand || !model) {
      return NextResponse.json(
        { error: 'Marque et modèle requis' },
        { status: 400 }
      );
    }

    // TODO: Query Supabase for similar vehicles
    // SELECT * FROM auto1_market_data
    // WHERE brand = ? AND model = ?
    // ORDER BY scraped_at DESC

    return NextResponse.json({
      brand,
      model,
      marketData: [],
      avgPrice: 0,
      priceRange: [0, 0],
    });
  } catch (error) {
    console.error('Market data GET error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
