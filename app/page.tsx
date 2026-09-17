'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">🚗 VehicleAuctions</div>
          <div className="space-x-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition">Login</Link>
            <Link href="/signup" className="text-slate-300 hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Vendez votre véhicule aux enchères
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Plateforme de vente aux enchères de véhicules. Déposez votre auto, les acheteurs enchérissent, 
            vous recevez le paiement. Simple, rapide, transparent.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sell">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Je veux vendre
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="text-white border-white hover:bg-white/10 px-8 py-3 text-lg">
                Parcourir les enchères
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4">
          <div className="text-3xl">📱</div>
          <h3 className="text-xl font-bold text-white">Dépôt facile</h3>
          <p className="text-slate-300">Uploadez des photos, décrivez votre véhicule, fixez un prix de départ</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4">
          <div className="text-3xl">⏱️</div>
          <h3 className="text-xl font-bold text-white">Enchères en temps réel</h3>
          <p className="text-slate-300">Suivez les enchères live, recevez des notifications, vendez plus cher</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-4">
          <div className="text-3xl">💰</div>
          <h3 className="text-xl font-bold text-white">Paiement sécurisé</h3>
          <p className="text-slate-300">Recevez le paiement une fois l'acheteur confirmé. Pas de risque.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Prêt à vendre?</h2>
        <Link href="/sell">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
            Créer un compte vendeur
          </Button>
        </Link>
      </section>
    </div>
  );
}
