# PowerShell script to start React development server
# Always starts from the project directory

Write-Host "Starting React Development Server..." -ForegroundColor Green
Write-Host ""

# Navigate to project directory
$ProjectPath = "C:\Users\swamy\OneDrive\Projects\SQL_Server_Audit_Dashboard\Audit_ui"
Write-Host "Navigating to project directory: $ProjectPath" -ForegroundColor Yellow
Set-Location -Path $ProjectPath

# Verify we're in the correct directory
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Start the development server using full path to npm
Write-Host "Starting development server..." -ForegroundColor Green
& "C:\Program Files\nodejs\npm.cmd" start
