'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CREDIT_PARTNERS } from '@/lib/credit-partners';

const WARRANTY_PROVIDERS = [
  {
    name: 'Grâce Savoie',
    email: 'adv.nsa@wtwco.com',
    website: 'https://www.gsnsa.com',
    coverage: 'Panne mécanique complète',
    price: '€500 - €1500',
    duration: '1-5 ans',
    description: 'Couverture complète avec assistance 24/7',
  },
  {
    name: 'Opteven',
    phone: '+33 4 72 43 52 52',
    website: 'https://fr.opteven.com',
    coverage: 'Garantie complète',
    price: '€400 - €1200',
    duration: '1-5 ans',
    description: 'Prise en charge rapide, réseau d\'ateliers agréés',
  },
  {
    name: 'RPM',
    website: 'https://www.rpm-garantie.com',
    coverage: 'Protection moteur et boîte',
    price: '€300 - €900',
    duration: '1-4 ans',
    description: 'Spécialisé dans les pièces mécaniques critiques',
  },
  {
    name: 'Warranty Direct',
    website: 'https://www.warranty-direct.fr',
    coverage: 'Garantie étendue',
    price: '€450 - €1400',
    duration: '1-5 ans',
    description: 'Flexible avec options à la carte',
  },
  {
    name: 'Legionella Garantie',
    website: 'https://www.legionella.fr',
    coverage: 'Assurance mécanique',
    price: '€350 - €1100',
    duration: '1-5 ans',
    description: 'Tarifs compétitifs pour l\'acheteur',
  },
  {
    name: 'Allianz Assistance',
    website: 'https://www.allianz.fr',
    coverage: 'Couverture complète + assistance',
    price: '€600 - €2000',
    duration: '1-5 ans',
    description: 'Leader de l\'assurance automobile',
  },
];

export default function WarrantyPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      {/* Nav */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300">
            🚗 VehicleAuctions
          </Link>
          <div className="space-x-4">
            <Link href="/credit">
              <Button className="bg-green-600 hover:bg-green-700">💳 Crédit</Button>
            </Link>
            <Link href="/sell">
              <Button className="bg-blue-600 hover:bg-blue-700">Vendre</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">🛡️ Assurance Auto</h1>
            <p className="text-xl text-slate-300">
              Protégez votre véhicule avec nos partenaires d'assurance de confiance
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Pourquoi s'assurer?</h2>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>✅ Couverture contre les pannes mécaniques</li>
              <li>✅ Assistance 24/7 sur route</li>
              <li>✅ Dépannage et remorquage inclus</li>
              <li>✅ Remplacement de pièces sans franchise</li>
              <li>✅ Tranquillité d'esprit garantie</li>
            </ul>
          </div>

          {/* Providers Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Nos partenaires assureurs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WARRANTY_PROVIDERS.map((provider, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4 hover:border-orange-500 transition cursor-pointer"
                  onClick={() => setSelected(selected === provider.name ? null : provider.name)}
                >
                  {/* Header */}
                  <div>
                    <h3 className="text-xl font-bold text-white">{provider.name}</h3>
                    <p className="text-sm text-slate-400">{provider.coverage}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tarif</span>
                      <span className="text-green-400 font-semibold">{provider.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Durée</span>
                      <span className="text-white">{provider.duration}</span>
                    </div>
                  </div>

                  {/* Expanded */}
                  {selected === provider.name && (
                    <div className="bg-slate-900/50 p-4 rounded space-y-3 border-t border-slate-700 pt-4">
                      <p className="text-slate-300 text-sm">{provider.description}</p>
                      {provider.email && (
                        <a href={`mailto:${provider.email}`} className="text-blue-400 hover:text-blue-300 text-sm block">
                          ✉️ {provider.email}
                        </a>
                      )}
                      {provider.phone && (
                        <a href={`tel:${provider.phone}`} className="text-blue-400 hover:text-blue-300 text-sm block">
                          📞 {provider.phone}
                        </a>
                      )}
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm block break-all"
                      >
                        🌐 {provider.website}
                      </a>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 mt-2">
                        Demander une offre
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-orange-900/30 to-orange-900/10 border border-orange-700 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-orange-300">Assurez votre achat dès aujourd'hui</h2>
            <p className="text-orange-200">
              Combiné avec notre service de crédit pour une protection complète de votre véhicule
            </p>
            <div className="space-x-4">
              <Link href="/credit">
                <Button className="bg-green-600 hover:bg-green-700">💳 Crédit Auto</Button>
              </Link>
              <Link href="/sell">
                <Button className="bg-blue-600 hover:bg-blue-700">🚗 Vendre</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
