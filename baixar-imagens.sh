#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  ORMED - Download de Imagens do Google Drive                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📥 Este script vai baixar as imagens do Google Drive"
echo "   e integrá-las no projeto ORMED."
echo ""
echo "🔗 Link: https://drive.google.com/drive/folders/1OpA6qTwfu8gifqTzwIr2fbmscmrACAtx"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado!"
    echo "   Por favor, instale o Python primeiro:"
    echo "   https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python3 encontrado"

# Install gdown if not present
echo ""
echo "📦 Verificando gdown..."
python3 -c "import gdown" 2>/dev/null || {
    echo "📥 Instalando gdown..."
    pip3 install gdown -q || {
        echo "❌ Falha ao instalar gdown"
        exit 1
    }
}
echo "✅ gdown instalado"

# Create output directory
mkdir -p public/images/from-drive

# Download from Google Drive
echo ""
echo "📥 Baixando imagens do Google Drive..."
echo "   Isso pode demorar alguns minutos..."
echo ""

python3 -c "
import gdown
try:
    gdown.download_folder(
        'https://drive.google.com/drive/folders/1OpA6qTwfu8gifqTzwIr2fbmscmrACAtx',
        output='public/images/from-drive',
        quiet=False
    )
    print('✅ Download concluído!')
except Exception as e:
    print(f'❌ Erro: {e}')
    print('💡 Tente baixar manualmente do Google Drive')
"

echo ""
echo "📁 Arquivos baixados:"
find public/images/from-drive -type f

echo ""
echo "🚀 Próximos passos:"
echo "   1. Verifique as imagens em: public/images/from-drive/"
echo "   2. Atualize lib/data.ts se necessário"
echo "   3. Rode: npm run dev"
echo ""
