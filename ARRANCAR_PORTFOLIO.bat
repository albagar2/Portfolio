@echo off
setlocal enabledelayedexpansion
title ALBA-OS: Portfolio Principal
color 0B

echo =====================================================================
echo              ALBA-OS: INICIANDO PORTFOLIO PRINCIPAL
echo =====================================================================
echo.

:: ─────────────────────────────────────────────────────────
:: FASE 0: Verificar que existe la base de datos SQLite
:: ─────────────────────────────────────────────────────────
echo [0/3] Verificando base de datos SQLite...
cd /d "%~dp0backend"

if not exist "prisma\dev.db" (
    echo [!] Base de datos NO encontrada. Creando y migrando...
    call npx prisma migrate deploy
    if errorlevel 1 (
        echo [!] migrate deploy fallo, intentando db push...
        call npx prisma db push --accept-data-loss
    )
    echo [OK] Base de datos creada.
) else (
    echo [OK] Base de datos encontrada: prisma\dev.db
)

:: ─────────────────────────────────────────────────────────
:: FASE 1: Generar cliente Prisma (por si hay cambios en schema)
:: ─────────────────────────────────────────────────────────
echo.
echo [1/3] Generando cliente Prisma...
call npx prisma generate
if errorlevel 1 (
    echo [ERROR] Prisma generate fallo. Revisa el schema.
    pause
    exit /b 1
)
echo [OK] Cliente Prisma listo.

:: ─────────────────────────────────────────────────────────
:: FASE 2: Arrancar Backend y Frontend en ventanas separadas
:: ─────────────────────────────────────────────────────────
echo.
echo [2/3] Iniciando Backend (puerto 3000)...
start "Portfolio-Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo [2/3] Iniciando Frontend (puerto 5173)...
start "Portfolio-Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: ─────────────────────────────────────────────────────────
:: FASE 3: Esperar y abrir navegador
:: ─────────────────────────────────────────────────────────
echo.
echo [3/3] Esperando que los servicios arranquen...
timeout /t 6 /nobreak > nul

echo [OK] Abriendo Portfolio en el navegador...
start http://localhost:5173

echo.
echo =====================================================================
echo   PORTFOLIO EN LINEA:
echo     Frontend  ->  http://localhost:5173
echo     Backend   ->  http://localhost:3000/api
echo     DB        ->  SQLite en backend\prisma\dev.db
echo =====================================================================
echo.
timeout /t 8
exit
