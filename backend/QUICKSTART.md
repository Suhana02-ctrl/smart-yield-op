# Quick Start Guide

Follow these steps to set up and run the DeFi Optimizer Backend.

## Step 1: Prerequisites

Ensure you have installed:
- **Node.js** v16+ ([Download](https://nodejs.org))
- **MongoDB** (local or Atlas account: [mongodb.com](https://mongodb.com))
- **Git** ([Download](https://git-scm.com))

## Step 2: Create Backend Directory

```bash
# Navigate to your project root
cd your-project-root

# Create backend folder
mkdir backend
cd backend
```

## Step 3: Copy Project Files

Copy all the files from this backend folder into your `backend/` directory.

Your folder structure should look like:
```
your-project-root/
├── smart-apy-swap/          # Your frontend
└── backend/                 # Your new backend
    ├── models/
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── utils/
    ├── server.js
    ├── package.json
    ├── .env.example
    └── README.md
```

## Step 4: Install Dependencies

```bash
# Make sure you're in the backend directory
cd backend

# Install all dependencies
npm install
# or
bun install
```

**Dependencies installed:**
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `cors` - Enable frontend access
- `dotenv` - Environment variables
- `axios` - HTTP requests
- `nodemon` (dev) - Auto-reload during development

## Step 5: Set Up Environment Variables

### Option A: Local MongoDB

1. Ensure MongoDB is running locally:
   ```bash
   # Windows (if installed with chocolatey)
   mongod
   
   # macOS (if installed with brew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Your `.env` should look like:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/defi-optimizer
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a cluster and get connection string

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update with your Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/defi-optimizer?retryWrites=true&w=majority
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

## Step 6: Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   DeFi Optimizer Backend Server        ║
╚════════════════════════════════════════╝
✓ Server running on port 5000
✓ Environment: development
✓ Frontend URL: http://localhost:5173

Available endpoints:
  GET  http://localhost:5000/
  GET  http://localhost:5000/api/health
  GET  http://localhost:5000/api/protocols
  GET  http://localhost:5000/api/protocols/best?asset=USDC
  POST http://localhost:5000/api/investments
```

## Step 7: Test the API

Open your browser and test:

```
http://localhost:5000/api/health
```

You should get:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-24T10:30:00.000Z"
}
```

## Step 8: Connect Frontend to Backend

Update your frontend `.env` to point to the backend:

In your `smart-apy-swap/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

Then use the API client in your frontend:

```javascript
// In your React component
import { protocolAPI, investmentAPI } from '../path/to/api-client';

// Get best protocol
const best = await protocolAPI.getBestProtocol('USDC');

// Create investment
const investment = await investmentAPI.createInvestment({
  userId: '0x...',
  amount: 1000,
  asset: 'USDC',
  selectedProtocol: 'Yearn',
  apy: 6.2
});
```

See `FRONTEND_INTEGRATION.md` for complete examples.

## Troubleshooting

### MongoDB Connection Refused

**Problem:** `MongooseError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port 5000 Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

Or change port in `.env`:
```env
PORT=5001
```

### CORS Error from Frontend

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Update `.env`:
```env
FRONTEND_URL=http://localhost:3000  # Your actual frontend URL
```

Supported browsers must match exactly (including port).

### .env File Not Loading

**Problem:** Environment variables are `undefined`

**Solution:**
1. Delete `.env` and recreate it
2. Make sure you're in the `backend/` directory when running the server
3. Restart the server after creating `.env`

## Next Steps

1. **Test all endpoints** using Postman or curl
2. **Connect frontend** using the API client
3. **Deploy backend** to Heroku, Railway, or your preferred platform
4. **Add real API integration** for live APY data
5. **Add authentication** for user security

## Useful Commands

```bash
# Install a specific package
npm install package-name

# Update all packages
npm update

# Check for vulnerabilities
npm audit

# Run tests (when configured)
npm test

# Stop the server
# Press Ctrl+C in the terminal
```

## API Documentation

For complete API documentation, see [README.md](README.md)

## Support

If you encounter issues:
1. Check the logs in the terminal
2. Review the README.md for API details
3. Verify `.env` configuration
4. Ensure MongoDB is running

Happy coding! 🚀
