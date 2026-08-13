# Build Manual para Firefox (sem Node.js)

Se você não quiser instalar Node.js, siga estes passos simples:

## Método 1: Renomear arquivos (mais fácil)

1. **Na pasta da extensão**, renomeie:
   - `manifest.json` → `manifest-chrome.json` (backup)
   - `manifest-firefox.json` → `manifest.json`

2. **Selecione TODOS os arquivos** da pasta (Ctrl+A / Cmd+A)
   - Exceto: `manifest-chrome.json`, `manifest-firefox.json`, `*.zip`

3. **Compacte em ZIP**:
   - Windows: clique direito → "Enviar para" → "Pasta compactada"
   - Mac: clique direito → "Comprimir"
   - Linux: clique direito → "Comprimir"

4. **Renomeie o .zip para .xpi**:
   - Ex: `anti-jao-extension.zip` → `anti-jao.xpi`

5. **Pronto!** Teste no Firefox em `about:debugging`

---

## Método 2: Linha de comando

### Windows (PowerShell):
```powershell
cd anti-jao-extension
# Backup do manifest original
Rename-Item manifest.json manifest-chrome.json
# Ativa o manifest do Firefox
Rename-Item manifest-firefox.json manifest.json
# Compacta tudo
Compress-Archive -Path "*" -DestinationPath "anti-jao-firefox.zip"
# Renomeia para .xpi
Rename-Item anti-jao-firefox.zip anti-jao-firefox.xpi
# Restaura manifest original (opcional, para desenvolver no Chrome)
Rename-Item manifest.json manifest-firefox.json
Rename-Item manifest-chrome.json manifest.json
```

### Mac/Linux:
```bash
cd anti-jao-extension
# Backup
mv manifest.json manifest-chrome.json
mv manifest-firefox.json manifest.json
# Cria xpi
zip -r anti-jao-firefox.xpi . -x "*.zip" "manifest-chrome.json" "manifest-firefox.json" "build-firefox.js"
# Restaura
mv manifest.json manifest-firefox.json
mv manifest-chrome.json manifest.json
```

---

## ✅ Checklist antes de publicar

- [ ] O arquivo tem extensão `.xpi`
- [ ] O `manifest.json` dentro é o do Firefox (com `browser_specific_settings`)
- [ ] Todos os ícones estão na pasta `icons/`
- [ ] Não há arquivos ZIP dentro do XPI
- [ ] Testou no Firefox com `about:debugging`
