/**
 * Anti-Jão Extension - Popup Script
 * Gerencia a interface do popup e comunicação com background
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Elementos do DOM
  const masterToggle = document.getElementById("masterToggle");
  const modeBadge = document.getElementById("modeBadge");
  const btnModerado = document.getElementById("btnModerado");
  const btnAgressivo = document.getElementById("btnAgressivo");
  const statTotal = document.getElementById("statTotal");
  const statPage = document.getElementById("statPage");
  const statSites = document.getElementById("statSites");
  const statScore = document.getElementById("statScore");
  const recentList = document.getElementById("recentList");
  const sitesList = document.getElementById("sitesList");
  const btnClearHistory = document.getElementById("btnClearHistory");
  const btnSettings = document.getElementById("btnSettings");
  const btnReport = document.getElementById("btnReport");
  const privacyLink = document.getElementById("privacyLink");

  // Estado
  let settings = { ...DEFAULT_SETTINGS };
  let stats = { ...DEFAULT_SETTINGS.stats };

  // Inicializa
  await loadData();
  renderUI();
  setupEventListeners();

  /**
   * Carrega dados do background
   */
  async function loadData() {
    try {
      const settingsRes = await chrome.runtime.sendMessage({ action: "getSettings" });
      if (settingsRes.success) settings = settingsRes.settings;

      const statsRes = await chrome.runtime.sendMessage({ action: "getGlobalStats" });
      if (statsRes.success) stats = statsRes.stats;

      const tabRes = await chrome.runtime.sendMessage({ action: "getTabStats" });
      if (tabRes.success) {
        statPage.textContent = tabRes.pageBlocked || 0;
      }
    } catch (e) {
      console.error("[Anti-Jão Popup] Erro ao carregar dados:", e);
    }
  }

  /**
   * Renderiza a interface com os dados atuais
   */
  function renderUI() {
    // Toggle master
    masterToggle.checked = settings.enabled;

    // Modo
    updateModeUI(settings.mode);

    // Estatísticas
    statTotal.textContent = formatNumber(stats.totalBlocked || 0);

    const siteCount = Object.keys(stats.sitesBlocked || {}).length;
    statSites.textContent = siteCount;

    // Score médio
    const recentHistory = (stats.history || []).slice(0, 20);
    if (recentHistory.length > 0) {
      const avgScore = recentHistory.reduce((sum, h) => sum + (h.score || 0), 0) / recentHistory.length;
      statScore.textContent = Math.round(avgScore * 100) + "%";
    } else {
      statScore.textContent = "--";
    }

    // Lista de bloqueios recentes
    renderRecentList();

    // Lista de sites
    renderSitesList();
  }

  /**
   * Atualiza a UI do modo
   */
  function updateModeUI(mode) {
    if (mode === "moderado") {
      modeBadge.textContent = "MODERADO";
      modeBadge.className = "badge badge-warning";
      btnModerado.classList.add("active");
      btnAgressivo.classList.remove("active");
    } else {
      modeBadge.textContent = "AGRESSIVO";
      modeBadge.className = "badge badge-danger";
      btnAgressivo.classList.add("active");
      btnModerado.classList.remove("active");
    }
  }

  /**
   * Renderiza lista de bloqueios recentes
   */
  function renderRecentList() {
    const history = (stats.history || []).slice(0, 10);

    if (history.length === 0) {
      recentList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📭</span>
          <p>Nenhum bloqueio recente</p>
        </div>
      `;
      return;
    }

    recentList.innerHTML = history.map(item => `
      <div class="list-item">
        <div>
          <div class="item-site">
            <span>🚫</span>
            <span>${escapeHtml(item.site || "Desconhecido")}</span>
          </div>
          <div class="item-preview" title="${escapeHtml(item.preview || "")}">
            ${escapeHtml((item.preview || "").substring(0, 60))}...
          </div>
        </div>
        <span class="item-count">${Math.round((item.score || 0) * 100)}%</span>
      </div>
    `).join("");
  }

  /**
   * Renderiza lista de sites mais filtrados
   */
  function renderSitesList() {
    const sites = stats.sitesBlocked || {};
    const sortedSites = Object.entries(sites)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sortedSites.length === 0) {
      sitesList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🌐</span>
          <p>Nenhum site filtrado ainda</p>
        </div>
      `;
      return;
    }

    sitesList.innerHTML = sortedSites.map(([site, count]) => `
      <div class="list-item">
        <span class="item-site">
          <span>🌐</span>
          <span>${escapeHtml(site)}</span>
        </span>
        <span class="item-count">${count} itens</span>
      </div>
    `).join("");
  }

  /**
   * Configura event listeners
   */
  function setupEventListeners() {
    // Toggle master
    masterToggle.addEventListener("change", async () => {
      settings.enabled = masterToggle.checked;
      await chrome.runtime.sendMessage({ 
        action: "saveSettings", 
        settings: { enabled: settings.enabled } 
      });

      // Notifica a aba ativa
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        try {
          await chrome.tabs.sendMessage(tabs[0].id, { 
            action: "updateSettings", 
            settings: { enabled: settings.enabled } 
          });
        } catch (e) {
          // Aba pode não ter content script
        }
      }
    });

    // Modos
    btnModerado.addEventListener("click", () => changeMode("moderado"));
    btnAgressivo.addEventListener("click", () => changeMode("agressivo"));

    // Limpar histórico
    btnClearHistory.addEventListener("click", async () => {
      if (confirm("Tem certeza que deseja limpar o histórico de bloqueios?")) {
        await chrome.runtime.sendMessage({ action: "resetStats" });
        stats = { ...DEFAULT_SETTINGS.stats, lastReset: Date.now() };
        renderUI();
      }
    });

    // Abrir configurações
    btnSettings.addEventListener("click", () => {
      chrome.runtime.openOptionsPage();
    });

    // Abrir relatório (página de opções na aba de relatório)
    btnReport.addEventListener("click", () => {
      chrome.runtime.openOptionsPage();
      // Opcional: pode passar hash para abrir aba específica
    });

    // Link de privacidade
    privacyLink.addEventListener("click", () => {
      chrome.tabs.create({
        url: "https://github.com/anti-jao/extension/blob/main/PRIVACY.md"
      });
    });
  }

  /**
   * Altera o modo de operação
   */
  async function changeMode(mode) {
    settings.mode = mode;
    await chrome.runtime.sendMessage({ 
      action: "saveSettings", 
      settings: { mode } 
    });
    updateModeUI(mode);

    // Notifica a aba ativa
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      try {
        await chrome.tabs.sendMessage(tabs[0].id, { 
          action: "updateSettings", 
          settings: { mode } 
        });
      } catch (e) {}
    }
  }

  /**
   * Escapa HTML para evitar XSS
   */
  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Formata números
   */
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  }
});
