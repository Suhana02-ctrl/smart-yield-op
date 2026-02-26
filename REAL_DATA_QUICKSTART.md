# 🚀 Quick Start - Real APY Data

Get real APY data from DefiLlama in **under 2 minutes**!

## Step 1: Start Backend with Real Data

```bash
cd cre-backend
npm run server
```

You should see:
```
✓ Server running on http://localhost:5000
✓ Ready to receive /simulate requests
✓ Available Endpoints
  GET  http://localhost:5000/api/protocols - Fetch top protocols with real APY
```

## Step 2: Test Real Data Endpoints

Open a new terminal:

### Get Top 10 Protocols (with REAL APY!)
```bash
curl http://localhost:5000/api/protocols?limit=10
```

### Get USDC Protocols
```bash
curl http://localhost:5000/api/protocols/USDC
```

### Get Current Aave APY
```bash
curl http://localhost:5000/api/apy/Aave
```

### Run Simulation with Real Data
```bash
curl -X POST http://localhost:5000/simulate \
  -H "Content-Type: application/json" \
  -d '{"wallet":"0x123abc"}'
```

## Step 3: Frontend - Use Real Data in Components

Update your React components to fetch real protocols:

```typescript
import { fetchRealProtocols } from './lib/api';

export default function ProtocolList() {
  const [protocols, setProtocols] = useState([]);

  useEffect(() => {
    (async () => {
      // Fetch REAL protocols with LIVE APY data
      const realProtocols = await fetchRealProtocols(10, 'Ethereum');
      setProtocols(realProtocols);
    })();
  }, []);

  return (
    <div>
      {protocols.map(protocol => (
        <div key={protocol.id}>
          <h3>{protocol.name}</h3>
          <p>APY: {protocol.apy}%</p>
          <p>TVL: {protocol.tvl}</p>
        </div>
      ))}
    </div>
  );
}
```

## Step 4: Start Frontend

```bash
cd smart-apy-swap
npm run dev
```

Now your frontend is showing **real APY data** from DefiLlama!

---

## What You Get

✅ **Real APY Data** from DefiLlama API  
✅ **10+ Top Protocols** by APY  
✅ **Multi-Asset Support** (USDC, DAI, ETH, etc.)  
✅ **Live Updates** - APY refreshes with each request  
✅ **Zero Hardcoded Values** - No more mock data!

---

## Example Real Data Response

```json
{
  "success": true,
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
    },
    {
      "id": "protocol_2",
      "name": "Compound V3",
      "chain": "Ethereum",
      "apy": 4.91,
      "tvl": "$3.2B",
      "symbol": "USDC"
    }
  ]
}
```

---

## Available Functions in `src/lib/api.ts`

| Function | Purpose | Returns |
|----------|---------|---------|
| `fetchRealProtocols()` | Get top protocols with real APY | `Protocol[]` |
| `fetchProtocolsForAsset()` | Get protocols for specific asset (USDC, etc) | `Protocol[]` |
| `fetchProtocolAPY()` | Get current APY for one protocol | `number` |
| `runSimulation()` | Run yield optimization with real data | `SimulationResult` |

---

## Troubleshooting

### Backend not starting?
```bash
# Make sure you're in the right directory
cd cre-backend

# Install dependencies
npm install

# Start the server
npm run server
```

### "Cannot find module" error?
```bash
# Reinstall dependencies
cd cre-backend
rm -rf node_modules
npm install
npm run server
```

### API returning empty data?
- DefiLlama might be rate-limited
- Check: `curl https://yields.llama.fi/pools`
- Backend will fall back to default safe values

---

## What Changed?

### Before (Mock Data)
```typescript
const PROTOCOLS = [
  { id: "aave-v3", name: "Aave V3", apy: 5.82 } // Hardcoded
]
```

### After (Real Data)
```typescript
const protocols = await fetchRealProtocols(10, 'Ethereum')
// Returns actual APY from DefiLlama API!
```

---

## Next Steps

1. ✅ Replace hardcoded PROTOCOLS in protocol display components
2. ✅ Add real data fetching to your simulation logic
3. ✅ Test with different assets (USDC, USDT, DAI, etc)
4. ✅ Check console for APY updates
5. ✅ Monitor backend logs for data fetches

---

**Happy optimizing with REAL APY data! 🎉**
