@echo off
title Stop CycloneShield Services
color 0C
cls

echo.
echo  Stopping all CycloneShield AI services...
echo.

:: Kill Node.js (Vite frontend servers)
taskkill /F /IM node.exe 2>nul
if not errorlevel 1 (
    echo  [OK] Node.js processes stopped
) else (
    echo  [--] No Node.js processes found
)

:: Kill Python (FastAPI/agent.py)
taskkill /F /IM python.exe 2>nul
if not errorlevel 1 (
    echo  [OK] Python processes stopped
) else (
    echo  [--] No Python processes found
)

echo.
echo  All CycloneShield services stopped.
echo  Press any key to close...
echo.
pause >nul
