# BDB-002 — Sistema de Modificadores Ambientais e Urbanos

**Projeto:** Buildings Design Bible
**Versão:** 0.1
**Status:** 🟡 Especificação concluída; requer validação por implementação
**Dependência:** `BDB-001_TAXONOMIA_UNIVERSAL.md`
**Função:** Converter contexto geográfico, climático, urbano, econômico, tecnológico e cultural em regras reproduzíveis para seleção e transformação de edifícios.

---

## 1. Objetivo

O BDB-001 definiu **o que um edifício pode conter**. O BDB-002 define **como o contexto altera as probabilidades, limites e requisitos desses componentes**.

O sistema de modificadores deverá:

1. receber um perfil de contexto;
2. combinar informações de região, cidade, bairro e lote;
3. filtrar combinações impossíveis ou proibidas;
4. alterar pesos de seleção dos módulos compatíveis;
5. deslocar intervalos de dimensões e propriedades;
6. adicionar requisitos e tags;
7. preservar invariantes do arquétipo;
8. gerar o mesmo resultado quando utilizada a mesma seed;
9. registrar por que cada decisão foi tomada;
10. permitir revisão das regras sem refazer os modelos.

Este documento não pretende declarar regras arquitetônicas universais e imutáveis. Os valores iniciais são **heurísticas de jogo**, que deverão ser substituídas ou calibradas por pesquisa e testes visuais.

---

## 2. Decisões normativas

### 2.1 O contexto não cria o arquétipo

O gerador escolhe ou recebe primeiro um arquétipo, por exemplo:

```text
detached_house
corner_shop
walkup_apartment
warehouse
school
```

Os modificadores adaptam esse arquétipo. Eles não podem transformar silenciosamente uma `detached_house` em uma `residential_tower`.

Mudanças de arquétipo deverão ocorrer em uma etapa explícita de seleção urbana ou evolução histórica.

### 2.2 Restrições duras vencem preferências

Uma regra de segurança, implantação ou compatibilidade estrutural não poderá ser anulada por uma preferência estética.

Exemplo:

```text
FORBID roof_module_X em snow_load elevado
```

deve vencer:

```text
MULTIPLY_WEIGHT roof_module_X por preferência cultural
```

### 2.3 Cultura altera distribuição, não exclusividade

Uma matriz cultural deve modificar probabilidades, composição, ornamentação e relações com o espaço, mas não declarar que um componente pertence exclusivamente a um povo ou país.

### 2.4 Riqueza não representa qualidade estética

O modificador `wealth` pode alterar área, custo, acabamento, manutenção, segurança e disponibilidade tecnológica. Ele não deve definir beleza, valor histórico ou relevância cultural.

### 2.5 Conservação é independente de riqueza

Um edifício de baixo custo pode estar muito bem conservado. Um edifício de alto custo pode estar degradado, abandonado ou inacabado.

### 2.6 Toda geração deve ser explicável

O resultado precisa armazenar uma trilha de decisão:

```text
componente selecionado
peso-base
regras aplicadas
peso final
regras rejeitadas
seed
```

Isso permitirá depuração, balanceamento e auditoria visual.

---

## 3. Vocabulário do sistema

### 3.1 Contexto

Conjunto de condições que descreve um local e um momento.

### 3.2 Domínio

Família de modificadores:

```text
climate
topography
hydrography
environmental_risk
density
wealth
infrastructure
development
construction_period
tech_level
cultural_matrix
maintenance
```

### 3.3 Perfil

Arquivo que descreve um contexto completo ou uma regra reutilizável de um domínio.

### 3.4 Candidato

Módulo, material, parâmetro ou receita que está sendo avaliado pelo gerador.

### 3.5 Regra

Operação aplicada a um candidato quando determinadas condições são atendidas.

### 3.6 Invariante

Propriedade que o contexto não pode alterar sem trocar o arquétipo.

Exemplos:

- uso principal;
- família volumétrica essencial;
- limites estruturais do módulo;
- conexões obrigatórias;
- acessos funcionais mínimos.

### 3.7 Peso

Valor relativo utilizado para sorteio ponderado entre candidatos válidos.

### 3.8 Intensidade

Força de presença de uma condição no contexto, normalizada entre `0.0` e `1.0`.

---

## 4. Hierarquia espacial do contexto

O mundo utilizará perfis sobrepostos:

```text
GLOBAL
└── REGION
    └── CITY
        └── DISTRICT
            └── BLOCK
                └── LOT
                    └── BUILDING_EXCEPTION
```

### 4.1 Função de cada nível

| Nível | Responsabilidade |
|---|---|
| Global | convenções do jogo e defaults |
| Region | clima amplo, matriz cultural, período dominante |
| City | densidade, infraestrutura, economia urbana |
| District | uso, riqueza local, morfologia, conservação |
| Block | alinhamentos, continuidade de fachadas, acessos |
| Lot | topografia local, dimensão, água, orientação |
| Building exception | edifícios únicos, históricos ou deliberadamente atípicos |

### 4.2 Regras de herança

1. Valores escalares usam o valor mais local explicitamente definido.
2. Tags são unidas e deduplicadas.
3. Riscos são acumulados, salvo substituição explícita.
4. Regras usam a soma dos perfis aplicáveis.
5. `forbid` e `require` nunca são apagados por herança implícita.
6. Um override explícito deve registrar justificativa.
7. Campos ausentes herdam; `null` significa remoção deliberada apenas onde o schema permitir.

### 4.3 Exemplo

```json
{
  "region": {
    "climate": "tropical_humid",
    "cultural_family": "latin_american"
  },
  "city": {
    "density": "urban_high",
    "infrastructure": "standard"
  },
  "district": {
    "wealth": 3,
    "development": "established"
  },
  "lot": {
    "topography": "flat",
    "hydrography": "floodplain"
  }
}
```

O perfil final resulta da resolução desses níveis antes da seleção de componentes.

---

## 5. Modelo universal de regra

Cada regra deve possuir:

```json
{
  "rule_id": "CLM_TROP_HUM_ROOF_OVERHANG_001",
  "target": "components.roof.roof_overhang",
  "operation": "range_shift",
  "match": {
    "context.climate.primary": ["tropical_humid"]
  },
  "selector": {
    "candidate_tags_any": ["roof"]
  },
  "value": {
    "min_delta": 0.15,
    "max_delta": 0.30
  },
  "strength": 0.8,
  "priority": 60,
  "confidence": "hypothesis",
  "rationale": "Heurística inicial para proteção de fachadas e aberturas."
}
```

### 5.1 Operações permitidas

```text
require
forbid
weight_multiplier
range_shift
set_default
clamp_range
add_tag
remove_tag
set_cost_multiplier
emit_warning
```

#### `require`

Exige componente, propriedade ou tag.

#### `forbid`

Remove o candidato antes do sorteio.

#### `weight_multiplier`

Multiplica o peso relativo de candidatos compatíveis.

Faixa recomendada:

```text
0.25 — forte desestímulo
0.50 — desestímulo
0.80 — leve desestímulo
1.00 — neutro
1.25 — leve preferência
1.50 — preferência
2.00 — forte preferência
3.00 — excepcional
```

Valores acima de `3.00` exigem justificativa.

#### `range_shift`

Desloca um intervalo sem fixar um valor.

Exemplo:

```text
opening_ratio [0.20, 0.40]
+ delta [0.10, 0.15]
= [0.30, 0.55]
```

#### `set_default`

Define valor apenas quando nenhuma camada anterior escolheu um valor.

#### `clamp_range`

Impõe mínimo e máximo finais.

#### `add_tag` e `remove_tag`

Alteram a semântica usada por regras posteriores.

#### `set_cost_multiplier`

Altera o custo de produção ou manutenção, não a probabilidade diretamente.

#### `emit_warning`

Permite combinações raras, mas registra que exigem inspeção.

---

## 6. Prioridades

As prioridades são avaliadas do maior para o menor impacto lógico, não pela ordem dos arquivos.

| Faixa | Classe | Exemplos |
|---:|---|---|
| 90–100 | invariantes e segurança | encaixe estrutural, acesso obrigatório |
| 80–89 | risco e implantação | enchente, declive, incêndio |
| 70–79 | clima severo | neve, vento extremo, calor extremo |
| 60–69 | clima e desempenho | drenagem, sombra, ventilação |
| 50–59 | morfologia urbana | recuos, geminação, altura |
| 40–49 | tecnologia e infraestrutura | disponibilidade de sistemas |
| 30–39 | período e matriz cultural | composição e distribuição |
| 20–29 | riqueza e manutenção | acabamento, tamanho, equipamentos |
| 10–19 | variedade estética | cor, ornamentação menor |
| 1–9 | ruído controlado | exceções visuais de baixa influência |

Em empate:

1. vence a regra mais local;
2. depois, a de maior `strength`;
3. depois, a de maior confiança;
4. por fim, ordem estável por `rule_id`.

---

## 7. Pipeline de aplicação

```text
1. carregar arquétipo
2. carregar lote e contexto
3. resolver herança espacial
4. validar enums e intervalos
5. preservar invariantes
6. aplicar terreno, hidrografia e riscos
7. aplicar clima
8. aplicar densidade e morfologia urbana
9. aplicar infraestrutura e desenvolvimento
10. aplicar período e tecnologia
11. aplicar matriz cultural
12. aplicar riqueza e manutenção
13. resolver conflitos
14. normalizar pesos
15. sortear com seed
16. validar encaixes
17. registrar trilha de decisão
18. salvar edifício gerado
```

A ordem separa:

- **o que é possível**;
- **o que é adequado**;
- **o que é provável**;
- **o que é apenas variação**.

---

## 8. Cálculo de pesos

Cada candidato começa com:

```text
base_weight > 0
```

Para todas as regras de peso aplicáveis:

```text
effective_multiplier =
1 + ((rule_multiplier - 1) × rule_strength × context_intensity)
```

O peso final é:

```text
final_weight =
base_weight × produto(effective_multiplier)
```

Depois:

```text
normalized_probability =
final_weight / soma(final_weight dos candidatos válidos)
```

### 8.1 Exemplo

```text
base_weight = 1.00
preferência climática = 1.50
strength = 0.80
intensity = 0.75

effective_multiplier =
1 + ((1.50 - 1) × 0.80 × 0.75)
= 1.30
```

O candidato passa de `1.00` para `1.30`.

### 8.2 Proteções

- Peso final não pode ser negativo.
- Candidato proibido possui peso `0`.
- Candidato requerido deve entrar antes do sorteio.
- Multiplicadores acumulados devem ser limitados por domínio.
- O limite inicial recomendado é `0.05` a `8.00`.
- O gerador deve avisar quando apenas um candidato permanecer válido.

---

## 9. Resolução de conflitos

### 9.1 `require` versus `forbid`

`forbid` vence, salvo override explícito de prioridade superior e com justificativa.

### 9.2 Duas regras `require` incompatíveis

A geração falha de forma controlada e registra:

```text
CONFLICT_REQUIRED_COMPONENTS
```

Não deve escolher uma silenciosamente.

### 9.3 Intervalos sem interseção

Exemplo:

```text
regra A: altura mínima = 4
regra B: altura máxima = 3
```

Resultado:

```text
CONFLICT_EMPTY_RANGE
```

O gerador tenta, nesta ordem:

1. retornar ao último estado válido;
2. escolher receita alternativa do mesmo arquétipo;
3. emitir falha de geração;
4. nunca inventar valor fora dos limites.

### 9.4 Cultura versus clima

Clima e risco possuem prioridade superior. A matriz cultural pode escolher entre alternativas climaticamente compatíveis, mas não tornar válido um módulo proibido por risco.

### 9.5 Riqueza versus infraestrutura

Riqueza individual não cria automaticamente redes urbanas inexistentes.

Exemplo:

```text
wealth = 6
infrastructure = minimal
```

pode gerar soluções privadas:

- reservatório;
- gerador;
- fossa;
- acesso próprio;

mas não deve inserir uma rede pública avançada no bairro.

### 9.6 Período versus renovação

O período de construção define a base. Uma camada de renovação pode substituir partes sem apagar a idade do edifício.

---

## 10. Domínio: clima

Enums herdados do BDB-001:

```text
equatorial
tropical_humid
tropical_seasonal
arid_hot
semi_arid
mediterranean
subtropical
temperate_oceanic
temperate_continental
cold_continental
subarctic
polar
highland
```

### 10.1 Parâmetros climáticos normalizados

Além do enum, o contexto pode informar:

```text
heat
cold
humidity
rainfall
rainfall_seasonality
snow_load
wind_exposure
solar_exposure
salt_air_exposure
freeze_thaw
```

Todos entre `0.0` e `1.0`.

O enum serve como preset. Os parâmetros permitem representar microclimas e casos híbridos.

### 10.2 Alvos principais

```text
roof_pitch
roof_overhang
roof_material
drainage_system
opening_ratio
window_type
shading
ventilation
wall_thickness
thermal_mass
insulation
foundation_height
material_weathering
technical_equipment
```

### 10.3 Regras de projeto

- Clima modifica adequação, não identidade cultural.
- Parâmetros explícitos vencem médias do preset.
- Condições extremas podem gerar `require` ou `forbid`.
- Condições ordinárias devem preferir `weight_multiplier` e `range_shift`.
- Um perfil climático não deve escolher cor ou ornamento cultural sem regra separada.

---

## 11. Domínio: topografia

Enums:

```text
flat
gently_rolling
hilly
steep
mountainous
valley
plateau
cliff
dune
```

### 11.1 Parâmetros

```text
slope
slope_direction
elevation
terrain_stability
excavation_difficulty
soil_drainage
```

### 11.2 Efeitos

```text
foundation_type
retaining_wall
stilt_probability
stepped_volume
access_stairs
ramp_feasibility
lot_coverage
parking_access
building_orientation
construction_cost
```

### 11.3 Regras

- `slope` elevado reduz compatibilidade de grandes placas contínuas.
- Terreno instável pode proibir fundações ou alturas específicas.
- A solução deve registrar adaptação ao terreno.
- A topografia do lote vence a classificação média da cidade.

---

## 12. Domínio: hidrografia

Enums:

```text
dry
seasonal_stream
river
lake
lagoon
wetland
canal
estuary
coast
floodplain
```

### 12.1 Parâmetros

```text
water_distance
flood_frequency
flood_depth
groundwater_level
bank_erosion
salt_air_exposure
```

### 12.2 Efeitos

```text
foundation_height
stilts
ground_floor_use
material_durability
drainage
access_route
setback_from_water
service_location
```

A presença de água não significa automaticamente risco elevado. Risco deve ser declarado separadamente ou derivado de parâmetros mensuráveis.

---

## 13. Domínio: risco ambiental

Enums:

```text
flood
storm
hurricane
earthquake
wildfire
landslide
extreme_heat
extreme_cold
volcanic
coastal_erosion
```

Cada risco possui:

```text
type
intensity
frequency
confidence
```

### 13.1 Efeitos possíveis

```text
require reinforcement
forbid vulnerable materials
limit floor count
increase setback
require escape route
require elevated equipment
increase maintenance
alter roof geometry
reduce ornament projection
```

Risco é uma camada de compatibilidade e segurança. Não deve ser usado como simples estética.

---

## 14. Domínio: densidade

Enums:

```text
isolated
rural_sparse
rural_clustered
suburban_low
urban_low
urban_medium
urban_high
metropolitan
hyperdense
```

### 14.1 Parâmetros

```text
target_floor_area_ratio
target_lot_coverage
street_wall_continuity
average_frontage
average_setback
height_pressure
mixed_use_pressure
parking_pressure
```

### 14.2 Efeitos

```text
floor_count
lot_width
lot_depth
setbacks
attached_probability
front_alignment
mixed_use_probability
courtyard_probability
parking_type
vertical_circulation
```

### 14.3 Princípio

Densidade deve controlar principalmente morfologia urbana. Ela não deve determinar sozinha riqueza, conservação ou qualidade de infraestrutura.

---

## 15. Domínio: riqueza

Escala herdada:

```text
0 — extreme_deprivation
1 — low_income
2 — lower_middle
3 — middle_income
4 — upper_middle
5 — affluent
6 — elite
```

### 15.1 Efeitos permitidos

```text
lot_area_range
built_area_range
material_availability
finish_complexity
equipment_count
security_level
landscaping
private_infrastructure
maintenance_budget
extension_probability
customization_probability
```

### 15.2 Efeitos proibidos

Riqueza não pode determinar diretamente:

```text
cultural_value
historical_value
beauty
cleanliness
morality
social importance
```

### 15.3 Escalas complementares

Para evitar simplificações, um contexto poderá possuir:

```text
wealth_level
income_stability
construction_budget
maintenance_capacity
land_value
informality_pressure
```

---

## 16. Domínio: infraestrutura

Enums:

```text
minimal
basic
partial
standard
advanced
smart
degraded
```

### 16.1 Subsistemas

```text
electricity
water_supply
sewerage
stormwater
roads
sidewalks
public_lighting
telecommunications
waste_collection
public_transport
emergency_access
```

Cada subsistema pode possuir nível próprio.

### 16.2 Efeitos

```text
water_tank
generator
external_wiring
external_piping
septic_system
air_conditioning
solar_panel
utility_meter
waste_storage
driveway
service_access
```

O enum geral é um resumo. Subsistemas explícitos vencem o resumo.

---

## 17. Domínio: desenvolvimento urbano

Enums:

```text
informal
emerging
consolidating
established
modernized
advanced
declining
post_industrial
```

### 17.1 Efeitos

```text
street_regularization
lot_regularization
construction_completion
adaptive_reuse
vacancy
renovation
informal_extension
industrial_conversion
public_realm_quality
code_enforcement
```

`development` descreve o estado do tecido urbano, não o valor das pessoas que vivem nele.

---

## 18. Domínio: período de construção

Enums:

```text
pre_industrial
early_industrial
late_industrial
early_modern
mid_modern
late_modern
contemporary
near_future
```

### 18.1 Efeitos

```text
available_structure_systems
available_materials
opening_span
mechanical_equipment
facade_composition
construction_precision
standardization
ornament_distribution
```

O período base deve ser preservado mesmo quando o edifício recebe reformas.

---

## 19. Domínio: tecnologia construtiva

Enums:

```text
vernacular
craft
early_industrial
industrial
mass_produced
prefabricated
digital_fabrication
advanced
```

### 19.1 Efeitos

```text
module_size
span_range
height_limit
precision
repetition
customization
assembly_speed
material_palette
connection_type
```

Tecnologia e período são relacionados, mas não equivalentes. Técnicas vernaculares podem coexistir com períodos contemporâneos.

---

## 20. Domínio: matriz cultural

Campos:

```text
cultural_family
regional_variant
local_tradition
colonial_influence
religious_influence
migration_influence
globalized_influence
```

### 20.1 Estrutura de influência

Cada influência deve possuir:

```json
{
  "id": "example_influence",
  "weight": 0.35,
  "confidence": "hypothesis"
}
```

A soma não precisa ser `1.0`. Pesos representam força relativa, não composição genética ou demográfica.

### 20.2 Efeitos permitidos

```text
facade_rhythm
roof_distribution
courtyard_probability
street_relation
boundary_type
balcony_type
ornament_vocabulary
color_palette_tags
signage_patterns
craft_materials
spatial_customs
```

### 20.3 Salvaguardas

- Evitar uma receita única por país.
- Separar edifício tradicional, contemporâneo e excepcional.
- Registrar período e classe de uso.
- Evitar transformar símbolos religiosos ou culturais em decoração aleatória.
- Exigir pesquisa antes de marcar regra como `researched`.
- Permitir mistura, migração, globalização e reconstrução histórica.

---

## 21. Domínio: manutenção e transformação

Estados do BDB-001:

```text
new
well_maintained
used
weathered
neglected
damaged
ruined
```

### 21.1 Parâmetros separados

```text
maintenance_level
construction_completion
renovation_level
damage_level
weathering_level
informal_addition_level
vacancy_level
```

### 21.2 Transformações

```text
vertical_extension
rear_extension
side_extension
garage_conversion
commercial_conversion
facade_renovation
informal_annex
roof_replacement
window_replacement
subdivision
merging
abandonment
```

Transformações devem gerar histórico, não apenas substituir o estado final.

---

## 22. Perfil de contexto

O arquivo de contexto completo usa:

```text
00_CORE/schemas/context-profile.schema.json
```

Campos mínimos:

```json
{
  "schema_version": "0.1",
  "context_id": "CTX_TEST_001",
  "display_name": "Test Context",
  "seed": 1001,
  "scope": "lot",
  "climate": {
    "primary": "tropical_humid",
    "intensity": 0.85
  },
  "topography": {
    "type": "flat",
    "intensity": 0.9
  },
  "hydrography": {
    "type": "coast",
    "intensity": 0.5
  },
  "urban": {
    "density": "urban_high",
    "development": "established",
    "infrastructure": "standard"
  },
  "society": {
    "wealth_level": 3,
    "maintenance_capacity": 0.7
  },
  "temporal": {
    "construction_period": "contemporary",
    "tech_level": "mass_produced"
  },
  "cultural_matrix": {
    "cultural_family": "latin_american",
    "regional_variant": "neutral_test_fixture",
    "globalized_influence": 0.4
  }
}
```

### 22.1 Extensão para contextos localizados

O BDB-007 acrescenta dois campos opcionais ao mesmo contrato:

```text
geography
data_provenance
```

Eles permanecem opcionais para fixtures neutros. Porém, qualquer âncora de contexto real referenciada por uma receita regional deve declarar ambos. Contextos descendentes podem herdá-los pela cadeia validada de `parent_context_id`.

`geography` usa códigos estáveis de país, subdivisão e localidade. A chave local declara também `locality_code_system`, evitando colisão entre cadastros nacionais diferentes. `data_provenance.field_groups` separa campos sustentados por `evidence` de valores `normalized_hypothesis` usados apenas para completar um fixture.

Uma receita só pode consumir como base localizada os campos de geografia, clima amplo, período e tecnologia que possuam grupo de evidência. A presença de uma fonte não promove automaticamente os demais valores normalizados do perfil.

---

## 23. Perfil de modificador

Perfis reutilizáveis de domínio usam:

```text
00_CORE/schemas/modifier-profile.schema.json
```

Exemplos iniciais:

```text
04_CONTEXT_MODIFIERS/climate/tropical_humid.json
04_CONTEXT_MODIFIERS/climate/semi_arid.json
```

### 23.1 Estado de confiança

```text
hypothesis
researched
validated
deprecated
```

#### `hypothesis`

Heurística criada para protótipo.

#### `researched`

Regra apoiada por fontes registradas.

#### `validated`

Regra testada visualmente ou por simulação e aprovada para produção.

#### `deprecated`

Mantida apenas para compatibilidade ou histórico.

Nenhuma regra deste primeiro pacote deve ser marcada como `validated`.

---

## 24. Determinismo

A seed deve ser derivada de:

```text
world_seed
region_id
city_id
district_id
block_id
lot_id
generation_version
```

Exemplo conceitual:

```text
building_seed =
HASH(world_seed + lot_id + archetype_id + generation_version)
```

Requisitos:

- mesma entrada e versão produzem mesma saída;
- alteração de interface não muda geração;
- mudança de regras incrementa `generation_version`;
- a seed salva deve permitir reconstrução do edifício;
- sorteios de subsistemas devem usar sub-seeds estáveis.

Exemplo:

```text
seed_roof
seed_facade
seed_materials
seed_weathering
```

---

## 25. Registro de decisão

Cada edifício gerado deverá possuir:

```json
{
  "generation_trace": {
    "generation_version": "0.1",
    "seed": 1001,
    "context_id": "CTX_TEST_001",
    "archetype_id": "BLD_RES_HOUSE_DETACHED",
    "selected": [
      {
        "slot": "roof",
        "candidate_id": "ROF_HIP_MEDIUM_001",
        "base_weight": 1.0,
        "final_weight": 1.42,
        "applied_rules": [
          "CLM_TROP_HUM_ROOF_FORM_001"
        ]
      }
    ],
    "warnings": []
  }
}
```

---

## 26. Estratégia de pesquisa futura

Cada regra pesquisada deverá registrar:

```text
source_id
source_type
geographic_scope
time_scope
building_scope
summary
limitations
reviewer
review_date
```

### 26.1 Classificação de fontes

```text
A — norma técnica, publicação acadêmica ou instituição especializada
B — levantamento arquitetônico, livro técnico ou documentação governamental
C — documentação profissional ou inventário local
D — referência visual verificada
E — hipótese de design ainda não pesquisada
```

Uma regra pode usar várias fontes. O nível final deve refletir a fonte mais forte que realmente sustenta a regra.

### 26.2 Evitar extrapolação

Uma regra observada em:

```text
habitação rural de uma região específica
```

não deve ser aplicada automaticamente a:

```text
todas as edificações do país
```

O escopo precisa ser codificado.

---

## 27. Casos de validação iniciais

### Caso 001

```text
Arquétipo: detached_house
Clima: tropical_humid
Densidade: urban_high
Riqueza: 3
Infraestrutura: standard
Topografia: flat
Hidrografia: coast
```

### Caso 002

```text
Arquétipo: detached_house
Clima: semi_arid
Densidade: urban_low
Riqueza: 1
Infraestrutura: basic
Topografia: gently_rolling
Hidrografia: dry
```

A matriz cultural de teste será mantida deliberadamente igual nos dois casos para que as diferenças principais venham dos demais modificadores.

Arquivos:

```text
08_VALIDATION/bdb-002/CASE-001_TROPICAL_URBAN_MIDDLE.json
08_VALIDATION/bdb-002/CASE-002_SEMIARID_LOW_DENSITY_LOW_INCOME.json
08_VALIDATION/bdb-002/EXPECTED_DIFFERENCES.md
```

---

## 28. Critérios de aceitação do BDB-002

O documento será considerado validado quando uma implementação conseguir:

1. carregar um perfil de contexto válido;
2. rejeitar enums inexistentes;
3. herdar contexto de ao menos três níveis;
4. aplicar `require`, `forbid` e `weight_multiplier`;
5. detectar intervalo vazio;
6. preservar invariantes do arquétipo;
7. gerar resultado determinístico;
8. produzir trilha de decisão;
9. aplicar dois contextos ao mesmo arquétipo;
10. mostrar diferenças coerentes entre os casos;
11. manter cultura e riqueza como sistemas independentes;
12. reconstruir o resultado a partir da seed e versão.

Até lá, o status permanece 🟡.

---

## 29. Arquivos entregues nesta versão

```text
00_CORE/schemas/
├── context-profile.schema.json
└── modifier-profile.schema.json

04_CONTEXT_MODIFIERS/
├── BDB-002_SISTEMA_MODIFICADORES.md
└── climate/
    ├── tropical_humid.json
    └── semi_arid.json

08_VALIDATION/bdb-002/
├── CASE-001_TROPICAL_URBAN_MIDDLE.json
├── CASE-002_SEMIARID_LOW_DENSITY_LOW_INCOME.json
└── EXPECTED_DIFFERENCES.md
```

---

## 30. Próximo documento

```text
BDB-003 — Arquétipos Universais de Edifícios
```

O BDB-003 deverá transformar a lista preliminar do BDB-001 em fichas normativas com:

```text
invariantes
slots obrigatórios
slots opcionais
faixas dimensionais
usos compatíveis
densidades compatíveis
regras de lote
variantes funcionais
limites de transformação
```

O primeiro arquétipo recomendado para implementação será:

```text
BLD_RES_HOUSE_DETACHED
```

Ele será usado para executar os casos de validação definidos neste documento.
