# BDB-006 — Resultados esperados

## Garantias comuns

- todas as famílias são avaliadas em cada fixture;
- compatibilidade verifica arquétipo, uso, altura, tecnologia, clima e interseção morfológica;
- diretivas consumidas no BDB-005 não são reaplicadas no peso de família;
- somente diretivas ainda pendentes no caso anterior podem alterar famílias;
- referências de conhecimento distinguem `evidence` de `design_hypothesis`;
- fontes de evidência existem e hipóteses não fingem possuir fonte;
- seletores de módulos encontram candidatos reais sem copiar os módulos;
- `selection_state` permanece `deferred_to_recipe` porque prevalência pertence ao BDB-007.

## Caso tropical

As seis diretivas transportadas pelo DNA foram consumidas pelo BDB-005. Portanto, nenhuma recebe uma segunda aplicação:

| Família | Elegível | Peso final | Observação |
|---|---:|---:|---|
| `FAM_COMPACT_BLOCK_LOWRISE_001` | sim | `1.0` | alternativa morfológica neutra |
| `FAM_PROTECTED_COURTYARD_LOWRISE_001` | sim | `1.0` | clima não infere pátio |
| `FAM_SHADED_VENTILATED_EDGE_LOWRISE_001` | sim | `1.0` | compatível, mas sem reaplicar pesos de sombra |

## Caso semiárido

| Família | Elegível | Peso final | Diretiva |
|---|---:|---:|---|
| `FAM_COMPACT_BLOCK_LOWRISE_001` | sim | `1.1452` | `DIR_SEMI_ARID_COMPACT_001` |
| `FAM_PROTECTED_COURTYARD_LOWRISE_001` | sim | `1.1694` | `DIR_SEMI_ARID_COURTYARD_001` |
| `FAM_SHADED_VENTILATED_EDGE_LOWRISE_001` | não | `0` | evidência climática insuficiente para `semi_arid` |

O caso não combina automaticamente compact block e courtyard em uma única família. As duas preferências são avaliadas separadamente, evitando esconder a possível tensão geométrica entre compacidade externa e vazio interno.

Depois desta camada, nenhuma diretiva do catálogo atual permanece sem consumidor. Isso não torna o DNA completo: os avisos sobre domínios contextuais ausentes continuam preservados.
