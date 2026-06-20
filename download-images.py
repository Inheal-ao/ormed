#!/usr/bin/env python3
"""
Script para baixar imagens do Google Drive e integrar no projeto ORMED

COMO USAR:
1. Instale as dependências: pip install gdown
2. Rode: python3 download-images.py
3. As imagens serão baixadas e otimizadas automaticamente
"""

import os
import subprocess
import sys

# Configuração
FOLDER_ID = "1OpA6qTwfu8gifqTzwIr2fbmscmrACAtx"
OUTPUT_DIR = "./public/images/from-drive"
PROJECT_DIR = "."

def install_gdown():
    """Instala gdown se não estiver instalado"""
    try:
        import gdown
        print("✅ gdown já instalado")
        return True
    except ImportError:
        print("📦 Instalando gdown...")
        subprocess.run([sys.executable, "-m", "pip", "install", "gdown", "-q"])
        try:
            import gdown
            print("✅ gdown instalado com sucesso")
            return True
        except ImportError:
            print("❌ Falha ao instalar gdown")
            return False

def download_folder():
    """Baixa a pasta do Google Drive"""
    import gdown

    url = f"https://drive.google.com/drive/folders/{FOLDER_ID}"

    print(f"\n📥 Baixando imagens do Google Drive...")
    print(f"   URL: {url}")
    print(f"   Destino: {OUTPUT_DIR}")

    try:
        gdown.download_folder(url, output=OUTPUT_DIR, quiet=False)
        print("✅ Download concluído!")
        return True
    except Exception as e:
        print(f"❌ Erro no download: {e}")
        return False

def organize_images():
    """Organiza as imagens baixadas"""
    if not os.path.exists(OUTPUT_DIR):
        print("❌ Pasta de download não encontrada")
        return False

    print("\n📁 Organizando imagens...")

    # Listar arquivos baixados
    for root, dirs, files in os.walk(OUTPUT_DIR):
        for file in files:
            filepath = os.path.join(root, file)
            size = os.path.getsize(filepath)
            rel_path = os.path.relpath(filepath, OUTPUT_DIR)
            print(f"   📄 {rel_path} ({size/1024:.1f} KB)")

    return True

def update_data_ts():
    """Atualiza lib/data.ts com os novos caminhos das imagens"""
    data_file = os.path.join(PROJECT_DIR, "lib", "data.ts")

    if not os.path.exists(data_file):
        print("❌ lib/data.ts não encontrado")
        return False

    print("\n📝 Atualizando lib/data.ts...")

    with open(data_file, 'r') as f:
        content = f.read()

    # Aqui você pode adicionar lógica para atualizar os caminhos das imagens
    # Por enquanto, apenas verificamos se o arquivo existe

    print("✅ lib/data.ts verificado")
    return True

def main():
    print("="*60)
    print(" ORMED - Integração de Imagens do Google Drive")
    print("="*60)

    # Passo 1: Instalar gdown
    if not install_gdown():
        print("\n❌ Não foi possível instalar gdown")
        print("   Tente manualmente: pip install gdown")
        return

    # Passo 2: Criar pasta de saída
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Passo 3: Download
    if not download_folder():
        print("\n⚠️ Download automático falhou")
        print("   Tente baixar manualmente do Google Drive")
        print(f"   Link: https://drive.google.com/drive/folders/{FOLDER_ID}")
        return

    # Passo 4: Organizar
    organize_images()

    # Passo 5: Atualizar data.ts
    update_data_ts()

    print("\n" + "="*60)
    print(" ✅ Processo concluído!")
    print("="*60)
    print("\nPróximos passos:")
    print("   1. Verifique as imagens em:", OUTPUT_DIR)
    print("   2. Atualize lib/data.ts se necessário")
    print("   3. Rode: npm run dev")

if __name__ == "__main__":
    main()
