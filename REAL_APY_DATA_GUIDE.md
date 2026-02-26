# Real APY Data Implementation Guide

## Overview

Your DeFi optimizer now fetches **real, live APY data** from the **DefiLlama API** instead of hardcoded mock data. This document explains how to use the new real data endpoints.

## New Backend Endpoints

### 1. **GET /api/protocols** - Fetch Top Protocols
Get the best DeFi protocols with real APY data.

**URL:**
```
http://localhost:5000/api/protocols?limit=10&chain=Ethereum
```

**Query Parameters:**
- `limit` (optional): Number of protocols to return (default: 10)
- `chain` (optional): Filter by blockchain (default: "Ethereum")

**Example Response:**
```json
{
  "success": true,
  "message": "Top protocols fetched successfully",
  "count": 10,
  "data": [
    {
      "id": "protocol_0",
      "name": "Aave V3",
      "chain": "Ethereum",
      "apy": 5.82,
      "tvl": "$12.4B",
      "symbol": "USDC"
    },
    {
      "id": "protocol_1",
      "name": "Curve Finance",
      "chain": "Ethereum",
      "apy": 6.23,
      "tvl": "$1.8B",
      "symbol": "USDC"
    }
  ]
}
```

---

### 2. **GET /api/protocols/:asset** - Protocols for Specific Asset
Get protocols that support a specific asset (USDC, DAI, ETH, etc.)

**URL:**
```
http://localhost:5000/api/protocols/USDC
http://localhost:5000/api/protocols/USDT
http://localhost:5000/api/protocols/DAI
```

**Example Response:**
```json
{
  "success": true,
  "message": "Protocols for USDC fetched successfully",
  "asset": "USDC",
  "count": 5,
  "data": [
    {
      "id": "usdc_0",
      "name": "Aave V3",
      "chain": "Ethereum",
      "apy": 5.82,
      "tvl": "$12.4B",
      "symbol": "USDC"
    }
  ]
}
```

---

### 3. **GET /api/apy/:protocol** - Get Current APY for Protocol
Get the current APY for a specific protocol by name.

**URL:**
```
http://localhost:5000/api/apy/Aave
http://localhost:5000/api/apy/Compound
http://localhost:5000/api/apy/Yearn
```

**Example Response:**
```json
{
  "success": true,
  "protocol": "Aave",
  "apy": 5.82,
  "timestamp": "2026-02-25T10:30:00.000Z"
}
```

---

### 4. **POST /simulate** - Run Simulation with Real Data
Run a yield optimization simulation using real APY data.

**URL:**
```
POST http://localhost:5000/simulate
```

**Request Body:**
```json
{
  "wallet": "0x1234567890abcdef..."
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "protocol": "Aave V3",
    "apy": 5.82,
    "rewards": 1.59,
    "previousProtocol": "Compound V3",
    "walletAddress": "0x1234567890abcdef...",
    "transactionSimulated": true
  }
}
```

---

## Frontend API Functions

The frontend now has new functions in `src/lib/api.ts` for fetching real data:

### 1. **fetchRealProtocols()**
```typescript
import { fetchRealProtocols } from './lib/api';

// Fetch top 10 protocols for Ethereum
const protocols = await fetchRealProtocols(10, 'Ethereum');

// Each protocol object:
// {
//   id: string
//   name: string
//   chain: string
//   apy: number (REAL DATA from DefiLlama)
//   tvl: string
//   symbol: string
// }
```

### 2. **fetchProtocolsForAsset()**
```typescript
import { fetchProtocolsForAsset } from './lib/api';

// Get all protocols supporting USDC with real APY
const usdcProtocols = await fetchProtocolsForAsset('USDC');

// Get protocols for other assets
const ethProtocols = await fetchProtocolsForAsset('ETH');
const daiProtocols = await fetchProtocolsForAsset('DAI');
```

### 3. **fetchProtocolAPY()**
```typescript
import { fetchProtocolAPY } from './lib/api';

// Get current APY for a specific protocol
const aaveAPY = await fetchProtocolAPY('Aave');
const compoundAPY = await fetchProtocolAPY('Compound');
const yearnAPY = await fetchProtocolAPY('Yearn');
```

### 4. **runSimulation()**
```typescript
import { runSimulation } from './lib/api';

// Run simulation with real APY data
const result = await runSimulation('0x1234567890abcdef...');

// result object contains:
// {
//   protocol: string (best protocol with highest APY)
//   apy: number (REAL APY from DefiLlama)
//   rewards: number
//   previousProtocol: string
//   walletAddress: string
// }
```

---

## Usage Example: Update Protocol Display

**Before (Hardcoded Mock Data):**
```typescript
const PROTOCOLS: Protocol[] = [
  {
    id: "aave-v3",
    name: "Aave V3",
    apy: 5.82,  // ← Mock/Hardcoded
    tvl: "$12.4B",
  }
];
```

**After (Real Data from API):**
```typescript
import { fetchRealProtocols } from './lib/api';

const [protocols, setProtocols] = useState<Protocol[]>([]);

useEffect(() => {
  (async () => {
    const realProtocols = await fetchRealProtocols(10, 'Ethereum');
    setProtocols(realProtocols);
  })();
}, []);

// Now displaying real APY data!
```

---

## Data Sources

- **DefiLlama API**: `https://yields.llama.fi/pools`
- **Real-time APY Data**: Updated from dozens of DeFi protocols
- **Supported Assets**: USDC, USDT, DAI, ETH, WETH, and hundreds more
- **Chains**: Ethereum, Polygon, Optimism, Arbitrum, and others

## cURL Examples

### Get Top Protocols
```bash
curl -X GET "http://localhost:5000/api/protocols?limit=10&chain=Ethereum" \
  -H "Content-Type: application/json"
```

### Get USDC Protocols
```bash
curl -X GET "http://localhost:5000/api/protocols/USDC" \
  -H "Content-Type: application/json"
```

### Get Aave APY
```bash
curl -X GET "http://localhost:5000/api/apy/Aave" \
  -H "Content-Type: application/json"
```

### Run Simulation
```bash
curl -X POST "http://localhost:5000/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x1234567890abcdef1234567890abcdef12345678"
  }'
```

---

## Running the Servers

### 1. Start Backend (cre-backend)
```bash
cd cre-backend
npm install
npm run server
# Server running on http://localhost:5000
```

### 2. Start Frontend (smart-apy-swap)
```bash
cd smart-apy-swap
npm install
npm run dev
# Frontend running on http://localhost:5173
```

### 3. Test the Connection
```bash
# Check if backend is running
curl http://localhost:5000/health

# Fetch real protocols
curl http://localhost:5000/api/protocols

# Run a simulation
curl -X POST http://localhost:5000/simulate -H "Content-Type: application/json" -d '{"wallet":"0x123"}'
```

---

## Key Features

✅ **Real APY Data**: Live data from DefiLlama API (no more hardcoded values)  
✅ **Multiple Protocols**: Aave, Compound, Lido, Curve, Yearn, Beefy, and 100+ more  
✅ **Multiple Assets**: USDC, USDT, DAI, ETH, and hundreds of tokens  
✅ **Automatic Fallback**: If API is down, uses sensible default values  
✅ **Fast Updates**: APY data updates with each request (real-time)  
✅ **Type-Safe**: Full TypeScript support for all API functions  

---

## Troubleshooting

### Backend Returns Empty Data
**Problem**: `/api/protocols` returns empty array
**Solution**: DefiLlama API might be rate-limited or down. Check:
```bash
# Test DefiLlama directly
curl https://yields.llama.fi/pools | head -50
```

### Real APY Data Not Showing in Frontend
**Problem**: Frontend still shows hardcoded values
**Solution**: Update your components to use the new API functions:
```typescript
// OLD: Using hardcoded PROTOCOLS array
import { PROTOCOLS } from './lib/protocols';

// NEW: Fetch real data
import { fetchRealProtocols } from './lib/api';
```

### CORS Errors
**Problem**: `CORS policy: Response to preflight request...`
**Solution**: Make sure backend PORT is 5000 and frontend uses correct URL:
```typescript
const BACKEND_URL = 'http://localhost:5000'; // ✅ Correct
```

---

## Next Steps

1. ✅ Update your protocol display components to fetch real data
2. ✅ Create a custom hook to manage protocol fetching
3. ✅ Add caching to reduce API calls
4. ✅ Display APY update timestamps
5. ✅ Add error handling for API failures

---

## Support

For issues or questions about real APY data integration, check:
- Backend logs: Look for `✓ Fetched X pools from DefiLlama`
- Frontend console: Check for API call errors
- DefiLlama status: https://defillama.com
