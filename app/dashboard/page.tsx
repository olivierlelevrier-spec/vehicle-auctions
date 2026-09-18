'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Announcement {
  id: string;
  brand: string;
  model: string;
  price: number;
  mileage: number;
  status: string;
  bid_count: number;
  current_bid: number;
  created_at: string;
}

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAnnouncements = async () => {
    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/announcements?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors du chargement');
        return;
      }

      setAnnouncements(data.data || []);
    } catch (err) {
      setError('Erreur réseau: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      {/* Nav */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300">
            🚗 VehicleAuctions
          </Link>
          <div className="space-x-4">
            <Link href="/sell">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Déposer annonce
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Search */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-6">📊 Dashboard Vendeur</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email du vendeur
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                  <Button
                    onClick={loadAnnouncements}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-8 py-3"
                  >
                    {loading ? '⏳ Chargement...' : '🔍 Chercher'}
                  </Button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>
            </div>
          </div>

          {/* Announcements */}
          {announcements.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Mes annonces ({announcements.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition"
                  >
                    {/* Image Placeholder */}
                    <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-5xl">
                      🚗
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {ann.brand} {ann.model}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {ann.mileage.toLocaleString()}km
                        </p>
                      </div>

                      {/* Status */}
                      <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Statut:</span>
                          <span className={`text-sm font-semibold ${
                            ann.status === 'active' ? 'text-green-400' : 'text-slate-400'
                          }`}>
                            {ann.status === 'active' ? '🟢 Actif' : '⚪ ' + ann.status}
                          </span>
                        </div>
                      </div>

                      {/* Price & Bids */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-900/50 p-3 rounded">
                          <p className="text-xs text-slate-400">Prix de départ</p>
                          <p className="text-lg font-bold text-green-400">
                            €{ann.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded">
                          <p className="text-xs text-slate-400">Enchères</p>
                          <p className="text-lg font-bold text-blue-400">
                            {ann.bid_count} 💬
                          </p>
                        </div>
                      </div>

                      {/* Current Bid */}
                      {ann.current_bid > 0 && (
                        <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded">
                          <p className="text-xs text-blue-300">Enchère la plus haute</p>
                          <p className="text-lg font-bold text-blue-400">
                            €{ann.current_bid.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Date */}
                      <p className="text-xs text-slate-400">
                        📅 {new Date(ann.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {announcements.length === 0 && !loading && email && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-300">Aucune annonce trouvée pour cet email</p>
              <Link href="/sell" className="mt-4 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Créer une annonce
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
