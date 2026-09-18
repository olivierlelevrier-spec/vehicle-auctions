#!/usr/bin/env node

/**
 * Cleanup script - Exécute toutes les 6 heures
 * Nettoie les fichiers temporaires, caches, et données obsolètes
 */

const fs = require('fs');
const path = require('path');

const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000; // 6 heures

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function deleteDirectoryRecursive(dir) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      deleteDirectoryRecursive(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });

  fs.rmdirSync(dir);
}

function getDirectorySize(dir) {
  if (!fs.existsSync(dir)) return 0;

  let size = 0;
  try {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.lstatSync(filePath);
      if (stat.isDirectory()) {
        size += getDirectorySize(filePath);
      } else {
        size += stat.size;
      }
    });
  } catch (e) {
    // Ignore errors
  }
  return size;
}

function cleanup() {
  console.log('🧹 Nettoyage automatique VehicleAuctions...\n');

  const projectRoot = path.join(__dirname, '..');
  let totalCleaned = 0;

  // 1. Nettoyer .next
  const nextDir = path.join(projectRoot, '.next');
  const nextSize = getDirectorySize(nextDir);
  if (nextSize > 0) {
    deleteDirectoryRecursive(nextDir);
    console.log(`✓ .next nettoyé: ${formatBytes(nextSize)}`);
    totalCleaned += nextSize;
  }

  // 2. Nettoyer node_modules (optionnel - peut être énorme)
  // const nodeModulesDir = path.join(projectRoot, 'node_modules');
  // if (fs.existsSync(nodeModulesDir)) {
  //   deleteDirectoryRecursive(nodeModulesDir);
  //   console.log('✓ node_modules supprimé - réinstaller avec: npm install');
  //   totalCleaned += getDirectorySize(nodeModulesDir);
  // }

  // 3. Nettoyer fichiers de test temporaires
  const dataDir = path.join(projectRoot, 'data');
  if (fs.existsSync(dataDir)) {
    fs.readdirSync(dataDir).forEach(file => {
      const filePath = path.join(dataDir, file);
      // Garder les fichiers de données importantes, supprimer les fichiers > 7 jours
      const stat = fs.statSync(filePath);
      const ageInDays = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24);

      if (ageInDays > 7 && (file.includes('temp') || file.includes('test'))) {
        fs.unlinkSync(filePath);
        totalCleaned += stat.size;
        console.log(`✓ Fichier temporaire supprimé: ${file} (${formatBytes(stat.size)})`);
      }
    });
  }

  // 4. Nettoyer logs anciens
  const logsDir = path.join(projectRoot, 'logs');
  if (fs.existsSync(logsDir)) {
    fs.readdirSync(logsDir).forEach(file => {
      const filePath = path.join(logsDir, file);
      const stat = fs.statSync(filePath);
      const ageInDays = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24);

      if (ageInDays > 7) {
        fs.unlinkSync(filePath);
        totalCleaned += stat.size;
        console.log(`✓ Log ancien supprimé: ${file}`);
      }
    });
  }

  console.log(`\n✨ Nettoyage complété! Espace libéré: ${formatBytes(totalCleaned)}`);
  console.log(`⏰ Prochain nettoyage: dans 6 heures\n`);

  // Retourner le prochain nettoyage après 6 heures
  return CLEANUP_INTERVAL;
}

// Run cleanup
cleanup();

// Planifier le prochain nettoyage
if (process.argv.includes('--schedule')) {
  setInterval(cleanup, CLEANUP_INTERVAL);
  console.log('📅 Nettoyage programmé toutes les 6 heures\n');
}
