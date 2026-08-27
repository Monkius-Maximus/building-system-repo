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
