'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MVPListingDetail() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingRes = await fetch(`/api/listings-mvp/${id}`);
        const listingData = await listingRes.json();

        if (listingData.success) {
          setListing(listingData.data);
        }

        const bidsRes = await fetch(`/api/bids-mvp?listing_id=${id}`);
        const bidsData = await bidsRes.json();

        if (bidsData.success) {
          setBids(bidsData.data || []);
        }

        setLoading(false);
      } catch (err) {
        setError('Erreur au chargement');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBid = async () => {
    if (!bidAmount) {
      alert('Entrez un montant');
      return;
    }

    try {
      const response = await fetch('/api/bids-mvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: id,
          amount: parseInt(bidAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Erreur: ' + data.error);
        return;
      }

      alert('✅ Enchère placée!');
      setBidAmount('');
      // Reload bids
      const bidsRes = await fetch(`/api/bids-mvp?listing_id=${id}`);
      const bidsData = await bidsRes.json();
      if (bidsData.success) {
        setBids(bidsData.data || []);
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;
  if (!listing) return <div className="text-white p-8">Annonce non trouvée</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      <nav className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/mvp/browse" className="text-blue-400 hover:text-blue-300">← Retour</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {listing.brand} {listing.model} ({listing.year})
          </h1>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Prix départ</p>
                <p className="text-3xl font-bold text-white">{listing.price.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Enchère actuelle</p>
                <p className="text-3xl font-bold text-green-400">{listing.current_bid.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Description</p>
                <p className="text-white">{listing.description || 'Aucune description'}</p>
              </div>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Placer une enchère</h2>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-4 py-2"
                placeholder="Montant (€)"
                min={listing.current_bid + 1}
              />
              <Button
                onClick={handleBid}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Enchérir
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Historique des enchères ({bids.length})</h2>
            <div className="space-y-2">
              {bids.map((bid, idx) => (
                <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded p-4 flex justify-between">
                  <span className="text-white">{bid.profiles?.full_name || 'Anonyme'}</span>
                  <span className="text-green-400 font-bold">{bid.amount.toLocaleString()}€</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
