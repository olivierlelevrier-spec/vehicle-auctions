#!/bin/bash

# Production Deployment Script
# Supports: Docker, Render, Railway, or any Docker-compatible host

echo "🚀 VehicleAuctions MVP - Production Deployment"
echo "==============================================="

# Check dependencies
echo "✓ Checking dependencies..."
command -v node &> /dev/null || { echo "❌ Node.js not found"; exit 1; }
command -v npm &> /dev/null || { echo "❌ npm not found"; exit 1; }

# Install dependencies
echo "✓ Installing dependencies..."
npm install --production

# Build Next.js for production
echo "✓ Building Next.js for production..."
npm run build

# Show deployment options
echo ""
echo "✅ Build complete! Ready for deployment."
echo ""
echo "Option 1: Run locally in production mode"
echo "  npm run start"
echo ""
echo "Option 2: Deploy with Docker"
echo "  docker build -t vehicle-auctions-mvp ."
echo "  docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=<url> -e NEXT_PUBLIC_SUPABASE_ANON_KEY=<key> vehicle-auctions-mvp"
echo ""
echo "Option 3: Deploy to Render, Railway, Fly.io, etc."
echo "  Connect your GitHub repo and they'll auto-build from the Dockerfile"
echo ""
