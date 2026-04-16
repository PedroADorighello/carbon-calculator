/**
 * Base global de rotas rodoviárias brasileiras (valores aproximados em km).
 * Estrutura:
 * - RoutesDB.routes: lista de objetos { origem, destino, distanciaKm }
 * - RoutesDB.getAllCities(): retorna cidades únicas ordenadas
 * - RoutesDB.findDistance(origem, destino): busca distância em ambos sentidos
 */
var RoutesDB = {
  routes: [
    // Capitais e conexões interestaduais populares
    { origem: "São Paulo, SP", destino: "Rio de Janeiro, RJ", distanciaKm: 430 },
    { origem: "São Paulo, SP", destino: "Brasília, DF", distanciaKm: 1016 },
    { origem: "São Paulo, SP", destino: "Belo Horizonte, MG", distanciaKm: 586 },
    { origem: "São Paulo, SP", destino: "Curitiba, PR", distanciaKm: 408 },
    { origem: "Rio de Janeiro, RJ", destino: "Belo Horizonte, MG", distanciaKm: 434 },
    { origem: "Rio de Janeiro, RJ", destino: "Vitória, ES", distanciaKm: 521 },
    { origem: "Belo Horizonte, MG", destino: "Brasília, DF", distanciaKm: 740 },
    { origem: "Belo Horizonte, MG", destino: "Salvador, BA", distanciaKm: 1372 },
    { origem: "Brasília, DF", destino: "Goiânia, GO", distanciaKm: 209 },
    { origem: "Brasília, DF", destino: "Cuiabá, MT", distanciaKm: 1133 },
    { origem: "Brasília, DF", destino: "Palmas, TO", distanciaKm: 973 },
    { origem: "Curitiba, PR", destino: "Florianópolis, SC", distanciaKm: 300 },
    { origem: "Florianópolis, SC", destino: "Porto Alegre, RS", distanciaKm: 476 },
    { origem: "Salvador, BA", destino: "Aracaju, SE", distanciaKm: 356 },
    { origem: "Salvador, BA", destino: "Recife, PE", distanciaKm: 806 },
    { origem: "Recife, PE", destino: "João Pessoa, PB", distanciaKm: 120 },
    { origem: "João Pessoa, PB", destino: "Natal, RN", distanciaKm: 185 },
    { origem: "Recife, PE", destino: "Maceió, AL", distanciaKm: 285 },
    { origem: "Maceió, AL", destino: "Aracaju, SE", distanciaKm: 294 },
    { origem: "Fortaleza, CE", destino: "Natal, RN", distanciaKm: 537 },
    { origem: "Fortaleza, CE", destino: "Teresina, PI", distanciaKm: 634 },
    { origem: "Teresina, PI", destino: "São Luís, MA", distanciaKm: 446 },
    { origem: "Belém, PA", destino: "São Luís, MA", distanciaKm: 806 },
    { origem: "Belém, PA", destino: "Palmas, TO", distanciaKm: 973 },
    { origem: "Palmas, TO", destino: "Goiânia, GO", distanciaKm: 874 },
    { origem: "Goiânia, GO", destino: "Campo Grande, MS", distanciaKm: 935 },
    { origem: "Campo Grande, MS", destino: "Cuiabá, MT", distanciaKm: 694 },
    { origem: "Cuiabá, MT", destino: "Porto Velho, RO", distanciaKm: 1456 },
    { origem: "Porto Velho, RO", destino: "Rio Branco, AC", distanciaKm: 544 },
    { origem: "Manaus, AM", destino: "Boa Vista, RR", distanciaKm: 785 },
    { origem: "Manaus, AM", destino: "Porto Velho, RO", distanciaKm: 901 },

    // Rotas regionais populares
    { origem: "São Paulo, SP", destino: "Campinas, SP", distanciaKm: 99 },
    { origem: "São Paulo, SP", destino: "Santos, SP", distanciaKm: 85 },
    { origem: "Rio de Janeiro, RJ", destino: "Niterói, RJ", distanciaKm: 20 },
    { origem: "Belo Horizonte, MG", destino: "Uberlândia, MG", distanciaKm: 540 },
    { origem: "Curitiba, PR", destino: "Londrina, PR", distanciaKm: 380 },
    { origem: "Porto Alegre, RS", destino: "Caxias do Sul, RS", distanciaKm: 128 },
    { origem: "Salvador, BA", destino: "Feira de Santana, BA", distanciaKm: 108 },
    { origem: "Recife, PE", destino: "Caruaru, PE", distanciaKm: 135 },
    { origem: "Fortaleza, CE", destino: "Juazeiro do Norte, CE", distanciaKm: 491 }
  ],

  /**
   * Retorna array único e ordenado de cidades presentes nas rotas.
   * Extrai tanto de origem quanto de destino.
   */
  getAllCities: function () {
    var cities = new Set();

    this.routes.forEach(function (route) {
      cities.add(route.origem);
      cities.add(route.destino);
    });

    return Array.from(cities).sort(function (a, b) {
      return a.localeCompare(b, "pt-BR");
    });
  },

  /**
   * Busca a distância entre duas cidades (em ambos os sentidos).
   * Normaliza entradas para comparação robusta.
   * @param {string} origin
   * @param {string} destination
   * @returns {number|null}
   */
  findDistance: function (origin, destination) {
    if (!origin || !destination) return null;

    var normalize = function (value) {
      return String(value)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    };

    var o = normalize(origin);
    var d = normalize(destination);

    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      var ro = normalize(route.origem);
      var rd = normalize(route.destino);

      if ((ro === o && rd === d) || (ro === d && rd === o)) {
        return route.distanciaKm;
      }
    }

    return null;
  }
};

// Garante acesso explícito no browser
if (typeof window !== "undefined") {
  window.RoutesDB = RoutesDB;
}