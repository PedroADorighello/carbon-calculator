/**
 * Configurações globais da aplicação.
 * - Fatores de emissão por modal
 * - Metadados dos meios de transporte
 * - Regras de crédito de carbono
 * - Utilitários de UI (datalist e auto preenchimento de distância)
 */
var CONFIG = {
  // kg CO2 por km
  EMISSION_FACTORS: {
    bike: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  // Metadados para renderização de UI
  TRANSPORT_MODES: {
    bike: { label: "Bicicleta", icone: "🚲", cor: "#2e7d32" },
    car: { label: "Carro", icone: "🚗", cor: "#1565c0" },
    bus: { label: "Ônibus", icone: "🚌", cor: "#ef6c00" },
    truck: { label: "Caminhão", icone: "🚚", cor: "#6d4c41" }
  },

  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150
  },

  populateDatalist: function () {
    // Get cities list from RoutesDB.getAllCities()
    if (!window.RoutesDB || typeof window.RoutesDB.getAllCities !== "function") return;

    var cities = window.RoutesDB.getAllCities();

    // Get datalist element by id 'cities-list'
    var datalist = document.getElementById("cities-list");
    if (!datalist) return;

    // Limpa opções antigas
    datalist.innerHTML = "";

    // Create option elements for each city
    cities.forEach(function (city) {
      var option = document.createElement("option");
      option.value = city;
      // append datalist
      datalist.appendChild(option);
    });
  },

  setupDistanceAutofill: function () {
    // get origin and destination input elements
    var originInput = document.getElementById("origem");
    var destinationInput = document.getElementById("destino");

    // get distance input and manual checkbox
    var distanceInput = document.getElementById("distancia");
    var manualCheckbox = document.getElementById("manualDistancia");

    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) return;

    // Helper text (cria se não existir)
    var helper = document.getElementById("distance-helper");
    if (!helper) {
      helper = document.createElement("small");
      helper.id = "distance-helper";
      helper.style.display = "block";
      helper.style.marginTop = "6px";
      helper.style.color = "#5f6f65";
      helper.textContent = "Informe origem e destino para tentar preencher automaticamente.";
      distanceInput.insertAdjacentElement("afterend", helper);
    }

    var setHelper = function (text, color) {
      helper.textContent = text;
      helper.style.color = color || "#5f6f65";
    };

    var tryAutofill = function () {
      // on change:
      //  - get trimmed values from both inputs
      var origin = originInput.value.trim();
      var destination = destinationInput.value.trim();

      //  - if both are filled, call RoutesDB.findDistance()
      if (!origin || !destination || !window.RoutesDB || typeof window.RoutesDB.findDistance !== "function") {
        return;
      }

      var foundDistance = window.RoutesDB.findDistance(origin, destination);

      //  - if distance found:
      //    - fill distance input with value
      //    - make it readonly
      //    - show success message (change helper text color to green)
      if (typeof foundDistance === "number") {
        distanceInput.value = String(foundDistance);
        distanceInput.readOnly = true;
        distanceInput.disabled = false;
        setHelper("✅ Distância encontrada automaticamente para esta rota.", "#2e7d32");
      } else {
        //  - if not found:
        //    - clear distance input
        //    - change helper text to suggest manual input
        if (!manualCheckbox.checked) {
          distanceInput.value = "";
          distanceInput.readOnly = false;
          setHelper("⚠️ Rota não encontrada. Marque 'inserir distância manualmente'.", "#f9a825");
        } else {
          setHelper("ℹ️ Rota não encontrada. Insira a distância manualmente.", "#f9a825");
        }
      }
    };

    // add 'change' event listeners to both origin and destination inputs
    originInput.addEventListener("change", tryAutofill);
    destinationInput.addEventListener("change", tryAutofill);

    // add 'change' listener to manual checkbox:
    manualCheckbox.addEventListener("change", function () {
      // - When checked: remove readonly from distance, allow manual entry
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        distanceInput.disabled = false;
        distanceInput.placeholder = "Ex.: 95";
        setHelper("✍️ Distância manual habilitada.", "#0288d1");
        return;
      }

      // - when unchecked: try to find route again
      distanceInput.readOnly = true;
      tryAutofill();
    });

    // estado inicial
    if (!manualCheckbox.checked) {
      distanceInput.readOnly = true;
      tryAutofill();
    }
  }
};

// Expõe globalmente no browser
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}