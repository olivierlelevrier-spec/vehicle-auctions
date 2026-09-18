export interface WarrantyFormula {
  id: string;
  name: string;
  duration: string;
  coverage: string[];
  price?: string;
  description: string;
}

export interface WarrantyProvider {
  id: string;
  name: string;
  logo: string;
  contact: {
    email?: string;
    phone?: string;
    website?: string;
  };
  formulas: WarrantyFormula[];
}

export const WARRANTY_PROVIDERS: WarrantyProvider[] = [
  {
    id: 'no-warranty',
    name: '❌ Pas de garantie',
    logo: '🚗',
    contact: {},
    formulas: [
      {
        id: 'no-warranty-1',
        name: 'Vente sans garantie',
        duration: '-',
        coverage: [],
        description: 'Le véhicule est vendu sans garantie supplémentaire',
      },
    ],
  },
  {
    id: 'grace-savoie',
    name: '🛡️ Grâce Savoie (Willis Towers Watson)',
    logo: '🏢',
    contact: {
      email: 'adv.nsa@wtwco.com',
      website: 'https://www.gsnsa.com',
    },
    formulas: [
      {
        id: 'gs-auto-12',
        name: 'Auto - 12 mois',
        duration: '12 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Panne électronique', 'Assistance 24/24'],
        description: 'Couverture 12 mois pour panne mécanique, électrique et électronique',
      },
      {
        id: 'gs-auto-24',
        name: 'Auto - 24 mois',
        duration: '24 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Panne électronique', 'Assistance 24/24'],
        description: 'Couverture 24 mois pour panne mécanique, électrique et électronique',
      },
      {
        id: 'gs-auto-36',
        name: 'Auto - 36 mois',
        duration: '36 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Panne électronique', 'Assistance 24/24'],
        description: 'Couverture 36 mois pour panne mécanique, électrique et électronique',
      },
      {
        id: 'gs-prestige',
        name: 'Prestige (< 5 ans, < 80k km)',
        duration: '24/36 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Panne électronique', 'Services premium'],
        description: 'Couverture premium pour véhicules haut de gamme < 5 ans et < 80 000 km',
      },
      {
        id: 'gs-classic',
        name: 'Classic (8-10 ans, 150-200k km)',
        duration: '24 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Assistance 24/24'],
        description: 'Couverture adaptée pour véhicules 8-10 ans et 150-200 000 km',
      },
    ],
  },
  {
    id: 'opteven',
    name: '⚙️ Opteven',
    logo: '🔧',
    contact: {
      phone: '+33 4 72 43 52 52',
      website: 'https://fr.opteven.com',
    },
    formulas: [
      {
        id: 'opt-panne-12',
        name: 'Panne mécanique - 12 mois',
        duration: '12 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Assistance 24/24', 'Dépannage illimité'],
        description: 'Couverture panne mécanique 12 mois avec assistance complète',
      },
      {
        id: 'opt-panne-24',
        name: 'Panne mécanique - 24 mois',
        duration: '24 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Assistance 24/24', 'Dépannage illimité'],
        description: 'Couverture panne mécanique 24 mois avec assistance complète',
      },
      {
        id: 'opt-panne-36',
        name: 'Panne mécanique - 36 mois',
        duration: '36 mois',
        coverage: ['Panne mécanique', 'Panne électrique', 'Assistance 24/24', 'Dépannage illimité'],
        description: 'Couverture panne mécanique 36 mois avec assistance complète',
      },
      {
        id: 'opt-entretien',
        name: 'Entretien + Assistance',
        duration: '12/24 mois',
        coverage: ['Révisions', 'Entretien préventif', 'Assistance 24/24', 'Services spécialisés'],
        description: 'Couverture entretien et révisions avec assistance routière',
      },
    ],
  },
  {
    id: 'rpm',
    name: '🏆 RPM - Extension de garantie',
    logo: '✨',
    contact: {
      website: 'https://www.rpm-garantie.com',
    },
    formulas: [
      {
        id: 'rpm-12',
        name: 'Extension - 12 mois',
        duration: '12 mois',
        coverage: ['Panne mécanique', 'Panne électronique', 'Assistance roadside', 'Franchise réduite'],
        description: 'Extension de garantie 12 mois avec couverture complète',
      },
      {
        id: 'rpm-24',
        name: 'Extension - 24 mois',
        duration: '24 mois',
        coverage: ['Panne mécanique', 'Panne électronique', 'Assistance roadside', 'Franchise réduite'],
        description: 'Extension de garantie 24 mois avec couverture complète',
      },
      {
        id: 'rpm-36',
        name: 'Extension - 36 mois',
        duration: '36 mois',
        coverage: ['Panne mécanique', 'Panne électronique', 'Assistance roadside', 'Franchise réduite'],
        description: 'Extension de garantie 36 mois avec couverture complète',
      },
    ],
  },
  {
    id: 'warranty-direct',
    name: '🌍 Warranty Direct',
    logo: '🔐',
    contact: {
      website: 'https://www.warranty-direct.co.uk/fr',
    },
    formulas: [
      {
        id: 'wd-basic',
        name: 'Basic - 12 mois',
        duration: '12 mois',
        coverage: ['Panne mécanique', 'Assistance 24/24'],
        description: 'Couverture basique panne mécanique 12 mois',
      },
      {
        id: 'wd-standard',
        name: 'Standard - 24 mois',
        duration: '24 mois',
        coverage: ['Panne mécanique', 'Électrique', 'Assistance 24/24', 'Remplacement moteur'],
        description: 'Couverture standard 24 mois avec remplacement moteur',
      },
      {
        id: 'wd-premium',
        name: 'Premium - 36 mois',
        duration: '36 mois',
        coverage: ['Panne mécanique', 'Électrique', 'Électronique', 'Assistance 24/24', 'Pièces neuves'],
        description: 'Couverture premium 36 mois avec pièces neuves',
      },
    ],
  },
  {
    id: 'legionella',
    name: '⭐ Legionella Garantie',
    logo: '🎯',
    contact: {
      website: 'https://www.legionella-garantie.fr',
    },
    formulas: [
      {
        id: 'leg-comfort',
        name: 'Comfort - 12 mois',
        duration: '12 mois',
        coverage: ['Panne mécanique', 'Assistance routière', 'Confort client'],
        description: 'Formule comfort avec assistance complète 12 mois',
      },
      {
        id: 'leg-protection',
        name: 'Protection - 24 mois',
        duration: '24 mois',
        coverage: ['Panne mécanique', 'Électrique', 'Assistance routière', 'Protection étendue'],
        description: 'Formule protection 24 mois avec couverture étendue',
      },
    ],
  },
  {
    id: 'allianz',
    name: '🏛️ Allianz Assistance',
    logo: '🛡️',
    contact: {
      website: 'https://www.allianz.fr',
    },
    formulas: [
      {
        id: 'allianz-essential',
        name: 'Essential - 12 mois',
        duration: '12 mois',
        coverage: ['Panne mécanique', 'Assistance 24/24'],
        description: 'Garantie essential Allianz 12 mois',
      },
      {
        id: 'allianz-plus',
        name: 'Plus - 24 mois',
        duration: '24 mois',
        coverage: ['Panne mécanique', 'Électrique', 'Assistance premium', 'Voiture de remplacement'],
        description: 'Garantie plus Allianz 24 mois avec voiture de remplacement',
      },
    ],
  },
];

export const getProviderById = (id: string) => {
  return WARRANTY_PROVIDERS.find((p) => p.id === id);
};

export const getFormulaById = (providerId: string, formulaId: string) => {
  const provider = getProviderById(providerId);
  return provider?.formulas.find((f) => f.id === formulaId);
};
