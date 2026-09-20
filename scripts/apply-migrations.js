#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'TO_FILL_LATER') {
  console.error(`
❌ Configuration incomplete!

To complete migrations autonomously, you need:

1. Go to: https://app.supabase.com/project/_/settings/api
2. Copy the "Service Role Key" (secret key, not anon key)
3. Update .env.local:
   SUPABASE_SERVICE_ROLE_KEY=<paste-your-key-here>

4. Run this script again:
   npm run migrations
`);
  process.exit(1);
}

async function applyMigrations() {
  console.log('🔐 Initializing with service role key...');

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const migrations = [
    { file: '001_create_core_tables.sql', name: 'Create Core Tables' },
    { file: '002_setup_rls.sql', name: 'Setup RLS Policies' },
  ];

  for (const migration of migrations) {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', migration.file);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Not found: ${migration.file}`);
      process.exit(1);
    }

    console.log(`\n⏳ ${migration.name}...`);
    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql });

      if (error && error.code === 'PGRST204') {
        // 204 means no results, which is OK for DDL
        console.log(`✅ ${migration.file} executed`);
      } else if (error) {
        console.error(`❌ Error in ${migration.file}:`);
        console.error(error);
        process.exit(1);
      } else {
        console.log(`✅ ${migration.file} executed`);
      }
    } catch (err) {
      // RPC might not exist, try alternative method
      console.log(`⚠️  RPC exec_sql not available, please execute manually in SQL Editor`);
      console.log(`📋 SQL from ${migration.file}:\n`);
      console.log(sql);
      process.exit(1);
    }
  }

  console.log(`
✨ Migrations complete!

📊 Verify:
   1. Check Supabase dashboard → Database → Tables
      - profiles, listings, bids should exist
      - RLS policies should be enabled

2. Create test data (optional):
   Run: npm run seed

3. Configure Vercel:
   - Set NEXT_PUBLIC_SUPABASE_URL
   - Set NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Set SUPABASE_SERVICE_ROLE_KEY

4. Deploy to preview:
   Push to mvp/core branch or run: vercel deploy --prod
`);
}

applyMigrations().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
