# BDB-003-A — Catálogo Funcional Inicial de Tipos de Edifícios

**Projeto:** Buildings Design Bible  
**Versão:** 0.1  
**Status:** 🟡 Catálogo inicial; tipos futuros ainda são hipóteses  
**Dependência:** `BDB-003_ARQUETIPOS_UNIVERSAIS.md`

---

## 1. Objetivo

Este documento transforma a lista preliminar de possíveis edifícios em um **catálogo funcional controlado**.

Ele não cria automaticamente um novo arquétipo para cada item. O catálogo responde à pergunta **"que função/subtipo pode existir no mundo?"**; o BDB-003 responde **"qual é a estrutura morfológica mínima que define esse tipo?"**.

A separação adotada é:

```text
TIPO FUNCIONAL
    ↓
SUBTIPO
    ↓
ARQUÉTIPO BDB-003
    ↓
CONTEXTO / DNA / MÓDULOS / FAMÍLIA / RECEITA
    ↓
EDIFÍCIO GERADO
```

Um subtipo pode reutilizar um arquétipo existente. Quando isso não for suficiente, um novo arquétipo deve ser especificado no BDB-003 antes de ser tratado como implementável.

---

## 2. Regra de nomenclatura

O catálogo usa identificadores estáveis e independentes da aparência:

```text
TYPE_<FAMÍLIA>_<SUBTIPO>
```

Exemplo:

```text
TYPE_RESIDENTIAL_DETACHED_HOUSE
```

O `archetype_id` permanece sob o contrato do BDB-003 e não deve ser substituído pelo identificador funcional.

---

## 3. Catálogo inicial

### 3.1 Residencial

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_RESIDENTIAL_DETACHED_HOUSE` | Residencial | Casa isolada | `detached_house` |
| `TYPE_RESIDENTIAL_ATTACHED_HOUSE` | Residencial | Casa geminada/adossada | `attached_house` |
| `TYPE_RESIDENTIAL_WALKUP_APARTMENT` | Residencial | Apartamento sem elevador | `walkup_apartment` |
| `TYPE_RESIDENTIAL_MIDRISE_APARTMENT` | Residencial | Edifício residencial médio | `midrise_apartment` |
| `TYPE_RESIDENTIAL_TOWER` | Residencial | Torre residencial | futuro |
| `TYPE_RESIDENTIAL_VILLA` | Residencial | Conjunto/vila residencial | futuro |
| `TYPE_RESIDENTIAL_DORMITORY` | Residencial | Residência coletiva/dormitório | futuro |

### 3.2 Comercial

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_COMMERCIAL_STREET_SHOP` | Comercial | Loja de rua | `street_shop` |
| `TYPE_COMMERCIAL_CORNER_SHOP` | Comercial | Loja de esquina | `corner_shop` |
| `TYPE_COMMERCIAL_ROADSIDE_BUSINESS` | Comercial | Comércio voltado a acesso veicular | `roadside_business` |
| `TYPE_COMMERCIAL_SUPERMARKET` | Comercial | Supermercado | futuro |
| `TYPE_COMMERCIAL_MARKET` | Comercial | Mercado/mercado coberto | futuro |
| `TYPE_COMMERCIAL_SHOPPING_CENTER` | Comercial | Centro comercial | futuro |
| `TYPE_COMMERCIAL_GALLERY` | Comercial | Galeria comercial | futuro |
| `TYPE_COMMERCIAL_BANK` | Comercial | Agência bancária | futuro |
| `TYPE_COMMERCIAL_RESTAURANT` | Comercial | Restaurante | futuro |
| `TYPE_COMMERCIAL_CAFE` | Comercial | Café/lanchonete | futuro |
| `TYPE_COMMERCIAL_BAKERY` | Comercial | Padaria | futuro |

### 3.3 Uso misto

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_MIXED_SHOP_HOUSE` | Uso misto | Comércio + residência | `shop_house` |
| `TYPE_MIXED_URBAN_BLOCK` | Uso misto | Bloco urbano de usos combinados | `urban_mixed_block` |
| `TYPE_MIXED_APARTMENT_RETAIL` | Uso misto | Residencial + comércio | futuro |
| `TYPE_MIXED_OFFICE_RETAIL` | Uso misto | Escritório + comércio | futuro |
| `TYPE_MIXED_MARKET_HALL` | Uso misto | Mercado + outros usos | futuro |

### 3.4 Institucional e serviços públicos

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_INSTITUTIONAL_SCHOOL` | Institucional | Escola pequena | `small_school` |
| `TYPE_INSTITUTIONAL_CLINIC` | Institucional | Clínica pequena | `small_clinic` |
| `TYPE_INSTITUTIONAL_DAYCARE` | Institucional | Creche | futuro |
| `TYPE_INSTITUTIONAL_HOSPITAL` | Institucional | Hospital | futuro |
| `TYPE_INSTITUTIONAL_LIBRARY` | Institucional | Biblioteca | futuro |
| `TYPE_INSTITUTIONAL_MUSEUM` | Institucional | Museu | futuro |
| `TYPE_INSTITUTIONAL_CULTURAL_CENTER` | Institucional | Centro cultural | futuro |
| `TYPE_INSTITUTIONAL_THEATER` | Institucional | Teatro | futuro |
| `TYPE_INSTITUTIONAL_CINEMA` | Institucional | Cinema | futuro |
| `TYPE_INSTITUTIONAL_RELIGIOUS` | Institucional | Edificação religiosa | futuro |
| `TYPE_INSTITUTIONAL_CEMETERY` | Institucional | Cemitério | futuro |

### 3.5 Industrial

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_INDUSTRIAL_WORKSHOP` | Industrial | Oficina | `small_workshop` |
| `TYPE_INDUSTRIAL_SMALL_WAREHOUSE` | Industrial | Pequeno armazém/galpão | `small_warehouse` |
| `TYPE_INDUSTRIAL_FACTORY` | Industrial | Fábrica | futuro |
| `TYPE_INDUSTRIAL_HEAVY_FACTORY` | Industrial | Indústria de grande porte | futuro |
| `TYPE_INDUSTRIAL_PROCESSING_PLANT` | Industrial | Unidade de processamento | futuro |
| `TYPE_INDUSTRIAL_COLD_STORAGE` | Industrial | Armazém refrigerado | futuro |
| `TYPE_INDUSTRIAL_LOGISTICS_CENTER` | Industrial | Centro logístico | futuro |

### 3.6 Agrícola/rural

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_AGRICULTURAL_RURAL_HOUSE` | Rural | Casa rural | `rural_house` |
| `TYPE_AGRICULTURAL_FARMHOUSE` | Rural | Casa-sede de propriedade rural | futuro |
| `TYPE_AGRICULTURAL_BARN` | Rural | Celeiro/galpão agrícola | futuro |
| `TYPE_AGRICULTURAL_STABLE` | Rural | Estábulo | futuro |
| `TYPE_AGRICULTURAL_SILO` | Rural | Silo | futuro |
| `TYPE_AGRICULTURAL_GREENHOUSE` | Rural | Estufa | futuro |
| `TYPE_AGRICULTURAL_MILL` | Rural | Moinho | futuro |

### 3.7 Hospedagem

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_HOSPITALITY_HOTEL` | Hospedagem | Hotel | futuro |
| `TYPE_HOSPITALITY_INN` | Hospedagem | Pousada | futuro |
| `TYPE_HOSPITALITY_HOSTEL` | Hospedagem | Hostel | futuro |
| `TYPE_HOSPITALITY_RESORT` | Hospedagem | Resort | futuro |
| `TYPE_HOSPITALITY_MOTEL` | Hospedagem | Motel | futuro |

### 3.8 Transporte

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_TRANSPORT_RAIL_STATION` | Transporte | Estação ferroviária | futuro |
| `TYPE_TRANSPORT_METRO_STATION` | Transporte | Estação de metrô | futuro |
| `TYPE_TRANSPORT_BUS_TERMINAL` | Transporte | Terminal rodoviário | futuro |
| `TYPE_TRANSPORT_AIRPORT` | Transporte | Aeroporto | futuro |
| `TYPE_TRANSPORT_PORT` | Transporte | Porto | futuro |
| `TYPE_TRANSPORT_MARINA` | Transporte | Marina | futuro |
| `TYPE_TRANSPORT_PARKING_STRUCTURE` | Transporte | Garagem/estacionamento estruturado | futuro |

### 3.9 Segurança e emergência

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_SECURITY_POLICE_STATION` | Segurança | Delegacia/posto policial | futuro |
| `TYPE_SECURITY_FIRE_STATION` | Segurança | Corpo de bombeiros | futuro |
| `TYPE_SECURITY_BARRACKS` | Segurança | Quartel | futuro |
| `TYPE_SECURITY_PRISON` | Segurança | Unidade prisional | futuro |

### 3.10 Infraestrutura e utilidades

| ID | Tipo | Subtipo | Arquétipo atual |
|---|---|---|---|
| `TYPE_INFRASTRUCTURE_POWER_SUBSTATION` | Infraestrutura | Subestação elétrica | futuro |
| `TYPE_INFRASTRUCTURE_WATER_TREATMENT` | Infraestrutura | Estação de tratamento de água | futuro |
| `TYPE_INFRASTRUCTURE_WASTEWATER_PLANT` | Infraestrutura | Estação de tratamento de esgoto | futuro |
| `TYPE_INFRASTRUCTURE_PUMP_STATION` | Infraestrutura | Estação de bombeamento | futuro |
| `TYPE_INFRASTRUCTURE_WATER_RESERVOIR` | Infraestrutura | Reservatório | futuro |
| `TYPE_INFRASTRUCTURE_TELECOM` | Infraestrutura | Instalação de telecomunicações | futuro |

---

## 4. O que este catálogo NÃO define

Este catálogo não determina:

- clima;
- cultura;
- país ou região;
- riqueza;
- material;
- cor;
- acabamento;
- estado de conservação;
- estilo arquitetônico;
- frequência de ocorrência;
- aparência final.

Esses atributos continuam em seus respectivos sistemas. A separação é necessária para que, por exemplo, `TYPE_RESIDENTIAL_DETACHED_HOUSE` possa resultar em edifícios diferentes sem deixar de representar o mesmo tipo funcional.

---

## 5. Critério para adicionar um novo tipo

Um novo item só deve entrar como tipo/subtipo quando houver uma diferença funcional relevante.

Exemplo válido:

```text
Casa isolada
≠
Apartamento
```

porque existe diferença estrutural e de ocupação.

Exemplo que **não** cria um novo tipo:

```text
Casa térrea
Casa de dois pavimentos
```

se ambas continuam pertencendo ao mesmo arquétipo `detached_house` dentro das restrições definidas pelo BDB-003.

Da mesma forma:

```text
casa tropical
casa temperada
casa rica
casa pobre
```

não são tipos funcionais. São resultados de contexto/DNA/receita.

---

## 6. Estado de implementação

### Implementado no BDB-003

```text
detached_house
attached_house
rural_house
walkup_apartment
midrise_apartment
street_shop
corner_shop
roadside_business
shop_house
urban_mixed_block
small_workshop
small_warehouse
small_school
small_clinic
```

Esses 14 itens permanecem como o **núcleo normativo atual**, conforme o BDB-003. citeturn4file0

### Catálogo expandido

Os demais itens são **candidatos de planejamento**, não arquétipos aprovados. Antes de entrarem na geração, cada um deve ser testado contra a pergunta:

```text
Este subtipo pode ser representado adequadamente por um arquétipo existente?
```

Se não puder:

```text
novo subtipo
    ↓
novo arquétipo BDB-003
    ↓
validação
    ↓
componentes BDB-005
    ↓
família BDB-006
    ↓
receitas BDB-007
```

---

## 7. Próxima expansão controlada

A expansão não deve tentar implementar todos os itens simultaneamente.

A ordem de trabalho recomendada para o catálogo é:

```text
1. Consolidar os 14 arquétipos existentes
2. Criar os arquétipos agrícolas
3. Criar os arquétipos de infraestrutura
4. Expandir institucional
5. Expandir comercial
6. Expandir industrial
7. Expandir hospedagem e transporte
8. Revisar duplicidades e escalonamentos
```

Esta ordem é uma decisão de planejamento e pode ser alterada após validação dos primeiros resultados.

---

## 8. Princípio central

> **O catálogo deve crescer em função do que o gerador precisa distinguir, e não em função da quantidade de nomes de edifícios que conseguimos listar.**

Uma lista grande de nomes sem arquétipos, módulos e regras produziria apenas um catálogo ornamental. O objetivo do BDB é transformar cada distinção necessária em uma regra computável e validável.
