# Quick Reference Card

## Project Overview

**DeFi Yield Optimizer Backend** - Node.js + Express + MongoDB

---

## Installation (30 seconds)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Server runs on:** `http://localhost:5000`

---

## Main Files

| File | Purpose |
|------|---------|
| `server.js` | Main server with routes & middleware |
| `models/Investment.js` | User investment data schema |
| `models/Protocol.js` | DeFi protocol APY data schema |
| `controllers/investmentController.js` | Investment business logic |
| `controllers/protocolController.js` | Protocol business logic |
| `routes/investmentRoutes.js` | Investment API endpoints |
| `routes/protocolRoutes.js` | Protocol API endpoints |
| `utils/apy-fetcher.js` | APY data fetching & comparison |
| `middleware/errorHandler.js` | Error handling |

---

## Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/defi-optimizer
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## API Endpoints (Quick Reference)

### Protocols
```
GET    /api/protocols                    # Get all
GET    /api/protocols/best?asset=USDC   # Best for asset
GET    /api/protocols/compare/USDC      # Compare
GET    /api/protocols/Aave              # Specific
POST   /api/protocols/refresh           # Update data
```

### Investments
```
POST   /api/investments                 # Create
GET    /api/investments/:userId         # User's investments
GET    /api/investments/detail/:id      # Details
PUT    /api/investments/:id             # Update
DELETE /api/investments/:id             # Delete
POST   /api/investments/:id/check-better-apy  # Monitor APY
```

---

## Example Usage

### Get Best Protocol for USDC
```javascript
fetch('http://localhost:5000/api/protocols/best?asset=USDC')
  .then(r => r.json())
  .then(d => console.log(d.data)); // { name: 'Yearn', apy: 6.2, ... }
```

### Create Investment
```javascript
fetch('http://localhost:5000/api/investments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: '0x742d35...',
    amount: 1000,
    asset: 'USDC',
    selectedProtocol: 'Yearn',
    apy: 6.2
  })
})
.then(r => r.json())
.then(d => console.log(d.data._id)); // Save this ID
```

### Monitor Investment
```javascript
fetch(`http://localhost:5000/api/investments/${investmentId}/check-better-apy`, {
  method: 'POST'
})
.then(r => r.json())
.then(d => {
  if (d.data.betterAPYFound) {
    console.log(`Better APY at ${d.data.betterProtocol}`);
  }
});
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB wrapper |
| `cors` | Enable frontend access |
| `dotenv` | Environment variables |
| `axios` | HTTP requests |
| `nodemon` | Auto-reload (dev) |

---

## Supported Assets

- USDC
- USDT
- DAI
- ETH
- WETH

---

## Supported Protocols

1. **Aave** - Decentralized Lending
2. **Compound** - Money Market Protocol
3. **Yearn** - Yield Optimizer
4. **Beefy** - Multi-chain Yield Optimizer

---

## Database Schema (Simple View)

### Investment
```
{
  userId: String,
  amount: Number,
  asset: String (USDC|USDT|DAI|ETH|WETH),
  selectedProtocol: String (Aave|Compound|Yearn|Beefy),
  apy: Number,
  status: String (active|completed|withdrawn),
  beaterProtocol: String or null,
  ...timestamps
}
```

### Protocol
```
{
  name: String (unique),
  assets: { USDC: 5.2, DAI: 4.9, ... },
  description: String,
  url: String,
  lastUpdated: Date,
  ...timestamps
}
```

---

## Testing

### Test with curl
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/protocols
curl "http://localhost:5000/api/protocols/best?asset=USDC"
```

### Create and test investment
```bash
# Save the _id from response
curl -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "amount": 1000,
    "asset": "USDC",
    "selectedProtocol": "Yearn",
    "apy": 6.2
  }'

# Use the _id in check-better-apy
curl -X POST http://localhost:5000/api/investments/{_id}/check-better-apy
```

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "count": 4
}
```

### Error
```json
{
  "success": false,
  "error": {
    "message": "..."
  }
}
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Cannot connect MongoDB | Check MONGODB_URI in .env |
| Port 5000 in use | Kill process or change PORT |
| CORS error | Update FRONTEND_URL in .env |
| Modules not found | Run `npm install` |
| .env not loading | Restart server |

---

## Frontend Integration

Update your React component:

```javascript
// src/api.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const protocolAPI = {
  getBestProtocol: (asset) =>
    apiClient.get('/protocols/best', { params: { asset } }),
  compareAPY: (asset) =>
    apiClient.get(`/protocols/compare/${asset}`),
};

export const investmentAPI = {
  createInvestment: (data) =>
    apiClient.post('/investments', data),
  getUserInvestments: (userId) =>
    apiClient.get(`/investments/${userId}`),
  checkBetterAPY: (investmentId) =>
    apiClient.post(`/investments/${investmentId}/check-better-apy`),
};
```

Then in components:
```javascript
import { protocolAPI, investmentAPI } from './api';

// Get best protocol
const best = await protocolAPI.getBestProtocol('USDC');

// Create investment
const inv = await investmentAPI.createInvestment({...});
```

---

## Mock APY Data

Current test rates (from utils/apy-fetcher.js):

```
Asset   | Aave  | Compound | Yearn | Beefy
--------|-------|----------|-------|-------
USDC    | 5.2%  | 4.8%    | 6.2%  | 5.9%
USDT    | 5.1%  | 4.7%    | 6.0%  | 5.7%
DAI     | 4.9%  | 4.5%    | 5.8%  | 5.5%
ETH     | 2.3%  | 2.1%    | 3.2%  | 3.0%
WETH    | 2.3%  | 2.1%    | 3.2%  | 3.0%
```

To use real data, replace mock functions with actual API calls.

---

## Info Commands

```bash
# Check server status
curl http://localhost:5000/

# Health check
curl http://localhost:5000/api/health

# List all routes via code
# Check server.js and routes/ files

# Check MongoDB connection
# Watch console output when server starts
```

---

## File Sizes (Approximate)

- server.js: 100 lines
- models/: 120 lines total
- controllers/: 250 lines total
- routes/: 70 lines total
- utils/apy-fetcher.js: 180 lines
- middleware/: 50 lines

**Total: ~770 lines of code** - Beginner-friendly!

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Setup .env file
3. ✅ Start with `npm run dev`
4. ✅ Test endpoints
5. ✅ Connect frontend
6. ✅ Deploy when ready

---

## Documentation

- `README.md` - Complete API docs
- `QUICKSTART.md` - Setup steps
- `API_TESTING.md` - Testing examples
- `FRONTEND_INTEGRATION.md` - Frontend code
- `SETUP_COMPLETE.md` - Overview

---

**Ready to deploy? See deployment section in README.md**

Made with ❤️ for DeFi developers
