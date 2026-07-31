@echo off
title CycloneShield AI - IBM Granite Agent (Port 8001)
color 0A
cls

echo.
echo  =====================================================
echo   CycloneShield AI - IBM Granite Agent Backend
echo   Model: ibm/granite-3-8b-instruct
echo   watsonx.ai Project: 039c6c15-e114-4359-a3e9-0412fadef3af
echo   Running on: http://localhost:8001
echo   API Docs:   http://localhost:8001/docs
echo   ngrok URL:  (will be printed below when ready)
echo  =====================================================
echo.

cd /d "%~dp0granite_agent"

:: Check ibm-watsonx-ai is installed
python -c "import ibm_watsonx_ai" 2>nul
if errorlevel 1 (
    echo [INFO] Installing ibm-watsonx-ai...
    python -m pip install ibm-watsonx-ai==1.6.0
)

:: Check pyngrok is installed
python -c "import pyngrok" 2>nul
if errorlevel 1 (
    echo [INFO] Installing pyngrok...
    python -m pip install pyngrok
)

:: Check uvicorn is installed
python -c "import uvicorn" 2>nul
if errorlevel 1 (
    echo [INFO] Installing uvicorn + fastapi...
    python -m pip install fastapi uvicorn[standard] pydantic python-dotenv
)

echo.
echo [STARTING] IBM Granite Agent...
echo [IBM] Connecting to watsonx.ai...
echo.

python agent.py

pause
