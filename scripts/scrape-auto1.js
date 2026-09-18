#!/usr/bin/env node

/**
 * Auto1 Market Data Scraper
 * Scrapes vehicle data from Auto1 and stores in Supabase
 * Run: node scripts/scrape-auto1.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const AUTO1_URL = 'https://www.auto1.com/fr/app/merchant/cars?channel=24h&dir=asc&page=1&sort=relevanceSorting';
const OUTPUT_FILE = path.join(__dirname, '../data/auto1-market-data.json');

async function scrapeAuto1() {
  console.log('🚀 Démarrage du scraper Auto1...\n');

  const browser = await puppeteer.launch({
    headless: false, // Voir le navigateur
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  try {
    const page = await browser.newPage();

    console.log('📄 Accès à Auto1...');
    await page.goto(AUTO1_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('⏳ Attente du chargement des véhicules...');
    await page.waitForSelector('[data-testid="car-card"]', { timeout: 30000 }).catch(() => {
      console.log('Sélecteur non trouvé, tentative alternative...');
    });

    // Scraper les données des véhicules
    console.log('🔍 Extraction des données des véhicules...');

    const vehicles = await page.evaluate(() => {
      const cars = [];

      // Trouver tous les éléments de voiture
      const carElements = document.querySelectorAll('[data-testid="car-card"], .car-card, article');

      carElements.forEach(el => {
        try {
          const titleText = el.querySelector('h2, .title, [class*="title"]')?.textContent || '';
          const priceText = el.querySelector('[class*="price"], .price-value')?.textContent || '';
          const mileageText = el.querySelector('[class*="mileage"], [class*="km"]')?.textContent || '';

          // Parse marque et modèle
          const [brand, model] = titleText.split(/\s+/).slice(0, 2);

          // Parse prix
          const price = parseInt(priceText.replace(/[^\d]/g, ''));

          // Parse kilométrage
          const mileage = parseInt(mileageText.replace(/[^\d]/g, ''));

          if (brand && model && price > 0) {
            cars.push({
              brand,
              model,
              year: new Date().getFullYear(), // À améliorer
              mileage,
              price,
              scrapedAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          // Skip errors
        }
      });

      return cars;
    });

    console.log(`✅ ${vehicles.length} véhicules trouvés\n`);

    if (vehicles.length > 0) {
      console.log('📊 Exemples de données:');
      vehicles.slice(0, 3).forEach(v => {
        console.log(`  ${v.brand} ${v.model} - €${v.price} - ${v.mileage}km`);
      });
      console.log();
    }

    // Sauvegarder les données
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vehicles, null, 2));
    console.log(`💾 Sauvegardé: ${OUTPUT_FILE}`);

    // Envoyer à notre API
    console.log('\n🔗 Envoi à l\'API...');
    for (const vehicle of vehicles) {
      try {
        const response = await fetch('http://localhost:3000/api/market-data/auto1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicle),
        });

        if (response.ok) {
          console.log(`  ✓ ${vehicle.brand} ${vehicle.model}`);
        }
      } catch (e) {
        console.log(`  ✗ Erreur: ${e.message}`);
      }
    }

    console.log('\n✨ Scraping terminé!');
    console.log(`📈 ${vehicles.length} véhicules traités`);

  } finally {
    await browser.close();
  }
}

// Run
scrapeAuto1().catch(error => {
  console.error('Erreur:', error);
  process.exit(1);
});
