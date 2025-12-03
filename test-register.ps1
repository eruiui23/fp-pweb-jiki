$headers = @{'Content-Type'='application/json'}
$body = @{
    usn = 'testuser'
    email = 'testuser@example.com'
    pass = 'password123'
} | ConvertTo-Json

Write-Host "Testing POST /api/auth/register"
Write-Host "================================"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/register' `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "✓ Status: $($response.StatusCode)"
    Write-Host "✓ Response:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    }
}
