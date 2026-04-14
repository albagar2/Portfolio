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
    pushd proyectos\bateriaDePreguntas
    start "BP-IA" cmd /c "ARRANCAR_TODO.bat"
    popd
)

if exist "proyectos\controlGasoilFamiliar\start-dev.bat" (
    echo [-] Levantando Control Gasoil...
    pushd proyectos\controlGasoilFamiliar
    start "GASOIL" cmd /c "start-dev.bat"
    popd
)

if exist "proyectos\gestorDeProyectos\docker-compose.yml" (
    echo [-] Levantando Gestor de Proyectos...
    pushd proyectos\gestorDeProyectos
    docker-compose up -d
    popd
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
timeout /t 3 /nobreak > nul
start PORTAL_DEMOS.html

echo.
echo =====================================================================
echo   TODOS LOS SISTEMAS ESTAN EN LINEA Y OPERATIVOS.
echo   El entorno de desarrollo esta configurado al 100%%.
echo =====================================================================
timeout /t 10
exit

