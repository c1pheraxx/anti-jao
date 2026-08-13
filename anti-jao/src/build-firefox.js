/**
 * Anti-Jão — Script de build para Firefox
 * 
 * Como usar:
 * 1. Instale Node.js (https://nodejs.org)
 * 2. Abra o terminal na pasta da extensão
 * 3. Rode: node build-firefox.js
 * 4. O arquivo anti-jao-firefox.xpi será gerado
 */

const fs = require('fs');
const path = require('path');

// Verifica se estamos na pasta correta
if (!fs.existsSync('manifest.json')) {
  console.error('❌ Erro: Execute este script na pasta raiz da extensão (onde está o manifest.json)');
  process.exit(1);
}

// Lê o manifest do Firefox
const firefoxManifest = fs.readFileSync('manifest-firefox.json', 'utf8');

// Backup do manifest original
const originalManifest = fs.readFileSync('manifest.json', 'utf8');
fs.writeFileSync('manifest-chrome.json', originalManifest);
console.log('💾 Backup do manifest original salvo como manifest-chrome.json');

// Substitui pelo manifest do Firefox
fs.writeFileSync('manifest.json', firefoxManifest);
console.log('📝 Manifest do Firefox ativado');

// Lista de arquivos a incluir (exclui arquivos de build e Chrome)
const exclude = [
  'manifest-firefox.json',
  'manifest-chrome.json', 
  'build-firefox.js',
  'anti-jao-firefox.xpi',
  'anti-jao-extension.zip',
  'node_modules',
  '.git',
  '.DS_Store'
];

function shouldInclude(filePath) {
  const name = path.basename(filePath);
  return !exclude.includes(name) && !name.startsWith('.');
}

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relPath = path.relative(process.cwd(), fullPath);

    if (!shouldInclude(fullPath)) continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(relPath);
    }
  }
  return files;
}

// Cria o XPI (ZIP renomeado)
const JSZip = require('jszip');

// Se não tiver jszip instalado, dá instruções
if (!fs.existsSync('node_modules/jszip')) {
  console.log('\n📦 Instalando dependência jszip...');
  console.log('Rode primeiro: npm install jszip\n');

  // Fallback: instruções manuais
  console.log('🔄 Alternativa manual:');
  console.log('1. Renomeie manifest-firefox.json para manifest.json');
  console.log('2. Compacte TODOS os arquivos em um ZIP');
  console.log('3. Renomeie o .zip para .xpi');
  console.log('4. Pronto!\n');

  // Restaura manifest original
  fs.writeFileSync('manifest.json', originalManifest);
  process.exit(0);
}

const zip = new JSZip();
const files = getAllFiles('.');

for (const file of files) {
  const content = fs.readFileSync(file);
  zip.file(file, content);
}

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  .then(buffer => {
    fs.writeFileSync('anti-jao-firefox.xpi', buffer);
    console.log('✅ anti-jao-firefox.xpi criado com sucesso!');
    console.log(`📦 Tamanho: ${(buffer.length / 1024).toFixed(1)} KB`);

    // Restaura manifest original
    fs.writeFileSync('manifest.json', originalManifest);
    console.log('🔄 Manifest original restaurado');
    console.log('\n🦊 Agora você pode:');
    console.log('   • Testar no Firefox: about:debugging → Carregar temporária');
    console.log('   • Publicar: https://addons.mozilla.org/developers/');
  })
  .catch(err => {
    console.error('❌ Erro ao criar XPI:', err);
    fs.writeFileSync('manifest.json', originalManifest);
  });
