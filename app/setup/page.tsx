'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SetupPage() {
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const response = await fetch('/api/setup-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceRoleKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage('❌ ' + (data.error || 'Configuration failed'));
        return;
      }

      setMessage('✅ Supabase configured successfully!');
      setSuccess(true);
      setServiceRoleKey('');
    } catch (error) {
      setMessage('❌ ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <nav className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300">
            🚗 VehicleAuctions
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">⚙️ Configuration</h1>
            <p className="text-slate-400">Configure Supabase for email authentication</p>
          </div>

          {success ? (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 space-y-4">
              <p className="text-green-400 font-semibold">✅ Setup Complete!</p>
              <p className="text-green-300 text-sm">
                You can now login and signup without email confirmation.
              </p>
              <div className="space-y-2">
                <Link href="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Signup</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSetup} className="space-y-4">
              {message && (
                <div className={`${
                  success ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'
                } border rounded-lg p-3`}>
                  <p className={success ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
                    {message}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Supabase Service Role Key
                </label>
                <input
                  type="password"
                  value={serviceRoleKey}
                  onChange={(e) => setServiceRoleKey(e.target.value)}
                  placeholder="sbprivate_..."
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Found in: Supabase Dashboard → Settings → API → service_role secret
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-400">
                <p className="font-semibold text-slate-300 mb-2">How to find your key:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to https://app.supabase.com</li>
                  <li>Select your project</li>
                  <li>Settings → API → service_role secret</li>
                  <li>Copy and paste it here</li>
                </ol>
              </div>

              <Button
                type="submit"
                disabled={loading || !serviceRoleKey}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-2 rounded-lg font-semibold"
              >
                {loading ? '⏳ Configuring...' : '🔧 Configure Supabase'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
