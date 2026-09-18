export interface CreditOffer {
  duration: number; // mois
  interestRate: number; // %
  fee: number; // %
  totalCost: number; // pour 10,000€
}

export interface CreditPartner {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  phone?: string;
  email?: string;
  offers: CreditOffer[];
}

export const CREDIT_PARTNERS: CreditPartner[] = [
  {
    id: 'renault-credit',
    name: '💳 Renault Finance',
    logo: '🏪',
    description: 'Financement automobile spécialisé Renault et marques',
    website: 'https://www.renault-finance.fr',
    phone: '0800 800 900',
    offers: [
      {
        duration: 24,
        interestRate: 4.9,
        fee: 2.5,
        totalCost: 10620,
      },
      {
        duration: 36,
        interestRate: 5.2,
        fee: 2.5,
        totalCost: 10980,
      },
      {
        duration: 48,
        interestRate: 5.5,
        fee: 2.5,
        totalCost: 11380,
      },
      {
        duration: 60,
        interestRate: 5.8,
        fee: 3.0,
        totalCost: 11990,
      },
    ],
  },
  {
    id: 'bnp-auto',
    name: '🏦 BNP Paribas Autofin',
    logo: '🏛️',
    description: 'Solutions de financement auto BNP Paribas',
    website: 'https://www.bnp-autofin.fr',
    phone: '0800 024 024',
    offers: [
      {
        duration: 24,
        interestRate: 4.5,
        fee: 2.0,
        totalCost: 10550,
      },
      {
        duration: 36,
        interestRate: 4.8,
        fee: 2.0,
        totalCost: 10870,
      },
      {
        duration: 48,
        interestRate: 5.1,
        fee: 2.5,
        totalCost: 11260,
      },
      {
        duration: 60,
        interestRate: 5.4,
        fee: 2.5,
        totalCost: 11750,
      },
    ],
  },
  {
    id: 'credit-mutuel',
    name: '🤝 Crédit Mutuel Auto',
    logo: '💰',
    description: 'Crédit auto Crédit Mutuel - Taux compétitifs',
    website: 'https://www.creditmutuel.fr/auto',
    phone: '0970 200 200',
    offers: [
      {
        duration: 24,
        interestRate: 5.2,
        fee: 2.5,
        totalCost: 10650,
      },
      {
        duration: 36,
        interestRate: 5.5,
        fee: 2.5,
        totalCost: 11040,
      },
      {
        duration: 48,
        interestRate: 5.8,
        fee: 3.0,
        totalCost: 11540,
      },
      {
        duration: 60,
        interestRate: 6.1,
        fee: 3.0,
        totalCost: 12180,
      },
    ],
  },
  {
    id: 'sofinco',
    name: '⚡ Sofinco',
    logo: '✨',
    description: 'Crédit consommation auto Sofinco',
    website: 'https://www.sofinco.fr',
    phone: '0805 026 000',
    offers: [
      {
        duration: 24,
        interestRate: 4.3,
        fee: 1.9,
        totalCost: 10520,
      },
      {
        duration: 36,
        interestRate: 4.6,
        fee: 1.9,
        totalCost: 10820,
      },
      {
        duration: 48,
        interestRate: 4.9,
        fee: 2.3,
        totalCost: 11200,
      },
      {
        duration: 60,
        interestRate: 5.2,
        fee: 2.3,
        totalCost: 11680,
      },
    ],
  },
  {
    id: 'cetelem',
    name: '🏧 Cetelem',
    logo: '🎯',
    description: 'Crédit automobile Cetelem - Service complet',
    website: 'https://www.cetelem.fr',
    phone: '0800 827 827',
    offers: [
      {
        duration: 24,
        interestRate: 5.0,
        fee: 2.4,
        totalCost: 10640,
      },
      {
        duration: 36,
        interestRate: 5.3,
        fee: 2.4,
        totalCost: 11020,
      },
      {
        duration: 48,
        interestRate: 5.6,
        fee: 2.8,
        totalCost: 11480,
      },
      {
        duration: 60,
        interestRate: 5.9,
        fee: 2.8,
        totalCost: 12080,
      },
    ],
  },
  {
    id: 'axa-auto',
    name: '🛡️ AXA Crédits Auto',
    logo: '🔐',
    description: 'Crédit et assurance auto AXA',
    website: 'https://www.axa.fr/auto/credit',
    phone: '0970 800 800',
    offers: [
      {
        duration: 24,
        interestRate: 5.5,
        fee: 2.6,
        totalCost: 10690,
      },
      {
        duration: 36,
        interestRate: 5.8,
        fee: 2.6,
        totalCost: 11100,
      },
      {
        duration: 48,
        interestRate: 6.1,
        fee: 3.1,
        totalCost: 11620,
      },
      {
        duration: 60,
        interestRate: 6.4,
        fee: 3.1,
        totalCost: 12280,
      },
    ],
  },
];

export function calculateMonthlyPayment(amount: number, offer: CreditOffer): number {
  const monthlyRate = offer.interestRate / 100 / 12;
  const numPayments = offer.duration;

  if (monthlyRate === 0) {
    return Math.round(amount / numPayments);
  }

  const payment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment);
}

export function getPartnerById(id: string) {
  return CREDIT_PARTNERS.find((p) => p.id === id);
}
