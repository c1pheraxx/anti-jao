/**
 * Anti-Jão — Build script para Chrome/Edge (.zip)
 * 
 * Como usar:
 *   node scripts/build-chrome.js
 * 
 * Gera: anti-jao-chrome.zip na raiz do projeto
 */

const fs = require('fs');
const path = require('path');

const JSZip = require('jszip');

const SRC_DIR = 'src';
const OUTPUT_FILE = 'anti-jao-chrome.zip';

const EXCLUDE = [
  'manifest-chrome.json',
  'manifest-firefox.json',
  'build-firefox.js',
  'build-chrome.js',
  '.DS_Store',
  'Thumbs.db',
];

function shouldInclude(filePath) {
  const name = path.basename(filePath);
  return !EXCLUDE.includes(name) && !name.startsWith('.');
}

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relPath = path.relative(SRC_DIR, fullPath);

    if (!shouldInclude(fullPath)) continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push({ fullPath, relPath });
    }
  }
  return files;
}

async function build() {
  console.log('🔨 Construindo pacote para Chrome/Edge...\n');

  if (!fs.existsSync('node_modules/jszip')) {
    console.error('❌ jszip não encontrado. Rode primeiro: npm install');
    process.exit(1);
  }

  const zip = new JSZip();
  const files = getAllFiles(SRC_DIR);

  for (const { fullPath, relPath } of files) {
    const content = fs.readFileSync(fullPath);
    zip.file(relPath, content);
    console.log(`  📄 ${relPath}`);
  }

  const buffer = await zip.generateAsync({ 
    type: 'nodebuffer', 
    compression: 'DEFLATE' 
  });

  fs.writeFileSync(OUTPUT_FILE, buffer);

  const sizeKB = (buffer.length / 1024).toFixed(1);
  console.log(`\n✅ ${OUTPUT_FILE} criado com sucesso! (${sizeKB} KB)`);
  console.log('\n🚀 Próximos passos:');
  console.log('   1. Abra chrome://extensions/');
  console.log('   2. Ative "Modo do desenvolvedor"');
  console.log('   3. Arraste o .zip para a página');
}

build().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
