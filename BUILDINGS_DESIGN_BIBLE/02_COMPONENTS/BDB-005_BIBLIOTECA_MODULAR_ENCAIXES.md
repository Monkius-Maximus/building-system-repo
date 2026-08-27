# BDB-005 — Biblioteca Modular e Regras de Encaixe

**Projeto:** Buildings Design Bible
**Versão:** 0.1
**Status:** 🟡 Vertical slice implementado; requer expansão do catálogo
**Dependências:** BDB-001 a BDB-004
**Função:** Fornecer candidatos funcionais e conectáveis para as diretivas transportadas pelo DNA.

---

## 1. Objetivo

O BDB-005 transforma uma instrução abstrata como:

```text
exigir cobertura capaz de drenar chuva
favorecer parede com massa térmica
favorecer proteção solar em abertura exposta
```

em consultas executáveis sobre candidatos:

```text
tags
capabilities
parâmetros
compatibilidade
materiais
sockets
pesos
```

Esta entrega não tenta preencher toda a arquitetura mundial. Ela cria um catálogo mínimo, genérico e marcado como `hypothesis` para provar que o DNA do BDB-004 possui consumidores reais.

---

## 2. Posição na cadeia

```text
ARQUÉTIPO + CONTEXTO
         ↓
        DNA
         ↓
 FILTRAR CANDIDATOS       BDB-005
 AJUSTAR PESOS            BDB-005
 VALIDAR SOCKETS          BDB-005
         ↓
 FAMÍLIA ARQUITETÔNICA    BDB-006
 RECEITA REGIONAL         BDB-007
         ↓
 EDIFÍCIO GERADO
```

O catálogo modular é anterior às famílias regionais. Um módulo funcional pode participar de várias famílias; paleta, prevalência local, linguagem compositiva e história não pertencem a esta etapa.

---

## 3. Decisões normativas

### 3.1 Módulo não é edifício nem estilo

Um módulo descreve uma peça funcional selecionável. Ele pode representar fundação, estrutura, parede, fachada, cobertura, porta, janela, proteção climática ou equipamento.

Não pode declarar que é “brasileiro”, “japonês”, “árabe” ou “europeu”. Essas associações exigem pesquisa e entram no BDB-006/007.

### 3.2 Material e componente são entidades diferentes

O módulo declara funções, geometria e encaixes. O material declara desempenho e compatibilidade de slot.

```text
WAL_*  → peça de parede
MAT_*  → material permitido nessa peça
```

Um peso climático pode favorecer tanto um módulo quanto um material, sem fundir os dois conceitos.

### 3.3 Capacidade é contrato; tag é classificação

```text
capability  rain_drainage_capable  → requisito verificável
tag         pitched                → característica usada em pesos
```

Uma diretiva `require` deve consultar `capabilities`. Uma diretiva `weight_multiplier` pode consultar `tags` ou `capabilities` conforme seu seletor.

### 3.4 Ausência de capability reprova requisito

Não há inferência por nome do módulo. Uma cobertura chamada “inclinada” não satisfaz drenagem se `rain_drainage_capable` não estiver declarada.

Isso distingue:

```text
incompatível
```

de:

```text
compatibilidade ainda não pesquisada
```

O segundo caso também não passa por uma restrição dura; deve ser revisado e versionado.

### 3.5 Todo dado inicial é hipótese de protótipo

Dimensões, desempenho e pesos desta versão são valores normalizados para validar o sistema. Não são especificação de engenharia, recomendação construtiva ou representação regional final.

---

## 4. Contratos formais

```text
00_CORE/schemas/component-module.schema.json
00_CORE/schemas/material.schema.json
00_CORE/schemas/bdb005-validation.schema.json
```

### 4.1 Identidade

O prefixo de `module_id` deve coincidir com `slot_code`:

```text
ROF_* → ROF
WIN_* → WIN
TEC_* → TEC
```

O validador rejeita divergências mesmo quando o JSON Schema isolado não consegue comparar os dois campos.

### 4.2 Geometria normalizada

As dimensões usam unidades abstratas de grade. O valor não representa metro até que uma futura camada de exportação defina a escala.

```text
width_units
height_units
depth_units
repeatable_axes
mirror_allowed
rotation_steps
```

### 4.3 LOD

`lod_support` declara em quais escalas o módulo possui representação prevista. Isso não exige que a malha já exista.

---

## 5. Sistema de sockets

Cada socket declara:

```text
socket_id
interface
role: provider | consumer
normal
required
capacity
```

### 5.1 Interfaces iniciais

| Interface | Exemplo |
|---|---|
| `foundation_to_structure` | fundação recebe estrutura |
| `structure_to_wall` | estrutura ancora parede |
| `structure_to_facade` | estrutura recebe módulo de fachada |
| `structure_to_roof` | estrutura suporta cobertura |
| `facade_horizontal` | repetição lateral de bays |
| `facade_vertical` | empilhamento de fachada |
| `opening_window` | abertura recebe janela |
| `opening_door` | abertura recebe porta |
| `balcony_anchor` | fachada recebe varanda |
| `signage_anchor` | fachada recebe sinalização |
| `climate_control_anchor` | fachada/janela recebe proteção climática |
| `technical_anchor` | estrutura recebe equipamento |
| `ground_anchor` | componente se ancora ao lote |
| `lot_boundary` | muro ou cerca ocupa limite |

### 5.2 Conexão válida

Uma conexão é válida somente quando:

1. os dois módulos existem;
2. os sockets existem nos módulos indicados;
3. as interfaces são idênticas;
4. um socket é `provider` e o outro `consumer`;
5. a capacidade de nenhum socket foi excedida;
6. os módulos são compatíveis com uso, altura e tecnologia;
7. sockets obrigatórios estão conectados ao final da montagem;
8. não há conexão de um módulo consigo mesmo.

Nesta versão, a orientação é auditada, mas colisão espacial e tolerância geométrica exata permanecem futuras.

---

## 6. Pipeline de seleção

```text
1. carregar DNA e catálogo
2. separar diretivas por alvo
3. filtrar slot, uso, altura e tecnologia
4. aplicar require e forbid
5. descartar candidato sem capability obrigatória
6. intersectar ranges e aplicar deltas efetivos
7. aplicar multiplicadores já calculados no DNA
8. limitar peso final à faixa 0.05..8.00
9. ordenar candidatos por candidate_id antes de sorteio
10. registrar elegíveis, rejeitados e motivos
11. selecionar por decision_seed quando a receita exigir escolha
12. validar sockets da montagem
```

### 6.1 Peso

O BDB-004 já calculou o multiplicador efetivo. O BDB-005 não o recalcula:

```text
final_weight = clamp(
  base_weight × produto(effective_value das diretivas aplicáveis),
  0.05,
  8.00
)
```

Aplicar a fórmula climática novamente seria um erro de dupla ponderação.

### 6.2 Faixas

Para um `range_shift` transportado:

```text
shifted.min = candidate.min + effective_delta.min
shifted.max = candidate.max + effective_delta.max
```

Em `parameters`, a faixa declarada é a faixa-base mutável, não um teto rígido. Quando uma receita ou um módulo futuro declarar limites duros separados, o resultado será intersectado com esses limites. Faixa vazia gera `CONFLICT_EMPTY_RANGE`.

---

## 7. Catálogo inicial

### 7.1 Módulos estruturais obrigatórios

| Slot | Módulo inicial | Papel |
|---|---|---|
| FND | `FND_SLAB_GENERIC_001` | base com socket estrutural |
| STR | `STR_FRAME_LOWRISE_GENERIC_001` | estrutura até quatro pavimentos |
| WAL | `WAL_MASONRY_GENERIC_001` | parede com materiais intercambiáveis |
| FAC | `FAC_HABITABLE_BAY_GENERIC_001` | bay com porta, janela e proteção |
| ROF | `ROF_GABLE_DRAINED_GENERIC_001` | cobertura inclinada drenante |
| ROF | `ROF_FLAT_DRAINED_GENERIC_001` | alternativa plana drenante |
| ROF | `ROF_FLAT_UNCERTIFIED_GENERIC_001` | candidato sem capability comprovada |
| DOR | `DOR_SINGLE_EXTERNAL_GENERIC_001` | porta externa |
| WIN | `WIN_CASEMENT_SHADED_GENERIC_001` | janela com proteção solar |
| WIN | `WIN_CASEMENT_UNSHADED_GENERIC_001` | controle negativo do requisito |

### 7.2 Módulos opcionais

| Slot | Módulo | Papel |
|---|---|---|
| CLM | `CLM_HORIZONTAL_SHADE_GENERIC_001` | brise/anteparo horizontal |
| TEC | `TEC_WATER_TANK_BASIC_GENERIC_001` | armazenamento privado de água |

### 7.3 Materiais funcionais

```text
MAT_MASONRY_DENSE_GENERIC_001
MAT_PANEL_LIGHT_GENERIC_001
MAT_SURFACE_REFLECTIVE_GENERIC_001
MAT_SURFACE_NEUTRAL_GENERIC_001
```

Nenhum nome afirma origem cultural, prestígio, beleza ou classe social.

---

## 8. Resolução dos DNAs

### 8.1 Tropical úmido

O catálogo permite:

- eliminar a cobertura sem capability de drenagem;
- favorecer coberturas `pitched`/`rain_shedding` sem proibir a plana drenante;
- deslocar a faixa de beiral;
- deslocar a faixa de abertura da fachada;
- favorecer proteção climática;
- favorecer material resistente à umidade.

Assim, a alternativa plana continua válida, preservando a decisão antiestereótipo do BDB-002.

### 8.2 Semiárido

O catálogo permite:

- eliminar janela exposta sem proteção solar;
- favorecer o módulo de sombra;
- favorecer parede/material com massa térmica;
- favorecer reservatório privado;
- favorecer superfície refletiva sem torná-la culturalmente obrigatória.

As diretivas de `archetype.volume_complexity` e `archetype.plan_shape` continuam pendentes. Elas exigem um catálogo de candidatos morfológicos, não devem ser falsamente resolvidas por módulos físicos.

---

## 9. Diagnósticos

| Código | Significado |
|---|---|
| `MODULE_SLOT_PREFIX_MISMATCH` | prefixo do ID não coincide com slot |
| `UNKNOWN_MATERIAL_REFERENCE` | módulo aponta para material inexistente |
| `MATERIAL_SLOT_INCOMPATIBLE` | material não aceita o slot do módulo |
| `REQUIRED_CAPABILITY_MISSING` | candidato falha em `require` |
| `SOCKET_NOT_FOUND` | montagem cita socket inexistente |
| `SOCKET_INTERFACE_MISMATCH` | interfaces diferentes |
| `SOCKET_ROLE_MISMATCH` | provider/consumer inválidos |
| `SOCKET_CAPACITY_EXCEEDED` | número de conexões excede capacidade |
| `REQUIRED_SOCKET_UNCONNECTED` | socket obrigatório ficou solto |
| `DOUBLE_WEIGHT_APPLICATION` | multiplicador efetivo foi recalculado |
| `MORPHOLOGY_CATALOG_UNAVAILABLE` | diretiva morfológica permanece pendente |

---

## 10. Casos de validação

```text
08_VALIDATION/bdb-005/
├── CASE-001_TROPICAL_CANDIDATES.json
├── CASE-002_SEMIARID_CANDIDATES.json
└── EXPECTED_RESULTS.md
```

Os fixtures registram pesos finais, filtros de capability, ranges efetivos e uma montagem mínima dos sete slots obrigatórios.

---

## 11. Critérios de aceitação

O BDB-005 será considerado implementado para este vertical slice quando o validador conseguir:

1. validar todos os módulos e materiais contra seus schemas;
2. assegurar unicidade e correspondência entre prefixo e slot;
3. resolver todas as referências de material;
4. validar reciprocidade e capacidade dos sockets;
5. montar os sete slots obrigatórios de `detached_house`;
6. eliminar cobertura tropical sem drenagem explícita;
7. manter simultaneamente cobertura inclinada e plana drenante;
8. eliminar janela semiárida exposta sem proteção solar;
9. reproduzir os pesos efetivos registrados nos fixtures;
10. reproduzir os ranges deslocados sem faixa vazia;
11. deixar somente as duas diretivas morfológicas declaradas como pendentes;
12. repetir a avaliação com saída idêntica para os mesmos arquivos.

---

## 12. Limites desta versão

Ainda não existem:

- malhas, texturas ou arquivos de Blender;
- colisão geométrica tridimensional;
- catálogo de pavimentos e interiores;
- sockets com coordenadas físicas finais;
- módulos de todos os 16 slots;
- candidatos para todos os 14 arquétipos;
- famílias arquitetônicas globais;
- prevalência ou composição regional;
- persistência de edifício gerado.

---

## 13. Próxima etapa

```text
BDB-006 — Famílias Arquitetônicas Globais
```

O próximo documento poderá agrupar módulos compatíveis sem duplicá-los, acrescentando linguagem compositiva, períodos e fontes pesquisadas. As receitas específicas de regiões e cidades permanecem no BDB-007.
