#!/bin/bash

# Setup Supabase for vehicle auctions
# This script configures Supabase authentication settings

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_ROLE_KEY" ] || [ "$SERVICE_ROLE_KEY" = "TO_FILL_LATER" ]; then
  echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not configured"
  echo ""
  echo "To complete setup:"
  echo "1. Go to https://app.supabase.com"
  echo "2. Select your project"
  echo "3. Settings → API → service_role secret"
  echo "4. Add to .env.local as: SUPABASE_SERVICE_ROLE_KEY=<your_key>"
  echo ""
  exit 1
fi

echo "🔧 Configuring Supabase authentication..."
echo "📍 Project: $SUPABASE_URL"
echo ""

# Disable email confirmation via API
curl -X PATCH \
  "${SUPABASE_URL}/auth/v1/admin/config" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "external": {
      "email": {
        "enabled": true,
        "confirmations_enabled": false
      }
    }
  }' 2>/dev/null

echo "✅ Supabase configured!"
echo "📝 Email confirmation is now disabled"
