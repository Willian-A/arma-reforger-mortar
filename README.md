# Arma Reforger Mortar

Calculadora de solução de tiro para morteiros do **Arma Reforger**. Informe posição do morteiro, posição do alvo, arma e tipo de munição. O app devolve carga, distância, elevação, azimute, tempo de voo e correção de altitude.

## Funcionalidades

- Morteiros suportados:
  - **M252** (US, 81 mm)
  - **2B14 Podnos** (USSR, 82 mm)
- Tipos de munição: `HE`, `SMOKE`, `ILLUMINATION`.
- Entrada por grid de 6 dígitos (`000 000`, formatação automática) e altitude em metros.
- Seleção automática da carga pela distância.
- Interpolação linear das tabelas balísticas (elevação, tempo de voo e correção por 100 m de diferença de altura).
- Azimute em mils conforme o morteiro (6000 ou 6400 mils por círculo).
- Formulário em dois passos: arma/munição → posições.
- Histórico das soluções calculadas, persistido em `sessionStorage` (remover item ou limpar tudo).
- Erros explícitos: alvo fora do alcance (`OutOfRangeError`) e nenhuma carga disponível para a distância (`NoChargeError`).

## Como funciona o cálculo

1. `parseGrid` converte o grid em `{ x, y }` (cada unidade = 100 m).
2. `calculateDistance` e `calculateAzimuth` (`geometry.ts`) calculam distância e azimute.
3. `findCharge` escolhe a carga cujo intervalo `minRangeM`–`maxRangeM` contém a distância.
4. `interpolateBallisticRow` interpola a tabela da carga.
5. Correção de altitude: `(altOrigem − altAlvo) / 100 × dElevPer100mDrop`, somada à elevação.

Dados balísticos ficam em `src/ballistics/data/*.json` e são validados por schema Zod (`mortar.schema.ts`) na inicialização.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev)
- [HeroUI](https://www.heroui.com) + [Tailwind CSS 4](https://tailwindcss.com) + [Phosphor Icons](https://phosphoricons.com)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- [Zustand](https://zustand.docs.pmnd.rs) (stores com `persist`)
- [Vitest](https://vitest.dev) + jsdom
- [Biome](https://biomejs.dev) (lint e format)

## Começando

Requisitos: Node.js e [Yarn](https://yarnpkg.com).

```bash
yarn install
yarn dev
```

## Scripts

| Script         | Descrição                          |
| -------------- | ---------------------------------- |
| `yarn dev`     | Servidor de desenvolvimento (Vite) |
| `yarn build`   | Typecheck (`tsc -b`) + build       |
| `yarn preview` | Preview do build                   |
| `yarn test`    | Testes (Vitest)                    |
| `yarn lint`    | Lint (Biome)                       |
| `yarn format`  | Formata o código                   |
| `yarn check`   | Lint + format com correções        |

## Estrutura

```
src/
├── App.tsx
├── ballistics/          # Cálculo balístico
│   ├── data/            # Tabelas por morteiro (M252, 2B14) + testes
│   ├── firing-solution.ts
│   ├── geometry.ts      # Distância e azimute
│   ├── mortar.schema.ts # Schemas Zod e tipos
│   └── errors.ts
├── grid/                # Parse e formatação de grid
├── components/
│   ├── ResolveMortarForm/  # Formulário em passos (MortarStep, PositionsStep)
│   └── ResultsHistoryCard.tsx
└── stores/              # Zustand: resolução atual e histórico
```

## Adicionando um morteiro

1. Crie `src/ballistics/data/<id>.json` seguindo `mortarSchema`.
2. Registre em `MORTARS` (`firing-solution.ts`) e em `mortarModelSchema` (`mortar.schema.ts`).
3. Adicione teste de validação do JSON, como `m252.test.ts`.

## Aviso

Projeto não oficial, sem ligação com a Bohemia Interactive. As tabelas balísticas têm campo `verified` por linha; linhas não verificadas podem divergir do jogo.
