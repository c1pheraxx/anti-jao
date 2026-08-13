# 🛡️ Anti-Jão

**Bloqueie, oculte e filtre qualquer conteúdo relacionado ao cantor Jão na internet.**

Anti-Jão é uma extensão de navegador profissional que utiliza detecção inteligente de texto para identificar e remover conteúdo indesejado, deixando sua navegação personalizada e livre de distrações.

![Versão](https://img.shields.io/badge/versão-2.0.0-ff4757)
![Manifest](https://img.shields.io/badge/manifest-v3-blue)
![Privacidade](https://img.shields.io/badge/privacidade-100%25%20local-success)

---

## ✨ Funcionalidades

- **Bloqueio inteligente** — Detecta páginas, posts, vídeos, imagens e textos relacionados ao termo "Jão"
- **Suporte multi-plataforma** — Funciona em Google, YouTube, Twitter/X, Instagram, TikTok, Facebook, Reddit, Spotify e mais
- **Sistema de filtros** — Lista editável de palavras-chave com proteção contra falsos positivos
- **Dois modos de operação** — Moderado (alta precisão) e Agressivo (máxima proteção)
- **Análise de contexto** — Usa inteligência de texto para identificar conteúdo mesmo sem o nome direto
- **Estatísticas detalhadas** — Contagem de bloqueios, sites filtrados e histórico completo
- **100% local** — Nenhum dado sai do seu navegador

---

## 🚀 Instalação

### Chrome / Edge / Brave (Modo Desenvolvedor)

1. Baixe e extraia o arquivo `anti-jao-extension.zip`
2. Abra o navegador e vá para `chrome://extensions/`
3. Ative o **"Modo do desenvolvedor"** (canto superior direito)
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta `anti-jao-extension`
6. A extensão 🛡️ Anti-Jão aparecerá na barra de ferramentas

### Atualização

Para atualizar, substitua os arquivos da pasta e clique no ícone 🔄 na página `chrome://extensions/`.

---

## 🎮 Como usar

| Ação | Como fazer |
|------|-----------|
| Ativar/Desativar | Clique no ícone 🛡️ e use o toggle |
| Mudar modo | Clique em "Moderado" ou "Agressivo" no popup |
| Ver estatísticas | Clique em "Relatório completo" |
| Configurar palavras | Acesse ⚙️ Configurações → aba "Palavras-chave" |
| Adicionar exceção | Configurações → Whitelist (um site por linha) |

---

## 🏗️ Estrutura do Projeto

```
anti-jao-extension/
├── manifest.json          # Manifest V3
├── background.js          # Service worker
├── content.js             # Script de injeção na página
├── content.css            # Estilos de ocultação
├── constants.js           # Palavras-chave e configurações padrão
├── utils.js               # Funções utilitárias compartilhadas
├── popup.html             # Interface do popup
├── popup.css              # Estilos do popup
├── popup.js               # Lógica do popup
├── options.html           # Página de configurações
├── options.css            # Estilos das opções
├── options.js             # Lógica das opções
├── icons/                 # Ícones da extensão
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── assets/                # Recursos adicionais
├── README.md              # Este arquivo
└── INSTALL.md             # Guia detalhado de instalação
```

---

## 🔒 Privacidade

- **Zero coleta de dados** — Nenhuma informação pessoal é coletada
- **Processamento local** — Toda análise ocorre no seu navegador
- **Sem servidores externos** — A extensão não faz requisições para fora
- **Histórico local** — Estatísticas ficam apenas no `chrome.storage.local`
- **Código aberto** — Totalmente auditável

---

## 🛠️ Tecnologias

- **Manifest V3** — Padrão moderno de extensões Chrome
- **Service Worker** — Background script eficiente
- **MutationObserver** — Detecção dinâmica de novos elementos
- **Content Scripts** — Injeção em todas as páginas
- **Chrome Storage API** — Persistência local de configurações
- **Sistema de pontuação** — Algoritmo de relevância 0.0 a 1.0

---

## 📝 Licença

MIT License — Livre para uso pessoal e modificação.

---

**Feito com 🛡️ para uma internet mais personalizada.**
