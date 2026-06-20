@echo off
echo ==========================================
echo  ORMED - Ordem dos Médicos de Angola
echo  Instalador Rapido
echo ==========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [1/3] A instalar dependencias...
    echo Isso pode demorar alguns minutos...
    call npm install
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas!
) else (
    echo [1/3] Dependencias ja instaladas.
)

echo.
echo [2/3] A iniciar o servidor...
echo O site vai abrir em http://localhost:3000
echo.
echo Pressione CTRL+C para parar o servidor
echo.

REM Start the dev server
call npm run dev

pause
