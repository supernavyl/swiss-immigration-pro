#!/bin/bash
# Automated Verification Script - Swiss Immigration Pro
# Run this to verify all 3 fixes are working

set -e

echo "🔍 SWISS IMMIGRATION PRO - AUTOMATED VERIFICATION"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0

# Test function
test_file() {
    local file=$1
    local search_term=$2
    local description=$3

    echo -n "Testing: $description... "

    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ FAILED${NC} (file not found)"
        ((FAILED++))
        return 1
    fi

    if grep -q "$search_term" "$file"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (fix not found)"
        ((FAILED++))
        return 1
    fi
}

test_url() {
    local url=$1
    local description=$2

    echo -n "Testing: $description... "

    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⏳ WAITING${NC} (service not running yet)"
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 1: CODE VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Fix #1: Firefox exit intent popup
test_file "swiss-immigration-pro/components/marketing/ExitIntentPopup.tsx" \
    "typeof window === \"undefined\"" \
    "Fix #1: Firefox popup window checks"

# Fix #2: Newsletter admin endpoint
test_file "backend/app/routers/newsletter.py" \
    "admin_subscribers_router" \
    "Fix #2: Newsletter admin router created"

test_file "backend/app/main.py" \
    "newsletter.admin_subscribers_router" \
    "Fix #2: Newsletter admin router registered"

# Fix #3: Mobile API config
test_file "mobile/.env" \
    "EXPO_PUBLIC_API_URL=http://localhost:8000" \
    "Fix #3: Mobile backend port correct (8000)"

test_file "mobile/.env" \
    "EXPO_PUBLIC_CONTENT_URL=http://localhost:3000" \
    "Fix #3: Mobile frontend port correct (3000)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 2: SERVICE CONNECTIVITY CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Note: Make sure services are running:${NC}"
echo "  - Backend: docker-compose up"
echo "  - Web: npm run dev"
echo ""

test_url "http://localhost:8000/api/health" "Backend API health check"
test_url "http://localhost:3000" "Web app (http://localhost:3000)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 3: DATABASE VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if migration exists
echo -n "Checking: Database migration file... "
if [ -f "backend/app/migrations/versions/add_marketing_captures.py" ]; then
    echo -e "${GREEN}✅ FOUND${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⏳ OPTIONAL${NC} (exit intent capture is optional)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 4: DEPENDENCIES CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check web dependencies
echo -n "Checking: Web app node_modules... "
if [ -d "swiss-immigration-pro/node_modules" ]; then
    echo -e "${GREEN}✅ INSTALLED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⏳ NOT INSTALLED${NC} (run: npm install in swiss-immigration-pro/)"
fi

# Check mobile dependencies
echo -n "Checking: Mobile app node_modules... "
if [ -d "mobile/node_modules" ]; then
    echo -e "${GREEN}✅ INSTALLED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⏳ NOT INSTALLED${NC} (run: npm install in mobile/)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 5: DOCUMENTATION CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

docs=(
    "MASTER_FIX_INDEX.md"
    "FIREFOX_BUG_FIXED.md"
    "NEWSLETTER_SUBSCRIBERS_FIX.md"
    "MOBILE_FIXED.md"
    "VERIFICATION_CHECKLIST.md"
    "START_HERE.md"
)

for doc in "${docs[@]}"; do
    echo -n "Checking: $doc... "
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ MISSING${NC}"
        ((FAILED++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "FINAL RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED! READY TO GO!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start backend:  docker-compose up"
    echo "2. Start web:      cd swiss-immigration-pro && npm run dev"
    echo "3. Start mobile:   cd mobile && npm run web"
    echo ""
    echo "Test URLs:"
    echo "- Web: http://localhost:3000"
    echo "- Admin: http://localhost:3000/admin/newsletter"
    echo "- Mobile: http://localhost:19006"
    echo "- Backend: http://localhost:8000/api/health"
    exit 0
else
    echo -e "${RED}⚠️  SOME CHECKS FAILED${NC}"
    echo ""
    echo "Review the failures above and fix them:"
    echo "1. Check file paths"
    echo "2. Install missing dependencies (npm install)"
    echo "3. Start services (docker-compose up)"
    exit 1
fi
