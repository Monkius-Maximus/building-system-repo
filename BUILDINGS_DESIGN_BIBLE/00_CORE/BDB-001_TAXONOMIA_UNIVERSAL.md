# BDB-001 — Taxonomia Universal de Edifícios

**Projeto:** Buildings Design Bible
**Versão:** 0.1
**Status:** 🟡 Estrutura-base concluída; requer validação por protótipo
**Função:** Definir a anatomia universal dos edifícios e a organização inicial da biblioteca modular.

---

## 1. Objetivo

Criar uma taxonomia universal capaz de representar edifícios de diferentes:

- regiões;
- culturas;
- climas;
- períodos históricos;
- classes econômicas;
- níveis de densidade;
- funções urbanas e rurais.

A taxonomia não descreve diretamente estilos como "brasileiro", "japonês" ou "mediterrâneo".

Ela descreve as partes, propriedades e relações que podem ser modificadas por regras regionais.

O sistema deve permitir:

1. criação manual de edifícios;
2. montagem procedural;
3. geração de variações;
4. armazenamento em arquivos estruturados;
5. reutilização de módulos;
6. associação entre arquitetura e contexto urbano;
7. expansão gradual da biblioteca.

---

## 2. Princípio estrutural

Todo edifício será representado pela combinação de cinco grupos de informação:

```
EDIFÍCIO
│
├── IDENTIDADE
├── FORMA E VOLUME
├── COMPONENTES ARQUITETÔNICOS
├── CONTEXTO E IMPLANTAÇÃO
└── MODIFICADORES
```

A identidade informa o que o edifício é.

A forma define sua massa principal.

Os componentes definem como ele é construído visualmente.

O contexto define como ele se relaciona com o lote e a cidade.

Os modificadores adaptam o edifício às condições locais.

---

## 3. Camada A — Identidade do edifício

### 3.1 Identificador

Todo edifício deve possuir um identificador único.

Formato recomendado:

```
BLD_[USO]_[ARQUÉTIPO]_[VARIANTE]_[NÚMERO]
```

Exemplos:

```
BLD_RES_HOUSE_DETACHED_001
BLD_RES_APARTMENT_MIDRISE_001
BLD_COM_CORNER_SHOP_001
BLD_IND_WAREHOUSE_LIGHT_001
BLD_CIV_SCHOOL_PRIMARY_001
```

### 3.2 Uso principal

Enumeração inicial:

```
RESIDENTIAL
COMMERCIAL
MIXED_USE
INDUSTRIAL
CIVIC
INSTITUTIONAL
RELIGIOUS
AGRICULTURAL
INFRASTRUCTURE
TRANSPORT
RECREATIONAL
HOSPITALITY
MILITARY
SPECIAL
```

Códigos resumidos:

```
RES — residencial
COM — comercial
MIX — uso misto
IND — industrial
CIV — cívico
INS — institucional
REL — religioso
AGR — agrícola
INF — infraestrutura
TRN — transporte
REC — recreativo
HOS — hospedagem
MIL — militar
SPC — especial
```

### 3.3 Subuso

Exemplos:

```
RESIDENTIAL
├── single_family
├── multifamily
├── collective_housing
├── temporary_housing
└── informal_housing

COMMERCIAL
├── retail
├── services
├── office
├── food
├── entertainment
└── market

INDUSTRIAL
├── workshop
├── warehouse
├── factory
├── processing
├── extraction
└── utility
```

### 3.4 Ocupação

Define quem utiliza o edifício.

```
private
shared
public
restricted
abandoned
seasonal
temporary
```

### 3.5 Estado operacional

```
planned
under_construction
active
renovated
adapted
damaged
abandoned
ruined
demolished
```

---

## 4. Camada B — Forma e volume

Esta camada define a massa tridimensional do edifício antes da aplicação de detalhes.

### 4.1 Tipologia de implantação volumétrica

```
detached
semi_detached
attached
row
courtyard
perimeter_block
tower
podium_tower
slab
pavilion
cluster
linear
terraced
compound
irregular
```

**Significados principais**

- **Detached:** edifício isolado no lote.
- **Semi-detached:** duas unidades conectadas.
- **Attached:** edifício conectado a vizinhos.
- **Row:** sequência de unidades semelhantes.
- **Courtyard:** volumes organizados ao redor de pátio.
- **Perimeter block:** edifício acompanha o perímetro da quadra.
- **Tower:** volume vertical concentrado.
- **Slab:** bloco alongado e relativamente estreito.
- **Pavilion:** volume baixo e isolado.
- **Cluster:** conjunto de volumes relacionados.
- **Terraced:** volumes escalonados segundo a topografia.
- **Compound:** conjunto fechado com múltiplos edifícios.

### 4.2 Forma da planta

```
rectangle
square
narrow_rectangle
wide_rectangle
L_shape
U_shape
T_shape
H_shape
cross_shape
courtyard
circular
polygonal
organic
irregular
modular_cluster
```

### 4.3 Altura

O edifício deve registrar:

```
floor_count
minimum_height
maximum_height
average_floor_height
roof_height
```

Classes simplificadas:

```
SINGLE_STOREY
LOW_RISE
MID_RISE
HIGH_RISE
TOWER
MEGASTRUCTURE
```

Faixas iniciais para o jogo:

```
single_storey = 1 pavimento
low_rise = 2–4 pavimentos
mid_rise = 5–10 pavimentos
high_rise = 11–25 pavimentos
tower = acima de 25 pavimentos
```

Essas faixas podem ser modificadas conforme a escala visual do jogo.

### 4.4 Proporções

```
width
depth
height
frontage_width
aspect_ratio
floor_to_floor_height
footprint_area
built_area
```

Os valores podem ser absolutos ou normalizados.

Exemplo normalizado:

```json
{
  "width_units": 4,
  "depth_units": 6,
  "floor_count": 2
}
```

### 4.5 Complexidade volumétrica

```
simple
composite
segmented
stepped
stacked
fragmented
organic
```

### 4.6 Simetria

```
symmetrical
approximately_symmetrical
asymmetrical
radial
modular_repetition
```

---

## 5. Camada C — Componentes arquitetônicos

Cada componente poderá utilizar módulos visuais intercambiáveis.

### 5.1 Fundação e contato com o solo

Código da categoria:

```
FND — FOUNDATION
```

Tipos:

```
slab_on_grade
raised_slab
crawl_space
basement
stilts
piers
stone_base
masonry_base
platform
floating
terrain_integrated
```

Propriedades:

```
foundation_height
foundation_material
terrain_adaptation
visible_foundation
flood_resistance
```

### 5.2 Estrutura

Código:

```
STR — STRUCTURE
```

Tipos:

```
load_bearing_masonry
timber_frame
heavy_timber
reinforced_concrete
steel_frame
light_steel_frame
earth_structure
stone_structure
bamboo_structure
mixed_structure
prefabricated_structure
modular_structure
```

A estrutura pode não ficar visível no modelo final, mas influencia:

- tamanho dos vãos;
- número de pavimentos;
- espessura das paredes;
- ritmo da fachada;
- condição tecnológica da região;
- estado de conservação.

### 5.3 Paredes e fechamentos

Código:

```
WAL — WALL
```

Propriedades:

```
wall_system
wall_thickness
base_material
surface_finish
secondary_finish
insulation_level
weathering
maintenance_level
```

Materiais-base:

```
earth
adobe
rammed_earth
stone
brick
concrete_block
reinforced_concrete
timber
metal_panel
glass
composite_panel
bamboo
recycled_material
mixed_material
```

Acabamentos:

```
exposed
plastered
painted
rendered
tiled
clad
boarded
corrugated
polished
rough
weathered
unfinished
```

### 5.4 Fachada

Código:

```
FAC — FACADE
```

A fachada deve ser tratada como sistema, não apenas como textura.

Propriedades:

```
facade_composition
bay_count
vertical_rhythm
horizontal_rhythm
base_body_crown
opening_ratio
solid_void_ratio
depth_variation
ornament_density
commercial_activation
```

Composições:

```
flat
layered
recessed
projected
arcaded
colonnaded
balconied
curtain_wall
screened
mixed
```

### 5.5 Cobertura

Código:

```
ROF — ROOF
```

Tipos principais:

```
flat
shed
gable
hip
half_hip
pyramid
mansard
gambrel
butterfly
sawtooth
vault
dome
conical
terraced
green_roof
mixed
irregular
```

Propriedades:

```
roof_type
roof_pitch
roof_material
roof_overhang
roof_complexity
roof_access
drainage_system
snow_adaptation
rain_adaptation
wind_adaptation
```

Elementos associados:

```
ridge
valley
eave
parapet
gutter
downspout
chimney
dormer
skylight
lantern
roof_terrace
solar_panel
water_tank
antenna
mechanical_unit
```

### 5.6 Portas

Código:

```
DOR — DOOR
```

Tipos:

```
single
double
sliding
folding
rolling_shutter
garage
arched
pivot
service
industrial
ceremonial
open_passage
```

Propriedades:

```
door_material
door_width
door_height
transparency
security_level
ornamentation
street_access
step_access
```

### 5.7 Janelas e aberturas

Código:

```
WIN — WINDOW
```

Tipos:

```
fixed
casement
awning
hopper
sliding
sash
louvered
pivot
bay
bow
clerestory
shopfront
curtain_wall
arched
screened_opening
shuttered
```

Propriedades:

```
window_ratio
window_spacing
window_frame_material
glass_type
shutter_type
sun_protection
security_grille
opening_depth
ventilation_capacity
```

### 5.8 Varandas, sacadas e galerias

Código:

```
BAL — BALCONY
```

Tipos:

```
balcony
veranda
porch
loggia
gallery
terrace
roof_terrace
external_corridor
service_balcony
juliet_balcony
```

Propriedades:

```
depth
width
coverage
support_type
railing_type
enclosure_level
street_orientation
```

### 5.9 Circulação vertical

Código:

```
VCR — VERTICAL_CIRCULATION
```

Tipos:

```
internal_stair
external_stair
spiral_stair
ramp
elevator
service_elevator
escalator
ladder
```

Propriedades:

```
public_access
private_access
external_visibility
accessibility
fire_escape
```

### 5.10 Circulação horizontal

Código:

```
HCR — HORIZONTAL_CIRCULATION
```

Tipos:

```
corridor
gallery
arcade
covered_walkway
open_walkway
atrium
passage
bridge
```

### 5.11 Proteção solar e climática

Código:

```
CLM — CLIMATE_CONTROL
```

Elementos:

```
eave
awning
canopy
brise_soleil
screen
shutter
pergola
arcade
double_skin
ventilation_block
courtyard
wind_tower
rain_screen
```

### 5.12 Cercas, muros e limites

Código:

```
BND — BOUNDARY
```

Tipos:

```
none
low_wall
high_wall
metal_fence
wood_fence
wire_fence
hedge
mixed_wall_fence
security_barrier
decorative_railing
temporary_fence
```

Propriedades:

```
height
transparency
security_level
material
gate_type
maintenance_level
```

### 5.13 Garagem e estacionamento

Código:

```
PRK — PARKING
```

Tipos:

```
none
street_access
front_driveway
side_driveway
attached_garage
detached_garage
carport
surface_parking
underground_parking
parking_structure
service_yard
```

### 5.14 Sinalização

Código:

```
SGN — SIGNAGE
```

Tipos:

```
none
painted
hanging
roof_sign
totem
neon
digital
banner
institutional
directional
informal
temporary
```

### 5.15 Ornamentação

Código:

```
ORN — ORNAMENT
```

Categorias:

```
structural
surface
geometric
floral
figurative
religious
political
commercial
craft_based
industrial
minimal
```

Elementos:

```
cornice
molding
column
pilaster
arch
frieze
mosaic
relief
carving
tile_panel
mural
decorative_screen
```

### 5.16 Equipamentos técnicos

Código:

```
TEC — TECHNICAL
```

Elementos:

```
water_tank
air_conditioner
solar_panel
satellite_dish
antenna
generator
transformer
ventilation_unit
fire_escape
external_piping
utility_meter
waste_container
```

Esses elementos são importantes para diferenciar:

- clima;
- infraestrutura;
- riqueza;
- idade;
- manutenção;
- desenvolvimento tecnológico.

### 5.17 Desgaste e transformação

Código:

```
AGE — AGE_AND_CONDITION
```

Propriedades:

```
construction_age
renovation_age
maintenance_level
dirt_level
fading
cracks
corrosion
biological_growth
water_damage
patchwork
graffiti
informal_additions
structural_damage
```

Estados visuais:

```
new
well_maintained
used
weathered
neglected
damaged
ruined
```

---

## 6. Camada D — Lote e implantação

Um edifício não deve existir isoladamente. Sua relação com o lote é parte essencial da identidade visual.

### 6.1 Tipo de lote

```
urban_regular
urban_narrow
urban_deep
urban_corner
urban_irregular
suburban
rural
industrial
waterfront
hillside
isolated
compound
informal
```

### 6.2 Posição no lote

```
front_aligned
front_setback
centered
rear_aligned
side_aligned
corner_aligned
occupies_full_lot
scattered
terrain_following
```

### 6.3 Recuos

```
front_setback
rear_setback
left_setback
right_setback
```

Classes simplificadas:

```
none
minimal
small
medium
large
```

### 6.4 Relação com a rua

```
direct_access
front_yard
front_wall
front_fence
arcade
shopfront
parking_front
raised_access
service_lane
pedestrian_only
internal_access
```

### 6.5 Espaços externos

```
front_yard
backyard
side_yard
courtyard
patio
garden
vegetable_garden
service_yard
plaza
playground
parking_lot
loading_area
agricultural_field
```

### 6.6 Adaptação ao terreno

```
flat
cut
fill
stepped
terraced
stilts
retaining_wall
embedded
slope_following
```

### 6.7 Relação com água

```
none
riverfront
lakefront
coastal
canal_side
floodplain
wetland
over_water
seasonal_water
```

---

## 7. Camada E — Modificadores contextuais

Os modificadores não são componentes físicos. Eles controlam quais componentes podem ser escolhidos.

### 7.1 Clima

Código:

```
CLIMATE
```

Categorias iniciais:

```
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

O clima pode alterar:

- inclinação da cobertura;
- tamanho dos beirais;
- quantidade de aberturas;
- presença de varandas;
- espessura das paredes;
- materiais;
- proteção solar;
- drenagem;
- contato com o solo.

### 7.2 Matriz cultural

Código:

```
CULTURAL_MATRIX
```

A matriz cultural não deve ser uma lista fixa de países.

Ela deve permitir combinações:

```
cultural_family
regional_variant
local_tradition
colonial_influence
religious_influence
migration_influence
globalized_influence
```

Exemplo:

```json
{
  "cultural_family": "latin_american",
  "regional_variant": "brazil_northeast_coastal",
  "colonial_influence": ["portuguese"],
  "migration_influence": ["african_diaspora", "indigenous"],
  "globalized_influence": 0.45
}
```

### 7.3 Nível de riqueza

Código:

```
WEALTH
```

Escala inicial:

```
0 — extreme_deprivation
1 — low_income
2 — lower_middle
3 — middle_income
4 — upper_middle
5 — affluent
6 — elite
```

A riqueza influencia:

- área construída;
- tamanho do lote;
- qualidade dos materiais;
- manutenção;
- ornamentação;
- segurança;
- equipamentos;
- quantidade de ampliações;
- paisagismo;
- estacionamento.

Riqueza não deve determinar diretamente beleza ou valor cultural.

Uma construção simples pode ser bem conservada e visualmente coerente.

### 7.4 Densidade

Código:

```
DENSITY
```

```
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

A densidade altera:

- largura dos lotes;
- recuos;
- altura;
- geminação;
- uso misto;
- relação com a rua;
- estacionamento;
- quantidade de espaços externos.

### 7.5 Desenvolvimento urbano

Código:

```
DEVELOPMENT
```

```
informal
emerging
consolidating
established
modernized
advanced
declining
post_industrial
```

Esse valor representa a condição do tecido urbano, não o desenvolvimento humano real da população.

### 7.6 Infraestrutura

Código:

```
INFRASTRUCTURE_LEVEL
```

```
minimal
basic
partial
standard
advanced
smart
degraded
```

Afeta:

- pavimentação;
- drenagem;
- redes elétricas;
- iluminação;
- calçadas;
- equipamentos técnicos;
- armazenamento de água;
- tratamento de resíduos.

### 7.7 Período de construção

Código:

```
CONSTRUCTION_PERIOD
```

Faixas genéricas:

```
pre_industrial
early_industrial
late_industrial
early_modern
mid_modern
late_modern
contemporary
near_future
```

O projeto pode adicionar datas específicas posteriormente.

### 7.8 Tecnologia construtiva

Código:

```
TECH_LEVEL
```

```
vernacular
craft
early_industrial
industrial
mass_produced
prefabricated
digital_fabrication
advanced
```

### 7.9 Topografia

Código:

```
TOPOGRAPHY
```

```
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

### 7.10 Hidrografia

Código:

```
HYDROGRAPHY
```

```
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

### 7.11 Risco ambiental

Código:

```
ENVIRONMENTAL_RISK
```

```
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

---

## 8. Arquétipos universais iniciais

Esta lista representa os primeiros modelos funcionais que a biblioteca deverá suportar.

### 8.1 Residenciais

```
detached_house
semi_detached_house
row_house
courtyard_house
rural_house
farmhouse
stilt_house
informal_house
townhouse
small_apartment
walkup_apartment
courtyard_apartment
residential_slab
residential_tower
mansion
collective_housing
dormitory
```

### 8.2 Comerciais

```
street_shop
corner_shop
market_stall
covered_market
supermarket
shopping_center
office_house
office_block
office_tower
restaurant
bar
cafe
service_shop
gas_station
roadside_business
```

### 8.3 Uso misto

```
shop_house
storefront_house
mixed_use_row
mixed_use_block
mixed_use_tower
market_residential
workshop_house
```

### 8.4 Institucionais e cívicos

```
school
university_building
clinic
hospital
police_station
fire_station
city_hall
courthouse
post_office
library
community_center
government_office
```

### 8.5 Industriais

```
workshop
small_factory
factory
warehouse
distribution_center
processing_plant
power_station
water_facility
industrial_shed
mine_facility
```

### 8.6 Transporte

```
bus_stop
bus_terminal
train_station
metro_station
port_terminal
airport_terminal
parking_structure
toll_station
service_station
```

### 8.7 Agrícolas

```
barn
stable
silo
greenhouse
farm_storage
processing_shed
livestock_shelter
rural_workshop
plantation_house
```

### 8.8 Recreativos

```
sports_hall
stadium
clubhouse
cinema
theater
museum
playground_facility
park_pavilion
pool_facility
nightclub
```

### 8.9 Religiosos

```
small_shrine
chapel
church
mosque
temple
synagogue
monastery
religious_complex
cemetery_building
```

A aparência nunca deve ser inferida apenas pelo uso religioso. Ela dependerá da matriz cultural e do período.

### 8.10 Hospedagem

```
guesthouse
hostel
roadside_motel
small_hotel
urban_hotel
resort
luxury_hotel
rural_lodge
```

---

## 9. Estrutura modular de arquivos

Organização recomendada:

```
BUILDINGS_DESIGN_BIBLE/
│
├── 00_CORE/
│   ├── enums/
│   ├── schemas/
│   ├── naming_rules/
│   └── validation_rules/
│
├── 01_ARCHETYPES/
│   ├── residential/
│   ├── commercial/
│   ├── mixed_use/
│   ├── industrial/
│   ├── institutional/
│   ├── agricultural/
│   └── infrastructure/
│
├── 02_COMPONENTS/
│   ├── foundations/
│   ├── structures/
│   ├── walls/
│   ├── facades/
│   ├── roofs/
│   ├── windows/
│   ├── doors/
│   ├── balconies/
│   ├── circulation/
│   ├── climate_control/
│   ├── boundaries/
│   ├── signage/
│   ├── ornaments/
│   └── technical_equipment/
│
├── 03_MATERIALS/
│   ├── structural/
│   ├── surface/
│   ├── roofing/
│   ├── glazing/
│   ├── metal/
│   ├── timber/
│   └── ground/
│
├── 04_CONTEXT_MODIFIERS/
│   ├── climate/
│   ├── culture/
│   ├── wealth/
│   ├── density/
│   ├── terrain/
│   ├── hydrography/
│   ├── infrastructure/
│   └── periods/
│
├── 05_ARCHITECTURAL_FAMILIES/
│
├── 06_BUILDING_RECIPES/
│
├── 07_GENERATED_BUILDINGS/
│
└── 08_VALIDATION/
```

---

## 10. Modelo inicial de dados

```json
{
  "schema_version": "0.1",
  "building_id": "BLD_RES_HOUSE_DETACHED_001",
  "display_name": "Detached House Base",
  "usage": {
    "primary": "residential",
    "secondary": [],
    "subtype": "single_family",
    "occupancy": "private"
  },
  "archetype": {
    "type": "detached_house",
    "volume_type": "detached",
    "plan_shape": "rectangle",
    "complexity": "simple"
  },
  "dimensions": {
    "width_units": 4,
    "depth_units": 6,
    "floor_count": 1,
    "floor_height_units": 1
  },
  "components": {
    "foundation": "FND_SLAB_GRADE_001",
    "structure": "STR_MASONRY_001",
    "wall": "WAL_MASONRY_RENDERED_001",
    "facade": "FAC_SIMPLE_003",
    "roof": "ROF_GABLE_MEDIUM_001",
    "windows": [
      "WIN_CASEMENT_STANDARD_001"
    ],
    "doors": [
      "DOR_SINGLE_STANDARD_001"
    ],
    "balconies": [],
    "boundaries": [
      "BND_LOW_WALL_001"
    ],
    "technical_equipment": []
  },
  "lot": {
    "lot_type": "urban_regular",
    "position": "front_setback",
    "front_setback": "small",
    "side_setback": "small",
    "rear_setback": "medium",
    "street_relation": "front_yard"
  },
  "compatibility": {
    "climates": [
      "tropical_seasonal",
      "subtropical",
      "temperate_oceanic"
    ],
    "densities": [
      "suburban_low",
      "urban_low"
    ],
    "wealth_range": [
      1,
      4
    ],
    "terrain": [
      "flat",
      "gently_rolling"
    ]
  },
  "visual_variation": {
    "material_slots": [
      "wall_primary",
      "wall_secondary",
      "roof",
      "frames",
      "doors",
      "foundation"
    ],
    "color_palette_slots": 3,
    "weathering_range": [
      0.0,
      0.7
    ],
    "mirror_allowed": true,
    "rotation_allowed": true
  },
  "generation": {
    "spawn_weight": 1.0,
    "unique": false,
    "minimum_spacing": 1,
    "allowed_corner_lot": true
  }
}
```

---

## 11. Regras de composição procedural

### Regra 1 — O arquétipo vem antes do estilo

Primeiro o sistema escolhe:

```
detached_house
```

Depois aplica:

```
clima
cultura
riqueza
densidade
período
tecnologia
estado de conservação
```

### Regra 2 — Forma e aparência são sistemas separados

Duas casas podem possuir a mesma forma e fachadas completamente diferentes.

Da mesma maneira, componentes parecidos podem ser aplicados a formas diferentes.

### Regra 3 — Nem toda combinação será permitida

Cada módulo deverá registrar compatibilidades.

Exemplo:

```json
{
  "component_id": "ROF_FLAT_ACCESSIBLE_001",
  "allowed_climates": [
    "arid_hot",
    "mediterranean",
    "tropical_seasonal"
  ],
  "restricted_conditions": [
    "heavy_snow"
  ]
}
```

Restrições não precisam ser absolutas. Podem reduzir a probabilidade de geração.

### Regra 4 — A matriz cultural modifica probabilidades

Uma região não deve possuir apenas um estilo.

Exemplo:

```
60% tradição regional predominante
20% arquitetura nacional contemporânea
10% influência internacional
7% arquitetura histórica preservada
3% construções excepcionais
```

Os valores variarão de acordo com cada cidade.

### Regra 5 — Riqueza e conservação são variáveis independentes

Exemplos possíveis:

```
edifício simples + bem conservado
edifício caro + mal conservado
edifício antigo + restaurado
edifício novo + construção incompleta
```

### Regra 6 — Edifícios podem sofrer transformações

Transformações possíveis:

```
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

Isso permitirá que a cidade pareça evoluir ao longo do tempo.

---

## 12. Sistema de encaixes modulares

Cada módulo deve declarar seus pontos de conexão.

Exemplo de fachada:

```json
{
  "module_id": "FAC_BAY_NARROW_001",
  "module_type": "facade_bay",
  "width_units": 1,
  "height_units": 1,
  "connection_points": {
    "left": "facade_vertical",
    "right": "facade_vertical",
    "top": "floor_or_roof",
    "bottom": "foundation_or_floor"
  },
  "supports": {
    "window_slot": true,
    "door_slot": false,
    "balcony_slot": false,
    "signage_slot": false
  }
}
```

Tipos básicos de encaixe:

```
foundation_to_wall
wall_to_floor
floor_to_roof
facade_horizontal
facade_vertical
opening_window
opening_door
balcony_anchor
signage_anchor
technical_anchor
ground_anchor
lot_boundary
```

---

## 13. Níveis de detalhe

A biblioteca deverá funcionar em diferentes escalas.

### LOD 0 — Mapa global

Representação:

- silhueta;
- altura;
- cor predominante;
- densidade.

### LOD 1 — Visão da cidade

Representação:

- forma principal;
- cobertura;
- fachada simplificada;
- lotes;
- vegetação principal.

### LOD 2 — Visão do bairro

Representação:

- portas;
- janelas;
- varandas;
- muros;
- sinalização;
- equipamentos.

### LOD 3 — Visão do jogador

Representação:

- materiais;
- desgaste;
- objetos menores;
- iluminação;
- detalhes interativos.

### LOD 4 — Interior

Representação:

- cômodos;
- acessos;
- circulação;
- mobiliário;
- sistemas interativos.

Nem todo edifício precisa possuir LOD 4.

---

## 14. Escopo inicial de produção

O primeiro protótipo não deverá tentar representar o mundo inteiro.

Biblioteca mínima recomendada:

```
5 arquétipos residenciais
3 arquétipos comerciais
2 arquétipos de uso misto
2 arquétipos institucionais
2 arquétipos industriais
3 tipos de lote
4 tipos de cobertura
4 sistemas de parede
6 modelos de janela
4 modelos de porta
3 modelos de muro ou cerca
3 níveis de conservação
3 níveis de riqueza
2 climas
2 matrizes culturais
```

Esse conjunto já permitirá testar centenas de combinações.

---

## 15. Primeiro conjunto de arquétipos para protótipo

**Residenciais**

```
BLD_RES_HOUSE_DETACHED
BLD_RES_HOUSE_ATTACHED
BLD_RES_HOUSE_RURAL
BLD_RES_APARTMENT_WALKUP
BLD_RES_APARTMENT_MIDRISE
```

**Comerciais**

```
BLD_COM_STREET_SHOP
BLD_COM_CORNER_SHOP
BLD_COM_ROADSIDE_BUSINESS
```

**Uso misto**

```
BLD_MIX_SHOP_HOUSE
BLD_MIX_URBAN_BLOCK
```

**Institucionais**

```
BLD_INS_SCHOOL_SMALL
BLD_INS_CLINIC_SMALL
```

**Industriais**

```
BLD_IND_WORKSHOP_SMALL
BLD_IND_WAREHOUSE_SMALL
```

---

## 16. Critérios de validação

O BDB-001 será considerado validado quando o sistema conseguir:

1. representar ao menos quinze arquétipos;
2. gerar edifícios a partir de módulos;
3. produzir variações sem perder a função visual;
4. aplicar duas matrizes culturais ao mesmo arquétipo;
5. adaptar um arquétipo a dois climas;
6. alterar aparência por riqueza e conservação;
7. impedir combinações estruturalmente incoerentes;
8. salvar cada edifício gerado em JSON;
9. reconstruir visualmente um edifício a partir do JSON;
10. manter identificadores consistentes entre arquivos.

---

## 17. Limites desta versão

Esta versão ainda não define:

- famílias arquitetônicas regionais completas;
- estilos históricos específicos;
- sistemas construtivos detalhados;
- paletas de materiais;
- interiores;
- regras urbanísticas por cidade;
- geração de redes viárias;
- distribuição de edifícios por bairro;
- simulação histórica da cidade;
- implementação em uma engine específica.

Esses elementos serão desenvolvidos nos documentos posteriores.

---

## 18. Próximo documento

```
BDB-002 — Sistema de Modificadores Ambientais e Urbanos
```

O BDB-002 deverá transformar fatores como clima, densidade, riqueza, topografia e infraestrutura em regras mensuráveis.

Exemplo:

```
tropical_humid
 → aumenta probabilidade de grandes beirais
 → aumenta ventilação
 → favorece varandas e elementos vazados
 → reduz fachadas totalmente envidraçadas sem proteção
 → exige drenagem intensa
```

Depois dele:

```
BDB-003 — Arquétipos Universais de Edifícios
BDB-004 — Sistema de DNA Arquitetônico
BDB-005 — Biblioteca Modular e Regras de Encaixe
BDB-006 — Famílias Arquitetônicas Globais
BDB-007 — Receitas Regionais
BDB-008 — Geração de Lotes e Bairros
BDB-009 — Persistência e Formato dos Arquivos
BDB-010 — Protótipo Procedural
```
