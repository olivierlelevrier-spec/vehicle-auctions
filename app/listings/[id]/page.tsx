'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAnnouncementById, getBidsForAnnouncement, placeBid } from '@/lib/supabase';

export default function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [announcement, setAnnouncement] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [bidderEmail, setBidderEmail] = useState('');
  const [bidderName, setBidderName] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    const annResult = await getAnnouncementById(id);
    const bidsResult = await getBidsForAnnouncement(id);

    if (annResult.success && annResult.data) {
      setAnnouncement(annResult.data);
    }
    if (bidsResult.success) {
      setBids(bidsResult.data);
    }
    setLoading(false);
  };

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBidding(true);

    if (!bidderName || !bidderEmail || !bidAmount) {
      setError('All fields required');
      setBidding(false);
      return;
    }

    const result = await placeBid(id, parseInt(bidAmount), bidderEmail, bidderName);

    if (!result.success) {
      setError(result.error || 'Failed to place bid');
      setBidding(false);
      return;
    }

    // Send notification to seller
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: announcement.seller_email,
        subject: `New bid on ${announcement.brand} ${announcement.model}`,
        bidderName,
        bidAmount: parseInt(bidAmount),
        vehicleBrand: announcement.brand,
        vehicleModel: announcement.model,
      }),
    }).catch(() => {}); // Silently fail if email service unavailable

    setSuccess(`✅ Bid placed for €${bidAmount}!`);
    setBidAmount('');
    await loadData();
    setTimeout(() => setSuccess(''), 3000);
    setBidding(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  if (!announcement) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Not found</div>;

  const currentBid = announcement.current_bid || announcement.starting_bid || 0;
  const minBid = currentBid + 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      {/* Nav */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">🚗 VehicleAuctions</Link>
          <div className="space-x-4">
            <Link href="/browse">
              <Button className="bg-slate-700 hover:bg-slate-600">← Back</Button>
            </Link>
            <Link href="/sell">
              <Button className="bg-blue-600 hover:bg-blue-700">Sell</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Vehicle Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg h-96 flex items-center justify-center text-6xl">
              🚗
            </div>

            {/* Vehicle Details */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4">
              <h1 className="text-3xl font-bold text-white">
                {announcement.brand} {announcement.model}
              </h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Year</p>
                  <p className="text-white font-semibold">{announcement.year || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Mileage</p>
                  <p className="text-white font-semibold">{announcement.mileage?.toLocaleString() || 0} km</p>
                </div>
                <div>
                  <p className="text-slate-400">Fuel Type</p>
                  <p className="text-white font-semibold">{announcement.fuel_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Color</p>
                  <p className="text-white font-semibold">{announcement.color || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-slate-300">{announcement.description}</p>
            </div>

            {/* Warranty */}
            {announcement.warranty_provider && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                <h2 className="text-xl font-bold text-white mb-4">Warranty</h2>
                <p className="text-slate-300">
                  <strong>{announcement.warranty_provider}</strong> - {announcement.warranty_formula}
                </p>
              </div>
            )}

            {/* Bids */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h2 className="text-xl font-bold text-white mb-4">Bid History ({bids.length})</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bids.length === 0 ? (
                  <p className="text-slate-400">No bids yet</p>
                ) : (
                  bids.map((bid, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded flex justify-between">
                      <div>
                        <p className="text-white font-semibold">€{bid.amount?.toLocaleString() || 0}</p>
                        <p className="text-xs text-slate-400">{bid.bidder_name || bid.bidder_email}</p>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(bid.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Bidding */}
          <div className="space-y-6">
            {/* Current Bid */}
            <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-700 rounded-lg p-8">
              <p className="text-green-300 text-sm mb-2">Current Bid</p>
              <p className="text-4xl font-bold text-green-400 mb-4">€{currentBid.toLocaleString()}</p>
              <p className="text-sm text-green-300">{announcement.bid_count || 0} bids</p>
            </div>

            {/* Bid Form */}
            <form onSubmit={handleBid} className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4">
              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Your Name</label>
                <input
                  type="text"
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email</label>
                <input
                  type="email"
                  value={bidderEmail}
                  onChange={(e) => setBidderEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Bid Amount (€)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={minBid.toString()}
                  min={minBid}
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">Minimum: €{minBid.toLocaleString()}</p>
              </div>

              <Button
                type="submit"
                disabled={bidding}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 py-3 font-semibold"
              >
                {bidding ? '⏳ Placing Bid...' : '🔨 Place Bid'}
              </Button>
            </form>

            {/* Seller Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h3 className="text-lg font-bold text-white mb-4">Seller</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-400">Name:</span> <span className="text-white">{announcement.seller_name}</span></p>
                <p><span className="text-slate-400">Email:</span> <span className="text-white">{announcement.seller_email}</span></p>
                {announcement.seller_phone && (
                  <p><span className="text-slate-400">Phone:</span> <span className="text-white">{announcement.seller_phone}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
