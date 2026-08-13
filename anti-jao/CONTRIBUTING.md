# 🤝 Contribuindo com o Anti-Jão

Obrigado por seu interesse em contribuir! Este guia vai te ajudar a começar.

---

## 🚀 Primeiros passos

1. **Fork** este repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/SEU-USUARIO/anti-jao.git
   cd anti-jao
   ```
3. Crie uma **branch** para sua contribuição:
   ```bash
   git checkout -b minha-contribuicao
   ```

---

## 📁 Estrutura do código

```
src/
├── manifest.json          # Manifest V3 (Chrome/Edge)
├── manifest-firefox.json  # Manifest adaptado para Firefox
├── background.js          # Service worker — eventos do navegador
├── content.js             # Script injetado nas páginas — detecção e bloqueio
├── content.css            # Estilos aplicados aos elementos bloqueados
├── constants.js           # Palavras-chave, configurações padrão e listas
├── utils.js               # Funções utilitárias compartilhadas
├── popup.html/css/js      # Interface do popup
├── options.html/css/js    # Página de configurações
└── icons/                 # Ícones da extensão
```

---

## 🛠️ Ambiente de desenvolvimento

### Requisitos

- [Node.js](https://nodejs.org/) 18+ (opcional, para scripts de build)
- Navegador Chrome, Edge, Firefox ou Brave
- Editor de código (VS Code recomendado)

### Instalar dependências

```bash
npm install
```

### Build para Firefox

```bash
npm run build:firefox
```

Isso gera o arquivo `anti-jao-firefox.xpi` na raiz do projeto.

---

## 🧪 Testando localmente

### Chrome / Edge / Brave

1. Abra `chrome://extensions/`
2. Ative **"Modo do desenvolvedor"**
3. Clique em **"Carregar sem compactação"**
4. Selecione a pasta `src/`

### Firefox

1. Abra `about:debugging`
2. Clique em **"Este Firefox"**
3. Clique em **"Carregar extensão temporária..."**
4. Selecione o arquivo `anti-jao-firefox.xpi`

---

## 📝 Tipos de contribuição

### 🐛 Reportar bugs

- Verifique se o bug já foi reportado em [Issues](../../issues)
- Use o template [Bug Report](../../issues/new?template=bug_report.md)
- Inclua:
  - Navegador e versão
  - Passos para reproduzir
  - Comportamento esperado vs. atual
  - Screenshots (se aplicável)

### 💡 Sugerir funcionalidades

- Use o template [Feature Request](../../issues/new?template=feature_request.md)
- Explique o problema que a funcionalidade resolve
- Descreva a solução proposta

### 🔤 Adicionar palavras-chave

Se quiser adicionar termos relacionados ao Jão que estão faltando:

1. Edite `src/constants.js`
2. Adicione o termo ao array `JAO_KEYWORDS`
3. Se for um falso positivo, adicione a `FALSE_POSITIVES`
4. Envie um PR com a descrição do termo

### 🎨 Melhorar a interface

- Edite os arquivos CSS em `src/popup.css` e `src/options.css`
- Mantenha o tema escuro como padrão
- Teste em diferentes tamanhos de tela

### 🌍 Traduções

Quer traduzir para outro idioma?

1. Crie uma cópia dos arquivos HTML/JS com sufixo do idioma (ex: `popup-pt-BR.html`)
2. Traduza os textos visíveis
3. Envie um PR descrevendo o idioma adicionado

---

## ✅ Checklist antes de enviar um PR

- [ ] Testei a extensão no Chrome/Edge
- [ ] Testei a extensão no Firefox
- [ ] O código segue o estilo existente
- [ ] Adicionei comentários onde necessário
- [ ] Atualizei o README se necessário
- [ ] Não quebrei funcionalidades existentes

---

## 📜 Código de conduta

Seja respeitoso e construtivo. Todas as contribuições são bem-vindas, independentemente do nível de experiência.

---

**Dúvidas?** Abra uma [Issue](../../issues) ou entre em contato.
