/**
 * Anti-Jão Extension - Options Script
 * Lógica da página de configurações completa
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Estado
  let settings = { ...DEFAULT_SETTINGS };
  let stats = { ...DEFAULT_SETTINGS.stats };

  // Navegação entre abas
  const navItems = document.querySelectorAll(".nav-item");
  const tabs = document.querySelectorAll(".tab");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.dataset.tab;
      navItems.forEach(n => n.classList.remove("active"));
      tabs.forEach(t => t.classList.remove("active"));
      item.classList.add("active");
      document.getElementById(`tab-${target}`).classList.add("active");
    });
  });

  // Carrega dados
  await loadData();
  renderAll();
  setupEventListeners();

  async function loadData() {
    const s = await chrome.runtime.sendMessage({ action: "getSettings" });
    if (s.success) settings = s.settings;
    const st = await chrome.runtime.sendMessage({ action: "getGlobalStats" });
    if (st.success) stats = st.stats;
  }

  function renderAll() {
    renderGeneral();
    renderKeywords();
    renderAdvanced();
    renderStats();
  }

  function renderGeneral() {
    document.getElementById("optEnabled").checked = settings.enabled;
    document.getElementById("optShowCount").checked = settings.showBlockedCount;
    document.getElementById("optShowNotifications").checked = settings.showNotifications;
    document.getElementById("optWhitelist").value = (settings.whitelistSites || []).join("\n");

    document.querySelectorAll(".mode-card").forEach(card => {
      card.classList.toggle("active", card.dataset.mode === settings.mode);
    });
  }

  function renderKeywords() {
    const customList = document.getElementById("customKeywordsList");
    const defaultList = document.getElementById("defaultKeywordsList");

    const custom = settings.customKeywords || [];
    if (custom.length === 0) {
      customList.innerHTML = `<div class="empty-state"><span class="empty-icon">🔤</span><p>Nenhuma palavra-chave personalizada</p></div>`;
    } else {
      customList.innerHTML = custom.map(k => `
        <div class="keyword-tag">
          <span class="keyword-text">${escapeHtml(k)}</span>
          <button class="keyword-remove" data-kw="${escapeHtml(k)}">&times;</button>
        </div>
      `).join("");
    }

    defaultList.innerHTML = JAO_KEYWORDS.slice(0, 30).map(k => `
      <div class="keyword-tag">
        <span class="keyword-text">${escapeHtml(k)}</span>
      </div>
    `).join("") + `<div class="keyword-tag" style="opacity:0.5;text-align:center;">+ ${JAO_KEYWORDS.length - 30} termos embutidos</div>`;
  }

  function renderAdvanced() {
    const adv = settings.advanced || DEFAULT_SETTINGS.advanced;
    document.getElementById("optContextAnalysis").checked = adv.useContextAnalysis;
    document.getElementById("optCheckImages").checked = adv.checkImages;
    document.getElementById("optCheckVideos").checked = adv.checkVideos;
    document.getElementById("optCheckText").checked = adv.checkText;
    document.getElementById("optHideCompletely").checked = adv.hideCompletely;
    const minScore = Math.round((adv.minRelevanceScore || 0.3) * 100);
    document.getElementById("optMinScore").value = minScore;
    document.getElementById("optMinScoreValue").textContent = minScore + "%";
  }

  function renderStats() {
    document.getElementById("dashTotal").textContent = formatNumber(stats.totalBlocked || 0);
    document.getElementById("dashSites").textContent = Object.keys(stats.sitesBlocked || {}).length;
    const since = stats.lastReset ? new Date(stats.lastReset).toLocaleDateString("pt-BR") : "--";
    document.getElementById("dashSince").textContent = since;

    const sites = Object.entries(stats.sitesBlocked || {}).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const sitesEl = document.getElementById("dashTopSites");
    if (sites.length === 0) {
      sitesEl.innerHTML = `<div class="empty-state"><span class="empty-icon">📊</span><p>Sem dados suficientes</p></div>`;
    } else {
      sitesEl.innerHTML = `
        <div class="table-row header"><span class="table-cell">Site</span><span class="table-cell">Bloqueios</span></div>
        ${sites.map(([site, count]) => `<div class="table-row"><span class="table-cell">${escapeHtml(site)}</span><span class="table-cell">${count}</span></div>`).join("")}
      `;
    }

    const hist = (stats.history || []).slice(0, 20);
    const histEl = document.getElementById("dashHistory");
    if (hist.length === 0) {
      histEl.innerHTML = `<div class="empty-state"><span class="empty-icon">📜</span><p>Histórico vazio</p></div>`;
    } else {
      histEl.innerHTML = `
        <div class="table-row header"><span class="table-cell">Site</span><span class="table-cell">Score</span><span class="table-cell">Data</span></div>
        ${hist.map(h => `<div class="table-row"><span class="table-cell">${escapeHtml(h.site)}</span><span class="table-cell">${Math.round((h.score||0)*100)}%</span><span class="table-cell">${new Date(h.timestamp).toLocaleDateString("pt-BR")}</span></div>`).join("")}
      `;
    }
  }

  function setupEventListeners() {
    // Geral
    document.getElementById("optEnabled").addEventListener("change", async (e) => {
      settings.enabled = e.target.checked;
      await saveAndNotify();
    });
    document.getElementById("optShowCount").addEventListener("change", async (e) => {
      settings.showBlockedCount = e.target.checked;
      await saveAndNotify();
    });
    document.getElementById("optShowNotifications").addEventListener("change", async (e) => {
      settings.showNotifications = e.target.checked;
      await saveAndNotify();
    });
    document.getElementById("optWhitelist").addEventListener("change", async (e) => {
      settings.whitelistSites = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
      await saveAndNotify();
    });

    // Modos
    document.querySelectorAll(".mode-card").forEach(card => {
      card.addEventListener("click", async () => {
        settings.mode = card.dataset.mode;
        await saveAndNotify();
        renderGeneral();
      });
    });

    // Keywords
    document.getElementById("btnAddKeyword").addEventListener("click", async () => {
      const input = document.getElementById("newKeyword");
      const kw = input.value.trim().toLowerCase();
      if (!kw) return;
      if (!settings.customKeywords.includes(kw)) {
        settings.customKeywords.push(kw);
        JAO_KEYWORDS.push(kw);
        await saveAndNotify();
        input.value = "";
        renderKeywords();
      }
    });
    document.getElementById("customKeywordsList").addEventListener("click", async (e) => {
      if (e.target.classList.contains("keyword-remove")) {
        const kw = e.target.dataset.kw;
        settings.customKeywords = settings.customKeywords.filter(k => k !== kw);
        await saveAndNotify();
        renderKeywords();
      }
    });

    // Avançado
    const advIds = {
      optContextAnalysis: "useContextAnalysis",
      optCheckImages: "checkImages",
      optCheckVideos: "checkVideos",
      optCheckText: "checkText",
      optHideCompletely: "hideCompletely",
    };
    Object.entries(advIds).forEach(([id, key]) => {
      document.getElementById(id)?.addEventListener("change", async (e) => {
        settings.advanced = settings.advanced || { ...DEFAULT_SETTINGS.advanced };
        settings.advanced[key] = e.target.checked;
        await saveAndNotify();
      });
    });
    document.getElementById("optMinScore").addEventListener("input", async (e) => {
      const val = parseInt(e.target.value);
      document.getElementById("optMinScoreValue").textContent = val + "%";
      settings.advanced = settings.advanced || { ...DEFAULT_SETTINGS.advanced };
      settings.advanced.minRelevanceScore = val / 100;
      await saveAndNotify();
    });

    // Danger zone
    document.getElementById("btnResetAll").addEventListener("click", async () => {
      if (!confirm("Apagar TODO o histórico e estatísticas? Isso não pode ser desfeito.")) return;
      await chrome.runtime.sendMessage({ action: "resetStats" });
      stats = { ...DEFAULT_SETTINGS.stats, lastReset: Date.now() };
      renderStats();
    });
    document.getElementById("btnResetSettings").addEventListener("click", async () => {
      if (!confirm("Restaurar todas as configurações para o padrão?")) return;
      settings = { ...DEFAULT_SETTINGS };
      await saveAndNotify();
      renderAll();
    });
  }

  async function saveAndNotify() {
    await chrome.runtime.sendMessage({ action: "saveSettings", settings });
  }

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  }
});
