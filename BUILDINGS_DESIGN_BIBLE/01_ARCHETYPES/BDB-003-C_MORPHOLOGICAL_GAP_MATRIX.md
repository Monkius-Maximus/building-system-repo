# BDB-003-C — Matriz de Lacunas Morfológicas

**Projeto:** Buildings Design Bible  
**Versão:** 0.2  
**Status:** 🟡 Investigação morfológica  
**Dependências:** `BDB-003_ARQUETIPOS_UNIVERSAIS.md`, `BUILDING_TYPE_CATALOG.md`, `BUILDING_TYPE_NORMALIZATION_MATRIX.md`, `00_CORE/schemas/archetype.schema.json`  

> **Regra:** nenhuma linha desta matriz cria ou declara um novo arquétipo BDB-003 implementado.

---

## 1. Objetivo

Transformar os candidatos identificados na normalização em problemas morfológicos verificáveis.

A pergunta de controle é:

> **O conjunto atual de arquétipos consegue representar este caso sem deformação, exceção silenciosa ou contrato incoerente?**

A cadeia de decisão é:

```text
CATÁLOGO → NORMALIZAÇÃO → LACUNA → PROVA → FICHA BDB-003
```

Função, escala, implantação e organização espacial são analisadas antes de considerar um novo arquétipo. Clima, cultura, riqueza, material, cor e aparência continuam fora do BDB-003.

---

## 2. Estados

| Estado | Significado |
|---|---|
| `INVESTIGATE` | Há uma lacuna plausível, mas ainda não existe prova suficiente para nova ficha. |
| `REUSE_UNTIL_PROVEN` | O arquétipo existente continua sendo a solução padrão até que um caso demonstre insuficiência. |
| `COMPOSITION_FIRST` | O caso deve ser modelado primeiro como composição de edifícios/elementos. |
| `STRONG_CANDIDATE` | A distinção morfológica é forte o suficiente para entrar na próxima rodada de especificação BDB-003. Ainda não é implementação. |
| `UNRESOLVED` | A categoria é ampla ou ambígua demais para uma decisão segura. |

`STRONG_CANDIDATE` substitui a classificação anterior `NEW_ARCHETYPE_JUSTIFIED` para evitar que uma análise preliminar seja confundida com uma decisão normativa definitiva.

---

## 3. Critérios para uma nova ficha

Um candidato só passa para especificação BDB-003 quando houver evidência dos seguintes pontos:

1. **Identidade:** pelo menos um invariante o separa dos arquétipos existentes.
2. **Morfologia:** essa identidade altera volumetria, organização espacial ou implantação.
3. **Contrato:** o schema atual consegue expressar a identidade sem campos arbitrários.
4. **Slots:** componentes BDB-005 podem materializar os requisitos fundamentais.
5. **Lote:** existe uma relação própria ou significativamente diferente com lote/rua.
6. **Escalonamento:** há uma regra plausível de reclassificação quando os limites forem ultrapassados.
7. **Reuso:** composição, módulos, família ou receita não resolvem o caso adequadamente.

Se um desses pontos ainda estiver em aberto, o estado permanece investigativo.

---

## 4. Lacunas residenciais

| Candidato | Lacuna principal | Vizinho atual | Estado |
|---|---|---|---|
| `TYPE_RESIDENTIAL_TOWER` | Organização vertical e implantação de torre podem ultrapassar o contrato do apartamento médio. | `BLD_RES_APARTMENT_MIDRISE` | `INVESTIGATE` |
| `TYPE_RESIDENTIAL_DORMITORY` | Ocupação coletiva com quartos e espaços comuns pode não ser adequadamente descrita como apartamento. | `BLD_RES_APARTMENT_WALKUP` | `INVESTIGATE` |
| `TYPE_RESIDENTIAL_VILLA` | Pode ser uma composição de unidades residenciais, e não um único edifício. | `BLD_RES_HOUSE_DETACHED` | `COMPOSITION_FIRST` |

**Decisão atual:** não criar torre, dormitório ou vila antes de testar casos concretos contra apartamento + composição.

---

## 5. Lacunas comerciais e de uso misto

| Candidato | Lacuna principal | Vizinho atual | Estado |
|---|---|---|---|
| `TYPE_COMMERCIAL_MARKET` | Salão amplo, bancas e circulação pública interna podem exigir organização diferente da loja de rua. | `BLD_COM_STREET_SHOP` | `INVESTIGATE` |
| `TYPE_COMMERCIAL_SHOPPING_CENTER` | Múltiplas unidades, circulação coletiva e grandes áreas de acesso/estacionamento. | `BLD_MIX_URBAN_BLOCK` | `STRONG_CANDIDATE` |
| `TYPE_COMMERCIAL_GALLERY` | Sequência de unidades dependentes de circulação interna comum. | `BLD_COM_STREET_SHOP` | `INVESTIGATE` |
| `TYPE_MIXED_MARKET_HALL` | Programa amplo pode ser mais corretamente uma composição de salão + unidades + serviços. | `BLD_MIX_URBAN_BLOCK` | `COMPOSITION_FIRST` |

**Decisão atual:** shopping center é candidato forte por organização espacial; market hall permanece composição até prova contrária.

---

## 6. Lacunas institucionais

| Candidato | Lacuna principal | Vizinho atual | Estado |
|---|---|---|---|
| `TYPE_INSTITUTIONAL_HOSPITAL` | Setorização, circulação diferenciada e infraestrutura técnica excedem uma clínica pequena. | `BLD_INST_CLINIC_SMALL` | `STRONG_CANDIDATE` |
| `TYPE_INSTITUTIONAL_MUSEUM` | Exposição, circulação pública e áreas técnicas podem exigir programa próprio. | `BLD_INST_SCHOOL_SMALL` | `INVESTIGATE` |
| `TYPE_INSTITUTIONAL_CULTURAL_CENTER` | Programa composto de salas, reunião, apresentação e oficinas. | `BLD_INST_SCHOOL_SMALL` | `INVESTIGATE` |
| `TYPE_INSTITUTIONAL_THEATER` | Palco, plateia, bastidores e grande vão constituem restrições específicas. | `BLD_INST_SCHOOL_SMALL` | `STRONG_CANDIDATE` |
| `TYPE_INSTITUTIONAL_RELIGIOUS` | Categoria funcional ampla demais; diferentes programas podem produzir morfologias incompatíveis. | — | `UNRESOLVED` |
| `TYPE_INSTITUTIONAL_CEMETERY` | É predominantemente um território composto por múltiplos elementos, não um único edifício. | — | `COMPOSITION_FIRST` |

**Decisão atual:** hospital e teatro entram na próxima rodada de especificação. Museu e centro cultural continuam dependentes de prova de programa e composição.

---

## 7. Lacunas industriais

| Candidato | Lacuna principal | Vizinho atual | Estado |
|---|---|---|---|
| `TYPE_INDUSTRIAL_FACTORY` | Processo produtivo pode exigir envelope e fluxos próprios. | `BLD_IND_WORKSHOP_SMALL` | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_HEAVY_FACTORY` | Escala, vãos, altura e infraestrutura podem exceder uma fábrica genérica. | `TYPE_INDUSTRIAL_FACTORY` | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_PROCESSING_PLANT` | A organização do edifício pode ser subordinada a um fluxo contínuo de produção. | `TYPE_INDUSTRIAL_FACTORY` | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_LOGISTICS_CENTER` | Grande nave, docas e pátio de manobra alteram substancialmente a implantação. | `BLD_IND_WAREHOUSE_SMALL` | `STRONG_CANDIDATE` |
| `TYPE_INDUSTRIAL_COLD_STORAGE` | Refrigeração é inicialmente equipamento técnico, não identidade morfológica. | `BLD_IND_WAREHOUSE_SMALL` | `REUSE_UNTIL_PROVEN` |

**Decisão atual:** logistics center é candidato forte; cold storage não ganha arquétipo apenas por possuir refrigeração.

---

## 8. Lacunas agrícolas/rurais

| Candidato | Lacuna principal | Vizinho atual | Estado |
|---|---|---|---|
| `TYPE_AGRICULTURAL_BARN` | Relação com campo e programa rural podem exigir envelope diferente do armazém industrial. | `BLD_IND_WAREHOUSE_SMALL` | `INVESTIGATE` |
| `TYPE_AGRICULTURAL_STABLE` | Baias, ventilação e áreas externas para animais são requisitos programáticos próprios. | — | `STRONG_CANDIDATE` |
| `TYPE_AGRICULTURAL_SILO` | Estrutura vertical especializada, com geometria e ocupação diferentes de edifício convencional. | — | `STRONG_CANDIDATE` |
| `TYPE_AGRICULTURAL_GREENHOUSE` | Envoltória produtiva protegida e relação interior/exterior são fundamentais. | — | `STRONG_CANDIDATE` |
| `TYPE_AGRICULTURAL_MILL` | Pode ser edifício ou equipamento especializado; período e tecnologia influenciam sua definição. | — | `UNRESOLVED` |

**Decisão atual:** estábulo, silo e estufa possuem lacunas morfológicas claras para investigação formal. Moinho permanece indefinido.

---

## 9. Teste de escala

Escala não deve gerar uma árvore infinita de arquétipos:

```text
small → medium → large → huge → mega
```

A regra é:

> **A escala só cria nova identidade quando altera o modo de funcionamento, organização ou implantação do edifício.**

Exemplo:

```text
small_warehouse
      ↓ aumento dimensional
warehouse maior
      ↓ novas docas + pátio + circulação pesada
logistics_center
```

O segundo salto pode justificar um arquétipo; o primeiro normalmente é apenas uma restrição dimensional.

---

## 10. Teste de equipamento

Equipamento técnico não deve virar arquétipo automaticamente:

```text
warehouse + refrigeração
        ↓
warehouse + TEC
```

Quando o requisito reorganiza o edifício inteiro, a hipótese muda:

```text
warehouse + docas + pátio de manobra + circulação pesada
        ↓
possível identidade logística
```

A distinção é entre **equipamento que modifica um edifício** e **programa que reorganiza o edifício**.

---

## 11. Teste de composição

Alguns itens devem permanecer em uma camada superior ao arquétipo:

```text
CEMITÉRIO
├── administração
├── capela
├── túmulos
├── caminhos
└── áreas verdes
```

```text
SHOPPING CENTER
├── lojas
├── âncoras
├── circulação
├── estacionamento
└── áreas técnicas
```

A existência de vários elementos não significa que cada elemento ou o conjunto inteiro precise de uma ficha BDB-003 monolítica. A composição deve ser formalizada antes de multiplicar arquétipos.

---

## 12. Fila de especificação

Esta fila **não é ranking de importância**. Ela define os casos que devem testar novas abstrações do contrato.

### C1 — primeira rodada

```text
BLD? / HOSPITAL
BLD? / THEATER
BLD? / LOGISTICS_CENTER
BLD? / STABLE
BLD? / SILO
BLD? / GREENHOUSE
```

Os identificadores `BLD_*` acima são deliberadamente deixados em aberto. O ID definitivo só será atribuído quando a ficha BDB-003 for aprovada, evitando inventar identificadores antes da especificação.

### C2 — segunda rodada

```text
SHOPPING_CENTER
MUSEUM
CULTURAL_CENTER
FACTORY
BARN
TOWER
DORMITORY
MARKET
GALLERY
```

---

## 13. Fluxo obrigatório antes de criar cada arquétipo

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

Uma ficha BDB-003 sem suporte nos sistemas seguintes permanece incompleta e não deve ser tratada como arquétipo pronto para geração.

---

## 14. Critério de encerramento

BDB-003-C estará concluído quando:

- os candidatos relevantes da normalização estiverem classificados;
- cada `STRONG_CANDIDATE` tiver uma justificativa morfológica verificável;
- composição estiver separada de arquétipo;
- nenhum fator contextual tiver sido promovido indevidamente a identidade;
- os IDs definitivos só forem criados junto com suas fichas;
- a próxima rodada puder começar por fichas individuais, sem ampliar novamente o catálogo.

**Decisão normativa:** congelar a expansão do catálogo funcional durante esta etapa. O próximo ganho de qualidade deve vir da definição morfológica e da integração com BDB-005/BDB-006/BDB-007, não de adicionar mais nomes ao catálogo.
