'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAnnouncements } from '@/lib/supabase';

export default function Browse() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const result = await getAnnouncements(50);
    if (result.success && result.data) {
      setAnnouncements(result.data);
    }
    setLoading(false);
  };

  const filtered = announcements.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'luxury') return v.price > 100000;
    if (filter === 'sports') return ['M5', 'Cayenne', 'RS6', 'Model S'].includes(v.model);
    if (filter === 'electric') return v.fuel_type === 'Électrique';
    return true;
  });

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
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              🏎️ Enchères en cours
            </h1>
            <p className="text-xl text-slate-300">
              Découvrez nos véhicules en vente aux enchères. Les meilleurs prix du marché!
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', label: 'Tous les véhicules' },
              { id: 'luxury', label: 'Luxe (€100k+)' },
              { id: 'sports', label: 'Sports' },
              { id: 'electric', label: 'Électriques' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  filter === f.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center text-slate-300 py-12">Chargement des annonces...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-300 py-12">Aucune annonce trouvée</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle) => (
              <Link key={vehicle.id} href={`/listings/${vehicle.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition group cursor-pointer h-full">
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
                        {vehicle.year} • {vehicle.mileage?.toLocaleString() || 0}km
                      </p>
                    </div>

                    {/* Price */}
                    <div className="border-t border-slate-700 pt-3">
                      <p className="text-sm text-slate-400">Enchère actuelle</p>
                      <p className="text-2xl font-bold text-green-400">
                        €{(vehicle.current_bid || vehicle.price)?.toLocaleString() || 0}
                      </p>
                    </div>

                    {/* Bids */}
                    <div className="bg-slate-900/50 p-3 rounded">
                      <p className="text-sm text-slate-400">
                        💬 {vehicle.bid_count || 0} enchères
                      </p>
                    </div>

                    {/* Button */}
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Enchérir →
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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
