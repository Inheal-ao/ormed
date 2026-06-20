#!/usr/bin/env node
/**
 * Script de Otimização de Imagens para ORMED
 * 
 * Como usar:
 * 1. Coloque as imagens na pasta img/
 * 2. Rode: node optimize-images.js
 * 3. As imagens otimizadas vão para public/images/
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  inputDir: './img',
  outputDir: './public/images',
  sizes: {
    hero: { width: 1920, height: 1080, quality: 80 },
    news: { width: 800, height: 450, quality: 80 },
    events: { width: 800, height: 450, quality: 80 },
    avatars: { width: 200, height: 200, quality: 85 },
    bastonaria: { width: 600, height: 800, quality: 85 },
    about: { width: 1200, height: 800, quality: 80 },
    logo: { width: 200, height: 200 },
  }
};

// Check if img directory exists
if (!fs.existsSync(CONFIG.inputDir)) {
  console.log('❌ Pasta img/ não encontrada!');
  console.log('   Crie uma pasta "img" e coloque as imagens lá.');
  process.exit(1);
}

// Create output directory
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Copy images from img/ to public/images/
function copyImages() {
  const categories = ['logo', 'bastonaria', 'hero', 'news', 'events', 'avatars', 'about'];

  categories.forEach(category => {
    const srcDir = path.join(CONFIG.inputDir, category);
    const destDir = path.join(CONFIG.outputDir, category);

    if (fs.existsSync(srcDir)) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const files = fs.readdirSync(srcDir);
      files.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
          const size = fs.statSync(srcPath).size;
          console.log(`✅ ${category}/${file} (${(size/1024).toFixed(1)} KB)`);
        }
      });
    }
  });

  // Also copy loose files from img/ root
  const rootFiles = fs.readdirSync(CONFIG.inputDir);
  rootFiles.forEach(file => {
    const srcPath = path.join(CONFIG.inputDir, file);
    if (fs.statSync(srcPath).isFile()) {
      const destPath = path.join(CONFIG.outputDir, file);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ ${file} (root)`);
    }
  });
}

console.log('🚀 ORMED - Otimização de Imagens');
console.log('═══════════════════════════════════════');
console.log(`📁 Origem: ${CONFIG.inputDir}/`);
console.log(`📁 Destino: ${CONFIG.outputDir}/`);
console.log('');

copyImages();

console.log('');
console.log('✅ Imagens copiadas com sucesso!');
console.log('');
console.log('💡 DICA: Para otimização avançada (compressão WebP),');
console.log('   instale: npm install -g sharp');
console.log('   e rode: node optimize-advanced.js');
