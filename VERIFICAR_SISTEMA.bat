@echo off
setlocal enabledelayedexpansion
title ALBA-OS: Verificador de Dependencias y Salud del Sistema
color 0B

echo =====================================================================
echo                ALBA-OS: SYSTEM DIAGNOSTIC ^& REPAIR
echo =====================================================================
echo.

set PROJECTS=backend frontend proyectos\bateriaDePreguntas\backend proyectos\bateriaDePreguntas\frontend proyectos\bateriaDePreguntas\ai-microservice proyectos\controlGasoilFamiliar\backend proyectos\bio-sync-health\frontend proyectos\neural-link-guard\frontend proyectos\gestorDeProyectos\backend proyectos\gestorDeProyectos\frontend proyectos\crypto-terminal-pro\backend proyectos\crypto-terminal-pro\frontend proyectos\echo-vault-storage\backend proyectos\echo-vault-storage\frontend proyectos\tanatorio-tv proyectos\alba-os-control-center\backend proyectos\alba-os-control-center\frontend

set MISSING_COUNT=0

for %%P in (%PROJECTS%) do (
    echo [-] Verificando: %%P
    if not exist "%%P\node_modules\" (
        echo     ^> [!] node_modules NO ENCONTRADO.
        set /a MISSING_COUNT+=1
        echo     ^> Iniciando instalacion automatica en %%P...
        pushd "%%P"
        call npm install --no-audit --no-fund
        if errorlevel 1 (
            echo     ^> [ERROR] No se pudieron instalar dependencias en %%P.
        ) else (
            echo     ^> [OK] Dependencias instaladas.
        )
        popd
    ) else (
        echo     ^> [OK] Componente listo.
    )
    echo.
)

echo.
echo =====================================================================
echo    DIAGNOSTICO FINALIZADO
echo =====================================================================
if %MISSING_COUNT% equ 0 (
    echo [PASSED] Todos los microservicios tienen sus dependencias.
) else (
    echo [FIXED] Se instalaron %MISSING_COUNT% paquetes faltantes.
)
echo.
echo Presiona una tecla para cerrar este verificador y proceder al arranque.
pause > nul
exit /b
