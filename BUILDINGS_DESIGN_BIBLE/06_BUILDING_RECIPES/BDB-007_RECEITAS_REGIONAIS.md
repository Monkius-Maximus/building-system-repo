# BDB-007 — Receitas Regionais

**Projeto:** Buildings Design Bible

**Versão:** 0.1

**Status:** 🟡 Vertical slice implementado; ativação regional bloqueada até prevalência pesquisada

**Dependências:** BDB-001 a BDB-006

**Função:** Vincular famílias e recursos a um escopo localizado sem transformar exemplos em estereótipos ou percentuais inventados.

---

## 1. Objetivo

O BDB-007 cria a camada que responde:

```text
Quais famílias e recursos possuem base para entrar neste recorte
geográfico, temporal, tipológico e cultural?
```

Uma receita organiza:

```text
escopo exato
corpus ou distribuição
famílias candidatas
prevalência disponível
recursos locais pesquisados
lacunas do catálogo
bases de conhecimento
travas de ativação
```

Ela não escolhe uma região por semelhança climática e não transforma uma lista de obras publicadas em retrato estatístico da cidade.

---

## 2. Posição na cadeia

```text
ARQUÉTIPO + CONTEXTO
         ↓
        DNA
         ↓
 MÓDULOS E MATERIAIS       BDB-005
         ↓
 FAMÍLIAS CANDIDATAS       BDB-006
         ↓
 ESCOPO + EVIDÊNCIA LOCAL  BDB-007
         ↓
 RECEITA APTA OU BLOQUEADA
         ↓
 LOTE E BAIRRO             BDB-008
```

O BDB-007 filtra e governa possibilidades. Nesta versão ele não gera malha, não distribui lotes e não seleciona percentuais ausentes.

---

## 3. Distinções normativas

### 3.1 Receita não é família

A família do BDB-006 descreve uma gramática transregional. A receita associa famílias a um recorte pesquisado.

```text
família: shaded_ventilated_edge
receita: corpus residencial moderno do Recife
```

A associação não renomeia a família como “estilo do Recife” e não atribui propriedade cultural ao protótipo global.

### 3.2 Corpus não é região

`documented_corpus` significa que fontes identificam obras ou princípios em um conjunto delimitado. Ele não autoriza inferência sobre todas as construções da cidade.

`regional_distribution` exigirá uma base que defina:

```text
universo observado
unidade contada
denominador
amostra ou inventário
participações calculáveis
período e cobertura espacial
```

Sem esses itens, `regional_sampling_allowed` deve ser `false`.

### 3.3 Ocorrência não é frequência

Uma fonte que documenta cobogó, pátio ou peitoril ventilado prova uma ocorrência dentro dos seus limites. Ela não prova que o recurso aparece em toda residência nem informa sua frequência relativa.

### 3.4 Lacuna não recebe substituto silencioso

Se o catálogo não contém um componente com a semântica necessária, a receita registra `deferred_features`.

É proibido substituir automaticamente:

```text
telha sobre laje       → cobertura inclinada genérica
peitoril ventilado     → janela operável genérica
revestimento cerâmico  → superfície neutra
cobogó                 → brise genérico
```

Similaridade visual ou parcial não garante o mesmo comportamento.

---

## 4. Governança do conhecimento

Cada receita conserva a separação adotada no BDB-006:

| Nível | Uso | Fonte obrigatória? | Pode afetar o contrato? |
|---|---|---:|---:|
| `evidence` | fato delimitado pela fonte | sim | sim, dentro da limitação |
| `design_hypothesis` | tradução interna do sistema | não | sim, mantendo status parcial |
| **Extra não normativo** | exploração criativa | não | não |

Toda declaração deve ser usada por escopo, prevalência, regra de família ou recurso adiado. Bibliografia decorativa é rejeitada.

### 4.1 Tradução não vira autoria histórica

Mapear recursos de sombra para `shaded_ventilated_edge` é uma decisão procedural. A fonte sustenta os recursos; não sustenta o nome do protótipo nem uma equivalência historiográfica.

### 4.2 Ausência de dado é um resultado

Quando as fontes não oferecem denominador, a receita registra:

```text
claim_level: corpus_only
denominator_status: unavailable
quantitative_shares: []
```

O vazio é preservado. Não existe fallback numérico.

---

## 5. Contratos formais

```text
00_CORE/schemas/regional-recipe.schema.json
00_CORE/schemas/bdb007-validation.schema.json
```

### 5.1 Identidade e ciclo de vida

```text
recipe_id
recipe_kind
status
activation.state
```

Estados iniciais:

| Estado | Significado |
|---|---|
| `partial` | receita válida, mas com bloqueios ou traduções hipotéticas |
| `researched` | bases relevantes pesquisadas, ainda aguardando validação operacional |
| `validated` | contrato, catálogo e distribuição verificados |
| `deprecated` | mantida somente para migração ou auditoria |

### 5.2 Modos de receita

| `recipe_kind` | Alcance permitido |
|---|---|
| `documented_corpus` | geração explicitamente solicitada dentro do corpus |
| `regional_distribution` | amostragem regional, apenas com prevalência adequada |

---

## 6. Correspondência de escopo

Uma receita localizada compara todos os campos abaixo:

```text
context_anchor_ids[] na cadeia de ancestrais
country_code
subdivision_code
locality_code_system
locality_code
construction_period
cultural_variant
archetype_id
```

`context_anchor_ids` evita que dois perfis com valores parecidos sejam tratados como intercambiáveis. A correspondência aceita a própria âncora ou um contexto descendente por `parent_context_id`, permitindo que uma receita de cidade alcance distrito, quadra e lote sem perder a proveniência. Geografia e proveniência podem ser herdadas da primeira âncora ancestral que as declara. `locality_code_system` impede que códigos de cadastros diferentes sejam comparados como se compartilhassem o mesmo namespace. Os códigos geográficos permitem diagnóstico independente do nome humano.

Um descendente que herda a proveniência não pode alterar clima primário, período, nível tecnológico ou variante vinculada à receita. Para alterar um desses campos, ele deverá declarar proveniência localizada própria e passar novamente pela correspondência; copiar a fonte do ancestral para um valor diferente é rejeitado.

### 6.1 Ordem de bloqueio

```text
1. validar referências
2. comparar escopo
3. verificar compatibilidade de arquétipo e família
4. avaliar ativação e prevalência
5. expor recursos suportados ou adiados
```

Falha de escopo encerra a avaliação antes das famílias. Isso impede que `tropical_humid` ative uma receita do Recife em uma localidade não identificada.

---

## 7. Proveniência do contexto localizado

O `context-profile.schema.json` recebeu dois campos opcionais:

```text
geography
data_provenance
```

Âncoras reais usadas por receitas devem declarar ambos. Contextos descendentes podem herdá-los por uma cadeia de pais válida, desde que não alterem silenciosamente os campos vinculados à evidência.

`data_provenance.field_groups` separa:

```text
evidence                campos apoiados por fonte
normalized_hypothesis   valores de fixture ainda não medidos
```

Uma fonte em um grupo não valida os outros grupos. A receita somente pode usar como evidência os campos respaldados para aquela finalidade.

---

## 8. Famílias candidatas sem pesos inventados

`family_rules` relaciona famílias por evidência e tradução explícita. A ficha atual mantém duas candidatas:

```text
FAM_SHADED_VENTILATED_EDGE_LOWRISE_001
FAM_PROTECTED_COURTYARD_LOWRISE_001
```

Nenhuma recebe `weight`, `share` ou percentual. O schema não oferece esses campos em `family_rules`.

`family_diversity` registra se o corpus sustenta uma, várias ou ainda nenhuma quantidade mínima de candidatas. Somente quando o próprio registro declara `multiple_supported_candidates` o validador exige duas ou mais. Isso evita tanto cristalizar diversidade documentada em uma forma única quanto fabricar variedade em um corpus realmente homogêneo.

### 8.1 Compatibilidade continua obrigatória

A relação local não pode salvar uma família incompatível. Arquétipo, uso, altura, tecnologia, clima e período continuam sendo verificados contra BDB-006.

---

## 9. Prevalência e ativação

### 9.1 Contrato quantitativo

`quantitative_shares` somente pode existir quando:

```text
claim_level = quantified_regional
denominator_status = defined
unit != null
sample_size != null
soma das participações = 1
```

Uma distribuição regional ativa também precisa de ao menos duas participações pesquisadas.

### 9.2 Receita inicial

O corpus do Recife permanece:

```text
activation.state: corpus_limited
regional_sampling_allowed: false
requires_explicit_corpus_opt_in: true
```

Os bloqueios são:

```text
REGIONAL_PREVALENCE_UNESTABLISHED
LOCAL_COMPONENT_CATALOG_GAPS
```

Isso permite avançar o contrato sem apresentar uma hipótese como levantamento da cidade.

---

## 10. Corpus inicial pesquisado

### 10.1 Delimitação

O primeiro recorte cobre residências modernas documentadas no Recife, com foco nas décadas de 1950 e 1960 e correspondência ao período interno `mid_modern`.

O código municipal `2611606` provém do IBGE. A base arquitetônica usa estudos publicados por Luiz Amorim e Alcilia Afonso de Albuquerque Costa.

### 10.2 O que as fontes permitem afirmar

As fontes catalogadas permitem registrar:

- existência de produção moderna residencial no recorte;
- preocupação documentada com clima quente e úmido;
- uso pesquisado de soluções como pátios, terraços, proteção de aberturas, revestimentos cerâmicos, elementos vazados e peitoris ventilados;
- diversidade de soluções e autores.

### 10.3 O que as fontes não permitem afirmar

Elas não fornecem, nesta versão:

- total de casas do Recife no período;
- amostra estatística representativa;
- participação percentual de cada família;
- distribuição por bairro;
- presença obrigatória de cada recurso em toda obra;
- parâmetros geométricos universais.

---

## 11. Recursos adiados

O validador exige que cada `deferred_feature` não encontre candidato que satisfaça simultaneamente slot, tags e capacidades.

| Recurso | Slot | Motivo do adiamento |
|---|---|---|
| telha sobre laje | `ROF` | falta cavidade ventilada semanticamente declarada |
| peitoril ventilado | `WIN` | falta ventilação contínua protegida de chuva |
| revestimento cerâmico | material `FAC` | superfície genérica não prova material cerâmico |
| tela vazada | `FAC` / `CLM` | falta combinação de ventilação e proteção solar |

Se um candidato futuro preencher a lacuna, a validação falhará até que o recurso seja promovido e o adiamento removido.

---

## 12. Casos de validação

### 12.1 Correspondência positiva

O contexto localizado coincide em todas as chaves. As duas famílias entram no conjunto, mas a seleção permanece adiada por falta de prevalência regional.

### 12.2 Controle negativo tropical

O fixture tropical neutro possui clima compatível com uma das famílias, mas não possui geografia e usa período e variante diferentes.

Resultado obrigatório:

```text
resolution_status: rejected
selection_state: blocked_context_mismatch
family_candidate_ids: []
```

Esse caso protege contra a alucinação “tropical = Recife”.

---

## 13. Critérios de aceitação

O vertical slice é aceito quando:

1. contextos, receitas e casos validam contra JSON Schema 2020-12;
2. IDs e referências resolvem sem colisão;
3. evidência sempre cita fonte e hipótese não finge fonte;
4. toda declaração é usada por alguma regra;
5. a âncora localizada possui geografia e proveniência, herdáveis somente por descendência válida;
6. grupos de evidência e hipótese normalizada obedecem contratos diferentes;
7. recipe e context coincidem em todas as chaves de escopo;
8. o fixture tropical neutro é rejeitado;
9. famílias candidatas existem e são compatíveis;
10. a contagem de candidatas respeita a diversidade declarada para o corpus;
11. ausência de denominador impede percentuais e amostragem regional;
12. participações quantitativas futuras devem somar exatamente `1`;
13. recursos adiados realmente não possuem candidato semântico no catálogo;
14. nenhuma diretiva climática é aplicada novamente na receita;
15. o comando de validação permanece determinístico.

---

## 14. Limites desta versão

Ainda não existem:

- inventário municipal suficiente para distribuição regional;
- calibração por bairro ou transformação temporal;
- quatro componentes locais adiados;
- famílias históricas próprias além dos protótipos globais;
- parâmetros geométricos extraídos de amostra mensurada;
- resolvedor estocástico de receita;
- integração com lotes e tecido urbano;
- receita ativa para outro recorte global.

---

## 15. Próxima etapa

```text
BDB-008 — Geração de Lotes e Bairros
```

Antes de usar a receita em distribuição urbana, o projeto deverá decidir entre:

```text
expandir o catálogo local e pesquisar prevalência
ou
manter o corpus somente como modo explícito de geração histórica
```

---

## Apêndice A — Extra não normativo: mapa de confiança por bairro

**Relacionado às seções 6, 9 e 10.**

Uma exploração futura poderia visualizar, por bairro e período, a densidade das fontes, a confiança dos vínculos e as zonas sem dados. O mapa ajudaria a direcionar pesquisa e impediria transições bruscas baseadas apenas em limites administrativos.

Este Extra não define probabilidades, fronteiras, algoritmo espacial nem regra de geração. Ele não entra nos JSONs, fixtures ou resultados atuais e somente poderá ser promovido após definição de fontes georreferenciadas, escala, incerteza e proteção contra falso detalhamento.
