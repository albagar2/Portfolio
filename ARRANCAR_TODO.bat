@echo off
setlocal enabledelayedexpansion
title ALBA-OS: Secuencia de Inicio Global
color 0A

echo =====================================================================
echo                ALBA-OS: ELITE SOFTWARE COMMAND CENTER
echo =====================================================================
echo.

:: Fase 0: Verificación de Salud
echo [0/3] Ejecutando diagnostico de dependencias...
call VERIFICAR_SISTEMA.bat

echo.
echo [1/3] Iniciando los microservicios principales del Portfolio...
docker-compose up -d --build
if errorlevel 1 (
    echo [ERROR] Fallo al iniciar servicios Docker del Portfolio.
    color 0C
    pause
    exit /b
)
echo [OK] Portfolio Core iniciado.

echo.
echo [2/3] Arrancando Proyectos Satelites en sus respectivos puertos...
echo (Este proceso abrira varias ventanas en segundo plano)
echo.

:: Iterar proyectos que tengan scripts de arranque
if exist "proyectos\bateriaDePreguntas\ARRANCAR_TODO.bat" (
    echo [-] Levantando Bateria de Preguntas...
    cd proyectos\bateriaDePreguntas
    start "BP-IA" cmd /c "ARRANCAR_TODO.bat"
    cd ..\..
)

if exist "proyectos\controlGasoilFamiliar\start-dev.bat" (
    echo [-] Levantando Control Gasoil...
    cd proyectos\controlGasoilFamiliar
    start "GASOIL" cmd /c "start-dev.bat"
    cd ..\..
)

if exist "proyectos\gestorDeProyectos\docker-compose.yml" (
    echo [-] Levantando Gestor de Proyectos...
    cd proyectos\gestorDeProyectos
    docker-compose up -d
    cd ..\..
)

:: Arrancar algunos Frontends de proyectos destacables
echo [-] Levantando Bio Sync Health (Frontend)...
start "BIO-SYNC" cmd /c "cd proyectos\bio-sync-health\frontend && npm run dev"

echo [-] Levantando Neural Link Guard (Frontend)...
start "NEURAL-LINK" cmd /c "cd proyectos\neural-link-guard\frontend && npm run dev"

echo [-] Levantando Crypto Terminal Pro (Frontend)...
start "CRYPTO-PRO" cmd /c "cd proyectos\crypto-terminal-pro\frontend && npm run dev"

echo [-] Levantando Echo Vault Storage (Frontend)...
start "ECHO-VAULT" cmd /c "cd proyectos\echo-vault-storage\frontend && npm run dev"

echo [-] Levantando Tanatorio TV (Full Service)...
start "TANATORIO-TV" cmd /c "cd proyectos\tanatorio-tv && npm run dev"

echo [-] Levantando OS Control Center (Frontend)...
start "CONTROL-CENTER" cmd /c "cd proyectos\alba-os-control-center\frontend && npm run dev"

echo.
echo [3/3] Generando Portal de Demos...
echo El Portal interactivo se abrira en su navegador para interactuar con las apps.
start PORTAL_DEMOS.html

echo.
echo =====================================================================
echo   TODOS LOS SISTEMAS ESTAN EN LINEA Y OPERATIVOS.
echo   Mantenga abiertas las ventanas de consola (minimizadas).
echo =====================================================================
pause
