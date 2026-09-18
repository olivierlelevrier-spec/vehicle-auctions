'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const announcementId = searchParams.get('announcementId');
  const buyerAmount = searchParams.get('buyerAmount') || '0';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const commission = 50000; // 500 euros en centimes

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementId,
          buyerAmount: parseInt(buyerAmount),
          commission: commission / 100,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Payment failed');
        setLoading(false);
        return;
      }

      // In production, redirect to Stripe: window.location.href = data.session.checkoutUrl;
      // For demo, simulate success
      router.push(`/payment/success?session_id=${data.session.id}`);
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      {/* Nav */}
      <nav className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">🚗 VehicleAuctions</Link>
          <Link href="/browse"><Button className="bg-slate-700 hover:bg-slate-600">← Back</Button></Link>
        </div>
      </nav>

      {/* Payment */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">💳 Paiement de Commission</h1>
            <p className="text-slate-300">Veuillez payer la commission de plateforme</p>
          </div>

          {/* Amount Details */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Montant du bien vendu</span>
              <span className="text-white font-semibold">€{parseInt(buyerAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-3">
              <span className="text-slate-300">Commission plateforme (5%)</span>
              <span className="text-white font-semibold">€{(commission / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-3 text-lg">
              <span className="text-white font-bold">Total à payer</span>
              <span className="text-green-400 font-bold">€{(commission / 100).toLocaleString()}</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              ℹ️ La commission couvre les frais de transaction, de plateforme et de support client.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Méthodes de paiement</h3>
            <div className="space-y-2">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
              >
                {loading ? '⏳ Traitement...' : '💳 Payer avec Stripe'}
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700 py-3"
              >
                🏦 Virement bancaire
              </Button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              🔒 Paiement sécurisé avec encryption SSL. Vos données sont protégées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center"><p className="text-white">Chargement...</p></div>}>
      <PaymentContent />
    </Suspense>
  );
}
