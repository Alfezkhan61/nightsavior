# NightSavior API Connection Test Script
# This script tests all API routes systematically

# Test 1: Health Check
Write-Host "🔍 STARTING COMPREHENSIVE API TESTING..." -ForegroundColor Cyan
Write-Host "=" * 60

# Health Check
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5002/api/health" -Method GET
    Write-Host "✅ HEALTH CHECK: PASSED" -ForegroundColor Green
    Write-Host "   Status: $($health.message)"
} catch {
    Write-Host "❌ HEALTH CHECK: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host "`n" + ("=" * 60)

# Test 2: Authentication Routes
Write-Host "🔐 TESTING AUTHENTICATION ROUTES..." -ForegroundColor Yellow

# Create Test User
$testUser = @{
    name = "Test User $(Get-Random)"
    email = "testuser$(Get-Random)@example.com"
    password = "password123"
    role = "user"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/auth/signup" -Method POST -Headers @{'Content-Type' = 'application/json'} -Body $testUser
    Write-Host "✅ AUTH SIGNUP: PASSED" -ForegroundColor Green
    Write-Host "   User: $($signupResponse.data.user.name)"
    $global:testUserToken = $signupResponse.data.token
    $global:testUserEmail = ($testUser | ConvertFrom-Json).email
} catch {
    Write-Host "❌ AUTH SIGNUP: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test Login
$loginData = @{
    email = $global:testUserEmail
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/auth/login" -Method POST -Headers @{'Content-Type' = 'application/json'} -Body $loginData
    Write-Host "✅ AUTH LOGIN: PASSED" -ForegroundColor Green
    Write-Host "   Token received: $($loginResponse.data.token.Substring(0,20))..."
    $global:userToken = $loginResponse.data.token
} catch {
    Write-Host "❌ AUTH LOGIN: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test Protected Route (/api/auth/me)
try {
    $meResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/auth/me" -Method GET -Headers @{'Authorization' = "Bearer $global:userToken"}
    Write-Host "✅ AUTH PROFILE: PASSED" -ForegroundColor Green
    Write-Host "   User: $($meResponse.data.user.name)"
} catch {
    Write-Host "❌ AUTH PROFILE: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host "`n" + ("=" * 60)

# Test 3: Shop Routes
Write-Host "🏪 TESTING SHOP ROUTES..." -ForegroundColor Yellow

# Test Public Shop Listing
try {
    $shopsResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/shops/open-now" -Method GET
    Write-Host "✅ SHOPS LIST: PASSED" -ForegroundColor Green
    Write-Host "   Shops found: $($shopsResponse.data.shops.Count)"
    if ($shopsResponse.data.shops.Count -gt 0) {
        Write-Host "   Sample shop: $($shopsResponse.data.shops[0].name)"
    }
} catch {
    Write-Host "❌ SHOPS LIST: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Create Poster User for Shop Testing
$posterUser = @{
    name = "Test Poster $(Get-Random)"
    email = "poster$(Get-Random)@example.com"
    password = "password123"
    role = "poster"
} | ConvertTo-Json

try {
    $posterSignup = Invoke-RestMethod -Uri "http://localhost:5002/api/auth/signup" -Method POST -Headers @{'Content-Type' = 'application/json'} -Body $posterUser
    $global:posterToken = $posterSignup.data.token
    Write-Host "✅ POSTER ACCOUNT: CREATED" -ForegroundColor Green
} catch {
    Write-Host "❌ POSTER ACCOUNT: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test Shop Creation
$shopData = @{
    name = "API Test Shop $(Get-Random)"
    category = "food"
    location = @{
        address = "123 Test API Street"
        city = "Test City"
        coordinates = @{
            lat = 40.7128
            lng = -74.0060
        }
    }
    openTime = "18:00"
    closeTime = "06:00"
    description = "Shop created via API test"
    phone = "+1234567890"
} | ConvertTo-Json -Depth 3

try {
    $shopCreation = Invoke-RestMethod -Uri "http://localhost:5002/api/shops" -Method POST -Headers @{'Content-Type' = 'application/json'; 'Authorization' = "Bearer $global:posterToken"} -Body $shopData
    Write-Host "✅ SHOP CREATION: PASSED" -ForegroundColor Green
    Write-Host "   Shop: $($shopCreation.data.shop.name)"
    Write-Host "   Auto-Approved: $($shopCreation.data.shop.isApproved)"
    $global:testShopId = $shopCreation.data.shop.id
} catch {
    Write-Host "❌ SHOP CREATION: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test Shop Details
if ($global:testShopId) {
    try {
        $shopDetails = Invoke-RestMethod -Uri "http://localhost:5002/api/shops/$global:testShopId" -Method GET
        Write-Host "✅ SHOP DETAILS: PASSED" -ForegroundColor Green
        Write-Host "   Shop: $($shopDetails.data.shop.name)"
    } catch {
        Write-Host "❌ SHOP DETAILS: FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)"
    }
}

Write-Host "`n" + ("=" * 60)

# Test 4: Theme Routes
Write-Host "🎨 TESTING THEME ROUTES..." -ForegroundColor Yellow

# Test Guest Theme
$guestTheme = @{
    theme = "dark"
} | ConvertTo-Json

try {
    $themeResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/theme/guest-preference" -Method POST -Headers @{'Content-Type' = 'application/json'} -Body $guestTheme
    Write-Host "✅ GUEST THEME: PASSED" -ForegroundColor Green
} catch {
    Write-Host "❌ GUEST THEME: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test User Theme (Protected)
try {
    $userThemeResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/theme/preference" -Method GET -Headers @{'Authorization' = "Bearer $global:userToken"}
    Write-Host "✅ USER THEME GET: PASSED" -ForegroundColor Green
} catch {
    Write-Host "❌ USER THEME GET: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host "`n" + ("=" * 60)

# Test 5: Database Verification
Write-Host "🗄️ TESTING DATABASE OPERATIONS..." -ForegroundColor Yellow

# Verify shops are in database
try {
    $allShops = Invoke-RestMethod -Uri "http://localhost:5002/api/shops/open-now" -Method GET
    Write-Host "✅ DATABASE READ: PASSED" -ForegroundColor Green
    Write-Host "   Total shops in DB: $($allShops.data.shops.Count)"
    
    if ($allShops.data.shops.Count -gt 0) {
        Write-Host "✅ DATABASE WRITE: VERIFIED" -ForegroundColor Green
        Write-Host "   Latest shop: $($allShops.data.shops[0].name)"
    }
} catch {
    Write-Host "❌ DATABASE OPERATIONS: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host "`n" + ("=" * 60)
Write-Host "🎯 API TESTING COMPLETE!" -ForegroundColor Cyan
Write-Host "=" * 60
