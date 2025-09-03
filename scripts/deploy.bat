@echo off
REM ============================================================================
REM DEPLOYMENT SCRIPT (scripts/deploy.bat)
REM ============================================================================

echo Starting deployment process...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Run tests
echo Running tests...
npm run test:coverage

REM Build for production
echo Building for production...
call scripts\build-prod.bat

REM Start local server for testing
echo Starting local server...
echo You can access the application at http://localhost:3000
npm run serve

pause
