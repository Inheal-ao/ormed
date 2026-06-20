@echo off
chcp 65001 >nul
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  ORMED - Download de Imagens do Google Drive                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📥 Este script vai baixar as imagens do Google Drive
echo    e integrá-las no projeto ORMED.
echo.
echo 🔗 Link: https://drive.google.com/drive/folders/1OpA6qTwfu8gifqTzwIr2fbmscmrACAtx
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo    Por favor, instale o Python primeiro:
    echo    https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python encontrado

REM Install gdown if not present
echo.
echo 📦 Verificando gdown...
python -c "import gdown" >nul 2>&1
if errorlevel 1 (
    echo 📥 Instalando gdown...
    pip install gdown -q
    if errorlevel 1 (
        echo ❌ Falha ao instalar gdown
        pause
        exit /b 1
    )
)
echo ✅ gdown instalado

REM Create output directory
if not exist "public\images\from-drive" mkdir "public\images\from-drive"

REM Download from Google Drive
echo.
echo 📥 Baixando imagens do Google Drive...
echo    Isso pode demorar alguns minutos...
echo.

python -c "import gdown; gdown.download_folder('https://drive.google.com/drive/folders/1OpA6qTwfu8gifqTzwIr2fbmscmrACAtx', output='public/images/from-drive', quiet=False)"

if errorlevel 1 (
    echo.
    echo ❌ Download falhou!
    echo.
    echo 💡 Tente baixar manualmente:
    echo    1. Acesse: https://drive.google.com/drive/folders/1OpA6qTwfu8gifqTzwIr2fbmscmrACAtx
    echo    2. Baixe todas as imagens
    echo    3. Cole em: public/images/
    pause
    exit /b 1
)

echo.
echo ✅ Download concluído!
echo.

REM List downloaded files
echo 📁 Arquivos baixados:
dir /s /b "public\images\from-drive"

echo.
echo 🚀 Próximos passos:
echo    1. Verifique as imagens em: public/images/from-drive/
echo    2. Atualize lib/data.ts se necessário
echo    3. Rode: npm run dev
echo.
pause
