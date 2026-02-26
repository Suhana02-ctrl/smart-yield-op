# DeFi Auto Yield Optimizer - Setup Guide

Complete setup guide for integrating frontend and backend with wallet connect.

## Project Structure

```
smart-apy-swap/                    # Frontend (React + Vite)
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx      # ✅ NEW: Wallet connection component
│   │   ├── SimulationRunner.tsx    # ✅ NEW: Simulation runner component
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts                 # ✅ NEW: Backend API utilities
│   │   └── ...
│   ├── pages/
│   │   └── Index.tsx              # ✅ UPDATED: Integrated wallet + simulation
│   └── ...
├── .env                           # ✅ UPDATED: Backend URL configuration
├── vite.config.ts                 # ✅ UPDATED: Proxy configuration for local dev
└── ...

cre-backend/                        # Backend (Node.js + Express + TypeScript)
├── src/
│   ├── server.ts                  # ✅ NEW: Express server with /simulate endpoint
│   ├── workflows/
│   │   ├── yieldOptimization.ts
│   │   └── ... (getState(), execute() methods exposed)
│   └── ...
├── .env                           # ✅ UPDATED: Server configuration
├── package.json                   # ✅ UPDATED: Express, CORS dependencies + server script
└── ...
```

## Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd cre-backend
npm install
```

This installs:
- `express` - HTTP server framework
- `cors` - Cross-Origin Resource Sharing middleware
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable loader
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript runtime

### Step 2: Configure Backend Environment

The `.env` file is pre-configured:

```env
PORT=5000
FRONTEND_URL=http://localhost:8080
DEFI_LLAMA_API=https://yields.llama.fi/pools
APY_DIFFERENCE_THRESHOLD=2.0
COOLDOWN_HOURS=24
SIMULATE_MODE=true
```

No changes needed unless you want to customize:
- `PORT`: Backend server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:8080)
- `APY_DIFFERENCE_THRESHOLD`: Minimum APY difference to trigger rebalancing (default: 2.0%)
- `COOLDOWN_HOURS`: Hours between rebalances per protocol (default: 24)

### Step 3: Install Frontend Dependencies

```bash
cd ../smart-apy-swap
npm install
# or use: bun install
```

### Step 4: Configure Frontend Environment

Frontend `.env` is already configured with:

```env
PRIVATE_KEY=93cfd2721f2502bd3e67913c0c7eca0a67de2838f2ae8baa01921e1057e30058
VITE_BACKEND_URL=http://localhost:5000
```

The `VITE_BACKEND_URL` is used by the API client to connect to your backend.

### Step 5: Start Both Servers

**Terminal 1 - Backend Server:**

```bash
cd cre-backend
npm run server
```

Output:
```
╔════════════════════════════════════════╗
║   DeFi Auto Yield Optimizer Backend    ║
║       Express Server Running           ║
╚════════════════════════════════════════╝

✓ Server running on http://localhost:5000
✓ CORS enabled for: http://localhost:8080
✓ CRE Workflow initialized
✓ Ready to receive /simulate requests

Available Endpoints
GET  http://localhost:5000/
GET  http://localhost:5000/health
POST http://localhost:5000/simulate
```

**Terminal 2 - Frontend Dev Server:**

```bash
cd smart-apy-swap
npm run dev
# or: bun run dev
```

Output:
```
Local:   http://localhost:8080/
```

## Features Overview

### 1. Wallet Connect (✅ NEW)

- **Component**: `src/components/WalletConnect.tsx`
- **Features**:
  - Detects MetaMask wallet
  - Requests wallet access with `eth_requestAccounts`
  - Uses ethers.js `BrowserProvider` for verification
  - Shows shortened address (0x1234...abcd)
  - Handles errors (MetaMask not installed, user rejection)

**Usage in UI**:
```
┌─────────────────────────────────┐
│  Connect Wallet                 │
└─────────────────────────────────┘
      ↓ click ↓
┌─────────────────────────────────┐
│ Connected: 0x1234...abcd        │
│ [Disconnect]                    │
└─────────────────────────────────┘
```

### 2. Simulation Runner (✅ NEW)

- **Component**: `src/components/SimulationRunner.tsx`
- **Features**:
  - Calls `/simulate` endpoint on backend
  - Sends wallet address in request
  - Shows loading state ("Simulation Running...")
  - Displays results:
    - Current protocol (e.g., "Yearn")
    - Showing "Switched from Aave to Yearn"
    - Rewards earned ($X.XX)
  - Handles errors with helpful messages
  - Can run multiple simulations

**Usage in UI**:
```
┌──────────────────────────────────┐
│ Run Yield Optimization           │
│ [Start Simulation] (loading...)  │
└──────────────────────────────────┘
      ↓ completes ↓
┌──────────────────────────────────┐
│ ✓ Simulation Completed           │
│ Current Protocol: Yearn          │
│ → Switched from Aave to Yearn    │
│ Rewards Earned: $25.50           │
│ [Run Another Simulation]         │
└──────────────────────────────────┘
```

### 3. Backend /simulate Endpoint (✅ NEW)

- **File**: `src/server.ts`
- **Endpoint**: `POST http://localhost:5000/simulate`
- **Request Body**:
  ```json
  {
    "wallet": "0x1234567890abcdef..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "protocol": "Yearn",
      "apy": 6.2,
      "rewards": 25.50,
      "previousProtocol": "Aave",
      "walletAddress": "0x1234567890abcdef...",
      "transactionSimulated": true
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "error": "Error message here"
  }
  ```

**How it works**:
1. Frontend sends POST request with wallet address
2. Backend calls `yieldOptimizationWorkflow.execute()`
3. Workflow fetches best protocol from DefiLlama
4. Compares APY with current protocol
5. If APY difference > 2%, simulates rebalancing
6. Returns results to frontend
7. Frontend updates UI with protocol switch info

## Workflow Execution Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ 1. User clicks "Start Simulation"
       │ 2. Sends POST /simulate with wallet
       │
       ▼
┌─────────────────────────────────┐
│    Express Server (5000)        │
│  Routes POST /simulate request  │
└────────┬────────────────────────┘
         │ 3. Calls yieldOptimizationWorkflow.execute()
         │
         ▼
┌─────────────────────────────────┐
│  YieldOptimizationWorkflow      │
│  - Trigger: Check time          │
│  - Action: Compare APY          │
│  - Service: Fetch from API      │
└────────┬────────────────────────┘
         │ 4. Gets current state
         │ 5. Compares protocols
         │ 6. Simulates rebalance
         │ 7. Returns results
         │
         ▼
┌─────────────┐
│   Frontend  │
│ Updates UI  │
└─────────────┘
  • Shows protocol
  • Shows rewards
  • Shows switch message
  • Adds to activity log
```

## Testing the Integration

### Test 1: Check Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend server is running",
  "timestamp": "2024-02-24T10:30:45.123Z"
}
```

### Test 2: Run Simulation via cURL

```bash
curl -X POST http://localhost:5000/simulate \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0x1234567890abcdef1234567890abcdef12345678"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "protocol": "Yearn",
    "apy": 6.2,
    "rewards": 25.50,
    "previousProtocol": "Aave",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "transactionSimulated": true
  }
}
```

### Test 3: Test in Frontend UI

1. Go to http://localhost:8080
2. Click "Connect Wallet"
3. Approve MetaMask connection (or use demo if unavailable)
4. Click "Start Simulation"
5. See results displayed immediately

## Troubleshooting

### Issue: "MetaMask is not installed"

**Solution**: 
- Install MetaMask browser extension from https://metamask.io
- Or test without MetaMask by adding fallback logic

### Issue: "Backend connection failed"

**Solution**:
- Check backend is running: `curl http://localhost:5000/health`
- Verify backend is on port 5000
- Check FRONTEND_URL in backend .env matches your frontend URL
- Check VITE_BACKEND_URL in frontend .env

### Issue: CORS errors

**Solution**:
- Backend has CORS enabled for `http://localhost:8080`
- If you changed port, update both:
  - Backend `.env`: `FRONTEND_URL=http://localhost:YOUR_PORT`
  - Frontend `.env`: `VITE_BACKEND_URL=http://localhost:5000`

### Issue: "No accounts found"

**Solution**:
- MetaMask wallet not connected
- Create/import wallet in MetaMask
- Try connecting again
- Check browser console for error details

## Code Files Added/Modified

### ✅ NEW FILES

1. **`cre-backend/src/server.ts`** (250 lines)
   - Express server with POST /simulate endpoint
   - CORS middleware configuration
   - Error handling
   - TypeScript types for requests/responses

2. **`smart-apy-swap/src/components/WalletConnect.tsx`** (150+ lines)
   - MetaMask connection component
   - Address formatting
   - Error handling
   - Styled buttons and display

3. **`smart-apy-swap/src/components/SimulationRunner.tsx`** (200+ lines)
   - Runs backend simulation
   - Shows loading state
   - Displays results
   - Error handling

4. **`smart-apy-swap/src/lib/api.ts`** (80+ lines)
   - API client for /simulate endpoint
   - Type definitions for requests/responses
   - Backend health check utility

### ⚡ MODIFIED FILES

1. **`cre-backend/package.json`**
   - Added `express`, `cors` to dependencies
   - Added `@types/express`, `@types/cors` to devDependencies
   - Added `server` script: `ts-node src/server.ts`

2. **`cre-backend/.env`**
   - Added `PORT=5000`
   - Added `FRONTEND_URL=http://localhost:8080`

3. **`smart-apy-swap/src/pages/Index.tsx`**
   - Imported `WalletConnect`, `SimulationRunner` components
   - Added `walletAddress` state
   - Added wallet connect/disconnect handlers
   - Added simulation complete handlers
   - Integrated components in JSX

4. **`smart-apy-swap/.env`**
   - Added `VITE_BACKEND_URL=http://localhost:5000`

5. **`smart-apy-swap/vite.config.ts`**
   - Added dev server proxy configuration for `/api` routes

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (http://localhost:8080)          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Index.tsx (Main Page)                          │ │  │
│  │  │  • Deposit Protocol cards                       │ │  │
│  │  │  • Activity Log display                         │ │  │
│  │  │  • Simulation Monitor                           │ │  │
│  │  │  • WalletConnect (NEW)                          │ │  │
│  │  │  • SimulationRunner (NEW)                       │ │  │
│  │  └────────────────────────┬────────────────────────┘ │  │
│  │                            │                          │  │
│  │  ┌────────────────────────▼────────────────────────┐ │  │
│  │  │  WalletConnect.tsx                              │ │  │
│  │  │  • Calls window.ethereum.request()             │ │  │
│  │  │  • Uses ethers.js BrowserProvider              │ │  │
│  │  │  • Returns wallet address                      │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  SimulationRunner.tsx                           │ │  │
│  │  │  • Calls api.runSimulation(wallet)             │ │  │
│  │  │  • Sends POST to backend /simulate            │ │  │
│  │  │  • Displays results                            │ │  │
│  │  └────────────┬─────────────────────────────────┘ │  │
│  │              │                                      │  │
│  │  ┌──────────▼────────────────────────────────────┐ │  │
│  │  │  api.ts / runSimulation()                      │ │  │
│  │  │  • Fetch to http://localhost:5000/simulate   │ │  │
│  │  │  • Sends: { wallet: "0x..." }                │ │  │
│  │  │  • Returns: { protocol, apy, rewards, ... } │ │  │
│  │  └──────────┬──────────────────────────────────┘ │  │
│  │             │                                      │  │
│  └─────────────┼──────────────────────────────────────┘  │
│                │ HTTP POST                                │
│                │ http://localhost:5000/simulate           │
│                │                                          │
└────────────────┼──────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│          Node.js Backend (http://localhost:5000)            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Express Server (server.ts)                 │  │
│  │                                                       │  │
│  │  POST /simulate                                      │  │
│  │  └─────────────────────────────────────────────────┐ │  │
│  │      1. Receive wallet address                      │ │  │
│  │      2. Call yieldOptimizationWorkflow.execute()   │ │  │
│  │      3. Workflow:                                  │ │  │
│  │         • Check cron trigger                        │ │  │
│  │         • Fetch APY from DefiLlama                 │ │  │
│  │         • Compare protocols                         │ │  │
│  │         • Check if >2% difference                  │ │  │
│  │         • Simulate rebalancing                      │ │  │
│  │         • Calculate gas fees                        │ │  │
│  │      4. Return results                             │ │  │
│  │  └────────────────────────┬──────────────────────┘ │  │
│  │                            │                        │  │
│  │  Return Response:           │                        │  │
│  │  {                          │                        │  │
│  │    "success": true,         │                        │  │
│  │    "data": {                │                        │  │
│  │      "protocol": "Yearn",   │                        │  │
│  │      "rewards": 25.50,      │                        │  │
│  │      ...                    │                        │  │
│  │    }                         │                        │  │
│  │  }                          │                        │  │
│  │                             │                        │  │
│  │  ┌────────────────────────▼─────────────────────┐  │  │
│  │  │  Integrated Services                          │  │  │
│  │  │  • DefiLlamaService (fetch APY)              │  │  │
│  │  │  • BlockchainSimulationService (simulate tx) │  │  │
│  │  │  • Logger (color-coded output)               │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Next Steps

1. ✅ Run both servers (backend on 5000, frontend on 8080)
2. ✅ Test wallet connection
3. ✅ Run simulations and see protocol switches
4. ✅ Monitor activity log for rebalancing events
5. 🔄 Customize thresholds in `.env` files as needed

## Additional Resources

- **Ethers.js Docs**: https://docs.ethers.org/
- **MetaMask Docs**: https://docs.metamask.io/
- **Express.js Docs**: https://expressjs.com/
- **TypeScript Docs**: https://www.typescriptlang.org/

---

Successfully integrated! Your DeFi Auto Yield Optimizer now has full wallet integration and backend simulation capabilities. 🚀
