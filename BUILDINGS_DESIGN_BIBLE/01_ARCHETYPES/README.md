# 01_ARCHETYPES

Este diretório contém as fichas normativas de arquétipo da Buildings Design Bible.

Um arquétipo descreve **o que um edifício é** antes de clima, cultura, riqueza ou materiais entrarem em cena.

## Documento normativo

```text
BDB-003_ARQUETIPOS_UNIVERSAIS.md
```

## Contrato

```text
../00_CORE/schemas/archetype.schema.json
```

Toda ficha deste diretório deve validar contra esse schema.

## Famílias

```text
residential      5 fichas
commercial       3 fichas
mixed_use        2 fichas
institutional    2 fichas
industrial       2 fichas
agricultural     ainda vazio
infrastructure   ainda vazio
```

## Três níveis de firmeza

| Nível | Onde aparece | O contexto pode alterar? |
|---|---|---|
| Invariante | `identity`, `invariants[]` | Não |
| Restrição | `min` / `max` / `allowed` | Sim, dentro da faixa |
| Preferência | `preferred`, `slots.optional` | Sim, livremente |

## O que não pertence a uma ficha

```text
clima
matriz cultural
nível de riqueza
material, cor ou acabamento
estado de conservação
```

Esses eixos chegam pelo BDB-002 e pelos documentos seguintes. Colocá-los aqui quebraria a modularidade.

## Estado

| Item | Estado |
|---|---|
| BDB-003 | 🟡 Especificado; requer implementação |
| Schema de arquétipo | 🟢 Criado |
| 14 fichas do protótipo | 🟡 Hipótese |
| Demais arquétipos do BDB-001 seção 8 | ⚪ Não iniciados |
