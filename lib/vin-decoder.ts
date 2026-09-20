// VIN Decoder - Extracts vehicle info from VIN
// Standard VIN format: WVWZZZ3CZ9E123456 (17 characters)

export interface VINData {
  brand: string;
  model: string;
  year: number;
  countryOfOrigin: string;
  message?: string;
}

// VIN position reference:
// Positions 1-3: World Manufacturer Identifier (WMI)
// Positions 4-8: Vehicle Descriptor Section (VDS)
// Position 9: Check digit
// Positions 10-17: Vehicle Identifier Section (VIS)
// Position 10: Model year

const VIN_MANUFACTURERS: Record<string, string> = {
  'WDB': 'Mercedes',
  'WVW': 'Volkswagen',
  'W0L': 'BMW',
  'WBA': 'BMW',
  'WBX': 'BMW',
  'ZFF': 'Ferrari',
  'ZF2': 'Ferrari',
  'ZF1': 'Ferrari',
  'ZFF': 'Ferrari',
  'F1Z': 'Ferrari',
  'JT2': 'Toyota',
  'JT4': 'Toyota',
  'JT6': 'Toyota',
  'JT7': 'Toyota',
  'JTH': 'Toyota',
  'JA3': 'Mazda',
  'JM1': 'Mazda',
  'HG1': 'Honda',
  'HG2': 'Honda',
  'HH1': 'Honda',
  'HH2': 'Honda',
  'JNB': 'Nissan',
  'JNC': 'Nissan',
  'JNK': 'Nissan',
  'LSV': 'Mitsubishi',
  'MMC': 'Mitsubishi',
  'SJN': 'Subaru',
  'KMH': 'Hyundai',
  'KNA': 'Hyundai',
  'KMHEC': 'Hyundai',
  'KUU': 'Kia',
  'KNDJB': 'Kia',
  'TMA': 'Toyota',
  'TMB': 'Toyota',
  'RU1': 'Porsche',
  'WP0': 'Porsche',
  'WP1': 'Porsche',
  'WP2': 'Porsche',
  'ZAR': 'Lamborghini',
  'ZFF': 'Ferrari',
  'ZF2': 'Ferrari',
  'RPS': 'Maserati',
  'ZLA': 'Aston Martin',
  'SAJ': 'Jaguar',
  'SAL': 'Rolls-Royce',
  'SCC': 'Bentley',
  'BF6': 'Citroën',
  'VF3': 'Renault',
  'VF7': 'Peugeot',
  'VFA': 'Citroën',
  'ZAM': 'Maserati',
  'ZF1': 'Ferrari',
};

const MODEL_YEAR_MAP: Record<string, number> = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
  'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
  'Y': 2030, '1': 2031, '2': 2032, '3': 2033, '4': 2034,
  '5': 2035, '6': 2036, '7': 2037, '8': 2038, '9': 2039,
};

export function isValidVIN(vin: string): boolean {
  // VIN must be 17 characters, alphanumeric (I, O, Q excluded)
  if (!vin || vin.length !== 17) return false;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return false;
  return true;
}

export function decodeVIN(vin: string): VINData {
  if (!isValidVIN(vin)) {
    return {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      countryOfOrigin: '',
      message: 'VIN invalide - Format: 17 caractères alphanumériques (sans I, O, Q)',
    };
  }

  const vinUpper = vin.toUpperCase();

  // Extract manufacturer from first 3 characters
  const wmi = vinUpper.substring(0, 3);
  let brand = '';

  // Try exact 3-char match first
  brand = VIN_MANUFACTURERS[wmi] || '';

  // Try 2-char match if not found
  if (!brand) {
    const wmi2 = vinUpper.substring(0, 2);
    for (const [key, value] of Object.entries(VIN_MANUFACTURERS)) {
      if (key.startsWith(wmi2)) {
        brand = value;
        break;
      }
    }
  }

  // Extract model year from position 10 (index 9)
  const yearChar = vinUpper[9];
  const year = MODEL_YEAR_MAP[yearChar] || new Date().getFullYear();

  // Extract country from first character
  let countryOfOrigin = '';
  const firstChar = vinUpper[0];
  if ('123456789X'.includes(firstChar) || firstChar >= 'J' && firstChar <= 'R' ||
      firstChar >= 'S' && firstChar <= 'Z') {
    // Extract from first character
    const countryMap: Record<string, string> = {
      'A': 'Afrique du Sud', 'B': 'Inde', 'C': 'Chine',
      'D': 'Allemagne', 'E': 'Espagne', 'F': 'France',
      'G': 'Italie', 'H': 'Hollande', 'J': 'Japon',
      'K': 'Corée du Sud', 'L': 'Chine', 'M': 'Italie',
      'N': 'Pays-Bas', 'P': 'Portugal', 'R': 'Russie/Lettonie',
      'S': 'Royaume-Uni', 'T': 'Suisse', 'V': 'Autriche/Suède',
      'W': 'Allemagne', 'X': 'Russie/Pays d\'Europe', 'Y': 'Suède',
      'Z': 'Italie',
    };
    countryOfOrigin = countryMap[firstChar] || 'Inconnu';
  }

  // Extract sequential digits from VIS (positions 12-14) for model guess
  // This is a simplified approach - real implementation would need database
  const vis = vinUpper.substring(11, 14);
  let model = '';

  if (brand === 'Ferrari') {
    // Ferrari models based on VIS pattern
    const firstDigit = vis[0];
    if (firstDigit === '3') model = 'F360';
    else if (firstDigit === '4') model = 'F430';
    else if (firstDigit === '4' && vis[1] === '6') model = 'F460';
    else if (firstDigit === '4' && vis[1] === '8') model = 'F488';
    else if (firstDigit === '5') model = '550/575/599';
    else if (firstDigit === '8') model = '812/F8';
    else model = 'Modèle Ferrari (estimation)';
  } else if (brand === 'Porsche') {
    const firstDigit = vis[0];
    if (firstDigit === '9') model = '911';
    else if (firstDigit === '7') model = '911 Carrera';
    else if (firstDigit === '4') model = 'Boxster/Cayman';
    else if (firstDigit === '5') model = 'Panamera';
    else if (firstDigit === '9' && vis[1] === '1') model = '911 Turbo';
    else model = 'Modèle Porsche';
  } else if (brand === 'Mercedes') {
    const vds = vinUpper.substring(3, 8);
    if (vds[0] === 'C' || vds[0] === 'W') model = 'Classe C';
    else if (vds[0] === 'E') model = 'Classe E';
    else if (vds[0] === 'S') model = 'Classe S';
    else if (vds[0] === 'G') model = 'Classe G';
    else if (vds[0] === 'A') model = 'Classe A';
    else model = 'Mercedes (modèle estimation)';
  } else if (brand === 'BMW') {
    const vds = vinUpper.substring(3, 8);
    if (vds[0] === '3') model = 'Série 3';
    else if (vds[0] === '5') model = 'Série 5';
    else if (vds[0] === '7') model = 'Série 7';
    else if (vds[0] === 'X') model = `X${vds[1]}`;
    else model = 'BMW (modèle estimation)';
  } else if (brand === 'Lamborghini') {
    if (vinUpper.includes('H')) model = 'Huracán';
    else if (vinUpper.includes('V')) model = 'Aventador';
    else if (vinUpper.includes('U')) model = 'Urus';
    else model = 'Lamborghini (modèle estimation)';
  }

  return {
    brand: brand || 'Inconnu',
    model: model || 'Modèle non identifié',
    year,
    countryOfOrigin,
  };
}
