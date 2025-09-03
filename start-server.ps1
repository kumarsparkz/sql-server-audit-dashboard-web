# Comprehensive React Development Server Startup Script
# This script always navigates to the project directory and starts the server

param(
    [switch]$Debug
)

# Define project path
$ProjectPath = "C:\Users\swamy\OneDrive\Projects\SQL_Server_Audit_Dashboard\Audit_ui"
$NodePath = "C:\Program Files\nodejs"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   React Development Server Startup" -ForegroundColor Cyan  
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to project directory
Write-Host "Step 1: Navigating to project directory..." -ForegroundColor Yellow
Write-Host "Target: $ProjectPath" -ForegroundColor Gray
Set-Location -Path $ProjectPath
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Step 2: Verify Node.js installation
Write-Host "Step 2: Verifying Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = & "$NodePath\node.exe" --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    
    $npmVersion = & "$NodePath\npm.cmd" --version  
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found at $NodePath" -ForegroundColor Red
    Write-Host "Please ensure Node.js is installed correctly." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Check if package.json exists
Write-Host "Step 3: Verifying project files..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found in current directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Red
    exit 1
}
Write-Host "package.json found ✓" -ForegroundColor Green

if (-not (Test-Path "src")) {
    Write-Host "ERROR: src directory not found" -ForegroundColor Red
    exit 1
}
Write-Host "src directory found ✓" -ForegroundColor Green
Write-Host ""

# Step 4: Install dependencies if needed
Write-Host "Step 4: Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    & "$NodePath\npm.cmd" install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "node_modules found ✓" -ForegroundColor Green
}
Write-Host ""

# Step 5: Start development server
Write-Host "Step 5: Starting development server..." -ForegroundColor Yellow
Write-Host "This will open your browser automatically when ready." -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green

# Try different methods to start the server
$success = $false

# Method 1: Try npx react-scripts start
try {
    Write-Host "Attempting: npx react-scripts start" -ForegroundColor Gray
    & "$NodePath\npx.cmd" react-scripts start
    $success = $true
} catch {
    Write-Host "Method 1 failed, trying alternative..." -ForegroundColor Yellow
}

# Method 2: Try direct node execution if npx fails
if (-not $success) {
    try {
        Write-Host "Attempting: direct node execution" -ForegroundColor Gray
        & "$NodePath\node.exe" "node_modules\react-scripts\bin\react-scripts.js" start
        $success = $true
    } catch {
        Write-Host "Method 2 failed" -ForegroundColor Yellow
    }
}

# Method 3: Try npm start with full path
if (-not $success) {
    try {
        Write-Host "Attempting: npm start" -ForegroundColor Gray
        & "$NodePath\npm.cmd" start
        $success = $true
    } catch {
        Write-Host "All methods failed" -ForegroundColor Red
    }
}

if (-not $success) {
    Write-Host ""
    Write-Host "ERROR: Unable to start development server" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "You can try running these commands manually:" -ForegroundColor Yellow
    Write-Host "1. cd `"$ProjectPath`"" -ForegroundColor Gray
    Write-Host "2. npm install --legacy-peer-deps" -ForegroundColor Gray  
    Write-Host "3. npm start" -ForegroundColor Gray
    exit 1
}
