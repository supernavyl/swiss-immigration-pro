#!/bin/bash
# Cloudflare Mobile App Setup Script
# Automates the entire Cloudflare + mobile app setup

set -e

echo "🚀 CLOUDFLARE MOBILE SETUP"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if domain is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: $0 yourdomain.com${NC}"
    echo ""
    echo "This script sets up your mobile app for Cloudflare"
    echo ""
    echo "Example:"
    echo "  $0 swissimmigrationpro.com"
    echo ""
    echo "This will:"
    echo "  1. Update mobile/.env with your domain"
    echo "  2. Create DNS configuration file"
    echo "  3. Create nginx configuration"
    echo "  4. Generate deployment guide"
    exit 1
fi

DOMAIN=$1
API_DOMAIN="api.${DOMAIN}"

echo -e "${BLUE}Configuration:${NC}"
echo "  Domain: $DOMAIN"
echo "  API Domain: $API_DOMAIN"
echo ""

# Step 1: Update mobile/.env
echo -e "${GREEN}✓${NC} Step 1: Updating mobile/.env"
cat > mobile/.env << EOF
# ============================================
# Mobile App - Cloudflare Configuration
# ============================================

# Production domains
EXPO_PUBLIC_DOMAIN=${DOMAIN}
EXPO_PUBLIC_API_DOMAIN=${API_DOMAIN}

# Note: config.ts auto-detects:
# - Local (localhost): http://localhost:8000
# - Production (${DOMAIN}): https://${API_DOMAIN}
EOF

echo "  Updated: mobile/.env"
echo ""

# Step 2: Create Cloudflare DNS configuration guide
echo -e "${GREEN}✓${NC} Step 2: Creating Cloudflare DNS guide"
cat > CLOUDFLARE_DNS_CONFIG.txt << EOF
╔════════════════════════════════════════════════════════╗
║      CLOUDFLARE DNS CONFIGURATION FOR MOBILE APP      ║
╚════════════════════════════════════════════════════════╝

Domain: ${DOMAIN}
API Domain: ${API_DOMAIN}

STEP 1: Add Domain to Cloudflare
├─ Go to: https://dash.cloudflare.com
├─ Click: "Add a domain"
├─ Enter: ${DOMAIN}
├─ Choose: Free plan (OK for testing)
└─ Update: Nameservers at your registrar

STEP 2: DNS Records (in Cloudflare Dashboard)
Go to: DNS Records tab

Add these records:

  TYPE  │ NAME               │ VALUE          │ PROXY
  ──────┼────────────────────┼────────────────┼─────────────
  A     │ ${DOMAIN}          │ YOUR.SERVER.IP │ ✅ Proxied
  A     │ api                │ YOUR.SERVER.IP │ ✅ Proxied
  CNAME │ www                │ ${DOMAIN}      │ ✅ Proxied

Replace YOUR.SERVER.IP with your actual server IP address.
Click the cloud icon to make them "Proxied" (orange).

STEP 3: SSL/TLS Configuration
Go to: SSL/TLS tab
├─ Overview
├─ Set to: "Full (Strict)"
└─ Wait for certificate (usually instant)

STEP 4: Cache Rules
Go to: Rules → Cache Rules
├─ Click: "Create Rule"
├─ If: URI path contains "/api/"
├─ Then: Cache TTL = 0 (bypass cache for API)
└─ Click: "Save"

STEP 5: Wait for DNS Propagation
├─ Usually instant but can take up to 24 hours
├─ Test with: dig ${DOMAIN}
├─ Should show: YOUR.SERVER.IP
└─ Then redeploy your app

VERIFICATION COMMANDS:
  # Check DNS
  dig ${DOMAIN}
  dig ${API_DOMAIN}

  # Check SSL
  curl -I https://${API_DOMAIN}/api/health

  # Mobile should request from:
  https://${API_DOMAIN}/api/*

Ready? → Run: npm run web
Then check DevTools (F12) → Network tab
EOF

echo "  Created: CLOUDFLARE_DNS_CONFIG.txt"
echo ""

# Step 3: Create nginx configuration for Cloudflare
echo -e "${GREEN}✓${NC} Step 3: Creating nginx configuration"
cat > nginx-cloudflare.conf << EOF
# Nginx configuration for Cloudflare + Mobile App
# Add these settings to your nginx.conf

server {
    listen 80;
    listen 443 ssl http2;
    server_name ${DOMAIN} ${API_DOMAIN};

    # SSL certificates (Let's Encrypt via Cloudflare)
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # CORS for mobile
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    # Cloudflare headers
    add_header CF-Cache-Status $upstream_cache_status always;

    # API endpoints (no cache)
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # No caching for API
        proxy_cache_bypass 1;
        proxy_no_cache 1;
    }

    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Health check
    location /health {
        proxy_pass http://backend:8000/api/health;
    }
}
EOF

echo "  Created: nginx-cloudflare.conf"
echo ""

# Step 4: Create deployment checklist
echo -e "${GREEN}✓${NC} Step 4: Creating deployment checklist"
cat > CLOUDFLARE_DEPLOY_CHECKLIST.md << EOF
# Cloudflare Mobile App - Deployment Checklist

## Pre-Deployment
- [ ] Domain registered and ready
- [ ] Server IP address known
- [ ] SSL certificate available
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000

## Cloudflare Setup (15 minutes)
- [ ] Domain added to Cloudflare
- [ ] DNS records added (A, CNAME)
  - [ ] ${DOMAIN} → YOUR.IP (Proxied)
  - [ ] ${API_DOMAIN} → YOUR.IP (Proxied)
- [ ] SSL/TLS set to "Full (Strict)"
- [ ] Cache rule added for /api/*
- [ ] DNS propagated (dig ${DOMAIN})

## Mobile App Update
- [ ] mobile/.env updated:
  - [ ] EXPO_PUBLIC_DOMAIN=${DOMAIN}
  - [ ] EXPO_PUBLIC_API_DOMAIN=${API_DOMAIN}
- [ ] Dependencies installed: npm install
- [ ] App rebuilt: npm run build
- [ ] Config.ts verified (auto-detection works)

## Deployment
- [ ] Backend running: docker-compose up
- [ ] Frontend running: npm run dev
- [ ] Nginx configured with SSL
- [ ] Service running on port 443

## Testing
- [ ] Desktop: https://${DOMAIN} loads
- [ ] Admin: https://${DOMAIN}/admin/newsletter works
- [ ] Mobile: npm run web
  - [ ] DevTools (F12) → Network tab
  - [ ] Requests to: https://${API_DOMAIN}/api/*
  - [ ] No CORS errors
  - [ ] No SSL errors
- [ ] Cloudflare Dashboard
  - [ ] Shows requests coming through
  - [ ] Cache status visible
  - [ ] No errors logged

## Verification Commands
\`\`\`bash
# Check DNS
dig ${DOMAIN}
dig ${API_DOMAIN}

# Check SSL
curl -I https://${API_DOMAIN}/api/health

# Check Cloudflare
curl -I https://${DOMAIN}

# Monitor logs
docker-compose logs -f backend
docker-compose logs -f frontend
\`\`\`

## Success Criteria
✅ Mobile app loads at https://${DOMAIN}
✅ API calls go to https://${API_DOMAIN}
✅ No console errors
✅ No CORS errors
✅ Cloudflare cache working
✅ Mobile login works
✅ Dashboard loads

## Troubleshooting
If mobile still connects to localhost:
1. Clear cache: rm -rf mobile/node_modules
2. Reinstall: npm install
3. Check config.ts is in place
4. Verify .env has correct domain
5. Rebuild: npm run web

If SSL errors:
1. Check certificate is valid
2. Check nginx has SSL configured
3. Test: curl -I https://${DOMAIN}
4. Regenerate if needed

If Cloudflare not working:
1. Verify DNS records are added
2. Verify SSL mode is "Full (Strict)"
3. Check firewall rules
4. Wait for DNS propagation (up to 24h)
EOF

echo "  Created: CLOUDFLARE_DEPLOY_CHECKLIST.md"
echo ""

# Step 5: Create quick reference
echo -e "${GREEN}✓${NC} Step 5: Creating quick reference"
cat > CLOUDFLARE_QUICK_REFERENCE.txt << EOF
╔══════════════════════════════════════════════════════╗
║     CLOUDFLARE MOBILE APP - QUICK REFERENCE         ║
╚══════════════════════════════════════════════════════╝

DOMAIN CONFIGURATION
  Main: ${DOMAIN}
  API:  ${API_DOMAIN}

DEVELOPMENT (Local)
  $ npm run web
  ✅ Auto-uses: http://localhost:8000

PRODUCTION (Cloudflare)
  $ npm run web
  ✅ Auto-uses: https://${API_DOMAIN}

CLOUDFLARE STEPS (15 min)
  1. Add domain to Cloudflare
  2. Add DNS records
  3. Set SSL to "Full (Strict)"
  4. Add cache rule for /api/*
  5. Deploy & test

VERIFY
  ✓ dig ${DOMAIN}
  ✓ curl -I https://${API_DOMAIN}/api/health
  ✓ npm run web → DevTools → Network
  ✓ All requests to https://${API_DOMAIN}

FILES UPDATED
  ✓ mobile/.env
  ✓ mobile/lib/config.ts (auto-detection ready)
  ✓ mobile/lib/api.ts (uses config)

NEXT STEPS
  1. Read: CLOUDFLARE_DNS_CONFIG.txt
  2. Follow: CLOUDFLARE_DEPLOY_CHECKLIST.md
  3. Test: npm run web
  4. Verify: DevTools → Network tab
EOF

echo "  Created: CLOUDFLARE_QUICK_REFERENCE.txt"
echo ""

# Summary
echo "════════════════════════════════════════════════════"
echo -e "${GREEN}✅ CLOUDFLARE SETUP COMPLETE!${NC}"
echo "════════════════════════════════════════════════════"
echo ""
echo "Configuration Created:"
echo "  ✓ mobile/.env - Updated with your domain"
echo "  ✓ CLOUDFLARE_DNS_CONFIG.txt - DNS setup guide"
echo "  ✓ nginx-cloudflare.conf - Nginx configuration"
echo "  ✓ CLOUDFLARE_DEPLOY_CHECKLIST.md - Deploy checklist"
echo "  ✓ CLOUDFLARE_QUICK_REFERENCE.txt - Quick reference"
echo ""
echo -e "${BLUE}Your Domain:${NC}"
echo "  Main:   ${DOMAIN}"
echo "  API:    ${API_DOMAIN}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Read: CLOUDFLARE_DNS_CONFIG.txt"
echo "  2. Add records to Cloudflare"
echo "  3. Follow: CLOUDFLARE_DEPLOY_CHECKLIST.md"
echo "  4. Test with: npm run web"
echo ""
echo -e "${GREEN}Ready to deploy!${NC}"
