# BDB-004 — Diferenças esperadas entre os DNAs

**Status:** 🟡 Fixtures normativos; requerem resolvedor executável  
**Arquétipo comum:** `BLD_RES_HOUSE_DETACHED`

## Objetivo

Os dois arquivos demonstram o formato do contrato entre contexto e catálogo modular. Eles não fingem que já existe um gerador de edifícios completo.

## O que permanece idêntico

| Bloco | Resultado |
|---|---|
| Arquétipo | `BLD_RES_HOUSE_DETACHED` |
| Invariantes | sem parede compartilhada, unidade única, acesso próprio |
| Política de slots | 7 obrigatórios, 9 opcionais, nenhum proibido |
| Limites morfológicos | permanecem dentro da ficha BDB-003 |
| Matriz cultural | fixture neutro latino-americano |
| Período e tecnologia | `contemporary` + `mass_produced` |

O contexto não alterou identidade nem converteu preferência em obrigação.

## O que muda

| Aspecto | Tropical úmido | Semiárido |
|---|---|---|
| Tag aplicada | `cross_ventilation_preferred` | `low_water_landscaping_preferred` |
| Tag visual | `humid_weathering_palette` sem impor degradação | nenhuma paleta obrigatória |
| Requisito futuro | drenagem de chuva na cobertura | proteção solar em abertura exposta |
| Cobertura | peso efetivo `1.286875` para `pitched`/`rain_shedding` | nenhuma forma de cobertura obrigatória |
| Proteção climática | peso efetivo `1.20825` | peso efetivo `1.352` |
| Parede/material | resistência à umidade `1.1785` | massa térmica `1.2002` |
| Forma | sem viés climático de planta nesta versão | pátio permanece opcional, peso `1.1694` |
| Equipamento | nenhum equipamento privado inferido | armazenamento de água recebe peso `1.2772` |

## Por que os dois estados são `partial`

Somente dois perfis climáticos existem no repositório. Os contextos também descrevem topografia, água, risco, densidade, infraestrutura, desenvolvimento, riqueza, período, tecnologia, cultura e manutenção, mas esses domínios ainda não possuem perfis carregáveis.

O resultado correto é:

```text
registrar INCOMPLETE_DOMAIN_COVERAGE
preservar os valores do contexto
não fabricar regras ausentes
```

Além disso, as diretivas que precisam avaliar telhados, paredes, janelas, materiais ou equipamentos ficam `carried_forward` até o BDB-005 fornecer candidatos e pesos-base.

## Correção de compatibilidade

O fixture tropical do BDB-002 usava `urban_high`, mas a ficha `detached_house` permite densidades até `urban_medium`. Isso faria o novo pipeline rejeitar o caso antes de aplicar clima, contrariando o propósito declarado de comparar o mesmo arquétipo.

O fixture foi corrigido para `urban_medium`. Um futuro teste de `urban_high` deverá esperar:

```text
ARCHETYPE_CONTEXT_INCOMPATIBLE
```

ou usar uma exceção explícita com justificativa, nunca uma aceitação silenciosa.

## Valores efetivos auditáveis

A fórmula é:

```text
effective_strength = strength × climate.intensity
effective_multiplier = 1 + ((declared_multiplier - 1) × effective_strength)
effective_delta = declared_delta × effective_strength
```

Exemplos:

```text
tropical roof form:
1 + ((1.45 - 1) × 0.75 × 0.85) = 1.286875

semiarid shade:
1 + ((1.50 - 1) × 0.80 × 0.88) = 1.352

tropical roof overhang min:
0.15 × 0.80 × 0.85 = 0.102
```

## Aprovação futura

O resolvedor será aprovado para estes fixtures quando:

1. produzir ambos os DNAs a partir das fontes, sem edição manual;
2. reproduzir a ordenação registrada em `decision_trace.rule_order`;
3. manter todos os limites do arquétipo;
4. emitir os dois warnings previstos;
5. transportar exatamente as diretivas sem catálogo;
6. produzir saída canônica idêntica com a mesma seed;
7. rejeitar a variante tropical se a densidade voltar a `urban_high`.
