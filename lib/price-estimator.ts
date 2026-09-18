// Price estimation logic using vehicle data
// Uses heuristic pricing model based on typical French used car market

interface VehicleForEstimate {
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  mileage: number;
  fiscalPower: number;
}

// Base prices for popular vehicle segments (in euros)
const BRAND_BASE_PRICES: Record<string, number> = {
  // Luxury
  'Porsche': 45000,
  'Maserati': 35000,
  'Ferrari': 150000,
  'Lamborghini': 120000,
  'Bugatti': 500000,
  'Bentley': 60000,
  'Rolls-Royce': 200000,
  'Aston Martin': 80000,

  // Premium
  'BMW': 28000,
  'Mercedes': 32000,
  'Audi': 25000,
  'Jaguar': 22000,
  'Land Rover': 20000,
  'Volvo': 18000,

  // Mid-range
  'Volkswagen': 15000,
  'Peugeot': 12000,
  'Renault': 11000,
  'Citroën': 10000,
  'Fiat': 9000,
  'Alfa Romeo': 14000,
  'SEAT': 11000,
  'Skoda': 12000,

  // Japanese
  'Toyota': 16000,
  'Honda': 15000,
  'Mazda': 13000,
  'Nissan': 14000,
  'Subaru': 17000,
  'Mitsubishi': 12000,
  'Suzuki': 10000,
  'Hyundai': 10000,
  'Kia': 11000,

  // American
  'Ford': 13000,
  'Chevrolet': 14000,
  'Dodge': 12000,
  'Jeep': 16000,

  // Electric
  'Tesla': 35000,
  'BYD': 18000,
  'Geely': 12000,
  'Great Wall': 11000,
};

export function estimateVehiclePrice(vehicle: VehicleForEstimate) {
  const currentYear = 2026;
  const vehicleAge = currentYear - vehicle.year;

  // Base price for brand/segment
  let basePrice = BRAND_BASE_PRICES[vehicle.brand] || 15000;

  // Depreciation based on age (year-on-year)
  const depreciationFactor = Math.pow(0.85, Math.max(0, vehicleAge - 1));
  let estimatedPrice = basePrice * depreciationFactor;

  // Mileage adjustment (0.05€ per km, capped at 150k km reference)
  const mileageDeduction = Math.min(vehicle.mileage * 0.05, vehicle.mileage * 0.08);
  estimatedPrice -= mileageDeduction;

  // Fuel type modifier
  const fuelModifiers: Record<string, number> = {
    'Essence': 1.0,
    'Diesel': 1.05,
    'Électrique': 1.4,
    'Hybride': 1.2,
    'Hybride rechargeable': 1.25,
    'Gaz': 0.9,
  };
  const fuelMod = fuelModifiers[vehicle.fuelType] || 1.0;
  estimatedPrice *= fuelMod;

  // Power modifier (fiscal horsepower)
  const powerBonus = vehicle.fiscalPower > 7 ? (vehicle.fiscalPower - 7) * 500 : 0;
  estimatedPrice += powerBonus;

  // Ensure minimum price
  const minPrice = basePrice * 0.3;
  const maxPrice = basePrice * 1.8;
  estimatedPrice = Math.max(minPrice, Math.min(estimatedPrice, maxPrice));

  // Calculate low/high estimates (±15%)
  const lowEstimate = Math.round(estimatedPrice * 0.85);
  const highEstimate = Math.round(estimatedPrice * 1.15);
  const midEstimate = Math.round(estimatedPrice);

  return {
    lowEstimate,
    midEstimate,
    highEstimate,
    factors: {
      brand: basePrice,
      depreciation: depreciationFactor,
      mileage: mileageDeduction,
      fuelType: fuelMod,
      power: powerBonus,
      vehicleAge,
    },
  };
}
