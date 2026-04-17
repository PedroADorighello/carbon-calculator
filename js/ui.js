/**
 * Objeto global de UI:
 * - formatação de números/moeda
 * - helpers de exibição/scroll
 * - renderização de blocos HTML
 * - controle de estado de loading em botão
 */
var UI = {
  // ===== UTILIDADES =====

  formatNumber: function (number, decimals) {
    var value = Number(number);
    var fixedDecimals = Number.isInteger(decimals) ? decimals : 2;
    if (!Number.isFinite(value)) value = 0;

    // Usa locale pt-BR para separador de milhar e decimal
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: fixedDecimals,
      maximumFractionDigits: fixedDecimals
    });
  },

  formatCurrency: function (value) {
    var amount = Number(value);
    if (!Number.isFinite(amount)) amount = 0;

    // Formato monetário brasileiro: R$ 1.234,56
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  },

  showElement: function (elementID) {
    var el = document.getElementById(elementID);
    if (!el) return;
    el.classList.remove("hidden");
  },

  scrollToELement: function (elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  // ===== RENDERING =====

  renderResults: function (data) {
    var modeMeta =
      (CONFIG && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[data.mode]) || {
        label: data.mode || "Transporte",
        icone: "🚘",
        cor: "#666"
      };

    var distanceText = this.formatNumber(data.distance, 1);
    var emissionText = this.formatNumber(data.emission, 2);

    return `
      <h2 style="margin-top: 0; color: #2e7d32; font-size: 1.6rem; font-weight: 800;">
        ✅ Resultado da Viagem
      </h2>

      <div class="results">
        <div class="results_card results_card--highlight">
          <div class="results_card__title" style="font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 2rem;">🗺️</span>
            <span>Rota</span>
          </div>
          <div class="results_card__value" style="font-size: 1.15rem; line-height: 1.6; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <span style="padding: 10px 14px; background: #f7faf7; border-radius: 12px; border: 1px solid #dceadf;">${data.origin}</span>
            <span style="font-size: 1.6rem; color: #999;">→</span>
            <span style="padding: 10px 14px; background: #f7faf7; border-radius: 12px; border: 1px solid #dceadf;">${data.destination}</span>
          </div>
        </div>

        <div class="results_card results_card--highlight">
          <div class="results_card__title" style="font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 2rem;">📏</span>
            <span>Distância</span>
          </div>
          <div class="results_card__value" style="font-size: 1.9rem; font-weight: 800; color: #2e7d32;">
            ${distanceText} <span style="font-size: 1rem; color: #666; font-weight: 600;">km</span>
          </div>
        </div>

        <div class="results_card results_card--highlight">
          <div class="results_card__title" style="font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 2rem;">🌿</span>
            <span>Emissão de CO₂</span>
          </div>
          <div class="results_card__value" style="font-size: 1.9rem; font-weight: 800; color: #2e7d32;">
            ${emissionText} <span style="font-size: 1rem; color: #666; font-weight: 600;">kg</span>
          </div>
        </div>

        <div class="results_card results_card--highlight">
          <div class="results_card__title" style="font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 2rem;">🚦</span>
            <span>Meio de Transporte</span>
          </div>
          <div class="results_card__value" style="color: ${modeMeta.cor}; font-weight: 800; font-size: 1.9rem; display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 2.3rem; line-height: 1;">${modeMeta.icone}</span>
            <span>${modeMeta.label}</span>
          </div>
        </div>
    `;

  if (data.mode !== "car" && data.savings) {
    html += `
      <div class="results_card results_card--highlight">
        <div class="results_card__title" style="font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 2rem;">💚</span>
          <span>Economia vs Carro</span>
        </div>
        <div class="results_card__value" style="color: #2e7d32; font-size: 1.5rem; font-weight: 800;">
          ${this.formatNumber(data.savings.savedKg, 2)} kg economizados
        </div>
        <div style="font-size: 1rem; color: #66bb6a; margin-top: 10px; font-weight: 700;">
          ${this.formatNumber(data.savings.percentage, 2)}% de redução
        </div>
      </div>
    `;
  }

  html += `</div>`;
  return html;
  },

  renderComparion: function (modesArray, selectedMode) {
    var modes = Array.isArray(modesArray) ? modesArray : [];
    if (!modes.length) return "";

    var self = this;

    function getBarColor(percentageVsCar) {
      if (percentageVsCar <= 25) return "#0288d1"; // azul
      if (percentageVsCar <= 50) return "#f9a825"; // amarelo
      if (percentageVsCar <= 100) return "#ef6c00"; // laranja
      return "#d32f2f"; // vermelho
    }

    var itemsHtml = modes
      .map(function (item) {
        var modeMeta =
          (CONFIG && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[item.mode]) || {
            label: item.mode,
            icone: "🚘"
          };

        var isSelected = item.mode === selectedMode;
        var emission = Number(item.emission) || 0;
        var percentageVsCar = Number(item.percentageVsCar) || 0;
        var barColor = getBarColor(percentageVsCar);

        return `
          <div class="comparison_item ${isSelected ? "comparison_item--selected" : ""}" style="display: grid; gap: 14px; padding: 18px; border: 1px solid #ddd; border-radius: 14px; background: #fafafa;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; gap: 12px; text-align: center;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <div style="font-size: 2.6rem; line-height: 1;">${modeMeta.icone}</div>
                <div style="font-size: 1.1rem; font-weight: 800; line-height: 1.2;">${modeMeta.label}</div>
                <div style="height: 24px; display: flex; align-items: center; justify-content: center;">
                  ${
                    isSelected
                      ? '<span class="comparison_item__badge" style="background: #22c55e; color: white; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800;">Selecionado!</span>'
                      : ""
                  }
                </div>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <div style="font-size: 2rem; font-weight: 900; color: #2e7d32; line-height: 1;">${self.formatNumber(emission, 2)}</div>
                <div style="font-size: 0.95rem; color: #666; font-weight: 700;">kg CO₂</div>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <div style="font-size: 1.9rem; font-weight: 900; color: #0288d1; line-height: 1;">${self.formatNumber(percentageVsCar, 2)}%</div>
                <div style="font-size: 0.95rem; color: #666; font-weight: 700;">vs. carro</div>
              </div>
            </div>

            <div style="margin-top: 4px;">
              <div style="height: 12px; width: 100%; background: #e9eef0; border-radius: 999px; overflow: hidden;">
                <div style="height: 100%; width: ${Math.max(4, Math.min(100, percentageVsCar))}%; background: ${barColor}; border-radius: 999px;"></div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    var tipHtml = `
      <div class="comparison_tip" style="background: #f0faf2; border-left: 4px solid #2e7d32; padding: 12px; margin-top: 16px; border-radius: 8px;">
        💡 <strong>Dica:</strong> a barra colorida indica o impacto relativo ao carro.
      </div>
    `;

    return `
      <h2 style="margin-top: 0; color: #2e7d32; font-size: 1.6rem; font-weight: 800;">
        📊 Comparação entre Modais
      </h2>
      <div class="comparison" style="display: grid; gap: 14px;">${itemsHtml}${tipHtml}</div>
    `;
  },

  renderCarbonCredits: function (creditsData) {
    var credits = creditsData && Number(creditsData.credits);
    var price = (creditsData && creditsData.price) || {};
    if (!Number.isFinite(credits)) credits = 0;

    // Estrutura mais simples e limpa: 2 cards + box informativo + botão
    return `
      <h2 style="margin-top: 0; color: #2e7d32; font-size: 1.5rem;">🌳 Créditos de Carbono</h2>

      <div class="credits">
        <div class="credits__grid">
          <div class="results_card">
            <div class="results_card__title">🧾 Créditos Necessários</div>
            <div class="results_card__value" style="font-size: 1.8rem;">${this.formatNumber(credits, 4)}</div>
            <small style="color: #999; display: block; margin-top: 8px;">1 crédito = 1.000 kg de CO₂</small>
          </div>

          <div class="results_card">
            <div class="results_card__title">💰 Preço Estimado</div>
            <div class="results_card__value" style="font-size: 1.8rem; color: #2e7d32;">
              ${this.formatCurrency(price.average || 0)}
            </div>
            <small style="color: #999; display: block; margin-top: 8px;">
              De ${this.formatCurrency(price.min || 0)} a ${this.formatCurrency(price.max || 0)}
            </small>
          </div>
        </div>

        <div class="credits__info" style="background: #f0faf2; padding: 12px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2e7d32; line-height: 1.6;">
          <strong>ℹ️ O que são créditos de carbono?</strong><br>
          Créditos de carbono representam a compensação de emissões por projetos ambientais certificados.
        </div>

        <button type="button" class="credits__button" style="background: linear-gradient(135deg, #2e7d32, #66bb6a); color: white; padding: 12px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
          🌳 Compensar Emissões
        </button>
      </div>
    `;
  },

  // ===== LOADING =====

  showLoading: function (buttonElement) {
    if (!buttonElement) return;

    // Salva texto original para restaurar depois
    if (!buttonElement.dataset.originalText) {
      buttonElement.dataset.originalText = buttonElement.innerHTML;
    }

    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  hideLOading: function (buttonElement) {
    if (!buttonElement) return;

    buttonElement.disabled = false;
    if (buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
    }
  }
};

// Exposição global no navegador
if (typeof window !== "undefined") {
  window.UI = UI;
}