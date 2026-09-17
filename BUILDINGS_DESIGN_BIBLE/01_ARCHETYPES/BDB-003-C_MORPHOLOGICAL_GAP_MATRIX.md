# BDB-003-C — Matriz de Lacunas Morfológicas

**Projeto:** Buildings Design Bible  
**Versão:** 0.3  
**Status:** 🟡 Investigação morfológica  
**Dependências:** `BDB-003_ARQUETIPOS_UNIVERSAIS.md`, `BUILDING_TYPE_CATALOG.md`, `BUILDING_TYPE_NORMALIZATION_MATRIX.md`, `00_CORE/schemas/archetype.schema.json`

> Nenhuma linha desta matriz cria ou declara um novo arquétipo BDB-003 implementado.

## 1. Objetivo

Transformar os candidatos da normalização em problemas morfológicos verificáveis.

Pergunta de controle:

> **O conjunto atual de arquétipos consegue representar o caso sem deformação, exceção silenciosa ou contrato incoerente?**

A cadeia é:

```text
CATÁLOGO → NORMALIZAÇÃO → LACUNA → PROVA → FICHA BDB-003
```

Clima, cultura, riqueza, material, cor e aparência não são critérios para criar arquétipos.

## 2. Estados

| Estado | Significado |
|---|---|
| `INVESTIGATE` | Lacuna plausível; falta prova suficiente. |
| `REUSE_UNTIL_PROVEN` | Reuso continua sendo a solução padrão até prova de insuficiência. |
| `COMPOSITION_FIRST` | O caso deve ser tratado inicialmente como composição. |
| `STRONG_CANDIDATE` | A distinção morfológica é forte o suficiente para entrar na próxima especificação BDB-003. Ainda não é implementação. |
| `UNRESOLVED` | A categoria é ampla ou ambígua demais para decisão segura. |

## 3. Critérios para uma nova ficha

Um candidato só passa para especificação quando houver evidência de:

1. um invariante que o separe dos arquétipos existentes;
2. diferença real de volumetria, organização espacial ou implantação;
3. representação possível pelo schema atual;
4. suporte por categorias de componentes BDB-005;
5. relação própria ou significativamente diferente com lote/rua;
6. regra plausível de escalonamento/reclassificação;
7. impossibilidade de resolver adequadamente por módulos, família, receita ou composição.

## 4. Lacunas residenciais

| Candidato | Lacuna principal | Vizinho verificado | Estado |
|---|---|---|---|
| `TYPE_RESIDENTIAL_TOWER` | Organização vertical e implantação de torre podem exceder o contrato do apartamento médio. | `BLD_RES_APARTMENT_MIDRISE` | `INVESTIGATE` |
| `TYPE_RESIDENTIAL_DORMITORY` | Ocupação coletiva e espaços comuns podem não caber naturalmente no modelo de apartamento. | `BLD_RES_APARTMENT_WALKUP` | `INVESTIGATE` |
| `TYPE_RESIDENTIAL_VILLA` | Pode ser conjunto de unidades, portanto composição antes de arquétipo. | `BLD_RES_HOUSE_DETACHED` | `COMPOSITION_FIRST` |

## 5. Lacunas comerciais e mistas

| Candidato | Lacuna principal | Vizinho verificado | Estado |
|---|---|---|---|
| `TYPE_COMMERCIAL_MARKET` | Salão amplo, bancas e circulação pública interna podem exceder loja de rua. | `BLD_COM_STREET_SHOP` | `INVESTIGATE` |
| `TYPE_COMMERCIAL_SHOPPING_CENTER` | Múltiplas unidades, circulação coletiva e grande infraestrutura de acesso. | `BLD_MIX_URBAN_BLOCK` | `STRONG_CANDIDATE` |
| `TYPE_COMMERCIAL_GALLERY` | Unidades dependentes de circulação interna comum. | `BLD_COM_STREET_SHOP` | `INVESTIGATE` |
| `TYPE_MIXED_MARKET_HALL` | Pode ser composição de salão, unidades e serviços. | `BLD_MIX_URBAN_BLOCK` | `COMPOSITION_FIRST` |

## 6. Lacunas institucionais

Os IDs abaixo foram verificados contra as fichas existentes:

- `BLD_INS_SCHOOL_SMALL` — escola pequena. fileciteturn35file2
- `BLD_INS_CLINIC_SMALL` — clínica pequena. fileciteturn33file0

| Candidato | Lacuna principal | Vizinho verificado | Estado |
|---|---|---|---|
| `TYPE_INSTITUTIONAL_HOSPITAL` | Setorização, circulação diferenciada e infraestrutura técnica excedem a clínica pequena. | `BLD_INS_CLINIC_SMALL` | `STRONG_CANDIDATE` |
| `TYPE_INSTITUTIONAL_MUSEUM` | Exposição, circulação pública e áreas técnicas podem exigir programa próprio. | `BLD_INS_SCHOOL_SMALL` | `INVESTIGATE` |
| `TYPE_INSTITUTIONAL_CULTURAL_CENTER` | Programa composto de salas, reunião, apresentação e oficinas. | `BLD_INS_SCHOOL_SMALL` | `INVESTIGATE` |
| `TYPE_INSTITUTIONAL_THEATER` | Palco, plateia, bastidores e grande vão constituem restrições próprias. | `BLD_INS_SCHOOL_SMALL` | `STRONG_CANDIDATE` |
| `TYPE_INSTITUTIONAL_RELIGIOUS` | Categoria ampla demais para uma única morfologia. | — | `UNRESOLVED` |
| `TYPE_INSTITUTIONAL_CEMETERY` | Predomina como território composto por múltiplos elementos. | — | `COMPOSITION_FIRST` |

## 7. Lacunas industriais

Os arquétipos industriais existentes confirmados são `BLD_IND_WORKSHOP_SMALL` e `BLD_IND_WAREHOUSE_SMALL`. fileciteturn36file1turn36file3

| Candidato | Lacuna principal | Vizinho verificado | Estado |
|---|---|---|---|
| `TYPE_INDUSTRIAL_FACTORY` | Processo produtivo pode exigir envelope e fluxos próprios. | `BLD_IND_WORKSHOP_SMALL` | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_HEAVY_FACTORY` | Escala, vãos, altura e infraestrutura podem exceder fábrica genérica. | `TYPE_INDUSTRIAL_FACTORY` | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_PROCESSING_PLANT` | Organização pode ser subordinada a fluxo contínuo de produção. | `TYPE_INDUSTRIAL_FACTORY` | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_LOGISTICS_CENTER` | Grande nave, docas e pátio de manobra alteram a implantação. | `BLD_IND_WAREHOUSE_SMALL` | `STRONG_CANDIDATE` |
| `TYPE_INDUSTRIAL_COLD_STORAGE` | Refrigeração é inicialmente requisito técnico, não identidade morfológica. | `BLD_IND_WAREHOUSE_SMALL` | `REUSE_UNTIL_PROVEN` |

## 8. Lacunas agrícolas/rurais

| Candidato | Lacuna principal | Vizinho | Estado |
|---|---|---|---|
| `TYPE_AGRICULTURAL_BARN` | Relação com campo e produção rural pode exigir envelope distinto. | `BLD_IND_WAREHOUSE_SMALL` | `INVESTIGATE` |
| `TYPE_AGRICULTURAL_STABLE` | Baias, ventilação e áreas externas para animais são requisitos próprios. | — | `STRONG_CANDIDATE` |
| `TYPE_AGRICULTURAL_SILO` | Estrutura vertical especializada, diferente de edifício ocupável convencional. | — | `STRONG_CANDIDATE` |
| `TYPE_AGRICULTURAL_GREENHOUSE` | Envoltória produtiva protegida e relação interior/exterior são fundamentais. | — | `STRONG_CANDIDATE` |
| `TYPE_AGRICULTURAL_MILL` | Pode ser edifício ou equipamento especializado; depende de período/tecnologia. | — | `UNRESOLVED` |

## 9. Regras transversais

### Escala

Não criar uma árvore infinita `small → medium → large → huge`. Nova identidade só existe quando o aumento de escala muda funcionamento, organização ou implantação.

### Equipamento

```text
warehouse + refrigeração → warehouse + TEC
```

Mas:

```text
warehouse + docas + grande pátio + circulação pesada
→ possível identidade logística
```

### Composição

```text
CEMITÉRIO
├── administração
├── capela
├── túmulos
├── caminhos
└── áreas verdes
```

A existência de vários elementos não obriga a criação de um arquétipo monolítico.

## 10. Próxima rodada

A primeira rodada de especificação deverá investigar seis padrões distintos:

```text
hospital
teatro
logistics_center
stable
silo
greenhouse
```

Os identificadores `BLD_*` definitivos só serão atribuídos quando as respectivas fichas BDB-003 forem especificadas e aprovadas.

A segunda rodada fica condicionada aos resultados da primeira:

```text
shopping_center
museum
cultural_center
factory
barn
tower
dormitory
market
gallery
```

## 11. Fluxo obrigatório

```text
BDB-003-C
   ↓
ficha morfológica
   ↓
archetype.schema.json
   ↓
slots BDB-005
   ↓
família BDB-006
   ↓
receita BDB-007
   ↓
fixture mínimo
   ↓
validação
```

Uma ficha BDB-003 sem suporte nos sistemas seguintes permanece incompleta.

## 12. Critério de encerramento

BDB-003-C estará concluído quando os candidatos relevantes estiverem classificados, cada candidato forte tiver justificativa verificável, composição estiver separada de arquétipo e nenhum fator contextual tiver sido promovido indevidamente a identidade.

**Decisão normativa:** durante esta etapa, congelar a expansão do catálogo. O próximo ganho de qualidade deve vir da definição morfológica e da integração com BDB-005/BDB-006/BDB-007.
