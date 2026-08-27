# BDB-003 — Arquétipos Universais de Edifícios

**Projeto:** Buildings Design Bible
**Versão:** 0.1
**Status:** 🟡 Especificação e primeiro conjunto concluídos; requer implementação
**Dependências:** `BDB-001_TAXONOMIA_UNIVERSAL.md`, `BDB-002_SISTEMA_MODIFICADORES.md`
**Função:** Definir formalmente o que é um arquétipo, separar invariante de restrição e de preferência, e converter a lista preliminar do BDB-001 em fichas normativas legíveis por máquina.

---

## 1. Objetivo

O BDB-001 forneceu o **vocabulário**. O BDB-002 forneceu as **forças externas**. O BDB-003 fornece os **tipos de edifício** sobre os quais essas forças agem.

Um arquétipo é aquilo que permanece reconhecível **antes** de clima, cultura, riqueza ou materiais entrarem em cena.

O documento deverá permitir:

1. declarar o que define cada tipo de edifício;
2. distinguir o que não pode mudar do que apenas costuma acontecer;
3. impedir que um modificador descaracterize silenciosamente um arquétipo;
4. indicar para qual arquétipo reclassificar quando um limite é ultrapassado;
5. declarar quais categorias de componente são obrigatórias, opcionais ou proibidas;
6. declarar a relação mínima com o lote e com a rua;
7. validar cada ficha contra um contrato único;
8. permitir que arquétipos futuros sejam acrescentados sem reescrever os existentes.

Assim como no BDB-002, os valores iniciais são **heurísticas de jogo**. Nenhuma ficha desta versão está marcada como `validated`.

---

## 2. Definição de arquétipo

### 2.1 O que pertence ao arquétipo

```text
uso principal e subuso
número de unidades de ocupação
empilhamento ou não dessas unidades
existência de parede compartilhada
existência de acesso próprio
existência de térreo público
família volumétrica
faixa de altura e de implantação
categorias de componente obrigatórias
relação mínima exigida com o lote e com a rua
transformações que o tipo admite
```

### 2.2 O que não pertence ao arquétipo

```text
telha cerâmica
reboco branco
janela de alumínio
muro frontal
varanda tropical
telhado muito inclinado
paleta de cores
clima
matriz cultural
nível de riqueza
estado de conservação
```

Tudo isso é resultado de contexto, e chega pelo BDB-002, pelo BDB-004 e pelas receitas. Se entrar no arquétipo, destrói a modularidade construída até aqui.

### 2.3 Exemplo

```text
DETACHED_HOUSE
        │
        ├── residencial
        ├── unidade independente
        ├── volume não compartilhado com vizinhos
        ├── acesso próprio
        ├── relação própria com o lote
        └── limites dimensionais plausíveis
```

### 2.4 Teste prático

Antes de acrescentar um campo a uma ficha, pergunte:

```text
Se eu mudar este valor, o edifício deixa de ser este tipo?
```

- **Sim** → é invariante ou restrição, e pertence ao arquétipo.
- **Não, apenas fica diferente** → é preferência, e provavelmente pertence ao contexto.

---

## 3. Posição na cadeia de geração

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

O arquétipo é escolhido **primeiro**. Isso confirma a Regra 1 do BDB-001 e a decisão 2.1 do BDB-002: o contexto adapta, não cria o tipo.

---

## 4. Os três níveis de firmeza

Esta é a decisão central do BDB-003.

| Nível | Significado | O contexto pode alterar? |
|---|---|---|
| **Invariante** | Define a identidade do tipo | Não. Violação rejeita ou reclassifica |
| **Restrição** | Limite dentro do qual o tipo continua válido | Sim, dentro da faixa |
| **Preferência** | Comportamento típico do tipo | Sim, livremente |

### 4.1 Exemplo aplicado a `detached_house`

```text
INVARIANTE
party_walls = forbidden

RESTRIÇÃO
floor_count = 1..4

PREFERÊNCIA
floor_count = 1..2
```

### 4.2 Como isso aparece na ficha

```text
identity.*                    → invariante
invariants[]                  → invariante, com teste explícito
*.min / *.max                 → restrição
*.allowed                     → restrição
*.preferred                   → preferência
slots.required / forbidden    → restrição
slots.optional                → preferência
```

### 4.3 Por que isso importa

Sem essa separação, um modificador poderia produzir:

```text
detached_house
+ 18 pavimentos
+ paredes compartilhadas dos dois lados
```

Com ela, o sistema percebe que aquilo deixou de ser uma `detached_house` e reage de forma explícita, em vez de gerar uma aberração procedural.

---

## 5. Decisões normativas

### 5.1 Riqueza não pertence ao arquétipo

Nenhuma ficha declara faixa de renda. Um mesmo arquétipo deve poder ser gerado em qualquer nível econômico, mudando acabamento, área e manutenção — não identidade.

Riqueza continua sendo domínio do BDB-002.

### 5.2 Clima não pertence ao arquétipo

Nenhuma ficha declara clima compatível. Uma `detached_house` existe em clima tropical, temperado e frio; o que muda é a expressão, não o tipo.

### 5.3 Cultura não pertence ao arquétipo

Nenhuma ficha declara família cultural, país ou tradição. A `shop_house` é recorrente em muitas culturas urbanas; tratá-la como pertencente a uma delas seria erro de modelagem.

### 5.4 Densidade pertence, porque é morfológica

`context_compatibility.densities` está presente porque densidade é um fato de implantação: uma casa isolada não ocorre em tecido hiperdenso por incompatibilidade de lote e de testada, não por juízo social.

A `notes` de cada ficha registra essa justificativa quando a exclusão poderia ser lida como julgamento.

### 5.5 Tecnologia pertence quando é condição estrutural

`context_compatibility.tech_levels` restringe apenas quando há razão construtiva. Exemplo: `midrise_apartment` exclui `vernacular` e `craft` porque depende de sistema estrutural e de circulação vertical mecanizada — não porque técnicas vernaculares sejam inferiores.

`rural_house` mantém todas as tecnologias, inclusive `vernacular` junto de `contemporary`: período e tecnologia são eixos separados.

### 5.6 Rejeitar é melhor que deformar

Quando uma combinação sai da faixa, o gerador não deve improvisar. Deve, nesta ordem:

```text
1. reclassificar para o arquétipo indicado
2. rejeitar a combinação
3. registrar o motivo
```

Nunca produzir um híbrido silencioso.

---

## 6. Estrutura da ficha

Contrato:

```text
00_CORE/schemas/archetype.schema.json
```

Blocos obrigatórios:

```text
schema_version
archetype_id
display_name
description
status
references
usage
identity
invariants
morphology
slots
lot_relationship
context_compatibility
transformations
archetype_escalation
```

### 6.1 `identity`

Fatos invariantes. Alterar qualquer um significa trocar de arquétipo.

```json
{
  "volume_types": ["detached"],
  "party_walls": "forbidden",
  "independent_street_access": "required",
  "unit_count": { "min": 1, "max": 1, "preferred": [1, 1] },
  "unit_stacking": "forbidden",
  "public_ground_floor": "forbidden"
}
```

Os campos tri-estado usam:

```text
required   → precisa existir
forbidden  → não pode existir
optional   → não é definidor deste tipo
```

Definições:

- **`unit_count`** — unidades de ocupação independentes dentro do edifício. Para equipamentos institucionais o valor é `1`, porque a instituição é uma única ocupação.
- **`unit_stacking`** — empilhamento vertical dessas unidades. É o que separa casa de apartamento.
- **`public_ground_floor`** — térreo acessível ao público sem convite prévio. É o que separa loja de residência.
- **`barrier_free_entrance`** — opcional; usado por equipamentos de saúde e educação.
- **`vertical_use_stack`** — exclusivo de uso misto; sequência de usos do térreo para o topo.

### 6.2 `invariants`

Cada invariante é declarada com teste explícito e ação de violação:

```json
{
  "invariant_id": "INV_RES_DETACHED_NO_PARTY_WALL",
  "statement": "O volume principal não compartilha parede estrutural com edifícios vizinhos.",
  "target": "identity.party_walls",
  "test": "identity.party_walls == 'forbidden'",
  "violation_action": "reject_or_reclassify"
}
```

Ações possíveis:

```text
reject                 falha controlada
reject_or_reclassify   tenta o arquétipo sugerido antes de falhar
warn                   permite, mas registra para inspeção
```

O campo `test` é uma expressão declarativa legível. Esta versão **não** define o interpretador; isso pertence ao BDB-010.

### 6.3 `morphology`

```text
floor_count          restrição + preferência
height_classes       classes do BDB-001 secao 4.3
plan_shapes          formas do BDB-001 secao 4.2
volume_complexity    complexidade do BDB-001 secao 4.5
symmetry             opcional
footprint_units      largura e profundidade normalizadas
structural_span      opcional; vão livre relevante
```

`structural_span` aparece apenas onde o vão é definidor: `midrise_apartment`, `urban_mixed_block`, `small_school`, `small_workshop` e `small_warehouse`.

### 6.4 `slots`

Categorias de componente do BDB-001 seção 5, por código de três letras:

```text
FND  fundação          BAL  varandas
STR  estrutura         VCR  circulação vertical
WAL  paredes           HCR  circulação horizontal
FAC  fachada           CLM  proteção climática
ROF  cobertura         BND  limites do lote
DOR  portas            PRK  estacionamento
WIN  janelas           SGN  sinalização
ORN  ornamentação      TEC  equipamentos técnicos
```

Regra de particionamento: **os dezesseis códigos devem estar classificados** em `required`, `optional` ou `forbidden`, sem sobreposição. Isso impede que uma ficha simplesmente esqueça uma categoria.

Exemplos que provam que o contrato não é específico para casas:

| Ficha | Slot notável | Motivo |
|---|---|---|
| `street_shop` | `SGN` obrigatório | Uma loja sem identificação não é uma loja |
| `roadside_business` | `PRK` obrigatório | O acesso do público é veicular |
| `small_school` | `BND` obrigatório | Perímetro controlado faz parte do programa |
| `small_clinic` | `TEC` obrigatório | Depende de infraestrutura técnica própria |
| `small_warehouse` | `WIN` **opcional** | Galpão de armazenagem pode não ter janelas |
| `small_warehouse` | `ORN` proibido | Ornamentação descaracteriza o tipo |
| `walkup_apartment` | `VCR` obrigatório | Unidades empilhadas exigem circulação coletiva |

Note que `WIN` é obrigatório para toda ficha residencial e opcional para as industriais. Um schema desenhado só para casas não teria essa distinção.

### 6.5 `lot_relationship`

```text
requires_independent_lot_access
requires_corner_lot            opcional
street_frontages               faixa
lot_types                      BDB-001 secao 6.1
lot_positions                  BDB-001 secao 6.2
street_relations               BDB-001 secao 6.4
setbacks.front / side / rear   BDB-001 secao 6.3
lot_coverage                   faixa normalizada
external_spaces                BDB-001 secao 6.5
required_external_spaces       opcional
```

`required_external_spaces` só aparece quando o espaço externo é condição do tipo:

```text
roadside_business  → parking_lot
small_school       → playground
small_warehouse    → loading_area
```

### 6.6 `context_compatibility`

Contém **apenas** compatibilidade morfológica e funcional:

```text
densities            obrigatório
tech_levels          obrigatório
development_stages   opcional
notes                justificativa em prosa
```

Clima, cultura e riqueza são deliberadamente ausentes, conforme a seção 5.

### 6.7 `transformations`

Usa a lista de doze transformações do BDB-001, Regra 6.

```json
{
  "allowed": ["vertical_extension", "rear_extension"],
  "forbidden": ["merging"],
  "limits": { "max_floor_count_after_extension": 4 }
}
```

`allowed` e `forbidden` são disjuntos. `limits` é aberto e serve para condições específicas do tipo, por exemplo:

```text
side_extension_blocked_by_party_walls
ground_floor_must_remain_public
loading_area_must_remain
clear_span_must_remain
parking_area_must_remain
```

### 6.8 `archetype_escalation`

Torna a rejeição construtiva:

```json
{
  "condition": "morphology.floor_count > 4",
  "suggested_archetype": "BLD_RES_APARTMENT_WALKUP",
  "note": "Altura acima do limite deixa de descrever uma casa unifamiliar isolada."
}
```

Em vez de apenas recusar, a ficha indica qual tipo descreve melhor o resultado.

---

## 7. Grafo de escalonamento

Dos dezoito alvos citados pelas quatorze fichas, dez resolvem dentro desta entrega:

```text
detached_house      → walkup_apartment, attached_house
attached_house      → detached_house, walkup_apartment, shop_house
rural_house         → detached_house
walkup_apartment    → midrise_apartment, attached_house, urban_mixed_block
midrise_apartment   → walkup_apartment, urban_mixed_block
street_shop         → shop_house, corner_shop, roadside_business
corner_shop         → street_shop, shop_house
roadside_business   → street_shop
shop_house          → urban_mixed_block, attached_house, street_shop
urban_mixed_block   → shop_house, midrise_apartment
small_workshop      → warehouse_small, street_shop
small_warehouse     → street_shop
```

Oito alvos são **referências futuras** deliberadas, para arquétipos ainda não escritos:

```text
BLD_RES_TOWER                 ← midrise_apartment
BLD_MIX_TOWER                 ← urban_mixed_block
BLD_AGR_FARMHOUSE             ← rural_house
BLD_INS_UNIVERSITY_BUILDING   ← small_school
BLD_CIV_COMMUNITY_CENTER      ← small_school
BLD_INS_HOSPITAL              ← small_clinic
BLD_COM_OFFICE_HOUSE          ← small_clinic
BLD_IND_DISTRIBUTION_CENTER   ← small_warehouse
```

Todos constam da lista de arquétipos do BDB-001 seção 8. Um validador deve tratar alvo não resolvido como **aviso**, não como erro, enquanto a biblioteca estiver incompleta.

---

## 8. Como o BDB-002 consome o arquétipo

O pipeline do BDB-002 seção 7 já reservava o passo 5, *preservar invariantes*. O BDB-003 é o que torna esse passo executável.

```text
1. carregar arquétipo            ← ficha do BDB-003
2. carregar lote e contexto
3. resolver herança espacial
4. validar enums e intervalos
5. preservar invariantes         ← invariants[] e identity
6..12. aplicar modificadores     ← restrito por allowed / min / max
13. resolver conflitos           ← archetype_escalation
...
```

Correspondência entre operações do BDB-002 e níveis do BDB-003:

| Operação BDB-002 | Pode tocar | Não pode tocar |
|---|---|---|
| `require` | slots `optional` | slots `forbidden` |
| `forbid` | slots `optional` | slots `required` |
| `weight_multiplier` | qualquer `preferred` | qualquer invariante |
| `range_shift` | dentro de `min`/`max` | além de `min`/`max` |
| `clamp_range` | subfaixa de `min`/`max` | faixa vazia |
| `set_default` | onde não há preferência | `identity` |
| `add_tag` / `remove_tag` | tags de candidato | `invariants` |

Quando um `range_shift` empurraria um valor além de `max`, aplica-se `CONFLICT_EMPTY_RANGE` do BDB-002 seção 9.3 ou o escalonamento da ficha, o que for declarado primeiro por prioridade.

---

## 9. Arquétipos entregues

Quatorze fichas, correspondentes exatamente ao conjunto de protótipo do BDB-001 seção 15.

### 9.1 Residenciais

| Ficha | `archetype_id` | Traço definidor |
|---|---|---|
| `detached_house` | `BLD_RES_HOUSE_DETACHED` | Sem parede compartilhada, unidade única |
| `attached_house` | `BLD_RES_HOUSE_ATTACHED` | Parede compartilhada, porta própria para a rua |
| `rural_house` | `BLD_RES_HOUSE_RURAL` | Isolada, taxa de ocupação baixa |
| `walkup_apartment` | `BLD_RES_APARTMENT_WALKUP` | Unidades empilhadas servidas por escada |
| `midrise_apartment` | `BLD_RES_APARTMENT_MIDRISE` | Unidades empilhadas com circulação mecanizada |

### 9.2 Comerciais

| Ficha | `archetype_id` | Traço definidor |
|---|---|---|
| `street_shop` | `BLD_COM_STREET_SHOP` | Térreo público em fachada contínua |
| `corner_shop` | `BLD_COM_CORNER_SHOP` | Lote de esquina, duas testadas ativas |
| `roadside_business` | `BLD_COM_ROADSIDE_BUSINESS` | Acesso veicular com recuo de manobra |

### 9.3 Uso misto

| Ficha | `archetype_id` | Traço definidor |
|---|---|---|
| `shop_house` | `BLD_MIX_SHOP_HOUSE` | Comércio no térreo, moradia acima |
| `urban_mixed_block` | `BLD_MIX_URBAN_BLOCK` | Base ativa e pavimentos superiores |

### 9.4 Institucionais

| Ficha | `archetype_id` | Traço definidor |
|---|---|---|
| `small_school` | `BLD_INS_SCHOOL_SMALL` | Circulação coletiva, perímetro e pátio |
| `small_clinic` | `BLD_INS_CLINIC_SMALL` | Acesso sem barreiras e apoio técnico |

### 9.5 Industriais

| Ficha | `archetype_id` | Traço definidor |
|---|---|---|
| `small_workshop` | `BLD_IND_WORKSHOP_SMALL` | Vão livre e abertura de carga |
| `small_warehouse` | `BLD_IND_WAREHOUSE_SMALL` | Vão amplo, sem térreo público |

### 9.6 Por que estes catorze

Cinco residenciais garantem que a família mais detalhada seja coberta. Os outros nove existem para **provar que o contrato não foi desenhado para casas**: exigem sinalização, estacionamento, perímetro, área de carga e circulação coletiva, e tornam janela opcional onde ela não é definidora.

---

## 10. Validação executada

Além do JSON Schema, foram verificadas condições que o schema sozinho não expressa.

| Verificação | Resultado |
|---|---|
| `archetype.schema.json` é JSON Schema 2020-12 válido | ✅ |
| 14 fichas contra o schema | ✅ 0 erros |
| `archetype_id` único e presente no BDB-001 seção 15 | ✅ 14/14 |
| Vocabulário contra os blocos do BDB-001 | ✅ 0 termos fora |
| `preferred` ⊆ `allowed` em todo `choice_set` | ✅ |
| `preferred` contido em `[min, max]` em toda faixa | ✅ |
| Slots: partição disjunta e cobertura dos 16 códigos | ✅ |
| `transformations.allowed` ∩ `forbidden` = ∅ | ✅ |
| `unit_stacking: required` implica `VCR` obrigatório | ✅ |
| `requires_corner_lot` implica `street_frontages.min ≥ 2` | ✅ |
| `vertical_use_stack` presente se e somente se `mixed_use` | ✅ |
| `required_external_spaces` ⊆ `external_spaces.allowed` | ✅ |
| Ausência de campos de clima, cultura, riqueza e material | ✅ |
| Todas as fichas em `status: hypothesis` | ✅ 14/14 |

Os vocabulários conferidos contra o BDB-001 foram: tipologia volumétrica, forma de planta, classes de altura, complexidade, simetria, tipo de lote, posição no lote, relação com a rua, classes de recuo, espaços externos, densidade, estágio de desenvolvimento, tecnologia construtiva e transformações.

---

## 11. Critérios de aceitação do BDB-003

O documento será considerado validado quando uma implementação conseguir:

1. carregar as quatorze fichas e rejeitar ficha fora do schema;
2. distinguir invariante, restrição e preferência ao aplicar modificadores;
3. recusar um modificador que viole invariante;
4. aceitar um modificador que apenas desloque preferência;
5. detectar faixa vazia após `range_shift` e `clamp_range`;
6. acionar `archetype_escalation` em vez de gerar híbrido;
7. aplicar os dois contextos do BDB-002 ao mesmo arquétipo;
8. manter o arquétipo reconhecível nos dois resultados;
9. registrar qual invariante bloqueou cada tentativa;
10. produzir resultado determinístico a partir da seed.

Os critérios 7 e 8 reutilizam diretamente `08_VALIDATION/bdb-002/`, com `BLD_RES_HOUSE_DETACHED` como caso de referência.

---

## 12. Limites desta versão

Esta versão ainda não define:

- interpretador para o campo `test`;
- fichas para os oito arquétipos citados como referência futura;
- os demais arquétipos das seções 8.6 a 8.10 do BDB-001;
- programa interno, cômodos ou áreas mínimas;
- variantes funcionais dentro de cada arquétipo;
- pesos de spawn por bairro;
- geometria concreta ou malhas;
- relação entre arquétipo e módulos físicos, que pertence ao BDB-005.

---

## 13. Arquivos entregues nesta versão

```text
00_CORE/schemas/
└── archetype.schema.json

01_ARCHETYPES/
├── BDB-003_ARQUETIPOS_UNIVERSAIS.md
├── residential/
│   ├── detached_house.json
│   ├── attached_house.json
│   ├── rural_house.json
│   ├── walkup_apartment.json
│   └── midrise_apartment.json
├── commercial/
│   ├── street_shop.json
│   ├── corner_shop.json
│   └── roadside_business.json
├── mixed_use/
│   ├── shop_house.json
│   └── urban_mixed_block.json
├── institutional/
│   ├── small_school.json
│   └── small_clinic.json
└── industrial/
    ├── small_workshop.json
    └── small_warehouse.json
```

---

## 14. Próximo documento

```text
BDB-004 — Sistema de DNA Arquitetônico
```

Com BDB-001, BDB-002 e BDB-003 concluídos, o BDB-004 poderá finalmente dizer:

```text
Pegue este arquétipo e transforme-o de acordo com este contexto.
```

Ou seja, o DNA é o resultado do cruzamento:

```text
arquétipo (BDB-003)  +  contexto (BDB-002)  =  DNA (BDB-004)
```

Essa será a primeira etapa em que a biblioteca produzirá, conceitualmente, edifícios concretos.

A pesquisa arquitetônica regional aprofundada — Recife, Tóquio, Marrakech, Estocolmo, Chicago — permanece adiada para o BDB-006 e o BDB-007. Preencher a biblioteca com arquitetura mundial antes de fechar a cadeia geradora produziria dados sem motor que os consuma.
