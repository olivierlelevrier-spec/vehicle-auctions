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

  // Special handling for classic/collectible models
  const classicModels = ['F360', 'F430', 'F355', '911', 'Testarossa', '250'];
  const isClassic = classicModels.some(m => vehicle.model.includes(m));

  // Depreciation: softer curve for luxury cars, even softer for classics
  let depreciationFactor: number;
  if (isClassic && vehicleAge > 15) {
    // Classic cars stabilize in value
    depreciationFactor = Math.pow(0.92, Math.min(vehicleAge - 1, 15)) * 0.95;
  } else if (vehicleAge > 10) {
    // Older luxury cars: slower depreciation
    depreciationFactor = Math.pow(0.88, 9) * Math.pow(0.95, Math.max(0, vehicleAge - 10));
  } else {
    // Newer cars: standard depreciation
    depreciationFactor = Math.pow(0.88, Math.max(0, vehicleAge - 1));
  }

  let estimatedPrice = basePrice * depreciationFactor;

  // Mileage adjustment (progressive: less per km for luxury cars)
  const mileageRate = basePrice > 50000 ? 0.015 : 0.05; // Lower rate for luxury
  const mileageDeduction = vehicle.mileage * mileageRate;
  estimatedPrice -= mileageDeduction;

  // Fuel type modifier
  const fuelModifiers: Record<string, number> = {
    'Essence': 1.0,
    'Diesel': 1.05,
    'Électrique': 1.4,
    'Hybride': 1.2,
    'Hybride rechargeable': 1.25,
    'Gaz': 0.9,
    'petrol': 1.0,
    'diesel': 1.05,
    'electric': 1.4,
    'hybrid': 1.2,
    'phev': 1.25,
  };
  const fuelMod = fuelModifiers[vehicle.fuelType] || 1.0;
  estimatedPrice *= fuelMod;

  // Power modifier (fiscal horsepower) - bonus for high-power vehicles
  const powerBonus = vehicle.fiscalPower > 7 ? (vehicle.fiscalPower - 7) * 800 : 0;
  estimatedPrice += powerBonus;

  // Classic model bonus (they hold value better)
  if (isClassic) {
    estimatedPrice *= 1.15;
  }

  // Ensure realistic bounds
  const minPrice = basePrice * 0.2;
  const maxPrice = basePrice * 2.5;
  estimatedPrice = Math.max(minPrice, Math.min(estimatedPrice, maxPrice));

  // Calculate low/high estimates (±20% for luxury, ±15% for regular)
  const margin = basePrice > 50000 ? 0.2 : 0.15;
  const lowEstimate = Math.round(estimatedPrice * (1 - margin));
  const highEstimate = Math.round(estimatedPrice * (1 + margin));
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
      isClassic,
    },
  };
}
