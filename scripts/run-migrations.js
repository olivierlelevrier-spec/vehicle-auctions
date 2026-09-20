#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MIGRATIONS = [
  '001_create_core_tables.sql',
  '002_setup_rls.sql',
];

async function runMigrations() {
  console.log('🚀 Starting MVP migrations setup...\n');

  // Wait for dev server to be ready
  const maxRetries = 30;
  let retries = 0;
  let serverReady = false;

  while (retries < maxRetries && !serverReady) {
    try {
      const response = await fetch('http://localhost:3000/api/setup/migrations', {
        method: 'OPTIONS',
      });
      serverReady = true;
      console.log('✅ Dev server is ready!\n');
    } catch (err) {
      retries++;
      if (retries % 5 === 0) {
        console.log(`⏳ Waiting for server... (${retries}/${maxRetries})`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!serverReady) {
    console.error('❌ Dev server not ready after 30 seconds');
    console.log('\n📌 Make sure to run: npm run dev');
    process.exit(1);
  }

  // Execute migrations
  for (const migrationFile of MIGRATIONS) {
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);

    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration not found: ${migrationFile}`);
      process.exit(1);
    }

    console.log(`📄 Running ${migrationFile}...`);

    const sql = fs.readFileSync(migrationPath, 'utf-8');

    try {
      const response = await fetch('http://localhost:3000/api/setup/migrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, name: migrationFile }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`❌ Migration ${migrationFile} failed`);
        console.error(result);
        process.exit(1);
      }

      console.log(`✅ ${migrationFile} completed\n`);
    } catch (err) {
      console.error(`❌ Error executing ${migrationFile}:`, err.message);
      process.exit(1);
    }
  }

  console.log('✨ All migrations completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('   1. Verify tables in Supabase dashboard');
  console.log('   2. Set environment variables in Vercel');
  console.log('   3. Test the MVP flow (signup → browse → bid)');
}

runMigrations().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
