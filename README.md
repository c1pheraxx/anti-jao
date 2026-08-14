<div align="center">

# 🛡️ Anti-Jão

**Bloqueie, oculte e filtre qualquer conteúdo relacionado ao cantor Jão na internet.**

[![Versão](https://img.shields.io/badge/vers%C3%A3o-2.0.0-ff4757?style=flat-square)](https://github.com/seu-usuario/anti-jao/releases)
[![Manifest](https://img.shields.io/badge/manifest-v3-blue?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Firefox](https://img.shields.io/badge/Firefox-Compat%C3%ADvel-FF7139?style=flat-square&logo=firefox)](https://addons.mozilla.org/)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green?style=flat-square)](LICENSE)
[![Privacidade](https://img.shields.io/badge/privacidade-100%25%20local-success?style=flat-square)](PRIVACY.md)

</div>

---

## 📖 Sobre

Anti-Jão é uma extensão de navegador profissional que utiliza **detecção inteligente de texto** para identificar e remover conteúdo indesejado, deixando sua navegação personalizada e livre de distrações.

Funciona em **Google**, **YouTube**, **Twitter/X**, **Instagram**, **TikTok**, **Facebook**, **Reddit**, **Spotify** e qualquer outro site.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---------|-----------|
| 🛡️ **Bloqueio inteligente** | Detecta páginas, posts, vídeos, imagens e textos relacionados ao termo "Jão" |
| 🌐 **Multi-plataforma** | Google, YouTube, Twitter/X, Instagram, TikTok, Facebook, Reddit, Spotify e mais |
| 🔤 **Filtros editáveis** | Lista de palavras-chave personalizável com proteção contra falsos positivos |
| 🎚️ **Dois modos** | **Moderado** (alta precisão) e **Agressivo** (máxima proteção) |
| 🧠 **Análise de contexto** | Identifica conteúdo relacionado mesmo sem o nome direto |
| 📊 **Estatísticas** | Contagem de bloqueios, sites filtrados e histórico completo |
| 🔒 **100% local** | Nenhum dado sai do seu navegador |

---

## 🚀 Instalação

### Chrome / Edge / Brave (Modo Desenvolvedor)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/anti-jao.git
cd anti-jao/src

# 2. Abra chrome://extensions/ no navegador
# 3. Ative "Modo do desenvolvedor"
# 4. Clique "Carregar sem compactação" e selecione a pasta src/
```

### Firefox

```bash
# 1. Clone o repositório
git clone https://github.com/c1pheraxx/anti-jao.git
cd anti-jao

# 2. Gere o pacote .xpi
node scripts/build-firefox.js

# 3. O arquivo anti-jao-firefox.xpi será criado na raiz
# 4. Arraste o .xpi para o Firefox ou use about:debugging
```

Ou instale direto da loja: [addons.mozilla.org](https://addons.mozilla.org/pt-BR/firefox/addon/anti-jao/) *(quando publicado)*

---

## 🎮 Como usar

| Ação | Como fazer |
|------|-----------|
| Ativar/Desativar | Clique no ícone 🛡️ na barra de ferramentas e use o toggle |
| Mudar modo | Clique em "Moderado" ou "Agressivo" no popup |
| Ver estatísticas | Clique em "Relatório completo" no popup |
| Configurar palavras | Acesse ⚙️ Configurações → aba "Palavras-chave" |
| Adicionar exceção | Configurações → Whitelist (um site por linha) |

---

## 🏗️ Estrutura do Projeto

```
anti-jao/
├── .github/                 # Templates de issues e PRs
├── screenshots/             # Screenshots para a loja
├── scripts/                 # Scripts de build
│   └── build-firefox.js     # Gera o .xpi para Firefox
├── src/                     # Código-fonte da extensão
│   ├── manifest.json          # Manifest V3 (Chrome/Edge)
│   ├── manifest-firefox.json  # Manifest adaptado para Firefox
│   ├── background.js          # Service worker
│   ├── content.js             # Script de injeção na página
│   ├── content.css            # Estilos de ocultação
│   ├── constants.js           # Palavras-chave e configurações
│   ├── utils.js               # Funções utilitárias
│   ├── popup.html             # Interface do popup
│   ├── popup.css              # Estilos do popup
│   ├── popup.js               # Lógica do popup
│   ├── options.html           # Página de configurações
│   ├── options.css            # Estilos das opções
│   ├── options.js             # Lógica das opções
│   ├── icons/                 # Ícones da extensão
│   └── assets/                # Recursos adicionais
├── .gitignore
├── LICENSE                    # Licença MIT
├── package.json               # Dependências de build
├── README.md                  # Este arquivo
├── INSTALL.md                 # Guia detalhado de instalação
├── FIREFOX-GUIDE.md           # Guia de publicação no Firefox
├── BUILD-FIREFOX-MANUAL.md    # Build manual sem Node.js
└── PRIVACY.md                 # Política de privacidade
```

---

## 🔒 Privacidade

- ✅ **Zero coleta de dados** — Nenhuma informação pessoal é coletada
- ✅ **Processamento local** — Toda análise ocorre no seu navegador
- ✅ **Sem servidores externos** — A extensão não faz requisições para fora
- ✅ **Histórico local** — Estatísticas ficam apenas no `browser.storage.local`
- ✅ **Código aberto** — Totalmente auditável

Leia nossa [Política de Privacidade completa](PRIVACY.md).

---

## 🛠️ Tecnologias

- **Manifest V3** — Padrão moderno de extensões
- **Service Worker** — Background script eficiente
- **MutationObserver** — Detecção dinâmica de novos elementos
- **Content Scripts** — Injeção em todas as páginas
- **Storage API** — Persistência local de configurações
- **Sistema de pontuação** — Algoritmo de relevância 0.0 a 1.0

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para saber como começar.

### Reportar bugs ou sugerir funcionalidades

- 🐛 [Reportar um bug](https://github.com/seu-usuario/anti-jao/issues/new?template=bug_report.md)
- 💡 [Sugerir funcionalidade](https://github.com/seu-usuario/anti-jao/issues/new?template=feature_request.md)

---

## 📝 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE) — livre para uso pessoal e modificação.

---

<div align="center">

**Feito com 🛡️ para uma internet mais personalizada.**

[⭐ Star neste repo](https://github.com/seu-usuario/anti-jao) · [🐛 Reportar bug](../../issues) · [💡 Sugerir funcionalidade](../../issues)

</div>
