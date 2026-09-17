'use client';

import { useState } from 'react';
import { COMPLETE_VEHICLE_BRANDS as VEHICLE_BRANDS, FUEL_TYPES } from '@/lib/complete-vehicle-data';
import { Button } from '@/components/ui/button';

export default function SellVehicle() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    fuelType: '',
    engineRef: '',
    fiscalPower: '',
    mileage: '',
    price: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    color: '',
  });

  const models = formData.brand ? VEHICLE_BRANDS[formData.brand as keyof typeof VEHICLE_BRANDS] || [] : [];

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const scanVehicle = async () => {
    if (!formData.licensePlate.trim()) {
      setScanError('Veuillez entrer une plaque d\'immatriculation');
      return;
    }

    setLoading(true);
    setScanError('');

    try {
      const response = await fetch(`/api/scan-vehicle?plate=${encodeURIComponent(formData.licensePlate)}`);

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          brand: data.brand || '',
          model: data.model || '',
          fuelType: data.fuelType || '',
          engineRef: data.engineRef || '',
          fiscalPower: data.fiscalPower?.toString() || '',
          mileage: data.mileage?.toString() || '',
          color: data.color || '',
        }));
        setStep(1);
      } else {
        const error = await response.json();
        setScanError(error.error + (error.suggestion ? ` - ${error.suggestion}` : ''));
      }
    } catch (error) {
      setScanError('Erreur lors du scan du véhicule');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step > 0 ? step - 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-12">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">🚗 Vendez votre voiture</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-12 gap-2">
          {[0,1,2,3,4,5,6,7].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-slate-700'}`} />
          ))}
        </div>

        {/* Step 0: Scan License Plate */}
        {step === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">📋 Étape 0: Scan immatriculation</h2>
              <p className="text-slate-300">Scannez votre plaque d'immatriculation pour préremplir automatiquement vos données</p>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <p className="text-blue-300 text-sm">💡 Conseil: Entrez votre plaque (ex: AB-123-CD ou AB123CD) pour que le système remplisse automatiquement la marque, le modèle et les caractéristiques de votre véhicule.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Plaque d'immatriculation</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="ex: AB-123-CD"
                  value={formData.licensePlate}
                  onChange={(e) => {
                    handleChange('licensePlate', e.target.value.toUpperCase());
                    setScanError('');
                  }}
                  className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={scanVehicle}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                >
                  {loading ? '⏳ Scan...' : '🔍 Scanner'}
                </button>
              </div>
              {scanError && <p className="text-red-400 text-sm mt-2">{scanError}</p>}
            </div>

            <div className="text-center pt-4">
              <p className="text-slate-400 text-sm">Ou vous pouvez remplir manuellement →</p>
              <button
                onClick={() => setStep(1)}
                className="text-blue-400 hover:text-blue-300 font-semibold mt-2"
              >
                Continuer sans scan
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Brand & Model */}
        {step === 1 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 1: Marque et modèle</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Marque de votre véhicule</label>
              <select
                value={formData.brand}
                onChange={(e) => { handleChange('brand', e.target.value); handleChange('model', ''); }}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option value="">Sélectionnez une marque...</option>
                {Object.keys(VEHICLE_BRANDS).map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>

            {formData.brand && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Modèle</label>
                <select
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionnez un modèle...</option>
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={nextStep} disabled={!formData.brand || !formData.model} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold">Suivant → (2/8)</Button>
            </div>
          </div>
        )}

        {/* Step 2: Fuel & Engine */}
        {step === 2 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 2: Énergie et moteur</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Type d'énergie</label>
              <div className="space-y-3">
                {FUEL_TYPES.map(fuel => (
                  <label key={fuel.value} className="flex items-center space-x-3 text-white cursor-pointer p-3 rounded-lg hover:bg-slate-700 transition">
                    <input type="radio" name="fuel" value={fuel.value} checked={formData.fuelType === fuel.value} onChange={(e) => handleChange('fuelType', e.target.value)} className="w-4 h-4" />
                    <span className="font-medium">{fuel.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Référence moteur</label>
              <input
                type="text"
                placeholder="ex: 1.2 TCe 100"
                value={formData.engineRef}
                onChange={(e) => handleChange('engineRef', e.target.value)}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={nextStep} disabled={!formData.fuelType || !formData.engineRef} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold">Suivant → (3/8)</Button>
            </div>
          </div>
        )}

        {/* Step 3: Fiscal Power & License Plate */}
        {step === 3 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 3: Puissance fiscale et immatriculation</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Puissance fiscale (ch)</label>
              <input type="number" placeholder="ex: 6" value={formData.fiscalPower} onChange={(e) => handleChange('fiscalPower', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Immatriculation</label>
              <input type="text" placeholder="ex: AB-123-CD" value={formData.licensePlate} onChange={(e) => handleChange('licensePlate', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={nextStep} disabled={!formData.fiscalPower || !formData.licensePlate} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold">Suivant → (4/8)</Button>
            </div>
          </div>
        )}

        {/* Step 4: Mileage & Price */}
        {step === 4 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 4: Kilométrage et prix de départ</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Kilométrage (km)</label>
              <input type="number" placeholder="ex: 125000" value={formData.mileage} onChange={(e) => handleChange('mileage', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Prix de départ (€)</label>
              <input type="number" placeholder="ex: 15000" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={nextStep} disabled={!formData.mileage || !formData.price} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold">Suivant → (5/8)</Button>
            </div>
          </div>
        )}

        {/* Step 5: Description */}
        {step === 5 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 5: Description du véhicule</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Décrivez l'état du véhicule</label>
              <textarea placeholder="État général, options, réparations récentes, entretien, etc." value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={5} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">Suivant → (6/8)</Button>
            </div>
          </div>
        )}

        {/* Step 6: Photos */}
        {step === 6 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 6: Photos du véhicule</h2>

            <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center bg-slate-700/30">
              <div className="text-5xl mb-4">📸</div>
              <p className="text-slate-300 text-lg">Glissez-déposez vos photos ici</p>
              <p className="text-slate-400 text-sm mt-2">ou cliquez pour sélectionner</p>
              <input type="file" multiple accept="image/*" className="mt-6 w-full" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">Suivant → (7/8)</Button>
            </div>
          </div>
        )}

        {/* Step 7: Registration */}
        {step === 7 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 7: Finalisez votre compte</h2>
            <p className="text-slate-300">Presque terminé! Complétez votre profil vendeur.</p>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Nom complet</label>
              <input type="text" placeholder="Jean Dupont" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Email</label>
              <input type="email" placeholder="jean@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Téléphone</label>
              <input type="tel" placeholder="06 12 34 56 78" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-300 text-sm"><strong>Commission:</strong> 500€ TTC (payable après vente confirmée)</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={() => alert('✅ Bravo!\n\nVotre véhicule a été déposé avec succès.\nVotre compte vendeur a été créé.\n\nCommission: 500€ TTC')} disabled={!formData.name || !formData.email || !formData.phone} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold text-lg">
                ✅ Finaliser le dépôt
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
