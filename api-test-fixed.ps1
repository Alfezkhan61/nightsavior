# NightSavior API Connection Test Script
# Comprehensive testing of frontend, backend, and MongoDB connections

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  NightSavior API Connection Test" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test configuration
$baseUrl = "http://localhost:5002/api"
$frontendUrl = "http://localhost:3000"

# Helper function to make HTTP requests
function Test-API {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [string]$Description
    )
    
    try {
        Write-Host "Testing: $Description" -ForegroundColor Yellow
        
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "SUCCESS: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        Write-Host ""
        return $response
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
        Write-Host ""
        return $null
    }
}

# 1. Health Check
Write-Host "1. HEALTH CHECK" -ForegroundColor Magenta
Write-Host "---------------" -ForegroundColor Magenta
Test-API -Url "$baseUrl/health" -Description "API Health Check"

# 2. Authentication Tests
Write-Host "2. AUTHENTICATION TESTS" -ForegroundColor Magenta
Write-Host "-----------------------" -ForegroundColor Magenta

# Test user signup
$signupData = @{
    name = "Test User"
    email = "test@example.com"
    password = "testpass123"
    role = "poster"
} | ConvertTo-Json

$signupResult = Test-API -Url "$baseUrl/auth/signup" -Method "POST" -Body $signupData -Description "User Signup"

# Test user login
$loginData = @{
    email = "test@example.com"
    password = "testpass123"
} | ConvertTo-Json

$loginResult = Test-API -Url "$baseUrl/auth/login" -Method "POST" -Body $loginData -Description "User Login"

$authToken = $null
if ($loginResult -and $loginResult.token) {
    $authToken = $loginResult.token
    Write-Host "Auth Token Retrieved: $authToken" -ForegroundColor Green
}

# 3. Theme Tests
Write-Host "3. THEME TESTS" -ForegroundColor Magenta
Write-Host "--------------" -ForegroundColor Magenta

$themeData = @{
    preferences = @{
        theme = "dark"
        mapStyle = "satellite"
    }
} | ConvertTo-Json

Test-API -Url "$baseUrl/theme/guest-preference" -Method "POST" -Body $themeData -Description "Guest Theme Preference"

if ($authToken) {
    $headers = @{ "Authorization" = "Bearer $authToken" }
    Test-API -Url "$baseUrl/theme/user-preference" -Method "POST" -Body $themeData -Headers $headers -Description "User Theme Preference"
    Test-API -Url "$baseUrl/theme/user-preference" -Headers $headers -Description "Get User Theme Preference"
}

# 4. Shop Tests
Write-Host "4. SHOP TESTS" -ForegroundColor Magenta
Write-Host "-------------" -ForegroundColor Magenta

if ($authToken) {
    $headers = @{ "Authorization" = "Bearer $authToken" }
    
    # Create a shop
    $shopData = @{
        name = "Test Shop"
        address = "123 Test Street"
        location = @{
            type = "Point"
            coordinates = @(72.8777, 19.0760)
        }
        shopType = "medicine"
        contactNumber = "1234567890"
        openTime = "09:00"
        closeTime = "21:00"
        description = "A test medical shop"
    } | ConvertTo-Json -Depth 3
    
    $shopResult = Test-API -Url "$baseUrl/shops" -Method "POST" -Body $shopData -Headers $headers -Description "Create Shop"
    
    # Get all shops
    Test-API -Url "$baseUrl/shops" -Description "Get All Shops"
    
    # Get open shops
    Test-API -Url "$baseUrl/shops/open-now" -Description "Get Open Shops"
    
    # Get shops by type
    Test-API -Url "$baseUrl/shops/by-type/medicine" -Description "Get Medicine Shops"
    
    # Get nearby shops
    Test-API -Url "$baseUrl/shops/nearby?lat=19.0760&lng=72.8777&radius=5000" -Description "Get Nearby Shops"
}

# 5. Report Tests
Write-Host "5. REPORT TESTS" -ForegroundColor Magenta
Write-Host "---------------" -ForegroundColor Magenta

if ($authToken) {
    $headers = @{ "Authorization" = "Bearer $authToken" }
    
    # Create a report
    $reportData = @{
        shopId = "507f1f77bcf86cd799439011"
        issueType = "closed"
        description = "Shop appears to be closed during listed hours"
        location = @{
            type = "Point"
            coordinates = @(72.8777, 19.0760)
        }
    } | ConvertTo-Json -Depth 3
    
    Test-API -Url "$baseUrl/reports" -Method "POST" -Body $reportData -Headers $headers -Description "Create Report"
    
    # Get user reports
    Test-API -Url "$baseUrl/reports/my-reports" -Headers $headers -Description "Get My Reports"
}

# 6. Admin Tests (if admin user exists)
Write-Host "6. ADMIN TESTS" -ForegroundColor Magenta
Write-Host "--------------" -ForegroundColor Magenta

# Try to create admin user
$adminSignupData = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "adminpass123"
    role = "admin"
} | ConvertTo-Json

Test-API -Url "$baseUrl/auth/signup" -Method "POST" -Body $adminSignupData -Description "Admin Signup"

# Try admin login
$adminLoginData = @{
    email = "admin@example.com"
    password = "adminpass123"
} | ConvertTo-Json

$adminLoginResult = Test-API -Url "$baseUrl/auth/login" -Method "POST" -Body $adminLoginData -Description "Admin Login"

if ($adminLoginResult -and $adminLoginResult.token) {
    $adminHeaders = @{ "Authorization" = "Bearer $($adminLoginResult.token)" }
    
    Test-API -Url "$baseUrl/admin/stats" -Headers $adminHeaders -Description "Get Admin Stats"
    Test-API -Url "$baseUrl/admin/pending-shops" -Headers $adminHeaders -Description "Get Pending Shops"
    Test-API -Url "$baseUrl/admin/reports" -Headers $adminHeaders -Description "Get All Reports"
}

# 7. Frontend Connection Test
Write-Host "7. FRONTEND CONNECTION TEST" -ForegroundColor Magenta
Write-Host "---------------------------" -ForegroundColor Magenta

try {
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "Frontend: CONNECTED on port 3000" -ForegroundColor Green
    }
}
catch {
    Write-Host "Frontend: NOT ACCESSIBLE on port 3000" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Database Connection Verification
Write-Host "8. DATABASE CONNECTION VERIFICATION" -ForegroundColor Magenta
Write-Host "-----------------------------------" -ForegroundColor Magenta

# Check if we can get data from the database
$dbTest = Test-API -Url "$baseUrl/shops" -Description "Database Connection Test (via shops endpoint)"
if ($dbTest) {
    Write-Host "MongoDB: CONNECTED and responding" -ForegroundColor Green
} else {
    Write-Host "MongoDB: CONNECTION ISSUES detected" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "           CONNECTION SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check server.js for configuration
$serverConfig = Get-Content "Backend/server.js" -ErrorAction SilentlyContinue
if ($serverConfig) {
    if ($serverConfig -match "5002") {
        Write-Host "Backend Server: CONFIGURED for port 5002" -ForegroundColor Green
    }
    if ($serverConfig -match "mongodb") {
        Write-Host "MongoDB: CONNECTION STRING found" -ForegroundColor Green
    }
    if ($serverConfig -match "localhost:3000") {
        Write-Host "CORS: CONFIGURED for localhost:3000" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Test completed! Check the results above for any connection issues." -ForegroundColor Cyan
Write-Host "If you see any RED errors, those need to be addressed." -ForegroundColor Yellow
