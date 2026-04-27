@echo off
echo ==========================================
echo   LANZADOR DE FAMILY GASTO - PREMIUM
echo ==========================================

start cmd /k "cd backend && echo Iniciando Backend... && npm run dev"
timeout /t 5
start cmd /k "cd frontend && echo Iniciando Frontend... && npm run dev"

echo.
echo Los servidores estan arrancando...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
pause
