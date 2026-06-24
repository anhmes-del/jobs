@echo off
title WindFarm Job Tracker - Local Dev
cd /d "%~dp0"

echo ====================================
echo   WindFarm Job Tracker - Local Dev
echo ====================================
echo.

:: ---------- Backend ----------
echo [1/2] Starting Backend (FastAPI)...
echo.

:: Create venv if not exists
if not exist "backend\.venv" (
    echo   Creating Python virtual environment...
    python -m venv backend\.venv
)

:: Activate venv and install deps
call backend\.venv\Scripts\activate.bat
pip install -q -r backend\requirements.txt

:: Start uvicorn in a new window
start "Backend - uvicorn" cmd /c "cd /d "%~dp0" && call backend\.venv\Scripts\activate.bat && uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

echo   Backend starting on http://localhost:8000
echo.

:: ---------- Frontend ----------
echo [2/2] Starting Frontend (Vite + React)...
echo.
cd frontend
if not exist "node_modules" (
    echo   Installing npm packages...
    call npm install
)

start "Frontend - vite" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo   Frontend starting on http://localhost:5173
echo.
echo ====================================
echo   Both servers are starting up.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo ====================================
echo.
pause
