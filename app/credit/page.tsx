'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CREDIT_PARTNERS, calculateMonthlyPayment } from '@/lib/credit-partners';

export default function CreditSimulator() {
  const [vehiclePrice, setVehiclePrice] = useState('15000');
  const [selectedPartner, setSelectedPartner] = useState(CREDIT_PARTNERS[0].id);
  const [selectedDuration, setSelectedDuration] = useState(36);

  const partner = CREDIT_PARTNERS.find((p) => p.id === selectedPartner)!;
  const offer = partner.offers.find((o) => o.duration === selectedDuration)!;
  const price = parseInt(vehiclePrice) || 0;
  const monthlyPayment = calculateMonthlyPayment(price, offer);
  const totalCost = monthlyPayment * selectedDuration;
  const interestCost = totalCost - price;

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
              <Button className="bg-blue-600 hover:bg-blue-700">Vendre</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Simulator */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">💳 Simulateur de Crédit Auto</h1>
            <p className="text-xl text-slate-300">
              Trouvez le meilleur financement pour votre véhicule
            </p>
          </div>

          {/* Inputs */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                💰 Prix du véhicule
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(e.target.value)}
                  className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="15000"
                />
                <span className="flex items-center text-white font-semibold">€</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Budget: {Math.round(price).toLocaleString()} €
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                🏦 Partenaire de crédit
              </label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                {CREDIT_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-2">{partner.description}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                ⏱️ Durée du crédit
              </label>
              <div className="grid grid-cols-4 gap-2">
                {partner.offers.map((offer) => (
                  <button
                    key={offer.duration}
                    onClick={() => setSelectedDuration(offer.duration)}
                    className={`p-3 rounded-lg border transition font-semibold ${
                      selectedDuration === offer.duration
                        ? 'border-blue-500 bg-blue-900/20 text-white'
                        : 'border-slate-600 bg-slate-900 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {offer.duration}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calculation */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">📊 Détails du crédit</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Prix du véhicule</span>
                  <span className="text-white font-semibold">{price.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Taux d'intérêt</span>
                  <span className="text-blue-400 font-semibold">{offer.interestRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Frais de dossier</span>
                  <span className="text-yellow-400 font-semibold">{offer.fee}%</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                  <span className="text-slate-300">Coût total des intérêts</span>
                  <span className="text-red-400 font-semibold">{interestCost.toLocaleString()} €</span>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mt-6">
                <p className="text-green-300 text-sm mb-1">Mensualité</p>
                <p className="text-3xl font-bold text-green-400">{monthlyPayment.toLocaleString()} €</p>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p className="text-blue-300 text-sm mb-1">Coût total sur {selectedDuration} mois</p>
                <p className="text-2xl font-bold text-blue-400">{totalCost.toLocaleString()} €</p>
              </div>
            </div>

            {/* Partner Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">📞 Contactez le partenaire</h2>

              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Partenaire</p>
                  <p className="text-white font-semibold text-lg">{partner.name}</p>
                </div>

                {partner.phone && (
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Téléphone</p>
                    <a href={`tel:${partner.phone}`} className="text-blue-400 hover:text-blue-300 font-semibold">
                      {partner.phone}
                    </a>
                  </div>
                )}

                {partner.email && (
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Email</p>
                    <a href={`mailto:${partner.email}`} className="text-blue-400 hover:text-blue-300 font-semibold">
                      {partner.email}
                    </a>
                  </div>
                )}

                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Website</p>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold break-all"
                  >
                    {partner.website}
                  </a>
                </div>

                <a href={partner.website} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">
                    💳 Demander une simulation
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
            <p className="text-blue-300">
              ℹ️ <strong>Conseil:</strong> Les taux affichés sont à titre informatif. Contactez directement les partenaires pour obtenir une simulation personnalisée avec
              votre taux exact en fonction de votre profil et de votre situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
