'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MVPLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      // Success - redirect to browse
      localStorage.setItem('user_session', JSON.stringify(data.data));
      router.push('/mvp/browse');
    } catch (err) {
      setError('Erreur réseau: ' + String(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <nav className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/mvp" className="text-2xl font-bold text-white">🚗 MVP</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Se connecter</h1>

          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 font-semibold"
            >
              {loading ? '⏳ Connexion...' : '✅ Se connecter'}
            </Button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Pas inscrit?{' '}
            <Link href="/mvp/signup" className="text-blue-400 hover:text-blue-300">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
