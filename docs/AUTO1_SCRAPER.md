# Auto1 Market Data Scraper

## Vue d'ensemble
Ce scraper récupère les données de marché en temps réel depuis Auto1 pour enrichir nos estimations de prix avec des données réelles.

## Installation

```bash
npm install puppeteer --save-dev
```

## Configuration

### 1. Supabase Database
Exécute le SQL de `SUPABASE_MARKET_DATA.sql` dans le dashboard Supabase:
- Crée la table `auto1_market_data`
- Crée les index pour les requêtes rapides
- Crée la vue `market_price_estimates`

### 2. Variables d'environnement
Ajoute à `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Utilisation

### Mode manuel (une seule fois)
```bash
node scripts/scrape-auto1.js
```

Cela:
1. Lance Puppeteer avec ton Chrome existant
2. Accède à ta page Auto1 connectée
3. Scrape tous les véhicules
4. Les enregistre localement dans `data/auto1-market-data.json`
5. Les envoie à notre API

### Mode automatisé (quotidien)
```bash
# Ajoute un cron job
0 8 * * * cd /path/to/project && node scripts/scrape-auto1.js
```

## Données collectées

Pour chaque véhicule:
- Marque & Modèle
- Année
- Kilométrage
- Prix
- Couleur
- Type de carburant
- Transmission
- Puissance moteur
- URL de l'annonce

## Impact sur l'estimation de prix

Une fois les données en Supabase, l'algorithme d'estimation de prix sera enrichi avec:
- **Prix moyen** par marque/modèle/année
- **Plage de prix** (min/max)
- **Prix par km** pour ajustement kilométrage
- **Tendance** sur le temps

## Structure de données

```json
{
  "brand": "Porsche",
  "model": "996",
  "year": 2000,
  "mileage": 75000,
  "price": 51000,
  "color": "Rosso Corsa",
  "fuelType": "Essence",
  "transmission": "Manual",
  "enginePower": 15,
  "scrapedAt": "2026-09-18T10:30:00Z"
}
```

## Avantages

1. **Gratuit** - Pas de coût Carvertical/Full Car History
2. **Temps réel** - Données du jour même
3. **Propriétaire** - Ta base de données personnelle
4. **Précis** - Basé sur tes vraies ventes
5. **Scalable** - Devient meilleur à chaque vente

## Limitations actuelles

- Scraper basique (amélioration possible)
- Ne scrape que ta page Auto1
- Nécessite Chrome ouvert
- À améliorer: extraction de l'année depuis le titre

## Prochaines améliorations

- [ ] Scraper d'autres vendeurs (concurrents)
- [ ] Historique complet de prix
- [ ] Alertes si prix du marché change
- [ ] Intégration LeBonCoin
- [ ] ML pour prédiction de prix
