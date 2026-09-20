// MVP Landing Page
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MVPHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">🚗 VehicleAuctions MVP ✅ Live</h1>
          <div className="space-x-4">
            <Link href="/mvp/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                S'inscrire
              </Button>
            </Link>
            <Link href="/mvp/login">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white">
              Enchères de voitures en ligne
            </h2>
            <p className="text-xl text-slate-300">
              Publiez vos annonces, enchérissez sur les meilleures voitures.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Link href="/mvp/browse">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white h-12 text-lg">
                🏎️ Parcourir les annonces
              </Button>
            </Link>
            <Link href="/mvp/sell">
              <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white h-12 text-lg">
                📋 Publier une annonce
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8">
          <div className="bg-slate-700/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">✅ Authentification</h3>
            <p className="text-slate-300 text-sm">Inscrivez-vous et gérez vos annonces</p>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">📝 Annonces</h3>
            <p className="text-slate-300 text-sm">Publiez et modifiez vos véhicules</p>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">💰 Enchères</h3>
            <p className="text-slate-300 text-sm">Enchérissez sur les annonces actives</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-700 mt-20 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>MVP: Authentification + Annonces + Enchères • 2026-09-20</p>
        </div>
      </footer>
    </div>
  );
}
