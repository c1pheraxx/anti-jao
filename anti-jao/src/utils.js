/**
 * Anti-Jão Extension - Utilities
 * Funções compartilhadas entre background, content e popup
 */

/**
 * Calcula a pontuação de relevância de um texto em relação ao Jão.
 * Retorna um valor entre 0.0 e 1.0.
 * 
 * @param {string} text - Texto a ser analisado
 * @param {Object} settings - Configurações atuais
 * @returns {number} Pontuação de 0.0 a 1.0
 */
function calculateRelevanceScore(text, settings = {}) {
  if (!text || typeof text !== "string") return 0.0;

  const lowerText = text.toLowerCase().trim();
  if (lowerText.length === 0) return 0.0;

  let score = 0.0;
  let maxScore = 0.0;

  // 1. Verifica falsos positivos primeiro
  for (const fp of FALSE_POSITIVES) {
    if (lowerText.includes(fp.toLowerCase())) {
      return 0.0; // Texto contém um falso positivo conhecido
    }
  }

  // 2. Verifica palavras-chave principais
  for (const keyword of JAO_KEYWORDS) {
    const kwLower = keyword.toLowerCase();
    if (lowerText.includes(kwLower)) {
      // Palavra exata tem peso maior
      const regex = new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i");
      if (regex.test(lowerText)) {
        score += 0.5; // Match exato de palavra
      } else {
        score += 0.3; // Match parcial
      }
    }
  }

  // 3. Análise de contexto (aumenta a pontuação se termos de contexto musical estão presentes)
  if (settings.advanced?.useContextAnalysis !== false) {
    let contextMatches = 0;
    for (const term of CONTEXT_TERMS) {
      if (lowerText.includes(term.toLowerCase())) {
        contextMatches++;
      }
    }
    // Contexto musical aumenta a confiança
    if (contextMatches >= 2) {
      score += 0.15;
    }
    if (contextMatches >= 4) {
      score += 0.15;
    }
  }

  // 4. Padrões específicos de alta confiança
  const highConfidencePatterns = [
    /jão\s+(?:cantor|música|musica|show|turnê|album|álbum|single|clipe)/i,
    /(?:cantor|músico)\s+jão/i,
    /jão\s+(?:oficial|spotify|youtube|instagram)/i,
    /(?:show|turnê|turne)\s+(?:do|de)\s+jão/i,
    /jão\s+(?:lobos|anti-heroi|anti heroi|pirata|super)/i,
  ];

  for (const pattern of highConfidencePatterns) {
    if (pattern.test(lowerText)) {
      score += 0.4;
      break; // Só conta uma vez
    }
  }

  // 5. Normaliza o score
  maxScore = 1.0;
  score = Math.min(score, maxScore);

  // 6. Aplica limiar mínimo baseado no modo
  const minThreshold = settings.mode === "agressivo" 
    ? (settings.advanced?.minRelevanceScore || 0.15)
    : (settings.advanced?.minRelevanceScore || 0.3);

  return score >= minThreshold ? score : 0.0;
}

/**
 * Verifica se um elemento deve ser analisado
 * @param {Element} element 
 * @returns {boolean}
 */
function shouldAnalyzeElement(element) {
  if (!element) return false;

  // Ignora elementos já processados
  if (element.dataset?.antiJaoProcessed === "true") return false;

  // Ignora scripts, styles, meta, link, etc.
  const ignoreTags = ["SCRIPT", "STYLE", "META", "LINK", "NOSCRIPT", "IFRAME", "SVG", "PATH", "CIRCLE"];
  if (ignoreTags.includes(element.tagName)) return false;

  // Ignora elementos invisíveis ou fora da viewport (otimização)
  const rect = element.getBoundingClientRect?.();
  if (rect && (rect.width === 0 || rect.height === 0)) {
    // Ainda pode analisar, mas com prioridade menor
  }

  return true;
}

/**
 * Marca um elemento como processado
 * @param {Element} element 
 */
function markAsProcessed(element) {
  if (element && element.dataset) {
    element.dataset.antiJaoProcessed = "true";
  }
}

/**
 * Extrai texto relevante de um elemento
 * @param {Element} element 
 * @returns {string}
 */
function extractText(element) {
  if (!element) return "";

  // Para imagens, verifica alt, title, aria-label
  if (element.tagName === "IMG") {
    return [
      element.alt || "",
      element.title || "",
      element.getAttribute("aria-label") || "",
      element.src || "",
    ].join(" ");
  }

  // Para links, verifica href também
  if (element.tagName === "A") {
    return [
      element.textContent || "",
      element.href || "",
      element.title || "",
      element.getAttribute("aria-label") || "",
    ].join(" ");
  }

  // Para vídeos/iframes
  if (element.tagName === "VIDEO" || element.tagName === "IFRAME") {
    return [
      element.title || "",
      element.getAttribute("aria-label") || "",
      element.src || "",
    ].join(" ");
  }

  // Texto padrão
  return element.textContent || element.innerText || "";
}

/**
 * Verifica se a URL atual está na lista de prioridade
 * @param {string} url 
 * @returns {boolean}
 */
function isPrioritySite(url = window.location.href) {
  const hostname = new URL(url).hostname.toLowerCase();
  return PRIORITY_SITES.some(site => hostname.includes(site));
}

/**
 * Verifica se o site está na whitelist
 * @param {string} url 
 * @param {string[]} whitelist 
 * @returns {boolean}
 */
function isWhitelisted(url = window.location.href, whitelist = []) {
  const hostname = new URL(url).hostname.toLowerCase();
  return whitelist.some(site => hostname.includes(site.toLowerCase()));
}

/**
 * Formata números grandes (1.247 → 1,2K)
 * @param {number} num 
 * @returns {string}
 */
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

/**
 * Debounce para otimizar chamadas frequentes
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle para limitar chamadas
 * @param {Function} func 
 * @param {number} limit 
 * @returns {Function}
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Gera um ID único
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Salva estatísticas no storage
 * @param {Object} stats 
 */
async function saveStats(stats) {
  try {
    await chrome.storage.local.set({ "antiJao_stats": stats });
  } catch (e) {
    console.error("[Anti-Jão] Erro ao salvar estatísticas:", e);
  }
}

/**
 * Carrega estatísticas do storage
 * @returns {Object}
 */
async function loadStats() {
  try {
    const result = await chrome.storage.local.get("antiJao_stats");
    return result.antiJao_stats || DEFAULT_SETTINGS.stats;
  } catch (e) {
    console.error("[Anti-Jão] Erro ao carregar estatísticas:", e);
    return DEFAULT_SETTINGS.stats;
  }
}

/**
 * Salva configurações no storage
 * @param {Object} settings 
 */
async function saveSettings(settings) {
  try {
    await chrome.storage.local.set({ "antiJao_settings": settings });
  } catch (e) {
    console.error("[Anti-Jão] Erro ao salvar configurações:", e);
  }
}

/**
 * Carrega configurações do storage
 * @returns {Object}
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get("antiJao_settings");
    // Merge com defaults para garantir que novas propriedades existam
    return { ...DEFAULT_SETTINGS, ...(result.antiJao_settings || {}) };
  } catch (e) {
    console.error("[Anti-Jão] Erro ao carregar configurações:", e);
    return DEFAULT_SETTINGS;
  }
}

// Exporta para módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateRelevanceScore,
    shouldAnalyzeElement,
    markAsProcessed,
    extractText,
    isPrioritySite,
    isWhitelisted,
    formatNumber,
    debounce,
    throttle,
    generateId,
    saveStats,
    loadStats,
    saveSettings,
    loadSettings,
  };
}
