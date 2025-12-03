@echo off
REM Test Register Endpoint
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"usn\":\"testuser\",\"email\":\"testuser@example.com\",\"pass\":\"password123\"}"

echo.
echo Register test complete!
pause
