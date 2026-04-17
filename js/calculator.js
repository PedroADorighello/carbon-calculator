/**
 * Objeto global com cálculos de emissão, comparação entre modais
 * e estimativa de créditos de carbono.
 */
var Calculator = {
  /**
   * Calcula emissão de CO2 para uma distância e modal.
   * Fórmula: emissão = distância (km) * fator (kg/km)
   * Retorna com 2 casas decimais.
   */
  calculateaEmission: function (distanceKm, transportMode) {
    var distance = Number(distanceKm) || 0;
    var factor = (CONFIG && CONFIG.EMISSION_FACTORS && CONFIG.EMISSION_FACTORS[transportMode]) || 0;
    var emission = distance * factor;
    return Number(emission.toFixed(2));
  },

  /**
   * Calcula emissão para todos os modais e compara com carro (baseline).
   * percentageVsCar = (emission / carEmission) * 100
   * Retorna array ordenado por menor emissão.
   */
  calculateAllModes: function (distanceKm) {
    var results = [];
    var distance = Number(distanceKm) || 0;
    var factors = (CONFIG && CONFIG.EMISSION_FACTORS) || {};

    // Baseline: emissão do carro para a mesma distância
    var carFactor = factors.car || 0;
    var carEmission = distance * carFactor;

    for (var mode in factors) {
      if (!Object.prototype.hasOwnProperty.call(factors, mode)) continue;

      var emission = distance * factors[mode];

      // Se baseline for zero, evita divisão inválida
      var percentageVsCar = carEmission > 0 ? (emission / carEmission) * 100 : 0;

      results.push({
        mode: mode,
        emission: Number(emission.toFixed(2)),
        percentageVsCar: Number(percentageVsCar.toFixed(2))
      });
    }

    // Ordena do menor para o maior emissor
    results.sort(function (a, b) {
      return a.emission - b.emission;
    });

    return results;
  },

  /**
   * Calcula economia em relação a uma emissão base.
   * savedKg = baselineEmission - emission
   * percentage = (savedKg / baselineEmission) * 100
   * Retorna com 2 casas decimais.
   */
  CalculateSavings: function (emission, baselineEmission) {
    var current = Number(emission) || 0;
    var baseline = Number(baselineEmission) || 0;

    var savedKg = baseline - current;
    var percentage = baseline > 0 ? (savedKg / baseline) * 100 : 0;

    return {
      savedKg: Number(savedKg.toFixed(2)),
      percentage: Number(percentage.toFixed(2))
    };
  },

  /**
   * Converte emissão em créditos de carbono.
   * credits = emissionKg / KG_PER_CREDIT
   * Retorna com 4 casas decimais.
   */
  calculateCarbonCredits: function (emissionKh) {
    var emissionKg = Number(emissionKh) || 0;
    var kgPerCredit =
      (CONFIG && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.KG_PER_CREDIT) || 1000;

    var credits = emissionKg / kgPerCredit;
    return Number(credits.toFixed(4));
  },

  /**
   * Estima faixa de preço para compra de créditos.
   * min = credits * PRICE_MIN_BRL
   * max = credits * PRICE_MAX_BRL
   * average = (min + max) / 2
   * Retorna com 2 casas decimais.
   */
  estimateCreditPrice: function (credits) {
    var c = Number(credits) || 0;
    var minRate =
      (CONFIG && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.PRICE_MIN_BRL) || 0;
    var maxRate =
      (CONFIG && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.PRICE_MAX_BRL) || 0;

    var min = c * minRate;
    var max = c * maxRate;
    var average = (min + max) / 2;

    return {
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      average: Number(average.toFixed(2))
    };
  }
};

// Exposição global no navegador
if (typeof window !== "undefined") {
  window.Calculator = Calculator;
}