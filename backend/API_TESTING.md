# API Testing Guide

Test all backend endpoints using curl, Postman, or any HTTP client.

## Quick Test Commands

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-24T10:30:00.000Z"
}
```

---

## Protocol Endpoints

### Get All Protocols

```bash
curl http://localhost:5000/api/protocols
```

### Get Best Protocol for USDC

```bash
curl "http://localhost:5000/api/protocols/best?asset=USDC"
```

### Get Best Protocol for DAI

```bash
curl "http://localhost:5000/api/protocols/best?asset=DAI"
```

### Compare APY for USDC

```bash
curl http://localhost:5000/api/protocols/compare/USDC
```

### Get Specific Protocol (Aave)

```bash
curl http://localhost:5000/api/protocols/Aave
```

### Refresh Protocol Data

```bash
curl -X POST http://localhost:5000/api/protocols/refresh
```

---

## Investment Endpoints

### Create Investment

```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "amount": 1000,
    "asset": "USDC",
    "selectedProtocol": "Yearn",
    "apy": 6.2
  }'
```

**Copy the returned `_id` for use in other requests.**

### Get User Investments

Replace `USER_ID` with actual user ID:

```bash
curl http://localhost:5000/api/investments/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb
```

### Get Specific Investment

Replace `INVESTMENT_ID` with actual ID from create response:

```bash
curl http://localhost:5000/api/investments/detail/INVESTMENT_ID
```

**Example:**
```bash
curl http://localhost:5000/api/investments/detail/65d8a3f2c4e8b1a2c3d4e5f6
```

### Check for Better APY

Replace `INVESTMENT_ID`:

```bash
curl -X POST http://localhost:5000/api/investments/INVESTMENT_ID/check-better-apy
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/investments/65d8a3f2c4e8b1a2c3d4e5f6/check-better-apy
```

### Update Investment

Replace `INVESTMENT_ID`:

```bash
curl -X PUT http://localhost:5000/api/investments/INVESTMENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "withdrawn",
    "notes": "Market volatility - took profits"
  }'
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/investments/65d8a3f2c4e8b1a2c3d4e5f6 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "withdrawn",
    "notes": "Market volatility - took profits"
  }'
```

### Delete Investment

Replace `INVESTMENT_ID`:

```bash
curl -X DELETE http://localhost:5000/api/investments/INVESTMENT_ID
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/investments/65d8a3f2c4e8b1a2c3d4e5f6
```

---

## Using Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Select **Raw Text**
4. Paste the following JSON:

```json
{
  "info": {
    "name": "DeFi Optimizer API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/health"
      }
    },
    {
      "name": "Get All Protocols",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/protocols"
      }
    },
    {
      "name": "Get Best Protocol (USDC)",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/protocols/best?asset=USDC"
      }
    },
    {
      "name": "Compare APY (USDC)",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/protocols/compare/USDC"
      }
    },
    {
      "name": "Create Investment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "{{base_url}}/api/investments",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": \"0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb\",\n  \"amount\": 1000,\n  \"asset\": \"USDC\",\n  \"selectedProtocol\": \"Yearn\",\n  \"apy\": 6.2\n}"
        }
      }
    },
    {
      "name": "Get User Investments",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/investments/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb"
      }
    },
    {
      "name": "Get Investment Detail",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/investments/detail/{{investment_id}}"
      }
    },
    {
      "name": "Check Better APY",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/investments/{{investment_id}}/check-better-apy"
      }
    },
    {
      "name": "Update Investment",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": "{{base_url}}/api/investments/{{investment_id}}",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"withdrawn\",\n  \"notes\": \"Test note\"\n}"
        }
      }
    },
    {
      "name": "Delete Investment",
      "request": {
        "method": "DELETE",
        "url": "{{base_url}}/api/investments/{{investment_id}}"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    },
    {
      "key": "investment_id",
      "value": ""
    }
  ]
}
```

5. Set variables:
   - `base_url`: `http://localhost:5000`
   - `investment_id`: (paste from create response)

---

## Testing Workflow

### 1. Start with Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Get Available Protocols
```bash
curl http://localhost:5000/api/protocols
```

### 3. Find Best Protocol
```bash
curl "http://localhost:5000/api/protocols/best?asset=USDC"
```

### 4. Create an Investment
```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb",
    "amount": 1000,
    "asset": "USDC",
    "selectedProtocol": "Yearn",
    "apy": 6.2
  }'
```

**Save the `_id` from response (e.g., `65d8a3f2c4e8b1a2c3d4e5f6`)**

### 5. Check User Investments
```bash
curl http://localhost:5000/api/investments/0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb
```

### 6. Check for Better APY
```bash
curl -X POST http://localhost:5000/api/investments/65d8a3f2c4e8b1a2c3d4e5f6/check-better-apy
```

### 7. Update Investment Status
```bash
curl -X PUT http://localhost:5000/api/investments/65d8a3f2c4e8b1a2c3d4e5f6 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Successfully harvested gains"
  }'
```

### 8. Delete Investment
```bash
curl -X DELETE http://localhost:5000/api/investments/65d8a3f2c4e8b1a2c3d4e5f6
```

---

## Expected Responses Summary

| Endpoint | Method | Status | Response |
|----------|--------|--------|----------|
| `/api/health` | GET | 200 | Health status |
| `/api/protocols` | GET | 200 | All protocols |
| `/api/protocols/best?asset=USDC` | GET | 200 | Best protocol |
| `/api/protocols/compare/USDC` | GET | 200 | Comparison array |
| `/api/investments` | POST | 201 | Created investment |
| `/api/investments/:userId` | GET | 200 | User investments |
| `/api/investments/detail/:id` | GET | 200 | Investment details |
| `/api/investments/:id` | PUT | 200 | Updated investment |
| `/api/investments/:id/check-better-apy` | POST | 200 | APY check result |
| `/api/investments/:id` | DELETE | 200 | Deletion confirmation |

---

## Error Testing

### Test 400 Bad Request
```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -d '{ "amount": 100 }'  # Missing required fields
```

### Test 404 Not Found
```bash
curl http://localhost:5000/api/investments/invalid-id
```

### Test 404 Route Not Found
```bash
curl http://localhost:5000/api/nonexistent
```

---

## Tips & Tricks

### Use Pretty Print JSON
```bash
# macOS/Linux
curl http://localhost:5000/api/protocols | jq .

# Windows (Requires jq)
curl http://localhost:5000/api/protocols | jq.exe .
```

### Save Response to File
```bash
curl http://localhost:5000/api/protocols > protocols.json
```

### Extract Investment ID from Response
```bash
curl -s -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -d '{"userId":"0x742...","amount":1000,"asset":"USDC","selectedProtocol":"Yearn","apy":6.2}' \
  | grep -o '"_id":"[^"]*"'
```

---

## Debugging Tips

1. **Check server logs** - Watch the terminal where server is running
2. **Verify MongoDB** - Check if MongoDB is running and connected
3. **Check CORS** - Make sure `FRONTEND_URL` in `.env` is correct
4. **Test with simple endpoints first** - Health check confirms server is running

---

For more details, see [README.md](README.md)
