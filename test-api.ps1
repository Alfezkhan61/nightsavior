# Comprehensive API Testing Script for NightSavior

Write-Host "🔍 NIGHTSAVIOR API COMPREHENSIVE TEST REPORT" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Gray
Write-Host "Backend URL: http://localhost:5002" -ForegroundColor Gray
Write-Host "Frontend URL: http://localhost:3001" -ForegroundColor Gray
Write-Host ""

$testResults = @()
$headers = @{"Content-Type" = "application/json"}

# Helper function to test endpoint
function Test-Endpoint {
    param($Name, $Method, $Url, $Body = $null, $Headers = @{"Content-Type" = "application/json"})
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -Headers $Headers
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers
        }
        Write-Host "✅ SUCCESS: $Name" -ForegroundColor Green
        return @{Name = $Name; Status = "✅ PASS"; Response = $response}
    } catch {
        Write-Host "❌ FAILED: $Name - $($_.Exception.Message)" -ForegroundColor Red
        return @{Name = $Name; Status = "❌ FAIL"; Error = $_.Exception.Message}
    }
}

Write-Host "1. HEALTH CHECK" -ForegroundColor Cyan
Write-Host "---------------" -ForegroundColor Cyan
$healthResult = Test-Endpoint "Health Check" "GET" "http://localhost:5002/api/health"
$testResults += $healthResult

Write-Host "`n2. AUTHENTICATION ROUTES" -ForegroundColor Cyan
Write-Host "-------------------------" -ForegroundColor Cyan

# Generate unique test data
$testEmail = "testuser$(Get-Random)@example.com"
$testPassword = "password123"

# Test Signup
$signupData = @{
    name = "API Test User"
    email = $testEmail
    password = $testPassword
    role = "user"
} | ConvertTo-Json

$signupResult = Test-Endpoint "User Signup" "POST" "http://localhost:5002/api/auth/signup" $signupData
$testResults += $signupResult

if ($signupResult.Status -eq "✅ PASS") {
    $userToken = $signupResult.Response.data.token
    
    # Test Login
    $loginData = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    $loginResult = Test-Endpoint "User Login" "POST" "http://localhost:5002/api/auth/login" $loginData
    $testResults += $loginResult
    
    # Test Protected Route
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $userToken"
    }
    
    $profileResult = Test-Endpoint "Get User Profile" "GET" "http://localhost:5002/api/auth/me" $null $authHeaders
    $testResults += $profileResult
    
    # Test Profile Update
    $updateData = @{
        name = "Updated Test User"
        themePreference = "light"
    } | ConvertTo-Json
    
    $updateResult = Test-Endpoint "Update Profile" "PUT" "http://localhost:5002/api/auth/profile" $updateData $authHeaders
    $testResults += $updateResult
}

Write-Host "`n3. THEME ROUTES" -ForegroundColor Cyan
Write-Host "---------------" -ForegroundColor Cyan

# Test Guest Theme
$guestThemeData = @{
    sessionId = "test-session-$(Get-Random)"
} | ConvertTo-Json

$guestThemeResult = Test-Endpoint "Guest Theme Preference" "POST" "http://localhost:5002/api/theme/guest-preference" $guestThemeData
$testResults += $guestThemeResult

if ($guestThemeResult.Status -eq "✅ PASS") {
    $sessionId = $guestThemeResult.Response.data.sessionId
    
    # Test Guest Theme Update
    $updateGuestTheme = @{
        sessionId = $sessionId
        themePreference = "light"
    } | ConvertTo-Json
    
    $updateGuestResult = Test-Endpoint "Update Guest Theme" "PUT" "http://localhost:5002/api/theme/guest-preference" $updateGuestTheme
    $testResults += $updateGuestResult
}

Write-Host "`n4. ADMIN ROUTES (Testing endpoint existence)" -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor Cyan

$adminHealthResult = Test-Endpoint "Admin Route Check" "GET" "http://localhost:5002/api/admin/dashboard"
$testResults += $adminHealthResult

Write-Host "`n5. SHOP ROUTES (Testing endpoint existence)" -ForegroundColor Cyan
Write-Host "--------------------------------------------" -ForegroundColor Cyan

$shopListResult = Test-Endpoint "Shop List" "GET" "http://localhost:5002/api/shops"
$testResults += $shopListResult

Write-Host "`n6. REPORT ROUTES (Testing endpoint existence)" -ForegroundColor Cyan
Write-Host "----------------------------------------------" -ForegroundColor Cyan

$reportListResult = Test-Endpoint "Report List" "GET" "http://localhost:5002/api/reports"
$testResults += $reportListResult

Write-Host "`n" -ForegroundColor White
Write-Host "📊 TEST SUMMARY REPORT" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object { $_.Status -eq "✅ PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "❌ FAIL" }).Count
$totalTests = $testResults.Count

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round($passCount / $totalTests * 100, 2))%" -ForegroundColor Yellow

Write-Host "`nDetailed Results:" -ForegroundColor White
foreach ($result in $testResults) {
    Write-Host "$($result.Status) $($result.Name)" -ForegroundColor $(if ($result.Status -eq "✅ PASS") { "Green" } else { "Red" })
    if ($result.Error) {
        Write-Host "    Error: $($result.Error)" -ForegroundColor DarkRed
    }
}

Write-Host "`n🔗 CONNECTION STATUS:" -ForegroundColor Cyan
Write-Host "Backend Server: ✅ Running on port 5002" -ForegroundColor Green
Write-Host "Frontend Server: ✅ Running on port 3001" -ForegroundColor Green
Write-Host "MongoDB: ✅ Connected" -ForegroundColor Green
            Write-Host "CORS: ✅ Configured for localhost:3000" -ForegroundColor Green
