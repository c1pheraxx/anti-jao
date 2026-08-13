# Política de Privacidade — Anti-Jão

**Última atualização:** 12 de agosto de 2026

---

## 1. Compromisso com a privacidade

O Anti-Jão foi desenvolvido com o princípio fundamental de **privacidade por design**. Nossa extensão não coleta, não transmite e não armazena nenhum dado pessoal em servidores externos.

---

## 2. Dados que NÃO coletamos

A extensão Anti-Jão **NÃO** coleta, armazena ou transmite:

- ❌ Histórico de navegação
- ❌ Dados pessoais (nome, email, endereço, etc.)
- ❌ Informações de login ou senhas
- ❌ Dados de localização
- ❌ Comportamento de navegação
- ❌ Conteúdo de páginas web (exceto para análise local imediata)
- ❌ Estatísticas de uso para análise

---

## 3. Dados processados localmente

Toda a análise de conteúdo ocorre **exclusivamente no navegador do usuário**, em tempo real. A extensão:

- Analisa o texto visível na página atual
- Compara com uma lista local de palavras-chave
- Oculta elementos que correspondem aos critérios
- **Nunca** envia o conteúdo analisado para lugar nenhum

---

## 4. Armazenamento local

A extensão utiliza a API `browser.storage.local` (ou `chrome.storage.local`) para armazenar **apenas**:

- Configurações do usuário (modo de operação, palavras-chave personalizadas, whitelist)
- Estatísticas de bloqueio (contagem total, sites filtrados, histórico local)

Esses dados:
- Ficam exclusivamente no dispositivo do usuário
- Não são sincronizados com a nuvem
- Não são acessíveis por terceiros
- Podem ser apagados a qualquer momento nas configurações da extensão

---

## 5. Permissões

A extensão solicita as seguintes permissões, todas estritamente necessárias para seu funcionamento:

| Permissão | Motivo |
|-----------|--------|
| `storage` | Armazenar configurações e estatísticas localmente |
| `activeTab` | Analisar a página atual para detecção de conteúdo |
| `scripting` | Injetar scripts de análise nas páginas |
| `<all_urls>` | Analisar conteúdo em qualquer site (necessário para o bloqueio funcionar em todas as páginas) |

---

## 6. Servidores externos

A extensão **NÃO** faz requisições para servidores externos. Não há:
- Telemetria
- Analytics
- Atualizações automáticas via servidor próprio
- Comunicação com APIs de terceiros

---

## 7. Código aberto

O código-fonte completo da extensão está disponível publicamente em:

https://github.com/seu-usuario/anti-jao

Qualquer pessoa pode auditar o código para verificar nossas afirmações de privacidade.

---

## 8. Alterações nesta política

Se houver alterações nesta política de privacidade, atualizaremos esta página e o campo `data_collection_permissions` no manifest da extensão.

---

## 9. Contato

Para dúvidas sobre privacidade, abra uma [Issue no GitHub](https://github.com/seu-usuario/anti-jao/issues) ou entre em contato pelo email de suporte.
