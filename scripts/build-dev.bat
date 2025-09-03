@echo off
REM ============================================================================
REM BUILD SCRIPT FOR DEVELOPMENT (scripts/build-dev.bat)
REM ============================================================================

echo Building for Development Environment...

REM Set environment variables
set REACT_APP_ENV=development
set GENERATE_SOURCEMAP=true

REM Clean previous build
if exist build rmdir /s /q build

REM Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Build the application
npm run build

echo Development build completed!
echo Build output is in the 'build' directory

pause
