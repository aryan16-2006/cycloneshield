@echo off
title CycloneShield AI - Frontend (Port 5000)
color 0B
cls

echo.
echo  =====================================================
echo   CycloneShield AI - Main Dashboard Frontend
echo   React + TypeScript + Vite + TailwindCSS
echo   Running on: http://localhost:5000
echo  =====================================================
echo.

cd /d "%~dp0frontend"

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing packages...
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Packages installed successfully!
    echo.
)

echo [STARTING] Frontend server...
echo [OPEN] http://localhost:5000
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
