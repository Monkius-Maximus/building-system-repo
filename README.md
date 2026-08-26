# Buildings Design Bible

Biblioteca de regras, componentes, arquétipos e perfis contextuais para geração procedural de edifícios e cidades em um jogo de mundo aberto em escala global.

## Estado geral

**🟠 Em desenvolvimento**

| Código | Documento | Estado |
|---|---|---|
| BDB-001 | Taxonomia Universal de Edifícios | 🟡 Estrutura-base; requer protótipo |
| BDB-002 | Sistema de Modificadores Ambientais e Urbanos | 🟡 Especificado; requer implementação |
| BDB-003 | Arquétipos Universais de Edifícios | 🟡 Especificado; requer implementação |
| BDB-004 | Sistema de DNA Arquitetônico | ⚪ Não iniciado |
| BDB-005 | Biblioteca Modular e Regras de Encaixe | ⚪ Não iniciado |
| BDB-006 | Famílias Arquitetônicas Globais | ⚪ Não iniciado |
| BDB-007 | Receitas Regionais | ⚪ Não iniciado |
| BDB-008 | Geração de Lotes e Bairros | ⚪ Não iniciado |
| BDB-009 | Persistência e Formato dos Arquivos | ⚪ Não iniciado |
| BDB-010 | Protótipo Procedural | ⚪ Não iniciado |

## Semântica de status

| Estado | Significado |
|---|---|
| 🔴 | Cancelado, descartado ou possivelmente superado |
| 🟠 | Iniciado |
| 🟡 | Em progresso ou requer atenção |
| 🟢 | Etapa concluída |
| 🔵 | Módulo concluído |

## Estrutura principal

```text
BUILDINGS_DESIGN_BIBLE/
├── 00_CORE/
├── 01_ARCHETYPES/
├── 02_COMPONENTS/
├── 03_MATERIALS/
├── 04_CONTEXT_MODIFIERS/
├── 05_REGIONAL_FAMILIES/
├── 06_BUILDING_RECIPES/
├── 07_GENERATED_BUILDINGS/
└── 08_VALIDATION/
```

## Documento atual

```text
BUILDINGS_DESIGN_BIBLE/01_ARCHETYPES/BDB-003_ARQUETIPOS_UNIVERSAIS.md
```

## Cadeia de geração

```text
ARQUÉTIPO          BDB-003    "O que é?"
     ↓
CONTEXTO           BDB-002    "Onde está?"
     ↓
DNA                BDB-004    "Que características recebeu?"
     ↓
MÓDULOS            BDB-005    "Com quais peças será construído?"
     ↓
RECEITA            BDB-006+   "Como montar?"
     ↓
EDIFÍCIO GERADO
```

## Próxima etapa

Produzir o `BDB-004 — Sistema de DNA Arquitetônico`, que cruza arquétipo e contexto:

```text
arquétipo (BDB-003)  +  contexto (BDB-002)  =  DNA (BDB-004)
```

## Princípio do projeto

O sistema não procura armazenar milhares de edifícios acabados. Ele procura armazenar:

```text
arquétipos
componentes
restrições
modificadores
receitas
probabilidades
contextos
trilhas de decisão
```

Edifícios finais serão resultados reproduzíveis dessas combinações.
