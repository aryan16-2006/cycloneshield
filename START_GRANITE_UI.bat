@echo off
title CycloneShield AI - IBM Granite Chat UI (Port 3001)
color 0D
cls

echo.
echo  =====================================================
echo   CycloneShield AI - IBM Granite Chat Interface
echo   Standalone React Chat UI
echo   Running on: http://localhost:3001
echo   Requires: Granite Agent running on port 8001
echo  =====================================================
echo.

cd /d "%~dp0granite_agent\ui"

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
    echo [OK] Packages installed!
    echo.
)

echo [STARTING] IBM Granite Chat UI...
echo [OPEN] http://localhost:3001
echo.
echo NOTE: Make sure START_GRANITE_AGENT.bat is running first!
echo.

call npm run dev

pause
