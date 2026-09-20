'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Listing {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  current_bid: number;
  status: string;
  created_at: string;
}

export default function MVPBrowse() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings-mvp');
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Erreur au chargement');
          setLoading(false);
          return;
        }

        setListings(data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Erreur réseau');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      <nav className="border-b border-slate-700 bg-slate-900/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/mvp" className="text-2xl font-bold text-white">🚗 MVP</Link>
          <div className="space-x-4">
            <Link href="/mvp/sell"><Button className="bg-blue-600">Publier</Button></Link>
            <Link href="/mvp/logout"><Button className="bg-red-600">Déconnexion</Button></Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">🏎️ Enchères en cours</h1>

        {error && <div className="text-red-400 mb-6">{error}</div>}
        {loading && <div className="text-slate-300">Chargement...</div>}

        {listings.length === 0 && !loading && (
          <div className="text-center text-slate-400">
            <p>Aucune annonce trouvée</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <Link key={listing.id} href={`/mvp/listings/${listing.id}`}>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:border-blue-500 cursor-pointer transition">
                <h3 className="text-xl font-bold text-white">
                  {listing.brand} {listing.model}
                </h3>
                <p className="text-slate-400 text-sm">{listing.year}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Prix départ:</span>
                    <span className="text-blue-400 font-bold">{listing.price.toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Enchère actuelle:</span>
                    <span className="text-green-400 font-bold">{listing.current_bid.toLocaleString()}€</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
