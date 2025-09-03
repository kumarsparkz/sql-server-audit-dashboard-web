@echo off
REM ============================================================================
REM BUILD SCRIPT FOR PRODUCTION (scripts/build-prod.bat)
REM ============================================================================

echo Building for Production Environment...

REM Set environment variables
set REACT_APP_ENV=production
set GENERATE_SOURCEMAP=false
set INLINE_RUNTIME_CHUNK=false

REM Clean previous build
if exist build rmdir /s /q build

REM Build the application
npm run build

REM Optimize build (optional)
echo Optimizing build...
REM You can add additional optimization steps here

echo Production build completed!
echo Build output is in the 'build' directory
echo Ready for deployment

pause
