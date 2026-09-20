'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MVPSell() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.brand || !formData.model || !formData.price) {
      setError('Remplissez les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/listings-mvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          year: formData.year ? parseInt(formData.year) : null,
          price: parseInt(formData.price),
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la création');
        setLoading(false);
        return;
      }

      alert('✅ Annonce créée!\n\nRedirection vers votre annonce...');
      router.push(`/mvp/listings/${data.data[0].id}`);
    } catch (err) {
      setError('Erreur réseau');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      <nav className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between">
          <Link href="/mvp" className="text-2xl font-bold text-white">🚗 MVP</Link>
          <Link href="/mvp/browse"><Button className="bg-blue-600">Parcourir</Button></Link>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Publier une annonce</h1>

          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Marque *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="ex: Porsche"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Modèle *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="ex: 911"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Année</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-4 py-2"
                  placeholder="1985"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Prix (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-4 py-2"
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-4 py-3 h-32 focus:outline-none focus:border-blue-500"
                placeholder="Décrivez votre véhicule..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-3 font-semibold text-lg"
            >
              {loading ? '⏳ Création...' : '✅ Publier l\'annonce'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
