Write-Host "Testing Book Store API Endpoints" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

$BASE_URL = "http://localhost:5000"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"

Write-Host "`n1. Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method GET
    Write-Host "Success: Health OK" -ForegroundColor Green
} catch {
    Write-Host "Failed: Health check failed" -ForegroundColor Red
}

Write-Host "`n2. Register User" -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = $testEmail
    password = "password123"
    role = "user"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$BASE_URL/api/v1/users/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Success: User registered: $testEmail" -ForegroundColor Green
} catch {
    Write-Host "Failed: Registration failed" -ForegroundColor Red
}

Write-Host "`n3. Login User" -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/api/v1/users/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Success: Login successful" -ForegroundColor Green
} catch {
    Write-Host "Failed: Login failed" -ForegroundColor Red
    $token = $null
}

Write-Host "`n4. Get All Books" -ForegroundColor Yellow
try {
    $books = Invoke-RestMethod -Uri "$BASE_URL/api/v1/books" -Method GET
    Write-Host "Success: Books retrieved" -ForegroundColor Green
} catch {
    Write-Host "Failed: Could not get books" -ForegroundColor Red
}

Write-Host "`n5. Search Books" -ForegroundColor Yellow
try {
    $searchBooks = Invoke-RestMethod -Uri "$BASE_URL/api/v1/books/search?q=book" -Method GET
    Write-Host "Success: Search completed" -ForegroundColor Green
} catch {
    Write-Host "Failed: Search failed" -ForegroundColor Red
}

Write-Host "`n6. Get All Authors" -ForegroundColor Yellow
try {
    $authors = Invoke-RestMethod -Uri "$BASE_URL/api/v1/authors" -Method GET
    Write-Host "Success: Authors retrieved" -ForegroundColor Green
} catch {
    Write-Host "Failed: Could not get authors" -ForegroundColor Red
}

Write-Host "`n7. Get All Genres" -ForegroundColor Yellow
try {
    $genres = Invoke-RestMethod -Uri "$BASE_URL/api/v1/genres" -Method GET
    Write-Host "Success: Genres retrieved" -ForegroundColor Green
} catch {
    Write-Host "Failed: Could not get genres" -ForegroundColor Red
}

if ($token) {
    $headers = @{ Authorization = "Bearer $token" }
    
    Write-Host "`n8. Get Cart" -ForegroundColor Yellow
    try {
        $cart = Invoke-RestMethod -Uri "$BASE_URL/api/v1/cart" -Method GET -Headers $headers
        Write-Host "Success: Cart retrieved" -ForegroundColor Green
    } catch {
        Write-Host "Failed: Could not get cart" -ForegroundColor Red
    }
    
    Write-Host "`n9. Get Profile" -ForegroundColor Yellow
    try {
        $profile = Invoke-RestMethod -Uri "$BASE_URL/api/v1/profile" -Method GET -Headers $headers
        Write-Host "Success: Profile retrieved" -ForegroundColor Green
    } catch {
        Write-Host "Failed: Could not get profile" -ForegroundColor Red
    }
} else {
    Write-Host "`nSkipping authenticated endpoints (no token)" -ForegroundColor Yellow
}

Write-Host "`nTesting Complete!" -ForegroundColor Green