@echo off
title Deposito Mais Barato - Iniciando...
color 0A

echo ============================================
echo  DEPOSITO PARCEIRO - Iniciando servidores
echo ============================================
echo.

:: Kill any existing node processes on our ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000 "') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /F /PID %%a 2>nul

:: Start API backend (port 8000)
echo [1/3] Iniciando backend API (porta 8000)...
start "Backend API" cmd /k "cd /d %~dp0 && node server.js"
timeout /t 2 /nobreak >nul

:: Start Vite frontend (port 5173)
echo [2/3] Iniciando frontend Vite (porta 5173)...
start "Frontend Vite" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 /nobreak >nul

:: Start ngrok tunnel on port 5173
echo [3/3] Iniciando ngrok (tunelando porta 5173)...
start "Ngrok Tunnel" cmd /k "\"C:\Users\Administrator\Documents\Utiliatarios N8N Floricultura Online\ngrok.exe\" http 5173"

echo.
echo ============================================
echo  Tudo iniciado!
echo  - Backend:  http://localhost:8000
echo  - Frontend: http://localhost:5173
echo  - Ngrok: veja a janela do ngrok para a URL publica
echo ============================================
echo.
echo Aguarde alguns segundos e abra: http://localhost:5173
echo.
pause
