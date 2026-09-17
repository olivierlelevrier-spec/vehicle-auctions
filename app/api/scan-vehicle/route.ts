import { NextRequest, NextResponse } from 'next/server';

// Mock Histovec data - en production, appeler l'API réelle
const mockHistovecData: Record<string, any> = {
  'AB123CD': {
    brand: 'Porsche',
    model: 'Cayenne',
    year: 2022,
    fuelType: 'petrol',
    fiscalPower: 12,
    engineRef: '3.0L V6',
    color: 'Noir',
    mileage: 45000,
  },
  'EF456GH': {
    brand: 'Maserati',
    model: 'Ghibli',
    year: 2021,
    fuelType: 'diesel',
    fiscalPower: 10,
    engineRef: '3.0 TDI',
    color: 'Gris',
    mileage: 62000,
  },
};

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get('plate')?.toUpperCase();

  if (!plate) {
    return NextResponse.json(
      { error: 'Plaque d\'immatriculation requise' },
      { status: 400 }
    );
  }

  try {
    // En production: appeler l'API Histovec réelle
    // const response = await fetch(`https://histovec.gouv.fr/api/v1/vehicle/${plate}`, {
    //   headers: { 'Authorization': `Bearer ${process.env.HISTOVEC_API_KEY}` }
    // });

    // Pour MVP: utiliser les données mockées
    const data = mockHistovecData[plate];

    if (!data) {
      return NextResponse.json(
        {
          error: 'Véhicule non trouvé',
          suggestion: 'Essayez: AB123CD ou EF456GH (données de test)'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur scan véhicule:', error);
    return NextResponse.json(
      { error: 'Erreur lors du scan du véhicule' },
      { status: 500 }
    );
  }
}
