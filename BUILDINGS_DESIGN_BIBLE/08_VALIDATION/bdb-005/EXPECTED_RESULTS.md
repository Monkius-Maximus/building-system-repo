# BDB-005 — Resultados esperados

## Garantias comuns

- os sete slots obrigatórios de `BLD_RES_HOUSE_DETACHED` aparecem na montagem;
- todas as conexões usam interfaces idênticas e papéis opostos;
- nenhum módulo aponta para material inexistente ou incompatível com o slot;
- `final_weight` usa o multiplicador efetivo do DNA apenas uma vez;
- candidato reprovado por requisito possui peso final `0`;
- alternativas sem preferência continuam elegíveis quando não existe proibição.

## Caso tropical

| Candidato | Resultado | Motivo |
|---|---:|---|
| `ROF_GABLE_DRAINED_GENERIC_001` | `1.286875` | drenagem + preferência `pitched`/`rain_shedding` |
| `ROF_FLAT_DRAINED_GENERIC_001` | `1.0` | drenagem presente; forma plana continua válida |
| `ROF_FLAT_UNCERTIFIED_GENERIC_001` | `0` | falta `rain_drainage_capable` |
| `CLM_HORIZONTAL_SHADE_GENERIC_001` | `1.20825` | corresponde a `awning`/`brise_soleil` |
| `MAT_MASONRY_DENSE_GENERIC_001` | `1.1785` | corresponde a `moisture_resistant` |

Faixas esperadas:

```text
gable roof_overhang  [0.10, 0.60] + [0.102, 0.204] = [0.202, 0.804]
flat  roof_overhang  [0.00, 0.20] + [0.102, 0.204] = [0.102, 0.404]
facade opening_ratio [0.15, 0.35] + [0.0442, 0.09945] = [0.1942, 0.44945]
```

O caso prova que clima tropical úmido não implica automaticamente cobertura inclinada.

## Caso semiárido

| Candidato | Resultado | Motivo |
|---|---:|---|
| `WIN_CASEMENT_SHADED_GENERIC_001` | `1.0` | satisfaz requisito duro |
| `WIN_CASEMENT_UNSHADED_GENERIC_001` | `0` | falta `sun_protection_capable` |
| `CLM_HORIZONTAL_SHADE_GENERIC_001` | `1.352` | preferência de sombra |
| `MAT_MASONRY_DENSE_GENERIC_001` | `1.2002` | preferência de massa térmica |
| `TEC_WATER_TANK_BASIC_GENERIC_001` | `1.2772` | preferência de armazenamento privado |
| `MAT_SURFACE_REFLECTIVE_GENERIC_001` | `1.11` | preferência de reflectância solar |
| `MAT_SURFACE_NEUTRAL_GENERIC_001` | `1.0` | alternativa continua válida |

As diretivas abaixo permanecem explicitamente pendentes:

```text
DIR_SEMI_ARID_COMPACT_001
DIR_SEMI_ARID_COURTYARD_001
```

Elas operam sobre candidatos morfológicos, não sobre módulos físicos. Marcá-las como resolvidas seria esconder uma lacuna do sistema.

## Caso institucional hospitalar

Entrada: `DNA_TEST_INSTITUTIONAL_HOSPITAL_001` (`BLD_INS_HOSPITAL` sobre `CTX_TEST_TROPICAL_URBAN_MIDDLE_001`). Mesmo contexto e mesmo perfil climático do caso tropical; as diretivas efetivas são idênticas.

| Candidato | Resultado | Motivo |
|---|---:|---|
| `ROF_INSTITUTIONAL_GENERIC_001` | `1.0` | drenagem declarada; sem `pitched`/`rain_shedding`, não recebe preferência de forma |
| `FAC_INSTITUTIONAL_GENERIC_001` | `1.0` | recebe o deslocamento de `opening_ratio` |
| `MAT_MASONRY_DENSE_GENERIC_001` | `1.1785` | corresponde a `moisture_resistant` |
| `MAT_PANEL_LIGHT_GENERIC_001` | `1.0` | alternativa continua válida |
| `MAT_SURFACE_NEUTRAL_GENERIC_001` | `1.0` | alternativa continua válida |
| `MAT_SURFACE_REFLECTIVE_GENERIC_001` | `1.0` | alternativa continua válida |

Faixas esperadas:

```text
institutional roof_overhang  [0.10, 0.80] + [0.102, 0.204]   = [0.202, 1.004]
institutional opening_ratio  [0.10, 0.60] + [0.0442, 0.09945] = [0.1442, 0.69945]
```

Diretiva pendente:

```text
DIR_TROP_HUM_SHADE_001
```

O único módulo CLM do catálogo é restrito a `BLD_RES_HOUSE_DETACHED`. CLM é opcional no hospital; a pendência é registrada, não resolvida por ampliação de compatibilidade.

### O que o caso prova

- as tags de classificação de slot tornam a linha institucional endereçável pelos seletores climáticos;
- drenagem exigida é satisfeita por capability declarada, não por nome;
- deslocamentos de faixa e multiplicadores do DNA são reproduzidos sem dupla ponderação;
- os onze slots obrigatórios do hospital são montados.

### O que o caso não prova

- **rejeição**: nenhum candidato compatível com o hospital deixa de declarar uma capability exigida; a linha institucional não possui controle negativo equivalente a `ROF_FLAT_UNCERTIFIED_GENERIC_001`;
- **seleção**: há um único candidato por slot; a seleção é determinística por ausência de alternativas;
- **circulação**: `VCR_INSTITUTIONAL_GENERIC_001` e `HCR_INSTITUTIONAL_GENERIC_001` não declaram sockets; nenhuma conexão de circulação é testada.

### Evidência para a hipótese BDB-003-D

Com o catálogo atual, a camada BDB-005 não distingue hospital de `BLD_INS_CLINIC_SMALL`: a mesma linha de módulos declara os dois arquétipos e as diretivas incidem da mesma forma.

Os quatro testes de invariante do hospital também são verdadeiros quando avaliados sobre `small_clinic.json`:

| Invariante | Teste | Hospital | Clínica pequena |
|---|---|:---:|:---:|
| `INV_INS_HOSPITAL_ACCESSIBLE_ENTRANCE` | `identity.barrier_free_entrance == 'required'` | sim | sim |
| `INV_INS_HOSPITAL_SEPARATED_CIRCULATION` | `'HCR' in slots.required` | sim | sim |
| `INV_INS_HOSPITAL_TECHNICAL_INFRASTRUCTURE` | `'TEC' in slots.required` | sim | sim |
| `INV_INS_HOSPITAL_PROGRAMMATIC_SCALE` | `'composite'` ou `'segmented'` em `volume_complexity.allowed` | sim | sim |

As diferenças verificáveis entre os dois arquétipos estão no envelope e na identidade:

| Campo | Hospital | Clínica pequena |
|---|---|---|
| `morphology.floor_count` | 1–12 | 1–3 |
| `morphology.height_classes.allowed` | até `HIGH_RISE` | até `LOW_RISE` |
| `morphology.footprint_units.width` | 12–80 | 5–30 |
| `slots.required` contém `VCR` | sim | não |
| `identity.unit_stacking` | `required` | `forbidden` |

O gerador, portanto, produz envelopes diferentes para os dois arquétipos; os invariantes nomeados como setorização e escala programática não verificam essas propriedades.

### Decisões arquiteturais abertas

**BLOCKED — ARCHITECTURAL DECISION REQUIRED**

1. **Tags de desempenho da cobertura institucional.** Declarar ou não `pitched`/`rain_shedding` em `ROF_INSTITUTIONAL_GENERIC_001` decide se `DIR_TROP_HUM_ROOF_FORM_001` a favorece. É afirmação de projeto, não classificação.
2. **Controle negativo institucional.** Provar rejeição exige um candidato compatível com o hospital sem uma capability exigida. Isso implica um novo módulo.
3. **Faixa tecnológica da linha.** Os onze módulos aceitam `vernacular` e `craft` porque `small_school` e `small_clinic` aceitam; `STR_INSTITUTIONAL_GENERIC_001` declara ao mesmo tempo `twelve_storey_support_capable`. Uma única estrutura atende escalas incompatíveis.
4. **Altura da linha.** Os módulos declaram `max_floor_count: 12`, mas `height_classes` param em `MID_RISE`. Pelo BDB-001, 11–25 pavimentos é `high_rise`. A seção 7.2 do BDB-005 declara 12 pavimentos para fundação e estrutura.
5. **Sockets de circulação.** Sem interfaces para VCR e HCR, o invariante de circulação do hospital é satisfeito apenas pela presença do slot.
6. **Teste dos invariantes do hospital.** Os testes atuais não distinguem o hospital da clínica pequena. Endurecê-los altera a ficha BDB-003-D, que permanece em hipótese.

Até essas decisões, `BLD_INS_HOSPITAL` permanece `hypothesis` e o caso permanece `partial`.
