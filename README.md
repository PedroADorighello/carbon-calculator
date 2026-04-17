# 🌱 Carbon Calculator

Calculadora web de emissão de CO₂ para rotas rodoviárias brasileiras, com comparação entre modais de transporte e estimativa de créditos de carbono.

## ✨ Funcionalidades

- Autocomplete de cidades com base em rotas pré-definidas (`RoutesDB`)
- Preenchimento automático de distância entre origem e destino
- Cálculo de emissão por modal:
  - 🚲 Bicicleta
  - 🚗 Carro
  - 🚌 Ônibus
  - 🚚 Caminhão
- Comparação de emissões entre modais
- Estimativa de economia de CO₂ vs carro
- Cálculo de créditos de carbono e faixa de preço estimada
- Interface responsiva (desktop e mobile)

---

## 🧱 Estrutura do projeto

```text
carbon-calculator/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ app.js
│  ├─ calculator.js
│  ├─ config.js
│  ├─ routes-data.js
│  └─ ui.js
└─ .github/
   └─ workflows/
      └─ deploy.yml
```

---

## ⚙️ Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- GitHub Actions (deploy)
- GitHub Pages (hosting)

---

## ▶️ Como executar localmente

Como é um projeto estático, basta abrir o `index.html` no navegador.

### Opção recomendada (VS Code + Live Server)
1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito em `index.html`.
3. Selecione **Open with Live Server**.

---

## 🧮 Regras de cálculo (resumo)

### Fatores de emissão (kg CO₂/km)

- bike: `0`
- car: `0.12`
- bus: `0.089`
- truck: `0.96`

### Créditos de carbono

- `1 crédito = 1000 kg CO₂`
- Faixa de preço:
  - mínimo: `R$ 50`
  - máximo: `R$ 150`

---

## 🚀 Deploy

O deploy é automático no **GitHub Pages** via workflow:

- Arquivo: `.github/workflows/deploy.yml`
- Dispara em:
  - push na branch `main`
  - execução manual (`workflow_dispatch`)
- Não há etapa de build (deploy direto dos arquivos estáticos)

---

## 📌 Melhorias futuras (sugestões)

- Persistência de histórico de cálculos no `localStorage`
- Filtros por estado/região no autocomplete
- Modo escuro (dark mode)
- Testes unitários para `calculator.js` e `ui.js`

---

## 👨‍💻 Autor

Projeto desenvolvido para estudos na **DIO** com apoio do **GitHub Copilot**.