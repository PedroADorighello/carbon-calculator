(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // 1) Preenche autocomplete de cidades
    if (window.CONFIG && typeof CONFIG.populateDatalist === "function") {
      CONFIG.populateDatalist();
    }

    // 2) Ativa autofill de distância
    if (window.CONFIG && typeof CONFIG.setupDistanceAutofill === "function") {
      CONFIG.setupDistanceAutofill();
    }

    // 3) Obtém formulário (id solicitado: calculator-form)
    // fallback para co2Form, caso ainda esteja no HTML antigo
    var form =
      document.getElementById("calculator-form") ||
      document.getElementById("co2Form");

    if (!form) {
      console.error("Formulário não encontrado.");
      return;
    }

    var transportCards = document.querySelectorAll(".transport-card");

  transportCards.forEach(function (card) {
    card.addEventListener("click", function () {
      transportCards.forEach(function (item) {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });

      card.classList.add("selected");
      card.setAttribute("aria-pressed", "true");
    });
  });

    // 4) Listener de submit
    form.addEventListener("submit", handleFormSubmit);

    // 5) Log de inicialização
    console.log("✅ Calculadora inicializada!");
  });

  function handleFormSubmit(e) {
    // 1) Evita submit padrão
    e.preventDefault();

    // 2) Coleta valores do formulário
    var originInput = document.getElementById("origem");
    var destinationInput = document.getElementById("destino");
    var distanceInput = document.getElementById("distancia");

    var origin = originInput ? originInput.value.trim() : "";
    var destination = destinationInput ? destinationInput.value.trim() : "";
    var distance = distanceInput ? parseFloat(distanceInput.value) : NaN;

    // modo via radio (solicitado)
    var checkedRadio = document.querySelector('input[name="transporte"]:checked');
    var transportMode = checkedRadio ? checkedRadio.value : "";

    // fallback para card selecionado (compatibilidade com UI anterior)
    if (!transportMode) {
      var selectedCard = document.querySelector(".transport-card.selected");
      transportMode = selectedCard ? selectedCard.getAttribute("data-value") : "";
    }

    // 3) Validações
    if (!origin || !destination || !Number.isFinite(distance)) {
      alert("Preencha origem, destino e distância corretamente.");
      return;
    }

    if (distance <= 0) {
      alert("A distância deve ser maior que 0.");
      return;
    }

    if (!transportMode) {
      alert("Selecione um meio de transporte.");
      return;
    }

    // 4) Botão de submit
    var submitButton = e.submitter || document.querySelector('button[type="submit"]');

    // 5) Loading
    if (window.UI && typeof UI.showLoading === "function") {
      UI.showLoading(submitButton);
    }

    // 6) Oculta seções anteriores
    hideElementSafe("results-section");
    hideElementSafe("comparison-section");
    hideElementSafe("carbon-credits-section");

    // 7) Simula processamento
    setTimeout(function () {
      try {
        // Cálculos principais
        var emission = Calculator.calculateaEmission(distance, transportMode);
        var carEmission = Calculator.calculateaEmission(distance, "car");
        var savings = Calculator.CalculateSavings(emission, carEmission);
        var allModes = Calculator.calculateAllModes(distance);

        // Créditos de carbono
        var credits = Calculator.calculateCarbonCredits(emission);
        var price = Calculator.estimateCreditPrice(credits);

        // Objetos de dados para rendering
        var resultsData = {
          origin: origin,
          destination: destination,
          distance: distance,
          emission: emission,
          mode: transportMode,
          savings: savings
        };

        var creditsData = {
          credits: credits,
          price: price
        };

        // Render: resultados
        var resultsContent = document.getElementById("results-content");
        if (resultsContent && UI && typeof UI.renderResults === "function") {
          resultsContent.innerHTML = UI.renderResults(resultsData);
        }

        // Render: comparação (compatível com typo renderComparion)
        var comparisonContent = document.getElementById("comparison-content");
        if (comparisonContent && UI) {
          if (typeof UI.renderComparison === "function") {
            comparisonContent.innerHTML = UI.renderComparison(allModes, transportMode);
          } else if (typeof UI.renderComparion === "function") {
            comparisonContent.innerHTML = UI.renderComparion(allModes, transportMode);
          }
        }

        // Render: créditos
        var carbonCreditsContent = document.getElementById("carbon-credits-content");
        if (carbonCreditsContent && UI && typeof UI.renderCarbonCredits === "function") {
          carbonCreditsContent.innerHTML = UI.renderCarbonCredits(creditsData);
        }

        // Exibe seções
        showElementSafe("results-section");
        showElementSafe("comparison-section");
        showElementSafe("carbon-credits-section");

        // Scroll até resultados
        if (window.UI && typeof UI.scrollToELement === "function") {
          UI.scrollToELement("results-section");
        }

        // Remove loading (compatível com typo hideLOading)
        hideLoadingSafe(submitButton);
      } catch (error) {
        console.error("Erro ao processar cálculo:", error);
        alert("Ocorreu um erro ao calcular. Tente novamente.");
        hideLoadingSafe(submitButton);
      }
    }, 1500);
  }

  function hideElementSafe(elementId) {
    if (window.UI && typeof UI.hideElement === "function") {
      UI.hideElement(elementId);
      return;
    }
    var el = document.getElementById(elementId);
    if (el) el.classList.add("hidden");
  }

  function showElementSafe(elementId) {
    if (window.UI && typeof UI.showElement === "function") {
      UI.showElement(elementId);
      return;
    }
    var el = document.getElementById(elementId);
    if (el) el.classList.remove("hidden");
  }

  function hideLoadingSafe(button) {
    if (window.UI && typeof UI.hideLoading === "function") {
      UI.hideLoading(button);
      return;
    }
    if (window.UI && typeof UI.hideLOading === "function") {
      UI.hideLOading(button);
    }
  }
})();