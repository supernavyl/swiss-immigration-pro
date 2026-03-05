#!/bin/bash
# Fix npm peer dependency conflict

set -e

echo "🔧 Fixing npm peer dependency conflict..."
echo ""

cd swiss-immigration-pro

# Remove node_modules and lock file
echo "🗑️  Removing old dependencies..."
rm -rf node_modules package-lock.json
echo "✓ Cleaned up"
echo ""

# Reinstall with corrected versions
echo "📦 Installing dependencies with Next.js 15.5.2..."
npm install
echo "✓ Dependencies installed"
echo ""

# Verify installation
echo "✅ Verifying Next.js version..."
npm list next
echo ""

echo "🎉 Peer dependency conflict resolved!"
echo ""
echo "Next step:"
echo "  npm run dev"
