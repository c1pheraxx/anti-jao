/**
 * Anti-Jão Extension - Background Service Worker
 * Gerencia eventos do navegador, comunicação e estatísticas globais
 */

// ============================================
// INSTALAÇÃO E ATUALIZAÇÃO
// ============================================

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[Anti-Jão] Extensão instalada/atualizada.", details.reason);

  // Inicializa configurações padrão se não existirem
  const existing = await chrome.storage.local.get("antiJao_settings");
  if (!existing.antiJao_settings) {
    await chrome.storage.local.set({
      antiJao_settings: DEFAULT_SETTINGS,
      antiJao_stats: DEFAULT_SETTINGS.stats,
    });
    console.log("[Anti-Jão] Configurações padrão inicializadas.");
  }

  // Cria notificação de boas-vindas
  if (details.reason === "install") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "🛡️ Anti-Jão instalado!",
      message: "Sua navegação está protegida. O conteúdo indesejado será filtrado automaticamente.",
      priority: 1,
    });
  }
});

// ============================================
// COMUNICAÇÃO
// ============================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse);
  return true; // Async response
});

async function handleMessage(request, sender, sendResponse) {
  try {
    switch (request.action) {
      case "getGlobalStats": {
        const stats = await loadStats();
        sendResponse({ success: true, stats });
        break;
      }

      case "getSettings": {
        const settings = await loadSettings();
        sendResponse({ success: true, settings });
        break;
      }

      case "saveSettings": {
        await saveSettings(request.settings);
        // Notifica todas as abas sobre a mudança
        await notifyAllTabs({ action: "settingsUpdated", settings: request.settings });
        sendResponse({ success: true });
        break;
      }

      case "resetStats": {
        const newStats = {
          ...DEFAULT_SETTINGS.stats,
          lastReset: Date.now(),
        };
        await saveStats(newStats);
        sendResponse({ success: true, stats: newStats });
        break;
      }

      case "openOptions": {
        chrome.runtime.openOptionsPage();
        sendResponse({ success: true });
        break;
      }

      case "getTabStats": {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
          try {
            const response = await chrome.tabs.sendMessage(tabs[0].id, { action: "getPageStats" });
            sendResponse({ success: true, ...response });
          } catch (e) {
            sendResponse({ success: true, pageBlocked: 0, site: tabs[0].url });
          }
        } else {
          sendResponse({ success: false, error: "Nenhuma aba ativa" });
        }
        break;
      }

      case "addCustomKeyword": {
        const settings = await loadSettings();
        const keyword = request.keyword?.trim().toLowerCase();
        if (keyword && !settings.customKeywords.includes(keyword)) {
          settings.customKeywords.push(keyword);
          // Adiciona também à lista principal em memória
          JAO_KEYWORDS.push(keyword);
          await saveSettings(settings);
          await notifyAllTabs({ action: "keywordsUpdated", keywords: settings.customKeywords });
        }
        sendResponse({ success: true, keywords: settings.customKeywords });
        break;
      }

      case "removeCustomKeyword": {
        const settings = await loadSettings();
        settings.customKeywords = settings.customKeywords.filter(k => k !== request.keyword);
        await saveSettings(settings);
        await notifyAllTabs({ action: "keywordsUpdated", keywords: settings.customKeywords });
        sendResponse({ success: true, keywords: settings.customKeywords });
        break;
      }

      default:
        sendResponse({ success: false, error: "Ação desconhecida: " + request.action });
    }
  } catch (error) {
    console.error("[Anti-Jão] Erro no background:", error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Envia mensagem para todas as abas abertas
 */
async function notifyAllTabs(message) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, message);
    } catch (e) {
      // Aba pode não ter o content script injetado, ignora erro
    }
  }
}

// ============================================
// ATUALIZAÇÃO DE ABAS
// ============================================

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Opcional: pode resetar contadores por página aqui
    // ou enviar mensagem para o content script
  }
});

// ============================================
// ÍCONE DINÂMICO
// ============================================

// Atualiza o badge da extensão com o número de bloqueios da aba ativa
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const response = await chrome.tabs.sendMessage(activeInfo.tabId, { action: "getPageStats" });
    if (response && response.pageBlocked > 0) {
      chrome.action.setBadgeText({ text: String(response.pageBlocked), tabId: activeInfo.tabId });
      chrome.action.setBadgeBackgroundColor({ color: "#ff4757" });
    } else {
      chrome.action.setBadgeText({ text: "", tabId: activeInfo.tabId });
    }
  } catch (e) {
    chrome.action.setBadgeText({ text: "", tabId: activeInfo.tabId });
  }
});

// ============================================
// ALARME PARA LIMPEZA PERIÓDICA
// ============================================

// Limpa histórico antigo a cada 7 dias
chrome.alarms?.create?.("cleanup", { periodInMinutes: 60 * 24 * 7 });

chrome.alarms?.onAlarm?.addListener(async (alarm) => {
  if (alarm.name === "cleanup") {
    const stats = await loadStats();
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    stats.history = stats.history.filter(h => h.timestamp > oneMonthAgo);
    await saveStats(stats);
    console.log("[Anti-Jão] Limpeza de histórico antigo concluída.");
  }
});
