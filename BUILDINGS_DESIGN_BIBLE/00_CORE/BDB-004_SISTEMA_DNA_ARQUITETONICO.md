# BDB-004 — Sistema de DNA Arquitetônico

**Projeto:** Buildings Design Bible  
**Versão:** 0.1  
**Status:** 🟡 Especificação concluída; requer implementação  
**Dependências:** BDB-001, BDB-002 e BDB-003  
**Função:** Transformar arquétipo e contexto em um contrato determinístico de geração, sem selecionar módulos que ainda não existem.

---

## 1. Objetivo

O DNA arquitetônico é a ponte entre a descrição abstrata de um tipo de edifício e a futura seleção de peças físicas.

```text
arquétipo (BDB-003) + contexto (BDB-002)
                    ↓
             DNA (BDB-004)
                    ↓
        módulos e encaixes (BDB-005)
```

O DNA deve:

1. preservar a identidade e as invariantes do arquétipo;
2. verificar se o contexto é compatível antes de adaptar o edifício;
3. consolidar limites morfológicos, de lote e de slots;
4. aplicar imediatamente regras que alteram tags ou o envelope conhecido;
5. transportar para o BDB-005 regras que dependem de candidatos ainda inexistentes;
6. registrar regras aplicadas, bloqueadas e pendentes;
7. falhar explicitamente quando as restrições não puderem coexistir;
8. produzir o mesmo resultado para os mesmos dados, versões e seed;
9. não inventar informação para domínios sem perfil disponível.

---

## 2. O que o DNA é — e o que não é

O DNA é um **contrato resolvido de intenção e restrição**. Ele informa ao próximo estágio o que deverá ser mantido, exigido, evitado ou favorecido.

Ele não é:

- um novo arquétipo;
- uma malha 3D;
- uma lista de componentes escolhidos;
- uma receita regional completa;
- um edifício persistido no mundo;
- uma autorização para preencher lacunas com estereótipos.

O edifício ainda é reconhecido pelo `archetype_id`. O `dna_id` identifica somente o resultado daquele cruzamento de entradas.

---

## 3. Decisões normativas

### 3.1 Compatibilidade vem antes de modificação

Antes de aplicar regras, o resolvedor compara o contexto com `context_compatibility` do arquétipo.

```text
contexto compatível      → continuar
contexto incompatível    → rejeitar ou solicitar escalonamento explícito
exceção declarada        → continuar com warning e justificativa
```

O sistema não pode alterar silenciosamente o arquétipo para salvar uma combinação inválida.

Essa regra revelou uma inconsistência nos fixtures anteriores: o caso tropical usava `urban_high`, enquanto `BLD_RES_HOUSE_DETACHED` admite no máximo `urban_medium`. O fixture foi corrigido para `urban_medium`, pois seu objetivo é comparar contextos mantendo o mesmo arquétipo. Testar escalonamento será um caso separado.

### 3.2 Invariantes são copiadas para um bloqueio de identidade

O DNA contém `identity_lock`, com:

- o arquétipo original;
- os identificadores das invariantes;
- os caminhos que nenhuma regra contextual pode alterar.

Uma tentativa de tocar esses caminhos gera `INVARIANT_VIOLATION`, nunca uma adaptação silenciosa.

### 3.3 Regra sem candidato vira diretiva

Os perfis do BDB-002 já apontam para coberturas, janelas, materiais e equipamentos. Esses catálogos pertencem ao BDB-005 e ainda não existem.

Portanto:

```text
regra pode ser resolvida com dados atuais  → state: applied
regra depende de catálogo futuro          → state: carried_forward
regra não corresponde ao contexto         → state: skipped
regra viola contrato                      → state: blocked
```

`carried_forward` não significa ignorada. Significa que a regra foi validada, ordenada e preservada para o estágio que terá candidatos reais.

### 3.4 Ausência não significa neutralidade comprovada

Se não houver perfil para um domínio presente no contexto, o DNA deve permanecer `partial` e emitir `INCOMPLETE_DOMAIN_COVERAGE`.

É proibido deduzir, por exemplo, regras de riqueza, cultura ou topografia apenas a partir do nome do contexto.

### 3.5 DNA e edifício gerado têm ciclos de vida diferentes

O DNA pode ser recalculado quando regras, arquétipos ou contexto mudarem. Um edifício já persistido poderá manter o DNA antigo, migrar ou ser regenerado conforme o futuro BDB-009.

---

## 4. Estados do resultado

| Estado | Significado |
|---|---|
| `partial` | Resultado válido, mas existem domínios sem perfil ou alvos aguardando catálogo |
| `resolved` | Todos os domínios aplicáveis foram avaliados e não há dependência desconhecida |
| `rejected` | Incompatibilidade, invariante violada ou conflito sem solução |

Um DNA `partial` pode alimentar protótipos, desde que seus warnings permaneçam visíveis. Ele não deve ser apresentado como representação regional validada.

---

## 5. Estrutura do DNA

O contrato formal está em:

```text
00_CORE/schemas/architectural-dna.schema.json
```

### 5.1 `provenance`

Registra exatamente quais entradas produziram o DNA:

```json
{
  "archetype_id": "BLD_RES_HOUSE_DETACHED",
  "context_ids": ["CTX_TEST_TROPICAL_URBAN_MIDDLE_001"],
  "modifier_profile_ids": ["MOD_CLIMATE_TROPICAL_HUMID_001"],
  "input_seed": 21001,
  "resolver_version": "spec-fixture-0.1",
  "canonicalization": "RFC8785"
}
```

O futuro resolvedor deverá acrescentar `input_fingerprint`, calculado sobre entradas canônicas.

### 5.2 `identity_lock`

É a fronteira que o contexto não pode atravessar. O resolvedor deve verificar o bloqueio antes e depois de cada operação.

### 5.3 `context_summary`

Contém apenas os eixos necessários para auditoria rápida. A fonte integral continua sendo o `context_id`; o DNA não deve duplicar todo o contexto.

### 5.4 `constraint_envelope`

É a cópia operacional dos limites do arquétipo após as regras que já puderem ser resolvidas:

- intervalos morfológicos;
- alternativas permitidas e preferidas;
- política de slots;
- implantação no lote;
- resultado da verificação de compatibilidade.

Preferências não viram obrigatoriedades durante a cópia.

### 5.5 `directives`

Cada diretiva preserva:

- regra de origem;
- alvo;
- operação e valor;
- seletor;
- força efetiva;
- prioridade e confiança;
- estado e justificativa.

### 5.6 `decision_trace`

Registra a ordem estável das regras, tentativas bloqueadas, alvos pendentes e chaves determinísticas de decisão.

---

## 6. Pipeline de resolução

```text
1. validar arquétipo, contexto e perfis contra seus schemas
2. resolver a hierarquia do contexto
3. verificar densidade e tecnologia contra o arquétipo
4. criar identity_lock
5. copiar o envelope de restrições e preferências
6. selecionar perfis cujos matches atendam ao contexto
7. ordenar regras deterministicamente
8. bloquear operações sobre invariantes ou restrições proibidas
9. aplicar tags e alterações resolvíveis
10. calcular força efetiva e transportar alvos sem catálogo
11. detectar conflitos e faixas vazias
12. classificar partial, resolved ou rejected
13. produzir trilha e fingerprint
14. validar o DNA contra architectural-dna.schema.json
```

O DNA não executa os passos de sorteio de módulos, encaixe geométrico ou construção de malha.

---

## 7. Ordenação determinística

As regras aplicáveis são ordenadas por esta tupla:

```text
priority            decrescente
scope_depth         decrescente
strength            decrescente
confidence_rank     decrescente
rule_id             crescente, ordem lexical por bytes UTF-8
```

Ranking de confiança:

```text
validated = 3
researched = 2
hypothesis = 1
deprecated = 0
```

Regras `deprecated` não são aplicadas por padrão, mas permanecem auditáveis.

Para decisões aleatórias futuras, cada caminho deverá receber uma seed independente:

```text
decision_seed = first_64_bits_big_endian(
  SHA-256(input_seed + "|" + dna_id + "|" + decision_path)
)
```

Assim, adicionar uma decisão nova não desloca toda a sequência pseudoaleatória das decisões antigas.

---

## 8. Semântica das operações no DNA

### 8.1 Força efetiva

Para operações graduais:

```text
effective_strength = rule.strength × context_intensity
```

Para `weight_multiplier`:

```text
effective_multiplier =
1 + ((rule_multiplier - 1) × effective_strength)
```

Para `range_shift`, cada delta é escalado:

```text
effective_delta = declared_delta × effective_strength
```

O valor declarado e o efetivo devem ser preservados na diretiva.

### 8.2 Mapeamento

| Operação | Resultado no DNA |
|---|---|
| `require` | requisito no envelope ou diretiva obrigatória |
| `forbid` | remoção válida ou diretiva de proibição |
| `weight_multiplier` | multiplicador efetivo transportado |
| `range_shift` | intervalo ajustado ou delta efetivo transportado |
| `set_default` | aplicado somente quando o alvo não possui valor |
| `clamp_range` | interseção; faixa vazia rejeita o DNA |
| `add_tag` | tag adicionada imediatamente quando o alvo existe |
| `remove_tag` | tag removida, sem apagar tag protegida por invariante |
| `set_cost_multiplier` | fator acumulado separado de probabilidade |
| `emit_warning` | entrada em `warnings` |

---

## 9. Conflitos e códigos de diagnóstico

| Código | Severidade | Resultado padrão |
|---|---|---|
| `ARCHETYPE_CONTEXT_INCOMPATIBLE` | error | `rejected` |
| `INVARIANT_VIOLATION` | error | `rejected` |
| `CONFLICT_REQUIRED_COMPONENTS` | error | `rejected` |
| `CONFLICT_EMPTY_RANGE` | error | `rejected` |
| `FORBID_REQUIRED_SLOT` | error | `rejected` |
| `REQUIRE_FORBIDDEN_SLOT` | error | `rejected` |
| `INCOMPLETE_DOMAIN_COVERAGE` | warning | `partial` |
| `TARGET_CATALOG_UNAVAILABLE` | warning | `partial` |
| `ONLY_ONE_CANDIDATE` | warning | continua |
| `DEPRECATED_RULE_SKIPPED` | info | continua |

Erros nunca podem ser convertidos em escolha aleatória.

---

## 10. Casos de validação

Os dois fixtures do BDB-002 usam o mesmo arquétipo e a mesma matriz cultural neutra. O BDB-004 materializa o envelope e as diretivas climáticas de cada um:

```text
08_VALIDATION/bdb-004/
├── DNA-CASE-001_TROPICAL_URBAN_MIDDLE.json
├── DNA-CASE-002_SEMIARID_LOW_DENSITY_LOW_INCOME.json
└── EXPECTED_DIFFERENCES.md
```

Ambos ficam `partial` porque apenas os perfis climáticos existem nesta versão. Isso é comportamento correto: o sistema sinaliza a lacuna em vez de inventar regras para os demais domínios.

---

## 11. Critérios de aceitação do BDB-004

Uma implementação será considerada compatível quando conseguir:

1. validar todas as entradas antes da resolução;
2. rejeitar `BLD_RES_HOUSE_DETACHED` em `urban_high` sem exceção explícita;
3. gerar os dois DNAs fornecidos a partir dos fixtures corrigidos;
4. manter o mesmo `archetype_id` e todas as invariantes;
5. calcular os multiplicadores e deltas efetivos documentados;
6. transportar regras de componentes como `carried_forward`;
7. aplicar tags de edifício e lote que já tenham alvo conhecido;
8. marcar cobertura incompleta de domínios como `partial`;
9. rejeitar `require` sobre slot proibido e `forbid` sobre slot obrigatório;
10. rejeitar faixas vazias sem inventar valor de fallback;
11. reproduzir byte a byte a mesma saída canônica com as mesmas entradas;
12. alterar o fingerprint quando qualquer entrada normativa mudar;
13. registrar toda regra aplicada, bloqueada, ignorada ou transportada;
14. validar o resultado contra `architectural-dna.schema.json`.

---

## 12. Limites desta versão

Esta versão não define:

- catálogo de componentes e materiais;
- pesos-base dos candidatos;
- sockets e regras geométricas de encaixe;
- programa interno ou cômodos;
- receita regional;
- seleção final de módulos;
- persistência e migração de DNAs;
- interpretador geral das expressões textuais de `invariants[].test`;
- implementação executável do resolvedor.

---

## 13. Próximo documento

```text
BDB-005 — Biblioteca Modular e Regras de Encaixe
```

O BDB-005 deverá fornecer candidatos reais para os alvos preservados em `directives`, permitindo transformar:

```text
"exigir drenagem de chuva"
```

em uma seleção concreta de cobertura, calha, condutor e conexões compatíveis.
