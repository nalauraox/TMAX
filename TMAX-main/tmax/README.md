# TMAX — Aplicação front-end

Uma aplicação React + Vite com foco em rotas e navegação (integração com Leaflet). Este repositório contém a aplicação cliente com páginas de cadastro, login, gerenciamento de rotas e finalização de entregas, com IA para ajudar a ter a melhor rota.

✅ Principais tecnologias

- React 19 + React Router
- Vite (dev / build / preview)
- TailwindCSS (estilização)
- Leaflet e React-Leaflet (mapas)
- Axios (requisições HTTP)
- OpenRouteService / @mapbox/polyline (rotas / geoprocessamento)

## Funcionalidades

- Páginas para cadastro de motorista, veículo (moto) e usuário
- Login e perfil do usuário
- Listagem de rotas a realizar e início de rota
- Visualização e navegação de rotas em mapa (Leaflet)
- Finalização de entregas por veículo

## Pré-requisitos

- Node.js (recomendado 18+)
- npm ou yarn

## Instalação e execução

1. Instale dependências

```bash
npm install
# ou
yarn
```

2. Rodar em desenvolvimento (hot-reload)

```bash
npm run dev
# ou
yarn dev
```

3. Build de produção

```bash
npm run build
# ou
yarn build
```

4. Pré-visualizar build (local)

```bash
npm run preview
# ou
yarn preview
```

5. Linter

```bash
npm run lint
# ou
yarn lint
```

## Estrutura principal (resumo)

```
tmax/
├─ src/
│  ├─ pages/            # telas / rotas (Home, Login, Register, Profile, Routes, etc.)
│  ├─ components/       # componentes reutilizáveis (forms, RouteStarted...)
│  ├─ assets/
│  └─ App.jsx, main.jsx  # ponto de entrada e rotas
├─ package.json         # scripts: dev, build, preview, lint
└─ README.md            # este arquivo
```

## Rotas (visão rápida)

- /routestodo → Home
- /register   → Cadastro
- /login      → Login
- /profile    → Perfil
- /routestodo → Rotas a realizar
- /routestart → Iniciar rota
- /route-navigation → Navegação de rota (mapa)

## Observações

- Esta aplicação é a camada cliente — o backend (API) está incluído neste repositório. Ajuste as variáveis de ambiente e endpoints conforme seu backend.
- As dependências de mapas e rotas (OpenRouteService, @mapbox/polyline, Leaflet) requerem chaves/serviços externos em produção.

## Contribuição

1. Fork → clone → branch de feature
2. Abra um pull request descrevendo mudanças

