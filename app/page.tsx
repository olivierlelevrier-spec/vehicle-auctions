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
            <Link href="/setup" className="text-slate-300 hover:text-white transition text-sm">⚙️ Setup</Link>
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

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Nos services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/sell">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-700 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer space-y-4">
              <div className="text-4xl">🚗</div>
              <h3 className="text-xl font-bold text-white">Vendre un véhicule</h3>
              <p className="text-slate-300">Déposez votre annonce et trouvez des acheteurs</p>
            </div>
          </Link>
          <Link href="/credit">
            <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-700 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer space-y-4">
              <div className="text-4xl">💳</div>
              <h3 className="text-xl font-bold text-white">Simulateur de crédit</h3>
              <p className="text-slate-300">Comparez les meilleures offres de financement</p>
            </div>
          </Link>
          <Link href="/browse">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-700 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="text-xl font-bold text-white">Parcourir les enchères</h3>
              <p className="text-slate-300">Trouvez votre prochaine voiture</p>
            </div>
          </Link>
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

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-700 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-green-400 mb-2">2,500+</div>
          <p className="text-slate-400">Véhicules vendus</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-green-400 mb-2">15M€</div>
          <p className="text-slate-400">Volume d'enchères</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
          <p className="text-slate-400">Vendeurs satisfaits</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 VehicleAuctions. Plateforme de vente aux enchères de véhicules en France.</p>
      </footer>
    </div>
  );
}
