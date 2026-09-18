import { estimateVehiclePrice } from '@/lib/price-estimator';

export async function POST(request: Request) {
  try {
    const vehicle = await request.json();

    if (!vehicle.brand || !vehicle.model || !vehicle.year || !vehicle.mileage) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const estimation = estimateVehiclePrice({
      brand: vehicle.brand,
      model: vehicle.model,
      year: parseInt(vehicle.year),
      fuelType: vehicle.fuelType || 'Essence',
      mileage: parseInt(vehicle.mileage) || 0,
      fiscalPower: parseInt(vehicle.fiscalPower) || 6,
    });

    return Response.json(estimation);
  } catch (error) {
    console.error('Price estimation error:', error);
    return Response.json(
      { error: 'Failed to estimate price' },
      { status: 500 }
    );
  }
}
