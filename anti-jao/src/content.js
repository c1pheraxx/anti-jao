/**
 * Anti-Jão Extension - Content Script
 * Detecta e oculta conteúdo relacionado ao Jão em todas as páginas
 */

(function () {
  "use strict";

  // Evita execução duplicada
  if (window.__antiJaoInitialized) return;
  window.__antiJaoInitialized = true;

  // Estado global
  let settings = { ...DEFAULT_SETTINGS };
  let stats = { ...DEFAULT_SETTINGS.stats };
  let blockedCount = 0;
  let observer = null;
  let shieldElement = null;

  /**
   * Inicializa a extensão
   */
  async function init() {
    settings = await loadSettings();
    stats = await loadStats();

    if (!settings.enabled) {
      console.log("[Anti-Jão] Extensão desativada.");
      return;
    }

    // Verifica whitelist
    if (isWhitelisted(window.location.href, settings.whitelistSites)) {
      console.log("[Anti-Jão] Site na whitelist, ignorando.");
      return;
    }

    console.log("[Anti-Jão] Proteção ativada no modo:", settings.mode);

    // Executa análise inicial
    scanAndBlock();

    // Configura MutationObserver para detectar novos elementos
    setupMutationObserver();

    // Cria o escudo flutuante
    if (settings.showBlockedCount) {
      createShield();
    }

    // Escuta mensagens do popup/background
    chrome.runtime.onMessage.addListener(handleMessage);
  }

  /**
   * Escaneia a página e bloqueia conteúdo relacionado
   */
  function scanAndBlock() {
    const selectors = getSelectorsForSite();
    const elements = document.querySelectorAll(selectors);

    elements.forEach((element) => {
      if (!shouldAnalyzeElement(element)) return;

      const text = extractText(element);
      const score = calculateRelevanceScore(text, settings);

      if (score > 0) {
        blockElement(element, score, text);
      }

      markAsProcessed(element);
    });
  }

  /**
   * Retorna seletores CSS específicos para cada site
   */
  function getSelectorsForSite() {
    const hostname = window.location.hostname.toLowerCase();

    // Seletores genéricos que funcionam na maioria dos sites
    const genericSelectors = [
      // Resultados de busca
      "[data-result]", "[data-ved]", ".g", ".yuRUbf", ".v7W49e",
      "[data-testid='tweet']", "[data-testid='cellInnerDiv']",
      "article", ".search-result", ".result",

      // Cards de vídeo
      "ytd-video-renderer", "ytd-rich-item-renderer", "ytd-compact-video-renderer",
      "ytd-grid-video-renderer", "ytd-playlist-renderer",
      ".video-card", ".video-item", ".video-list-item",
      "[data-testid='videoComponent']",

      // Posts de redes sociais
      "[role='article']", ".feed-item", ".post", ".timeline-item",
      ".css-1dbjc4n", // Twitter/X
      ".x1lliihq", // Instagram

      // Itens de feed
      "[data-testid='post']", "[data-testid='tweetText']",
      ".tiktok-item", "[data-e2e='search-card']",

      // Resultados de imagem
      ".isv-r", ".rg_i", ".bRMDJf", ".islrc",

      // Notícias
      ".news-item", ".noticia", ".materia", ".article-item",

      // Genéricos
      "a", "div", "article", "li", "section", "figure",
    ];

    // Seletores específicos por site
    const siteSpecific = {
      "youtube.com": [
        "ytd-video-renderer", "ytd-rich-item-renderer",
        "ytd-compact-video-renderer", "ytd-grid-video-renderer",
        "ytd-playlist-renderer", "ytd-channel-renderer",
        "ytd-comment-renderer", "ytd-reel-item-renderer",
        "#contents > ytd-rich-item-renderer",
        "#items > ytd-compact-video-renderer",
      ],
      "google.com": [
        ".g", ".yuRUbf", ".v7W49e", ".Ww4FFb", ".tF2Cxc",
        ".isv-r", ".rg_i", ".bRMDJf",
        "[data-attrid='wa:/description']",
        ".kp-whole-page",
      ],
      "twitter.com": [
        "[data-testid='tweet']", "[data-testid='cellInnerDiv']",
        "[data-testid='UserCell']", "[data-testid='tweetText']",
      ],
      "x.com": [
        "[data-testid='tweet']", "[data-testid='cellInnerDiv']",
        "[data-testid='UserCell']", "[data-testid='tweetText']",
      ],
      "instagram.com": [
        "article", ".x1lliihq", "._aabd", "._aa8k",
        "[role='button']",
      ],
      "tiktok.com": [
        "[data-e2e='search-card']", "[data-e2e='search_top-item']",
        ".tiktok-item", "[data-e2e='video-card']",
      ],
      "facebook.com": [
        "[role='article']", ".x1lliihq", "[data-pagelet='FeedUnit']",
      ],
      "reddit.com": [
        "[data-testid='post-container']", ".Post",
        "._1poyrkZ7g36PawDueRza", ".sr-list",
      ],
      "spotify.com": [
        "[data-testid='tracklist-row']", "[data-testid='playlist-tracklist']",
        ".EntityRowV2", ".Root__main-view",
      ],
    };

    for (const [site, selectors] of Object.entries(siteSpecific)) {
      if (hostname.includes(site)) {
        return selectors.join(", ");
      }
    }

    return genericSelectors.join(", ");
  }

  /**
   * Bloqueia um elemento detectado
   */
  function blockElement(element, score, originalText) {
    if (settings.advanced?.hideCompletely !== false) {
      element.classList.add("anti-jao-blocked");
    } else {
      element.classList.add("anti-jao-blurred");
    }

    // Adiciona badge no lugar do conteúdo (opcional)
    if (settings.advanced?.hideCompletely !== false) {
      const badge = document.createElement("div");
      badge.className = "anti-jao-badge";
      badge.textContent = "🛡️ Conteúdo bloqueado pelo Anti-Jão";

      // Tenta inserir o badge no lugar do elemento
      if (element.parentNode) {
        // Só insere se o elemento for um container razoável
        const rect = element.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 50) {
          element.parentNode.insertBefore(badge, element.nextSibling);
        }
      }
    }

    // Atualiza estatísticas
    blockedCount++;
    stats.totalBlocked++;

    const hostname = window.location.hostname;
    stats.sitesBlocked[hostname] = (stats.sitesBlocked[hostname] || 0) + 1;

    // Adiciona ao histórico (limita a 50 entradas)
    stats.history.unshift({
      id: generateId(),
      site: hostname,
      url: window.location.href,
      score: Math.round(score * 100) / 100,
      timestamp: Date.now(),
      preview: originalText.substring(0, 100).replace(/\s+/g, " ").trim(),
    });

    if (stats.history.length > 50) {
      stats.history = stats.history.slice(0, 50);
    }

    // Salva estatísticas (debounced)
    debouncedSaveStats();

    // Atualiza o escudo
    updateShield();

    // Mostra notificação toast (se habilitado)
    if (settings.showNotifications && blockedCount <= 5) {
      showToast(`Conteúdo bloqueado (score: ${Math.round(score * 100)}%)`);
    }
  }

  /**
   * Configura o MutationObserver
   */
  function setupMutationObserver() {
    const debouncedScan = debounce(() => {
      scanAndBlock();
    }, 500);

    observer = new MutationObserver((mutations) => {
      let shouldScan = false;

      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              shouldScan = true;
              break;
            }
          }
        }
        if (shouldScan) break;
      }

      if (shouldScan) {
        debouncedScan();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Cria o escudo flutuante no canto da página
   */
  function createShield() {
    if (shieldElement) return;

    shieldElement = document.createElement("div");
    shieldElement.className = "anti-jao-shield";
    shieldElement.innerHTML = `
      🛡️
      <span class="shield-count" style="display:none;">0</span>
      <span class="anti-jao-shield-tooltip">Anti-Jão ativo</span>
    `;

    shieldElement.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openOptions" });
    });

    document.body.appendChild(shieldElement);
  }

  /**
   * Atualiza o escudo flutuante
   */
  function updateShield() {
    if (!shieldElement) return;

    const countEl = shieldElement.querySelector(".shield-count");
    if (countEl) {
      countEl.textContent = blockedCount > 99 ? "99+" : blockedCount;
      countEl.style.display = blockedCount > 0 ? "block" : "none";
    }

    const tooltip = shieldElement.querySelector(".anti-jao-shield-tooltip");
    if (tooltip) {
      tooltip.textContent = `${blockedCount} conteúdo(s) bloqueado(s) nesta página`;
    }
  }

  /**
   * Mostra um toast de notificação
   */
  function showToast(message) {
    const existing = document.querySelector(".anti-jao-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "anti-jao-toast";
    toast.innerHTML = `
      <span class="toast-icon">🛡️</span>
      <div class="toast-content">
        <span class="toast-title">Anti-Jão</span>
        <span class="toast-desc">${message}</span>
      </div>
      <button class="toast-close">&times;</button>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.style.animation = "antiJaoSlideOut 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = "antiJaoSlideOut 0.3s ease forwards";
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  /**
   * Debounce para salvar estatísticas
   */
  const debouncedSaveStats = debounce(async () => {
    await saveStats(stats);
  }, 2000);

  /**
   * Handler de mensagens do runtime
   */
  function handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case "getStats":
        sendResponse({
          blockedCount,
          stats,
          settings,
        });
        break;

      case "updateSettings":
        settings = { ...settings, ...request.settings };
        saveSettings(settings);

        // Se desativou, remove classes
        if (!settings.enabled) {
          document.querySelectorAll(".anti-jao-blocked, .anti-jao-blurred").forEach((el) => {
            el.classList.remove("anti-jao-blocked", "anti-jao-blurred");
          });
          if (shieldElement) shieldElement.remove();
          if (observer) observer.disconnect();
        }

        sendResponse({ success: true });
        break;

      case "getPageStats":
        sendResponse({
          pageBlocked: blockedCount,
          site: window.location.hostname,
        });
        break;

      default:
        sendResponse({ error: "Ação desconhecida" });
    }

    return true; // Mantém canal aberto para resposta assíncrona
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
