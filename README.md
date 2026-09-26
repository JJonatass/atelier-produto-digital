# Do Problema ao Protótipo

Ferramenta interativa (React + Babel, sem build) baseada no **Livro Vol. 2** de Jonatas Silva — cobre os Capítulos 2 e 3 da metodologia de design de produto digital, ligada aos ODS.

Cada seção do livro vira um wizard guiado, com o texto do livro antes de cada campo e um resumo exportável ao final:

**Capítulo 2 — Construindo a Solução**
- 2.1 Da Problematização à Ideação
- 2.2 Ideação (Brainstorming, SCAMPER, Design Sprint)
- 2.3 Jornada do Usuário
- 2.4 Matriz CSD
- 2.5 Lean Canvas
- 2.6 Fluxo de Telas

**Capítulo 3 — Design System, Linguagem Visual e Prototipagem**
- 3.1 Do Problema à Linguagem Visual
- 3.2 Paleta de Cores
- 3.3 Tipografia
- 3.4 Ícones e Iconografia
- 3.5 Layout e Espaçamento
- 3.6 Tokens de Design
- 3.7 Design System
- 3.8 Prototipagem
- 3.9 Tom de Voz e Microcopy

## Como rodar

É um app estático — não precisa de build. Basta abrir `index.html` num navegador, ou servir a pasta com qualquer servidor estático (ex.: `npx serve .`, ou GitHub Pages).

## Estrutura

- `index.html` — shell da página, carrega React/ReactDOM/Babel via CDN e os 4 arquivos abaixo.
- `part1.jsx` a `part4.jsx` — componentes React (JSX transpilado no navegador pelo Babel standalone).

Os dados preenchidos ficam salvos no `localStorage` do navegador. A tela inicial tem um painel de backup para exportar/importar/reiniciar os dados.
