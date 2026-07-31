@echo off
title CycloneShield AI - Launch All Services
color 0E
cls

echo.
echo  ========================================================
echo   CycloneShield AI - Full Stack Launcher
echo   IBM Granite AI Cyclone Early Warning System
echo  ========================================================
echo.
echo   Services launching:
echo   [1] Main Dashboard Frontend    -> http://localhost:5000
echo   [2] IBM Granite Agent Backend  -> http://localhost:8001
echo   [3] IBM Granite Chat UI        -> http://localhost:3001
echo.
echo   IBM Granite: ibm/granite-8b-code-instruct @ watsonx.ai
echo   Project ID:  ee9ca177-dd2a-4be0-96e3-bf2a45b494fe
echo  ========================================================
echo.
timeout /t 2 /nobreak >nul

echo [1/3] Launching IBM Granite Agent Backend...
start "Granite Agent (8001)" cmd /k "cd /d %~dp0granite_agent && python agent.py"
timeout /t 4 /nobreak >nul

echo [2/3] Launching IBM Granite Chat UI...
start "Granite Chat UI (3001)" cmd /k "cd /d %~dp0granite_agent\ui && (if not exist node_modules npm install) && npm run dev"
timeout /t 2 /nobreak >nul

echo [3/3] Launching Main CycloneShield Dashboard...
start "CycloneShield Frontend (5000)" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo  ========================================================
echo   All services are starting in separate windows!
echo  ========================================================
echo.
echo   [DASHBOARD]  http://localhost:5000
echo   [GRANITE UI] http://localhost:3001
echo   [API DOCS]   http://localhost:8001/docs
echo.
echo   Wait ~10 seconds for all services to be ready.
echo   The ngrok public URL will appear in the Granite Agent window.
echo.
echo   Press any key to close this window...
echo.
pause >nul
