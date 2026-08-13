# 🦊 Guia Completo — Publicar Anti-Jão no Firefox

> **Grátis!** A Mozilla não cobra taxa para publicar extensões.

---

## 📋 Antes de começar

### O que você precisa:
- Conta Mozilla (gratuita, usa seu email)
- A extensão pronta (já temos!)
- Navegador Firefox instalado (para testar)
- Aproximadamente **15 minutos** do seu tempo

---

## 🛠️ Passo 1: Preparar a extensão para o Firefox

O Firefox usa o formato **.xpi** (zip renomeado) e tem pequenas diferenças no `manifest.json`.

### 1.1 Use o manifest correto

Já criamos o arquivo `manifest-firefox.json` no projeto. Para publicar:

```bash
# Renomeie o manifest do Firefox para ser o principal
cp manifest-firefox.json manifest.json
```

Ou simplesmente substitua o conteúdo do `manifest.json` pelo do `manifest-firefox.json`.

### Principais diferenças do Firefox:

| Chrome/Edge | Firefox |
|-------------|---------|
| `host_permissions` separado | Tudo dentro de `permissions` |
| `background.service_worker` | `background.scripts` (mais compatível) |
| Sem ID obrigatório | Precisa de `browser_specific_settings.gecko.id` |
| `options_page` | `options_ui` com `open_in_tab` |

---

## 📦 Passo 2: Empacotar no formato .xpi

O Firefox aceita extensões no formato **.xpi** (que é basicamente um .zip renomeado).

### No Windows (PowerShell):
```powershell
# Entre na pasta da extensão
cd anti-jao-extension

# Renomeie o manifest do Firefox
copy manifest-firefox.json manifest.json

# Crie o .xpi (selecione todos os arquivos e compacte)
Compress-Archive -Path "*" -DestinationPath "anti-jao.xpi"
```

### No Mac/Linux:
```bash
cd anti-jao-extension
cp manifest-firefox.json manifest.json
zip -r anti-jao.xpi . -x "*.zip" "manifest-firefox.json"
```

> ⚠️ **Importante:** Não inclua o arquivo ZIP dentro do XPI. O .xpi deve conter apenas os arquivos da extensão.

---

## 🧪 Passo 3: Testar localmente no Firefox

Antes de publicar, teste se funciona:

1. Abra o Firefox
2. Digite na barra de endereço: `about:debugging`
3. Clique em **"Este Firefox"** (This Firefox)
4. Clique em **"Carregar extensão temporária..."**
5. Selecione o arquivo `anti-jao.xpi`
6. A extensão 🛡️ Anti-Jão será carregada
7. Teste em sites como Google, YouTube, Twitter

Se tudo funcionar, pode seguir para a publicação!

---

## 📝 Passo 4: Criar conta no Firefox Add-ons (AMO)

1. Acesse: **https://addons.mozilla.org/pt-BR/developers/**
2. Clique em **"Entrar"** ou **"Cadastrar"**
3. Use sua conta Firefox existente ou crie uma nova (grátis)
4. Complete seu perfil de desenvolvedor:
   - Nome de exibição
   - URL do site (opcional)
   - Bio (opcional)

---

## 🚀 Passo 5: Enviar a extensão

### 5.1 Acesse o painel de desenvolvedor

1. Vá em: https://addons.mozilla.org/pt-BR/developers/addon/submit/distribution
2. Ou clique em **"Enviar novo complemento"**

### 5.2 Escolha o método de distribuição

| Opção | Quando usar |
|-------|-------------|
| **Pública (recomendada)** | Qualquer pessoa pode instalar pela loja |
| **Própria** | Você distribui o link/XPI manualmente |

Escolha **"Pública"** para publicar na loja oficial.

### 5.3 Faça o upload

1. Clique em **"Selecionar arquivo..."**
2. Escolha o `anti-jao.xpi`
3. Aguarde o processamento automático

### 5.4 Preencha os metadados

A Mozilla exige estas informações:

| Campo | O que colocar |
|-------|---------------|
| **Nome** | Anti-Jão |
| **URL** | (deixe em branco ou use GitHub) |
| **Resumo** | Bloqueie conteúdo relacionado ao cantor Jão. Navegação personalizada e livre de distrações. |
| **Descrição** | Veja o modelo abaixo 👇 |
| **Categoria** | Privacidade & Segurança |
| **Licença** | MIT / X11 |
| **Política de privacidade** | (obrigatório) Veja modelo abaixo 👇 |
| **Email de suporte** | Seu email |

### Modelo de descrição longa:

```
🛡️ Anti-Jão — Controle total sobre seu conteúdo

A extensão Anti-Jão foi desenvolvida para oferecer controle total sobre o conteúdo que você consome na internet. Com tecnologia de análise de texto e detecção inteligente, ela identifica e oculta qualquer conteúdo relacionado ao cantor Jão.

✨ Funcionalidades:
• Bloqueio inteligente em Google, YouTube, Twitter/X, Instagram, TikTok e mais
• Lista editável de palavras-chave
• Dois modos: Moderado e Agressivo
• Análise de contexto com pontuação de relevância
• Estatísticas detalhadas de bloqueios
• 100% local — nenhum dado sai do navegador

🔒 Privacidade:
Toda a análise ocorre localmente no seu navegador. Não coletamos dados pessoais, não enviamos informações para servidores externos e não rastreamos sua navegação.

⚙️ Tecnologias:
Manifest V3, Service Worker, MutationObserver, Chrome Storage API
```

### Modelo de política de privacidade:

```
Política de Privacidade — Anti-Jão

1. Coleta de dados: NÃO coletamos nenhum dado pessoal do usuário.
2. Processamento: Toda a análise de conteúdo ocorre localmente no navegador do usuário.
3. Servidores externos: A extensão NÃO faz requisições para servidores externos.
4. Histórico: As estatísticas de bloqueio são armazenadas apenas no armazenamento local do navegador (chrome.storage.local / browser.storage.local).
5. Terceiros: Não compartilhamos dados com terceiros.
6. Permissões: As permissões solicitadas são estritamente necessárias para o funcionamento da extensão (análise de páginas web e armazenamento local de configurações).

Última atualização: 2026
```

### 5.5 Ícones e screenshots

- **Ícone:** Já está no pacote (128x128px) ✅
- **Screenshots:** Adicione 1-5 imagens mostrando:
  - O popup da extensão
  - A página de configurações
  - Um exemplo de conteúdo bloqueado
  - As estatísticas

> 💡 **Dica:** Use screenshots com tema escuro, fica mais profissional.

### 5.6 Envie para revisão

1. Revise todas as informações
2. Clique em **"Enviar versão"**
3. A Mozilla vai analisar seu código (revisão manual + automática)

---

## ⏳ Passo 6: Aguardar aprovação

### Quanto tempo demora?

| Tipo de extensão | Tempo médio |
|------------------|-------------|
| Simples (como esta) | **1-3 dias úteis** |
| Complexa | 1-2 semanas |

### O que a Mozilla verifica?

- ✅ Código malicioso (não tem!)
- ✅ Permissões excessivas (não tem!)
- ✅ Coleta de dados indevida (não fazemos!)
- ✅ Funcionalidade declarada (funciona mesmo!)
- ✅ Política de privacidade presente

### Status que você verá:

1. **"Em fila"** — Aguardando revisão
2. **"Em revisão"** — Alguém da Mozilla está analisando
3. **"Aprovada"** 🎉 — Publicada na loja!
4. **"Rejeitada"** ❌ — Leia o motivo, corrija e reenvie

---

## 🎉 Passo 7: Publicado! E agora?

Quando aprovada, sua extensão estará em:
```
https://addons.mozilla.org/pt-BR/firefox/addon/anti-jao/
```

### Você pode:
- Compartilhar o link nas redes sociais
- Adicionar o badge "Disponível no Firefox" no README
- Atualizar a descrição a qualquer momento
- Publicar novas versões (updates passam por revisão mais rápida)

---

## 🔄 Passo 8: Atualizar versão

Quando quiser lançar uma atualização:

1. Altere a versão no `manifest.json` (ex: `"2.1.0"`)
2. Reempacote o `.xpi`
3. Acesse o painel do desenvolvedor
4. Clique em **"Enviar nova versão"**
5. Faça upload do novo `.xpi`
6. Adicione notas de release (o que mudou)
7. Envie para revisão

Updates geralmente são aprovados mais rápido (horas ou 1 dia).

---

## ❗ Problemas comuns e soluções

| Problema | Solução |
|----------|---------|
| "Manifest inválido" | Use o `manifest-firefox.json` fornecido |
| "Service worker não suportado" | Firefox 121+ suporta. Ou use `background.scripts` no V2 |
| Rejeição por privacidade | Adicione a política de privacidade completa |
| Rejeição por descrição vaga | Seja específico sobre o que a extensão faz |
| "Permissões excessivas" | Justifique cada permissão no manifest |
| Ícone não aparece | Verifique se é PNG e tem todos os tamanhos |

---

## 📞 Links úteis

- **Painel do desenvolvedor:** https://addons.mozilla.org/pt-BR/developers/
- **Documentação Firefox:** https://extensionworkshop.com/
- **Manifest V3 Firefox:** https://developer.mozilla.org/pt-BR/docs/Mozilla/Add-ons/WebExtensions/manifest.json
- **Status da revisão:** Acompanhe no painel do desenvolvedor

---

**Boa sorte! A Mozilla é bem receptiva com extensões de privacidade como esta.** 🦊🛡️
