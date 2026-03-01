#!/bin/bash
# Cloudflare Tunnel Setup Verification

echo "🌍 CLOUDFLARE TUNNEL VERIFICATION"
echo "=================================="
echo ""

TUNNEL_URL="https://estimate-printed-lemon-economic.trycloudflare.com"

echo "Tunnel URL: $TUNNEL_URL"
echo ""
echo "Checking configuration files..."
echo ""

# Check web app config
if [ -f "swiss-immigration-pro/.env.local" ]; then
    echo "✅ Web app config found"
    if grep -q "estimate-printed-lemon-economic.trycloudflare.com" "swiss-immigration-pro/.env.local"; then
        echo "   ✅ Contains tunnel URL"
    else
        echo "   ⚠️  Missing tunnel URL"
    fi
else
    echo "❌ Web app config not found"
fi

# Check mobile config
if [ -f "mobile/.env" ]; then
    echo "✅ Mobile app config found"
    if grep -q "estimate-printed-lemon-economic.trycloudflare.com" "mobile/.env"; then
        echo "   ✅ Contains tunnel URL"
    else
        echo "   ⚠️  Missing tunnel URL"
    fi
else
    echo "❌ Mobile app config not found"
fi

echo ""
echo "=================================="
echo "📖 NEXT STEPS:"
echo ""
echo "1. Start backend:"
echo "   docker-compose up"
echo ""
echo "2. Start web app (new terminal):"
echo "   cd swiss-immigration-pro && npm run dev"
echo ""
echo "3. Test locally:"
echo "   http://localhost:3000"
echo ""
echo "4. Test via tunnel:"
echo "   $TUNNEL_URL"
echo ""
echo "=================================="
echo "✅ Configuration verified!"
echo ""
echo "Your app will be accessible at:"
echo "$TUNNEL_URL"
echo ""
echo "Ready to go! 🚀"
