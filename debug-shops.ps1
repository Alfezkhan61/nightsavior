# Debug Script for Shop Visibility Issue
Write-Host "🔍 Debugging Shop Visibility Issue" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "`n1. Testing Backend Connection..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is running: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not responding. Please start the backend server first." -ForegroundColor Red
    exit 1
}

# Test 2: Check shops endpoint without authentication
Write-Host "`n2. Testing Shop Retrieval (Public Access)..." -ForegroundColor Yellow
try {
    $shopsResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/shops/open-now" -Method GET -TimeoutSec 10
    Write-Host "✅ Shop endpoint responding" -ForegroundColor Green
    Write-Host "Total shops found: $($shopsResponse.data.shops.Count)" -ForegroundColor Cyan
    
    if ($shopsResponse.data.shops.Count -eq 0) {
        Write-Host "⚠️  NO SHOPS FOUND - This explains why users can't see shop data!" -ForegroundColor Red
        Write-Host "Possible reasons:" -ForegroundColor Yellow
        Write-Host "  1. No shops have been created yet" -ForegroundColor Yellow
        Write-Host "  2. All shops are set to isActive: false" -ForegroundColor Yellow
        Write-Host "  3. All shops are set to isApproved: false" -ForegroundColor Yellow
        Write-Host "  4. Time filtering is excluding all shops" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Found shops in database:" -ForegroundColor Green
        $shopsResponse.data.shops | ForEach-Object {
            Write-Host "  • $($_.name)" -ForegroundColor White
            Write-Host "    Category: $($_.category)" -ForegroundColor Gray
            Write-Host "    Owner: $($_.owner.name) ($($_.owner.email))" -ForegroundColor Gray
            Write-Host "    Open: $($_.openTime) - $($_.closeTime)" -ForegroundColor Gray
            Write-Host "    Currently Open: $($_.isOpenNow)" -ForegroundColor $(if ($_.isOpenNow) { "Green" } else { "Red" })
            Write-Host ""
        }
    }
} catch {
    Write-Host "❌ Error retrieving shops: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 3: Check all shops endpoint (including closed ones)
Write-Host "`n3. Testing All Shops Endpoint..." -ForegroundColor Yellow
try {
    # This endpoint might not exist, but let's try
    $allShopsResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/shops" -Method GET -TimeoutSec 10
    Write-Host "✅ All shops endpoint responding" -ForegroundColor Green
    Write-Host "Total shops: $($allShopsResponse.data.shops.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  All shops endpoint not accessible (may require authentication)" -ForegroundColor Yellow
}

Write-Host "`n🎯 DIAGNOSIS COMPLETE" -ForegroundColor Cyan
Write-Host "If no shops were found above, that's why users can't see shop data." -ForegroundColor Yellow
Write-Host "The issue is likely in the shop creation or filtering logic." -ForegroundColor Yellow
