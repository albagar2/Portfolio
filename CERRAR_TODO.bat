@echo off
setlocal enabledelayedexpansion
title ALBA-OS: Secuencia de Apagado
color 0C

echo =====================================================================
echo                ALBA-OS: SEÑAL DE APAGADO INICIADA
echo =====================================================================
echo.
echo [1/3] Interrumpiendo contenedores Docker (Portfolio)...
docker-compose down

echo.
echo [2/3] Interrumpiendo contenedores Docker (Gestor de Proyectos)...
cd proyectos\gestorDeProyectos
docker-compose down 2>nul
cd ..\..

echo.
echo [3/3] Apagando procesos de desarrollo en background...
echo Matando todos los procesos de Node.js (Vite, Express, etc...)
taskkill /F /IM node.exe /T 2>nul

echo Cerrando ventanas CMD hijas de las demos...
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq BP-IA" 2>nul
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq GASOIL" 2>nul
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq BIO-SYNC" 2>nul
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq NEURAL-LINK" 2>nul

echo.
echo =====================================================================
echo   SISTEMA COMPLETAMENTE APAGADO Y RECURSOS LIBERADOS.
echo =====================================================================
pause
