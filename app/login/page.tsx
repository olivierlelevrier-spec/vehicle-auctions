'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Authentification en développement - Feature coming soon! 🚀');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300">
            🚗 VehicleAuctions
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-slate-400">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
              Se connecter
            </Button>
          </form>

          <div className="text-center">
            <p className="text-slate-400">
              Pas de compte?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
