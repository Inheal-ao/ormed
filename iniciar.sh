#!/bin/bash
echo "=========================================="
echo " ORMED - Ordem dos Médicos de Angola"
echo " Instalador Rápido"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[1/3] A instalar dependências..."
    echo "Isso pode demorar alguns minutos..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERRO: Falha ao instalar dependências!"
        exit 1
    fi
    echo "[OK] Dependências instaladas!"
else
    echo "[1/3] Dependências já instaladas."
fi

echo ""
echo "[2/3] A iniciar o servidor..."
echo "O site vai abrir em http://localhost:3000"
echo ""
echo "Pressione CTRL+C para parar o servidor"
echo ""

# Start the dev server
npm run dev
