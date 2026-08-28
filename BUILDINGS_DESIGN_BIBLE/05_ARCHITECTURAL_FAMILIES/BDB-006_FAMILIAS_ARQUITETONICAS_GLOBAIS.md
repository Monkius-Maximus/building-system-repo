# BDB-006 — Famílias Arquitetônicas Globais

**Projeto:** Buildings Design Bible
**Versão:** 0.1
**Status:** 🟡 Vertical slice implementado; requer expansão pesquisada
**Dependências:** BDB-001 a BDB-005
**Função:** Organizar gramáticas compositivas compatíveis sem duplicar módulos nem antecipar receitas regionais.

---

## 1. Objetivo

O BDB-006 cria a camada que responde:

```text
Quais linguagens compositivas podem organizar estes módulos
sem alterar a identidade do arquétipo e sem inventar uma região?
```

Uma família reúne:

```text
compatibilidade
vocabulário morfológico
preferências compositivas
seletores de módulos
bases de conhecimento
limitações explícitas
```

Esta entrega é uma prova vertical com três protótipos. O termo “globais” descreve o alcance pretendido do contrato, não uma alegação de que três fichas representam a arquitetura mundial.

---

## 2. Posição na cadeia

```text
ARQUÉTIPO + CONTEXTO
         ↓
        DNA
         ↓
 MÓDULOS E MATERIAIS       BDB-005
         ↓
 FAMÍLIA COMPOSITIVA       BDB-006
         ↓
 RECEITA REGIONAL          BDB-007
         ↓
 EDIFÍCIO GERADO
```

A família restringe e pondera possibilidades. Ela não determina em qual cidade ocorre, com que frequência ocorre ou qual paleta local utiliza.

---

## 3. Definição normativa

### 3.1 Família não é arquétipo

O arquétipo preserva identidade funcional:

```text
detached_house
small_school
street_shop
```

A família descreve uma organização possível dessa identidade:

```text
compact_block
protected_courtyard
shaded_ventilated_edge
```

Mudar a família não pode transformar uma casa isolada em edifício multifamiliar, loja ou escola.

### 3.2 Família não é região

O schema não possui país, cidade, povo ou prevalência. Esses dados exigem pesquisa localizada e pertencem à receita do BDB-007.

Uma forma encontrada em lugares diferentes não prova origem comum. Uma família `transregional_prototype` agrupa comportamento procedural, não linhagem histórica.

### 3.3 Família não é estilo histórico por aproximação

Uma fonte pode documentar recursos de uma tradição ou movimento. Isso não autoriza renomear o protótipo com o nome dessa tradição.

Exemplo desta versão:

```text
evidência: Tropical Modernism empregou sombra e ventilação em casos documentados
hipótese: mapear esses recursos para seletores genéricos do protótipo
proibido: declarar o protótipo como Tropical Modernism
```

### 3.4 Família não é receita

A família mantém alternativas compatíveis. A receita do BDB-007 decidirá composição regional, prevalência, período, materiais locais e parâmetros finais.

---

## 4. Governança do conhecimento

Cada ficha separa três níveis:

| Nível | Onde fica | Pode afetar o resolver? |
|---|---|---:|
| `evidence` | `knowledge.statements` com fonte | sim, dentro das limitações registradas |
| `design_hypothesis` | `knowledge.statements` sem fonte fingida | sim, mantendo `status: hypothesis` |
| **Extra não normativo** | apêndice ou nota Markdown | não |

### 4.1 Evidência

Uma declaração `evidence` precisa:

1. citar pelo menos uma fonte existente;
2. registrar autoria, publicador, ano, URL e data de acesso;
3. declarar limitações;
4. ser referenciada por uma escolha ou seletor da gramática.

### 4.2 Hipótese de projeto

Uma `design_hypothesis` não pode listar fonte. Ela registra com honestidade uma decisão de protótipo, como:

```text
faixa normalizada
multiplicador de teste
mapeamento entre tag e forma
compatibilidade ainda não pesquisada
```

### 4.3 Promoção

Uma família somente poderá mudar de `hypothesis` para `researched` quando:

- todas as afirmações identitárias relevantes possuírem fontes adequadas;
- a compatibilidade não depender de generalização silenciosa;
- os parâmetros de jogo estiverem separados dos fatos históricos;
- limitações e contraexemplos estiverem registrados;
- uma revisão confirmar que ela não invade arquétipo ou receita.

### 4.4 Extras

Conteúdo criativo deve aparecer em seção intitulada:

```text
Extra não normativo — relacionado à seção X.Y
```

Ele não entra nos JSONs, pesos, validações ou resultados esperados antes de promoção explícita.

---

## 5. Contratos formais

```text
00_CORE/schemas/architectural-family.schema.json
00_CORE/schemas/bdb006-validation.schema.json
```

### 5.1 Identidade da ficha

```text
family_id
family_kind
scope
status
identity.tags
identity.does_not_claim
```

Protótipos compositivos transregionais devem negar explicitamente:

```text
regional_prevalence
cultural_ownership
historical_lineage
```

### 5.2 Base de conhecimento

```text
knowledge.sources[]
knowledge.statements[]
```

Toda declaração precisa ser usada por uma escolha compositiva ou seletor. Declaração órfã é rejeitada para evitar bibliografia decorativa.

---

## 6. Compatibilidade

Uma família candidata passa por filtros de:

1. `archetype_id`;
2. uso principal;
3. interseção de classe de altura;
4. nível tecnológico;
5. clima, quando a ficha declara uma lista não vazia;
6. período, quando a ficha declara uma lista não vazia;
7. interseção de plan shape;
8. interseção de complexidade volumétrica;
9. interseção de simetria.

Lista vazia de clima ou período significa **ausência de filtro duro nesta versão**. Não significa evidência de compatibilidade universal.

O conjunto `compatibility.basis_refs` liga esses filtros às declarações que os justificam. Uma compatibilidade sem base registrada é rejeitada pelo contrato.

### 6.1 Resultado não é seleção

O BDB-006 produz candidatos elegíveis e pesos comparáveis. Todos os fixtures usam:

```text
selection_state: deferred_to_recipe
```

Escolher uma família antes da receita inventaria prevalência regional.

---

## 7. Composição e módulos

### 7.1 Gramática compositiva

```text
composition.tags
composition.plan_shapes
composition.volume_complexity
composition.symmetry
composition.parameters
```

Cada conjunto possui `allowed`, `preferred` e `basis_refs`. Preferências devem ser subconjunto das opções permitidas e todas devem respeitar o envelope do arquétipo.

### 7.2 Seletores, não cópias

Famílias não armazenam outro exemplar do módulo. Elas consultam o catálogo por:

```text
target_kind
slot_codes
candidate_tags_any
candidate_capabilities_all
operation
```

Operações iniciais:

| Operação | Efeito |
|---|---|
| `require` | exige candidato que satisfaça o contrato |
| `prefer` | ajusta peso sem eliminar alternativas |
| `forbid` | elimina correspondências proibidas |

Somente `prefer` possui `weight_multiplier`. O validador exige pelo menos um candidato real para seletores `require` e `prefer`.

### 7.3 Ausência de ID direto

O schema não possui `allowed_module_ids`. Isso é deliberado: módulos continuam pertencendo ao BDB-005 e podem participar de várias famílias.

---

## 8. Consumo de diretivas

O encadeamento registra três conjuntos disjuntos:

```text
upstream_consumed_directive_ids
family_consumed_directive_ids
unresolved_directive_ids
```

Sua união deve ser exatamente o conjunto de diretivas `carried_forward` do DNA.

`status: layer_accounted` significa que toda diretiva alcançou a camada correta e entrou na avaliação. Não significa que uma família final já foi selecionada.

### 8.1 Sem dupla aplicação

Diretiva consumida pelo BDB-005 não pode ser aplicada novamente à família. O BDB-006 só avalia diretivas ainda pendentes no fixture anterior e com alvo morfológico `archetype.*`.

### 8.2 Peso de família

```text
final_weight = clamp(
  base_weight × produto(effective_value das diretivas morfológicas aplicáveis),
  0.05,
  8.00
)
```

Uma preferência só altera famílias cujas tags correspondem ao seletor. Não corresponder mantém o peso-base; não torna o candidato incompatível.

---

## 9. Catálogo inicial

| Família | Papel no teste | Conhecimento |
|---|---|---|
| `FAM_COMPACT_BLOCK_LOWRISE_001` | expõe `compact` e `low_surface_area` | hipótese procedural explícita |
| `FAM_PROTECTED_COURTYARD_LOWRISE_001` | expõe `courtyard` e `protected_outdoor_space` | evidência sobre desempenho dependente do contexto + tradução hipotética |
| `FAM_SHADED_VENTILATED_EDGE_LOWRISE_001` | prova seletores de janela, fachada e proteção climática | precedente histórico pesquisado + tradução hipotética |

Todas permanecem em `status: hypothesis`. Possuir uma fonte em parte da ficha não valida automaticamente a família inteira.

### 9.1 Compact block

É um controle mecânico sem fonte externa. Traduz formas simples em tags utilizadas pelo DNA e declara que isso ainda não é uma métrica geométrica.

### 9.2 Protected courtyard

A evidência registrada demonstra que desempenho de pátios depende de clima, proporção, sombreamento e aberturas. A união de `courtyard` e `U_shape`, assim como a faixa normalizada, continua marcada como hipótese.

### 9.3 Shaded ventilated edge

A fonte histórica sustenta o uso documentado de sombra e ventilação em casos de Tropical Modernism. A família extrai somente recursos funcionais para provar seletores; ela declara explicitamente que não representa esse movimento.

---

## 10. Casos de validação

### 10.1 Tropical úmido

As seis diretivas do DNA já foram consumidas no BDB-005. As três famílias elegíveis mantêm peso `1.0`, provando que sombra, abertura e cobertura não foram ponderadas duas vezes.

O clima tropical não cria automaticamente pátio, bloco compacto ou qualquer estilo.

### 10.2 Semiárido

As duas diretivas morfológicas pendentes encontram consumidores separados:

```text
compact block        × 1.1452
protected courtyard × 1.1694
```

Elas não são fundidas em uma única família. Um pátio cria superfície interna e pode tensionar a ideia de baixo envelope externo; combinar as duas gramáticas exigirá uma receita ou um candidato futuro explicitamente validado.

`shaded_ventilated_edge` é rejeitada nesse caso porque a evidência atualmente associada restringe o protótipo a `tropical_humid`. A rejeição indica falta de escopo pesquisado, não impossibilidade arquitetônica universal.

---

## 11. Diagnósticos

| Código | Significado |
|---|---|
| `NO_REGIONAL_PREVALENCE_DATA` | família compatível, mas sem dados para seleção regional |
| `DNA_INPUT_PARTIAL` | o DNA ainda possui domínios sem perfil |
| `UNKNOWN_KNOWLEDGE_REFERENCE` | regra aponta para declaração inexistente |
| `EVIDENCE_WITHOUT_SOURCE` | afirmação de evidência não cita fonte |
| `HYPOTHESIS_WITH_SOURCE` | hipótese tenta apresentar fonte como validação automática |
| `FAMILY_ARCHETYPE_DRIFT` | escolha compositiva viola envelope do arquétipo |
| `FAMILY_SELECTOR_EMPTY` | seletor obrigatório não encontra candidato no catálogo |
| `DIRECTIVE_DOUBLE_CONSUMPTION` | duas camadas contabilizam a mesma diretiva |

Os textos de erro do validador usam descrições diretas; a tabela define códigos para persistência futura.

---

## 12. Critérios de aceitação

O vertical slice é aceito quando:

1. famílias e fixtures validam contra JSON Schema 2020-12;
2. IDs são únicos e referências resolvem;
3. escolhas compositivas permanecem dentro do arquétipo;
4. hipóteses e evidências obedecem contratos diferentes;
5. toda evidência cita fonte e toda hipótese evita fonte fingida;
6. toda declaração é usada por uma regra;
7. seletores encontram módulos ou materiais reais;
8. o caso tropical não reaplica diretivas do BDB-005;
9. o caso semiárido reproduz `1.1452` e `1.1694`;
10. a incompatibilidade climática produz peso `0` e motivo explícito;
11. nenhuma diretiva é consumida por duas camadas;
12. a seleção permanece adiada ao BDB-007;
13. nenhum protótipo declara país, cultura ou prevalência;
14. o comando de validação permanece determinístico.

---

## 13. Limites desta versão

Ainda não existem:

- catálogo representativo de famílias históricas documentadas;
- famílias para os treze outros arquétipos;
- métricas geométricas calculadas de compacidade;
- simulação térmica ou estrutural;
- composição de duas famílias na mesma receita;
- períodos e transições históricas detalhados;
- prevalência por país, região ou cidade;
- paletas e materiais locais pesquisados;
- escolha final de família;
- malhas ou regras de geração espacial.

---

## 14. Próxima etapa

```text
BDB-007 — Receitas Regionais
```

A próxima camada poderá selecionar e parametrizar famílias para localidades pesquisadas, preservando fontes, período, prevalência e exceções sem modificar os módulos genéricos.

---

## Apêndice A — Extra não normativo: grafo de famílias

**Relacionado às seções 6.1 e 7.1.**

Uma exploração futura poderia representar famílias como nós de um grafo e permitir interpolação controlada entre gramáticas compatíveis. Isso ajudaria a produzir transições graduais em cidades grandes sem criar fronteiras estilísticas abruptas.

Este Extra não possui schema, peso, algoritmo ou fixture. Ele não faz parte do comportamento atual e somente poderá ser promovido após definição matemática, testes de identidade e análise de impacto no BDB-007.
