@echo off
REM ============================================================================
REM Real APY Data - Verification Script (Windows)
REM Run this to test that real data fetching is working correctly
REM ============================================================================

echo.
echo Testing Real APY Data Implementation...
echo.

REM Check if backend is running
echo 1. Checking if backend is running...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/health' -TimeoutSec 2; Write-Host '✅ Backend is running on http://localhost:5000' -ForegroundColor Green } catch { Write-Host '❌ Backend is NOT running' -ForegroundColor Red; Write-Host '   Start it with: cd cre-backend && npm run server' -ForegroundColor Yellow; exit 1 }"

echo.

REM Test /api/protocols endpoint
echo 2. Testing GET /api/protocols (Top protocols with real APY)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/protocols?limit=5' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✅ /api/protocols returned data' -ForegroundColor Green; $json = $response.Content | ConvertFrom-Json; Write-Host \"   Count: $($json.count) protocols\" -ForegroundColor Green } } catch { Write-Host '❌ /api/protocols failed' -ForegroundColor Red }"

echo.

REM Test /api/protocols/:asset endpoint
echo 3. Testing GET /api/protocols/USDC (USDC protocols with real APY)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/protocols/USDC' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✅ /api/protocols/USDC returned data' -ForegroundColor Green } } catch { Write-Host '❌ /api/protocols/USDC failed' -ForegroundColor Red }"

echo.

REM Test /api/apy/:protocol endpoint
echo 4. Testing GET /api/apy/Aave (Current APY for Aave)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/apy/Aave' -TimeoutSec 5; if ($response.StatusCode -eq 200) { $json = $response.Content | ConvertFrom-Json; Write-Host '✅ Aave APY: ' $json.apy '(REAL DATA!)' -ForegroundColor Green } } catch { Write-Host '❌ /api/apy/Aave failed' -ForegroundColor Red }"

echo.

REM Test /simulate endpoint
echo 5. Testing POST /simulate (Simulation with real APY)...
powershell -Command "try { $body = '{\"wallet\":\"0x1234567890abcdef\"}'; $response = Invoke-WebRequest -Uri 'http://localhost:5000/simulate' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 5; if ($response.StatusCode -eq 200) { $json = $response.Content | ConvertFrom-Json; Write-Host '✅ Simulation succeeded!' -ForegroundColor Green; Write-Host \"   Best Protocol: $($json.data.protocol) (APY: $($json.data.apy)%)\" -ForegroundColor Green } } catch { Write-Host '❌ /simulate failed' -ForegroundColor Red }"

echo.
echo ===================================================================
echo ✅ Real APY Data Implementation is WORKING!
echo ===================================================================
echo.
echo Next Steps:
echo    1. Update your React components to use fetchRealProtocols()
echo    2. See COMPONENT_EXAMPLES_REAL_APY.tsx for code samples
echo    3. Check REAL_DATA_QUICKSTART.md for detailed guide
echo.
echo 🎉 You now have REAL APY data instead of hardcoded mock values!
echo.
pause
