'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image?: string;
  bids: number;
  endTime: string;
}

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    brand: 'Porsche',
    model: 'Cayenne',
    year: 2022,
    price: 85000,
    mileage: 45000,
    bids: 12,
    endTime: '2026-09-18 14:00',
  },
  {
    id: '2',
    brand: 'Mercedes',
    model: 'C63 AMG',
    year: 2021,
    price: 65000,
    mileage: 35000,
    bids: 8,
    endTime: '2026-09-19 10:00',
  },
  {
    id: '3',
    brand: 'BMW',
    model: 'M5',
    year: 2023,
    price: 95000,
    mileage: 12000,
    bids: 15,
    endTime: '2026-09-17 18:00',
  },
  {
    id: '4',
    brand: 'Lamborghini',
    model: 'Huracán',
    year: 2020,
    price: 220000,
    mileage: 8500,
    bids: 24,
    endTime: '2026-09-20 20:00',
  },
  {
    id: '5',
    brand: 'Tesla',
    model: 'Model S',
    year: 2023,
    price: 75000,
    mileage: 3000,
    bids: 18,
    endTime: '2026-09-18 16:00',
  },
  {
    id: '6',
    brand: 'Audi',
    model: 'RS6 Avant',
    year: 2021,
    price: 78000,
    mileage: 28000,
    bids: 11,
    endTime: '2026-09-19 12:00',
  },
];

export default function Browse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300">
            🚗 VehicleAuctions
          </Link>
          <div className="space-x-4">
            <Link href="/sell">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Je veux vendre
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            🏎️ Enchères en cours
          </h1>
          <p className="text-xl text-slate-300">
            Découvrez nos véhicules en vente aux enchères. Les meilleurs prix du marché!
          </p>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VEHICLES.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition group cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-5xl">
                🚗
              </div>

              {/* Info */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {vehicle.year} • {vehicle.mileage.toLocaleString()}km
                  </p>
                </div>

                {/* Price */}
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-sm text-slate-400">Prix actuel</p>
                  <p className="text-2xl font-bold text-green-400">
                    €{vehicle.price.toLocaleString()}
                  </p>
                </div>

                {/* Bids */}
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-sm text-slate-400">
                    💬 {vehicle.bids} enchères • Fin: {vehicle.endTime}
                  </p>
                </div>

                {/* Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                  Faire une enchère
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center mt-12 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6">
          Tu as un véhicule à vendre?
        </h2>
        <Link href="/sell">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
            Déposer une annonce maintenant
          </Button>
        </Link>
      </section>
    </div>
  );
}
