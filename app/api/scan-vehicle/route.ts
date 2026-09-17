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
  'CD789EF': {
    brand: 'BMW',
    model: 'M5',
    year: 2023,
    fuelType: 'petrol',
    fiscalPower: 15,
    engineRef: '4.4L Twin-Turbo',
    color: 'Blanc',
    mileage: 12000,
  },
  'GH012IJ': {
    brand: 'Mercedes',
    model: 'C63 AMG',
    year: 2021,
    fuelType: 'petrol',
    fiscalPower: 13,
    engineRef: '4.0L BiTurbo',
    color: 'Argent',
    mileage: 35000,
  },
  'KL345MN': {
    brand: 'Lamborghini',
    model: 'Huracán',
    year: 2020,
    fuelType: 'petrol',
    fiscalPower: 18,
    engineRef: '5.2L V10',
    color: 'Jaune',
    mileage: 8500,
  },
  'OP678QR': {
    brand: 'Ferrari',
    model: 'F8 Tributo',
    year: 2022,
    fuelType: 'petrol',
    fiscalPower: 17,
    engineRef: '3.9L Twin-Turbo',
    color: 'Rouge',
    mileage: 5000,
  },
  'ST901UV': {
    brand: 'Audi',
    model: 'RS6 Avant',
    year: 2021,
    fuelType: 'petrol',
    fiscalPower: 14,
    engineRef: '4.0L Twin-Turbo',
    color: 'Gris Titane',
    mileage: 28000,
  },
  'WX234YZ': {
    brand: 'Tesla',
    model: 'Model S',
    year: 2023,
    fuelType: 'electric',
    fiscalPower: 0,
    engineRef: 'Dual Motor',
    color: 'Noir Uniforme',
    mileage: 3000,
  },
  'AB567CD': {
    brand: 'Rolls-Royce',
    model: 'Ghost',
    year: 2021,
    fuelType: 'petrol',
    fiscalPower: 16,
    engineRef: '6.75L Twin-Turbo',
    color: 'Noir',
    mileage: 15000,
  },
  'EF890GH': {
    brand: 'Bentley',
    model: 'Continental GT',
    year: 2022,
    fuelType: 'petrol',
    fiscalPower: 15,
    engineRef: '6.0L Twin-Turbo',
    color: 'Bleu Océan',
    mileage: 8000,
  },
  'IJ123KL': {
    brand: 'Range Rover',
    model: 'Sport',
    year: 2023,
    fuelType: 'petrol',
    fiscalPower: 11,
    engineRef: '3.0L V6',
    color: 'Noir Metallic',
    mileage: 2000,
  },
  'MN456OP': {
    brand: 'Jaguar',
    model: 'F-Type',
    year: 2021,
    fuelType: 'petrol',
    fiscalPower: 11,
    engineRef: '3.0L V6 Superchargé',
    color: 'Gris British Racing',
    mileage: 22000,
  },
  'QR789ST': {
    brand: 'Aston Martin',
    model: 'DB11',
    year: 2020,
    fuelType: 'petrol',
    fiscalPower: 14,
    engineRef: '5.2L Twin-Turbo V12',
    color: 'Noir Profond',
    mileage: 18000,
  },
  'UV012WX': {
    brand: 'Bugatti',
    model: 'Chiron',
    year: 2021,
    fuelType: 'petrol',
    fiscalPower: 20,
    engineRef: '8.0L Quad-Turbo W16',
    color: 'Bleu Royal',
    mileage: 1200,
  },
  'YZ345AB': {
    brand: 'Porsche',
    model: '911 Turbo',
    year: 2022,
    fuelType: 'petrol',
    fiscalPower: 14,
    engineRef: '3.8L Twin-Turbo',
    color: 'Orange Papaya',
    mileage: 6000,
  },
  'CD678EF': {
    brand: 'Peugeot',
    model: '3008',
    year: 2021,
    fuelType: 'diesel',
    fiscalPower: 8,
    engineRef: '2.0L TDI',
    color: 'Blanc',
    mileage: 45000,
  },
  'GH901IJ': {
    brand: 'Renault',
    model: 'Espace',
    year: 2020,
    fuelType: 'petrol',
    fiscalPower: 7,
    engineRef: '1.6L Turbo',
    color: 'Gris',
    mileage: 78000,
  },
  'KL234MN': {
    brand: 'Citroën',
    model: 'C5 Aircross',
    year: 2022,
    fuelType: 'diesel',
    fiscalPower: 8,
    engineRef: '2.0L BlueHDi',
    color: 'Noir Obsidien',
    mileage: 22000,
  },
  'OP567QR': {
    brand: 'Volkswagen',
    model: 'Touareg',
    year: 2023,
    fuelType: 'diesel',
    fiscalPower: 9,
    engineRef: '3.0L TDI',
    color: 'Argent',
    mileage: 5000,
  },
  'ST890UV': {
    brand: 'Toyota',
    model: 'Supra',
    year: 2021,
    fuelType: 'petrol',
    fiscalPower: 11,
    engineRef: '3.0L Twin-Turbo',
    color: 'Bleu Électrique',
    mileage: 15000,
  },
  'WX123YZ': {
    brand: 'Honda',
    model: 'NSX',
    year: 2020,
    fuelType: 'hybrid',
    fiscalPower: 12,
    engineRef: '3.5L Twin-Turbo Hybrid',
    color: 'Bleu Foncé',
    mileage: 8000,
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
