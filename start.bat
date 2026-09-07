@echo off
title Leitner Language App
echo.
echo ========================================
echo   Leitner Language App - Starting...
echo ========================================
echo.
echo Please wait...
echo.

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take 1-2 minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Installation failed!
        pause
        exit /b 1
    )
    echo.
    echo Installation complete!
    echo.
)

:: Build the project
echo Building the app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Starting local server...
echo.
echo ========================================
echo   App is running!
echo   Opening browser...
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

:: Start preview server and open browser
start http://localhost:4173
call npm run preview

pause
