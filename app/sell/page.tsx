'use client';

import { useState } from 'react';
import { COMPLETE_VEHICLE_BRANDS as VEHICLE_BRANDS, FUEL_TYPES } from '@/lib/complete-vehicle-data';
import { WARRANTY_PROVIDERS } from '@/lib/warranty-providers';
import { Button } from '@/components/ui/button';

interface PriceEstimation {
  lowEstimate: number;
  midEstimate: number;
  highEstimate: number;
}

export default function SellVehicle() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [priceEstimation, setPriceEstimation] = useState<PriceEstimation | null>(null);
  const [estimationLoading, setEstimationLoading] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
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
    warrantyProvider: '',
    warrantyFormula: '',
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
          year: data.year?.toString() || '',
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

  const estimatePrice = async () => {
    if (!formData.brand || !formData.model || !formData.year || !formData.mileage) {
      alert('Veuillez remplir les données du véhicule d\'abord');
      return;
    }

    setEstimationLoading(true);
    try {
      const response = await fetch('/api/estimate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          fuelType: formData.fuelType,
          mileage: formData.mileage,
          fiscalPower: formData.fiscalPower,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPriceEstimation(data);
        setStep(8);
      } else {
        alert('Erreur lors de l\'estimation du prix: ' + data.error);
      }
    } catch (error) {
      alert('Erreur lors de l\'estimation: ' + String(error));
    } finally {
      setEstimationLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step > 0 ? step - 1 : 0);

  const submitAnnouncement = async () => {
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || 'Erreur lors de la sauvegarde');
        return;
      }

      alert('✅ Bravo!\n\nVotre annonce a été créée avec succès!\nNuméro annonce: ' + result.data[0]?.id + '\n\nCommission: 500€ TTC');
      setFormData({
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
        warrantyProvider: '',
        warrantyFormula: '',
      });
      setStep(0);
    } catch (error) {
      setSubmitError('Erreur réseau: ' + String(error));
    } finally {
      setSubmitting(false);
    }
  };

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
          {[0,1,2,3,4,5,6,7,8,9].map((s) => (
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
                value={formData.brand || ''}
                onChange={(e) => {
                  const newBrand = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    brand: newBrand,
                    model: '', // Reset model when brand changes
                  }));
                }}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option value="">Sélectionnez une marque...</option>
                {Object.keys(VEHICLE_BRANDS)
                  .sort()
                  .map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
              </select>
              {formData.brand && (
                <p className="text-xs text-green-400 mt-2">✓ {formData.brand} sélectionné</p>
              )}
            </div>

            {formData.brand && models.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Modèle</label>
                <select
                  value={formData.model || ''}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionnez un modèle...</option>
                  {models.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {formData.model && (
                  <p className="text-xs text-green-400 mt-2">✓ {formData.model} sélectionné</p>
                )}
              </div>
            )}

            {formData.brand && models.length === 0 && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <p className="text-red-400 text-sm">❌ Pas de modèles disponibles pour {formData.brand}</p>
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

        {/* Step 7: Warranty Selection */}
        {step === 7 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 7: Sélectionnez une garantie</h2>
            <p className="text-slate-300">Protégez votre acheteur avec une garantie fiable</p>

            <div className="grid md:grid-cols-2 gap-4">
              {WARRANTY_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => {
                    handleChange('warrantyProvider', provider.id);
                    handleChange('warrantyFormula', '');
                  }}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    formData.warrantyProvider === provider.id
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{provider.logo}</div>
                  <h3 className="font-bold text-white mb-2">{provider.name}</h3>
                  <div className="space-y-1 mb-3">
                    {provider.formulas.slice(0, 2).map((formula) => (
                      <p key={formula.id} className="text-sm text-slate-400">
                        • {formula.name}
                      </p>
                    ))}
                    {provider.formulas.length > 2 && (
                      <p className="text-sm text-slate-400">• +{provider.formulas.length - 2} autres formules</p>
                    )}
                  </div>
                  {provider.contact.email && (
                    <p className="text-xs text-blue-400 break-all">{provider.contact.email}</p>
                  )}
                  {provider.contact.phone && (
                    <p className="text-xs text-blue-400">{provider.contact.phone}</p>
                  )}
                </div>
              ))}
            </div>

            {formData.warrantyProvider && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-white">Formules disponibles</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {WARRANTY_PROVIDERS.find((p) => p.id === formData.warrantyProvider)?.formulas.map((formula) => (
                    <button
                      key={formula.id}
                      onClick={() => handleChange('warrantyFormula', formula.id)}
                      className={`p-3 rounded-lg text-left transition border ${
                        formData.warrantyFormula === formula.id
                          ? 'border-green-500 bg-green-900/20 text-white'
                          : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-semibold">{formula.name}</div>
                      <div className="text-xs mt-1">{formula.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3">← Retour</Button>
              <Button onClick={estimatePrice} disabled={estimationLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold">
                {estimationLoading ? '⏳ Estimation...' : 'Estimation de prix → (8/10)'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 8: Price Estimation */}
        {step === 8 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">💰 Étape 8: Estimation de prix</h2>
              <p className="text-slate-300">Découvrez l'estimation IA du prix de votre véhicule</p>
            </div>

            {priceEstimation ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-900/30 to-green-900/10 border border-green-700 rounded-lg p-8">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <p className="text-slate-400 text-sm">Estimation basse</p>
                      <p className="text-3xl font-bold text-green-400">€{priceEstimation.lowEstimate.toLocaleString('fr-FR')}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 text-sm">Estimation moyenne</p>
                      <p className="text-4xl font-bold text-white">€{priceEstimation.midEstimate.toLocaleString('fr-FR')}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 text-sm">Estimation haute</p>
                      <p className="text-3xl font-bold text-yellow-400">€{priceEstimation.highEstimate.toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">💡 Cette estimation est basée sur la marque, le modèle, l'année, le kilométrage et le type de carburant de votre véhicule. Vous pouvez confirmer le prix proposé ou en modifier le montant.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Prix de départ (€)</label>
                  <input type="number" placeholder="Entrez votre prix souhaité" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                  <p className="text-slate-400 text-xs mt-2">Laissez vide pour utiliser l'estimation moyenne (€{priceEstimation.midEstimate.toLocaleString('fr-FR')})</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3" disabled={estimationLoading}>← Retour</Button>
                  <Button onClick={nextStep} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg">Continuer →</Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <p className="text-slate-400">Aucune estimation disponible</p>
                <Button onClick={prevStep} variant="outline" className="text-white border-white hover:bg-white/10">← Retour</Button>
              </div>
            )}
          </div>
        )}

        {/* Step 9: Registration */}
        {step === 9 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Étape 9: Finalisez votre compte</h2>
            <p className="text-slate-300">Dernière étape! Complétez votre profil vendeur.</p>

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

            {formData.warrantyProvider && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 space-y-2">
                <p className="text-blue-300 text-sm font-semibold">📋 Garantie sélectionnée:</p>
                <p className="text-blue-300 text-sm">
                  {WARRANTY_PROVIDERS.find((p) => p.id === formData.warrantyProvider)?.name}
                  {formData.warrantyFormula &&
                    ` - ${WARRANTY_PROVIDERS.find((p) => p.id === formData.warrantyProvider)?.formulas.find((f) => f.id === formData.warrantyFormula)?.name}`}
                </p>
              </div>
            )}

            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-300 text-sm"><strong>Commission:</strong> 500€ TTC (payable après vente confirmée)</p>
            </div>

            {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

            <div className="flex gap-4 pt-4">
              <Button onClick={prevStep} variant="outline" className="flex-1 text-white border-white hover:bg-white/10 py-3" disabled={submitting}>← Retour</Button>
              <Button onClick={submitAnnouncement} disabled={!formData.name || !formData.email || !formData.phone || submitting} className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold text-lg">
                {submitting ? '⏳ Sauvegarde...' : '✅ Finaliser (10/10)'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
