@echo off
REM ============================================================================
REM SETUP SCRIPT - Install Node.js and Project Dependencies
REM ============================================================================

echo Checking Node.js installation...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo 1. Download the LTS version
    echo 2. Run the installer
    echo 3. Make sure "Add to PATH" is checked
    echo 4. Restart your computer
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo npm version:
npm --version

echo.
echo Installing project dependencies...
echo This may take a few minutes...

REM Install with legacy peer deps to handle version conflicts
npm install --legacy-peer-deps

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Try running: npm install --force
    pause
    exit /b 1
)

echo.
echo SUCCESS: All dependencies installed!
echo.
echo You can now run:
echo   npm start     - Start development server
echo   npm run build - Build for production
echo.

pause
