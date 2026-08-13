# Guia de Instalação — Anti-Jão

## Requisitos

- Google Chrome 88+ / Microsoft Edge 88+ / Brave / Opera / qualquer navegador Chromium
- Modo do desenvolvedor habilitado

---

## Passo a passo

### 1. Extraia o arquivo

Descompacte `anti-jao-extension.zip` em qualquer pasta do seu computador.

### 2. Abra a página de extensões

- **Chrome:** digite `chrome://extensions/` na barra de endereço
- **Edge:** digite `edge://extensions/` na barra de endereço
- **Brave:** digite `brave://extensions/` na barra de endereço

### 3. Ative o modo desenvolvedor

No canto superior direito da página, ative a chave **"Modo do desenvolvedor"** (Developer mode).

### 4. Carregue a extensão

Clique no botão **"Carregar sem compactação"** (Load unpacked).

Selecione a pasta `anti-jao-extension` que você extraiu.

### 5. Pronto!

A extensão 🛡️ Anti-Jão aparecerá na lista. Você pode:

- Fixar o ícone na barra clicando no ícone de quebra-cabeça 🧩 → 📌
- Acessar as configurações clicando com o botão direito no ícone → "Opções"
- Ver as estatísticas clicando no ícone

---

## Solução de problemas

| Problema | Solução |
|----------|---------|
| Ícones não aparecem | Verifique se a pasta `icons/` está dentro da pasta da extensão |
| Extensão não bloqueia nada | Verifique se está ativada no popup e se o site não está na whitelist |
| Falsos positivos | Mude para o modo "Moderado" ou adicione exceções na whitelist |
| Alto uso de CPU | Na aba "Avançado", desative "Análise de contexto" ou aumente o limiar de relevância |

---

## Atualização

Para atualizar para uma nova versão:

1. Substitua os arquivos antigos pelos novos
2. Vá em `chrome://extensions/`
3. Clique no ícone 🔄 (Recarregar) na carta do Anti-Jão
