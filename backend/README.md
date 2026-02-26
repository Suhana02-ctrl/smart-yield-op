# DeFi Yield Optimizer - Backend

A robust Node.js + Express backend for the DeFi Yield Optimizer app. This API provides functionality for managing investments, fetching APY/APR data from multiple DeFi protocols, and recommending the best protocols based on real-time rates.

## Features

✅ **User Investment Management** - Store and manage user investment details  
✅ **Multi-Protocol APY Fetching** - Fetch APY data from Aave, Compound, Yearn, and Beefy  
✅ **APY Comparison & Recommendations** - Compare rates and suggest best protocols  
✅ **APY Monitoring** - Check if better rates become available  
✅ **MongoDB Integration** - Persistent data storage with Mongoose  
✅ **RESTful API** - Clean, well-documented endpoints  
✅ **Error Handling** - Comprehensive error handling and validation  
✅ **CORS Enabled** - Ready for frontend integration  

---

## Project Structure

```
backend/
├── models/                 # Database schemas
│   ├── Investment.js      # Investment schema
│   └── Protocol.js        # Protocol schema
├── controllers/           # Business logic
│   ├── investmentController.js
│   └── protocolController.js
├── routes/               # API endpoints
│   ├── investmentRoutes.js
│   └── protocolRoutes.js
├── middleware/           # Custom middleware
│   └── errorHandler.js
├── utils/               # Utility functions
│   └── apy-fetcher.js
├── .env.example         # Environment variables template
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # This file
```

---

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas cloud)
- **npm** or **bun** package manager

---

## Installation

### 1. Clone or create the backend folder

```bash
cd your-project-root
mkdir backend
cd backend
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Create `.env` file

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Update your `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/defi-optimizer
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/defi-optimizer?retryWrites=true&w=majority
```

---

## Running the Server

### Development mode (with auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The server will start on `http://localhost:5000`

---

## API Endpoints

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-24T10:30:00.000Z"
}
```

---

### Protocols Endpoints

#### Get All Protocols

```http
GET /api/protocols
```

**Response:**
```json
{
  "success": true,
  "message": "All protocols retrieved successfully",
  "count": 4,
  "data": [
    {
      "name": "Aave",
      "assets": {
        "USDC": 5.2,
        "USDT": 5.1,
        "DAI": 4.9,
        "ETH": 2.3,
        "WETH": 2.3
      },
      "description": "Decentralized lending protocol",
      "url": "https://aave.com",
      "lastUpdated": "2024-02-24T10:30:00.000Z",
      "dataSource": "aave-api"
    },
    {
      "name": "Compound",
      "assets": {
        "USDC": 4.8,
        "USDT": 4.7,
        "DAI": 4.5,
        "ETH": 2.1,
        "WETH": 2.1
      },
      "description": "Algorithmic money market protocol",
      "url": "https://compound.finance",
      "lastUpdated": "2024-02-24T10:30:00.000Z",
      "dataSource": "compound-api"
    },
    {
      "name": "Yearn",
      "assets": {
        "USDC": 6.2,
        "USDT": 6.0,
        "DAI": 5.8,
        "ETH": 3.2,
        "WETH": 3.2
      },
      "description": "Yield farming optimizer",
      "url": "https://yearn.finance",
      "lastUpdated": "2024-02-24T10:30:00.000Z",
      "dataSource": "yearn-api"
    },
    {
      "name": "Beefy",
      "assets": {
        "USDC": 5.9,
        "USDT": 5.7,
        "DAI": 5.5,
        "ETH": 3.0,
        "WETH": 3.0
      },
      "description": "Yield farming optimizer on multiple chains",
      "url": "https://beefy.finance",
      "lastUpdated": "2024-02-24T10:30:00.000Z",
      "dataSource": "beefy-api"
    }
  ]
}
```

---

#### Get Best Protocol for Asset

```http
GET /api/protocols/best?asset=USDC
```

**Response:**
```json
{
  "success": true,
  "message": "Best protocol found for USDC",
  "asset": "USDC",
  "data": {
    "name": "Yearn",
    "apy": 6.2,
    "url": "https://yearn.finance"
  }
}
```

---

#### Compare APY for Asset

```http
GET /api/protocols/compare/USDC
```

**Response:**
```json
{
  "success": true,
  "message": "APY comparison for USDC retrieved successfully",
  "asset": "USDC",
  "count": 4,
  "bestProtocol": {
    "protocol": "Yearn",
    "apy": 6.2,
    "url": "https://yearn.finance",
    "description": "Yield farming optimizer"
  },
  "data": [
    {
      "protocol": "Yearn",
      "apy": 6.2,
      "url": "https://yearn.finance",
      "description": "Yield farming optimizer"
    },
    {
      "protocol": "Beefy",
      "apy": 5.9,
      "url": "https://beefy.finance",
      "description": "Yield farming optimizer on multiple chains"
    },
    {
      "protocol": "Aave",
      "apy": 5.2,
      "url": "https://aave.com",
      "description": "Decentralized lending protocol"
    },
    {
      "protocol": "Compound",
      "apy": 4.8,
      "url": "https://compound.finance",
      "description": "Algorithmic money market protocol"
    }
  ]
}
```

---

#### Get Specific Protocol

```http
GET /api/protocols/Aave
```

**Response:**
```json
{
  "success": true,
  "message": "Aave protocol retrieved successfully",
  "data": {
    "name": "Aave",
    "assets": {
      "USDC": 5.2,
      "USDT": 5.1,
      "DAI": 4.9,
      "ETH": 2.3,
      "WETH": 2.3
    },
    "description": "Decentralized lending protocol",
    "url": "https://aave.com",
    "lastUpdated": "2024-02-24T10:30:00.000Z",
    "dataSource": "aave-api"
  }
}
```

---

#### Refresh Protocol Data

```http
POST /api/protocols/refresh
```

**Request Body:** (empty)

**Response:** (same as Get All Protocols)

---

### Investments Endpoints

#### Create Investment

```http
POST /api/investments
```

**Request Body:**
```json
{
  "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
  "amount": 1000,
  "asset": "USDC",
  "selectedProtocol": "Yearn",
  "apy": 6.2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Investment created successfully",
  "data": {
    "_id": "65d8a3f2c4e8b1a2c3d4e5f6",
    "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "amount": 1000,
    "asset": "USDC",
    "selectedProtocol": "Yearn",
    "apy": 6.2,
    "status": "active",
    "investedAt": "2024-02-24T10:30:00.000Z",
    "lastMonitoredAt": "2024-02-24T10:30:00.000Z",
    "beaterProtocol": null,
    "notes": null,
    "createdAt": "2024-02-24T10:30:00.000Z",
    "updatedAt": "2024-02-24T10:30:00.000Z"
  }
}
```

---

#### Get User Investments

```http
GET /api/investments/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb
```

**Response:**
```json
{
  "success": true,
  "message": "Investments retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "65d8a3f2c4e8b1a2c3d4e5f6",
      "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
      "amount": 1000,
      "asset": "USDC",
      "selectedProtocol": "Yearn",
      "apy": 6.2,
      "status": "active",
      "investedAt": "2024-02-24T10:30:00.000Z",
      "lastMonitoredAt": "2024-02-24T10:30:00.000Z",
      "beaterProtocol": null,
      "notes": null,
      "createdAt": "2024-02-24T10:30:00.000Z",
      "updatedAt": "2024-02-24T10:30:00.000Z"
    },
    {
      "_id": "65d8a3f2c4e8b1a2c3d4e5f7",
      "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
      "amount": 5000,
      "asset": "DAI",
      "selectedProtocol": "Aave",
      "apy": 4.9,
      "status": "active",
      "investedAt": "2024-02-24T09:00:00.000Z",
      "lastMonitoredAt": "2024-02-24T10:00:00.000Z",
      "beaterProtocol": "Yearn",
      "notes": "Better APY available at Yearn (5.8%)",
      "createdAt": "2024-02-24T09:00:00.000Z",
      "updatedAt": "2024-02-24T10:00:00.000Z"
    }
  ]
}
```

---

#### Get Specific Investment

```http
GET /api/investments/detail/65d8a3f2c4e8b1a2c3d4e5f6
```

**Response:**
```json
{
  "success": true,
  "message": "Investment retrieved successfully",
  "data": {
    "_id": "65d8a3f2c4e8b1a2c3d4e5f6",
    "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "amount": 1000,
    "asset": "USDC",
    "selectedProtocol": "Yearn",
    "apy": 6.2,
    "status": "active",
    "investedAt": "2024-02-24T10:30:00.000Z",
    "lastMonitoredAt": "2024-02-24T10:30:00.000Z",
    "beaterProtocol": null,
    "notes": null,
    "createdAt": "2024-02-24T10:30:00.000Z",
    "updatedAt": "2024-02-24T10:30:00.000Z"
  }
}
```

---

#### Check for Better APY

```http
POST /api/investments/65d8a3f2c4e8b1a2c3d4e5f6/check-better-apy
```

**Response (Better APY not found):**
```json
{
  "success": true,
  "message": "Current protocol has best APY",
  "data": {
    "betterAPYFound": false,
    "currentAPY": 6.2,
    "currentProtocol": "Yearn"
  }
}
```

**Response (Better APY found):**
```json
{
  "success": true,
  "message": "Better APY found",
  "data": {
    "betterAPYFound": true,
    "currentAPY": 4.9,
    "currentProtocol": "Aave",
    "betterAPY": 5.8,
    "betterProtocol": "Yearn",
    "apyImprovement": "0.90"
  }
}
```

---

#### Update Investment

```http
PUT /api/investments/65d8a3f2c4e8b1a2c3d4e5f6
```

**Request Body:**
```json
{
  "status": "withdrawn",
  "notes": "Withdrew early due to market volatility"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Investment updated successfully",
  "data": {
    "_id": "65d8a3f2c4e8b1a2c3d4e5f6",
    "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "amount": 1000,
    "asset": "USDC",
    "selectedProtocol": "Yearn",
    "apy": 6.2,
    "status": "withdrawn",
    "investedAt": "2024-02-24T10:30:00.000Z",
    "lastMonitoredAt": "2024-02-24T10:30:00.000Z",
    "beaterProtocol": null,
    "notes": "Withdrew early due to market volatility",
    "createdAt": "2024-02-24T10:30:00.000Z",
    "updatedAt": "2024-02-24T10:31:00.000Z"
  }
}
```

---

#### Delete Investment

```http
DELETE /api/investments/65d8a3f2c4e8b1a2c3d4e5f6
```

**Response:**
```json
{
  "success": true,
  "message": "Investment deleted successfully",
  "data": {
    "_id": "65d8a3f2c4e8b1a2c3d4e5f6",
    "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "amount": 1000,
    "asset": "USDC",
    "selectedProtocol": "Yearn",
    "apy": 6.2,
    "status": "active",
    "investedAt": "2024-02-24T10:30:00.000Z",
    "lastMonitoredAt": "2024-02-24T10:30:00.000Z",
    "beaterProtocol": null,
    "notes": null,
    "createdAt": "2024-02-24T10:30:00.000Z",
    "updatedAt": "2024-02-24T10:30:00.000Z"
  }
}
```

---

## Database Schema

### Investment Schema

```javascript
{
  userId: String,                    // User wallet address
  amount: Number,                    // Investment amount
  asset: String,                     // USDC, USDT, DAI, ETH, WETH
  selectedProtocol: String,          // Aave, Compound, Yearn, Beefy
  apy: Number,                       // APY at time of investment
  status: String,                    // active, completed, withdrawn
  investedAt: Date,                  // When investment was made
  lastMonitoredAt: Date,             // Last APY check time
  beaterProtocol: String,            // Protocol with better APY
  notes: String,                     // Additional notes
  createdAt: Date,                   // Auto-generated
  updatedAt: Date                    // Auto-generated
}
```

### Protocol Schema

```javascript
{
  name: String,                      // Aave, Compound, Yearn, Beefy
  assets: Map<String, Number>,       // {USDC: 5.2, DAI: 4.9, ...}
  description: String,               // Protocol description
  url: String,                       // Protocol website
  lastUpdated: Date,                 // When data was fetched
  dataSource: String,                // API source
  createdAt: Date,                   // Auto-generated
  updatedAt: Date                    // Auto-generated
}
```

---

## Error Handling

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Missing required fields"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Investment not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal Server Error"
  }
}
```

---

## CORS Configuration

The backend is configured to accept requests from your frontend URL (default: `http://localhost:5173`).

Update `FRONTEND_URL` in `.env` to change this.

---

## Advanced: Adding Real Protocol APIs

To use real APY data instead of mocks, update the utility functions in `utils/apy-fetcher.js`:

### Example: Integrating Aave API

```javascript
import axios from 'axios';

export const fetchAaveAPY = async () => {
  try {
    const response = await axios.get(
      'https://api.aave.com/data/rates-history',
      {
        params: { reserve: 'USDC' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Aave API error:', error);
    throw error;
  }
};
```

---

## Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_atlas_url
git push heroku main
```

### Deploy to Vercel/Railway

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

---

## Troubleshooting

### MongoDB Connection Error
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB service is running
- Verify database credentials

### CORS Error
- Update `FRONTEND_URL` in `.env`
- Ensure frontend is running on correct port

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

---

## License

MIT

---

## Support

For issues or questions, please open an issue in the repository.
