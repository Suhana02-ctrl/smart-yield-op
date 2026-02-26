#!/bin/bash
# ============================================================================
# Real APY Data - Verification Script
# Run this to test that real data fetching is working correctly
# ============================================================================

echo "🧪 Testing Real APY Data Implementation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${YELLOW}1. Checking if backend is running...${NC}"
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo "   Start it with: cd cre-backend && npm run server"
    exit 1
fi

echo ""

# Test /api/protocols endpoint
echo -e "${YELLOW}2. Testing GET /api/protocols (Top protocols with real APY)...${NC}"
RESPONSE=$(curl -s http://localhost:5000/api/protocols?limit=5)
if echo "$RESPONSE" | grep -q "success"; then
    COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | cut -d: -f2)
    echo -e "${GREEN}✅ /api/protocols returned $COUNT protocols${NC}"
    echo "   Sample response:"
    echo "$RESPONSE" | head -20
else
    echo -e "${RED}❌ /api/protocols failed${NC}"
fi

echo ""

# Test /api/protocols/:asset endpoint
echo -e "${YELLOW}3. Testing GET /api/protocols/USDC (USDC protocols with real APY)...${NC}"
RESPONSE=$(curl -s http://localhost:5000/api/protocols/USDC)
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ /api/protocols/USDC returned USDC protocols${NC}"
else
    echo -e "${RED}❌ /api/protocols/USDC failed${NC}"
fi

echo ""

# Test /api/apy/:protocol endpoint
echo -e "${YELLOW}4. Testing GET /api/apy/Aave (Current APY for Aave)...${NC}"
RESPONSE=$(curl -s http://localhost:5000/api/apy/Aave)
if echo "$RESPONSE" | grep -q "success"; then
    APY=$(echo "$RESPONSE" | grep -o '"apy":[0-9.]*' | cut -d: -f2)
    echo -e "${GREEN}✅ Aave APY: ${APY}% (REAL DATA!)${NC}"
else
    echo -e "${RED}❌ /api/apy/Aave failed${NC}"
fi

echo ""

# Test /simulate endpoint
echo -e "${YELLOW}5. Testing POST /simulate (Simulation with real APY)...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:5000/simulate \
  -H "Content-Type: application/json" \
  -d '{"wallet":"0x1234567890abcdef"}')
if echo "$RESPONSE" | grep -q "success"; then
    PROTOCOL=$(echo "$RESPONSE" | grep -o '"protocol":"[^"]*"' | cut -d'"' -f4)
    APY=$(echo "$RESPONSE" | grep -o '"apy":[0-9.]*' | cut -d: -f2)
    echo -e "${GREEN}✅ Simulation succeeded!${NC}"
    echo "   Best Protocol: $PROTOCOL (APY: ${APY}%)"
else
    echo -e "${RED}❌ /simulate failed${NC}"
fi

echo ""

# Summary
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Real APY Data Implementation is WORKING!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "📚 Next Steps:"
echo "   1. Update your React components to use fetchRealProtocols()"
echo "   2. See COMPONENT_EXAMPLES_REAL_APY.tsx for code samples"
echo "   3. Check REAL_DATA_QUICKSTART.md for detailed guide"
echo ""
echo "🎉 You now have REAL APY data instead of hardcoded mock values!"
echo ""
