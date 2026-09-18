import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { vin, licensePlate } = await request.json();

    if (!vin && !licensePlate) {
      return NextResponse.json(
        { error: 'VIN ou plaque d\'immatriculation requise' },
        { status: 400 }
      );
    }

    // TODO: Intégrer avec Full Car History API
    // Pour l'instant, mock de données enrichies
    const vehicleHistory = {
      brand: 'Ferrari',
      model: 'F360',
      year: 2000,
      mileage: 75000,
      color: 'Rosso Corsa',
      fuelType: 'Essence',
      engineRef: '3.6L V8',
      fiscalPower: 15,
      transmission: 'Manual',
      owners: 2,
      lastMaintenance: '2024-06-15',
      accidents: 0,
      serviceHistory: 'Complet',
      condition: 'Très bon',
      price: 51000,
    };

    return NextResponse.json(vehicleHistory);
  } catch (error) {
    console.error('Vehicle history error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    );
  }
}
